import { RunnableConfig } from "@langchain/core/runnables";
import { AgentState, ensureConfiguration } from "../configuration.js";
import {  loadChatModel } from "../utils.js";
import { CLASSIFIER_INTENT_PROMPT_AGENT_TEMPLATE } from "../prompts.js";
import { IntentSchema } from "../schemas/classifyIntention.js";

export async function classifyIntentionNode(
  state: typeof AgentState.State,
  config: RunnableConfig,
): Promise<typeof AgentState.Update> {
  const configuration = ensureConfiguration(config)
  const model = await loadChatModel(configuration.model)
  const structuredModel = model.withStructuredOutput(IntentSchema)
  const {intent} = await structuredModel.invoke([
    {
      role: "system",
      content: configuration.systemPromptTemplate
    },
    {
      role: "system",
      content: CLASSIFIER_INTENT_PROMPT_AGENT_TEMPLATE,
    },
    ...state.messages,
  ])

  return {
    intent,
  }
}