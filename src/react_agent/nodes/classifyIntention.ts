import { RunnableConfig } from '@langchain/core/runnables';
import { AgentState, ensureConfiguration } from '../configuration.js';
import { loadChatModel } from '../utils.js';
import { CLASSIFIER_INTENT_PROMPT_AGENT_TEMPLATE } from '../prompts.js';
import { IntentSchema } from '../schemas/classifyIntention.js';
import { inputGuardrail } from '../guardrails/inputGuardrail.js';
import { topicGuardrail } from '../guardrails/topicGuardrail.js';
import { OPEN_AI_MODEL } from '../constants/index.js';

export async function classifyIntentionNode(
  state: typeof AgentState.State,
  config: RunnableConfig,
): Promise<typeof AgentState.Update> {
  const configuration = ensureConfiguration(config);
  const gr = inputGuardrail(state.messages);
  if (!gr.ok)
    return {
      intent: 'blocked',
    };
  const lastMessage = state.messages.at(-1)?.content.toString() || '';
  const { inScope } = await topicGuardrail(lastMessage, OPEN_AI_MODEL.SIMPLE_FAST);
  if (!inScope)
    return {
      intent: 'blocked',
    };
  const model = await loadChatModel(configuration.model);
  const structuredModel = model.withStructuredOutput(IntentSchema);
  const { intent } = await structuredModel.invoke([
    {
      role: 'system',
      content: configuration.systemPromptTemplate,
    },
    {
      role: 'system',
      content: CLASSIFIER_INTENT_PROMPT_AGENT_TEMPLATE,
    },
    ...state.messages,
  ]);

  return {
    intent,
  };
}
