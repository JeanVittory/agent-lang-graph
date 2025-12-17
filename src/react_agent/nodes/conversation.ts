import { RunnableConfig } from "@langchain/core/runnables"
import { AgentState, ensureConfiguration } from "../configuration.js"
import { CONSULT_PROMPT_AGENT_TEMPLATE } from "../prompts.js"
import { loadChatModel } from "../utils.js"

export async function conversationNode(state: typeof AgentState.State, config: RunnableConfig): Promise<typeof AgentState.Update> {
  const configuration = ensureConfiguration(config)
  const model = await loadChatModel(configuration.model)
  const response = await model.invoke([
    {
      role: "system",
      content: CONSULT_PROMPT_AGENT_TEMPLATE,
    },
    ...state.messages,
  ])

  return {
    messages: [response],
  }
}