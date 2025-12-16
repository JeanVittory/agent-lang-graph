import { AIMessage } from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";
import { StateGraph, MemorySaver } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ConfigurationSchema, ensureConfiguration, AgentState } from "./configuration.js";
import { TOOLS } from "./tools.js";
import { contentToString, loadChatModel } from "./utils.js";
import { CLASSIFIER_INTENT_PROMPT_AGENT_TEMPLATE, CONSULT_PROMPT_AGENT_TEMPLATE } from "./prompts.js";


async function classifyIntention(
  state: typeof AgentState.State,
  config: RunnableConfig,
): Promise<typeof AgentState.Update> {
  const configuration = ensureConfiguration(config)
  const model = await loadChatModel(configuration.model)
  const response = await model.invoke([
    {
      role: "system",
      content: CLASSIFIER_INTENT_PROMPT_AGENT_TEMPLATE,
    },
    ...state.messages,
  ])

  const raw = contentToString(response.content).toLowerCase();

  const intent =
    raw.includes("conversation") ? "conversation" :
    raw.includes("scheduled") ? "scheduled" :
    raw.includes("consult") ? "consult" :
    raw.includes("cancel") ? "cancel": "conversation";

  return {
    messages: [response],
    intent,
  }
}

async function conversationAgent(state: typeof AgentState.State, config: RunnableConfig): Promise<typeof AgentState.Update> {
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

async function scheduledAgent(state: typeof AgentState.State, config: RunnableConfig): Promise<typeof AgentState.Update> {
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

async function consultAgent(state: typeof AgentState.State, config: RunnableConfig): Promise<typeof AgentState.Update> {
  const configuration = ensureConfiguration(config)
  const model = await loadChatModel(configuration.model)
  const response = await model.invoke([
    {
      role: "system",
      content: "You are a calm assistant who helps to de-escalate situations and provides thoughtful responses.",
    },
    ...state.messages,
  ])

  return {
    messages: [response],
  }
}

async function cancelAgent(state: typeof AgentState.State, config: RunnableConfig): Promise<typeof AgentState.Update> {
  const configuration = ensureConfiguration(config)
  const model = await loadChatModel(configuration.model)
  const response = await model.invoke([
    {
      role: "system",
      content: "You are a neutral assistant who provides balanced and objective responses.",
    },
    ...state.messages,
  ])

  return {
    messages: [response],
  }
}

function routeByIntent(state: typeof AgentState.State){
    switch (state.intent) {
    case "conversation":
      return "conversationAgent";
    case "consult":
      return "consultAgent";
    case "scheduled":
      return "scheduledAgent";
    case "cancel":
      return "cancelAgent";
    default:
      return "__end__";
  }
}

// Define the function that determines whether to continue or not
function routeModelOutput(state: typeof AgentState.State): string {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1];
  // If the LLM is invoking tools, route there.
  if ((lastMessage as AIMessage)?.tool_calls?.length || 0 > 0) {
    return "tools";
  }
  // Otherwise end the graph.
  else {
    return "__end__";
  }
}

const checkpointer = new MemorySaver()

const workflow = new StateGraph(AgentState, ConfigurationSchema)
  .addNode("classifyIntention", classifyIntention)
  .addNode("conversationAgent", conversationAgent)
  .addNode("consultAgent", consultAgent)
  .addNode("scheduledAgent", scheduledAgent)
  .addNode("cancelAgent", cancelAgent)
  .addNode("tools", new ToolNode(TOOLS))
  .addEdge("__start__", "classifyIntention")
  .addConditionalEdges(
    "classifyIntention",
    routeByIntent,
  )
  .addEdge("conversationAgent", "__end__")
  .addEdge("consultAgent", "__end__")
  .addEdge("scheduledAgent", "__end__")
  .addEdge("cancelAgent", "__end__")

export const graph = workflow.compile({
  interruptBefore: [],
  interruptAfter: [],
  checkpointer
});

