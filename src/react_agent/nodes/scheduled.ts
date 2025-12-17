import { RunnableConfig } from "@langchain/core/runnables"
import { AgentState, ensureConfiguration } from "../configuration.js"
import { loadChatModel } from "../utils.js"

export async function scheduledNode(state: typeof AgentState.State, config: RunnableConfig): Promise<typeof AgentState.Update> {
  const configuration = ensureConfiguration(config)
  const model = await loadChatModel(configuration.model)
  const response = await model.invoke([
    {
      role: "system",
      content: "You are a compassionate assistant who responds with empathy and understanding.",
    },
    ...state.messages,
  ])

  return {
    messages: [response],
  }
}