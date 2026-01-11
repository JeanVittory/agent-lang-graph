import { Annotation, messagesStateReducer } from '@langchain/langgraph';
import { BaseMessage } from '@langchain/core/messages';
import { SYSTEM_PROMPT_TEMPLATE } from './prompts.js';
import { RunnableConfig } from '@langchain/core/runnables';
import { ErrorType, Intent } from './types/index.js';
import { OPEN_AI_MODEL } from './constants/index.js';

export const ConfigurationSchema = Annotation.Root({
  systemPromptTemplate: Annotation<string>,
  model: Annotation<string>,
});

export function ensureConfiguration(config: RunnableConfig): typeof ConfigurationSchema.State {
  const configurable = config.configurable ?? {};
  return {
    systemPromptTemplate: configurable.systemPromptTemplate ?? SYSTEM_PROMPT_TEMPLATE,
    model: configurable.model ?? OPEN_AI_MODEL.SIMPLE_FAST,
  };
}

export const AgentState = Annotation.Root({
  intent: Annotation<Intent | ErrorType | null>({
    value: (current, update) => update ?? current,
    default: () => null,
  }),
  messages: Annotation<BaseMessage[]>({
    reducer: messagesStateReducer,
    default: () => [],
  }),
});
