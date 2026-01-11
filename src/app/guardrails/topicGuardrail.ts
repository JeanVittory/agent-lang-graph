import { loadChatModel } from '../utils.js';
import { TopicGateResult, TopicGateSchema } from '../schemas/topicGate.js';
import { TOPIC_GUARD_SYSTEM } from '../prompts.js';

export const topicGuardrail = async (
  userMessage: string,
  modelName: string,
): Promise<TopicGateResult> => {
  const model = await loadChatModel(modelName);
  const structuredModel = model.withStructuredOutput<TopicGateResult>(TopicGateSchema);
  const { inScope } = await structuredModel.invoke([
    { role: 'system', content: TOPIC_GUARD_SYSTEM },
    { role: 'user', content: userMessage },
  ]);
  return {
    inScope,
  };
};
