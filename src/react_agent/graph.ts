import { StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ConfigurationSchema, AgentState } from "./configuration.js";
import { TOOLS } from "./tools.js";
import { conversationNode } from "./nodes/conversation.js";
import { classifyIntentionNode } from "./nodes/classifyIntention.js";
import { scheduledNode } from "./nodes/scheduled.js";
import { consultNode } from "./nodes/consult.js";
import { cancelNode } from "./nodes/cancel.js";
import { routeByIntentNode } from "./nodes/routeByIntent.js";
import { checkpointer } from "./memory/checkpointer.js";
import { unknownIntentNode } from "./nodes/unknownIntent.js";

const workflow = new StateGraph(AgentState, ConfigurationSchema)
  .addNode("classifyIntentionNode", classifyIntentionNode)
  .addNode("conversationNode", conversationNode)
  .addNode("consultNode", consultNode)
  .addNode("scheduledNode", scheduledNode)
  .addNode("unknownIntentNode", unknownIntentNode)
  .addNode("cancelNode", cancelNode)
  .addNode("tools", new ToolNode(TOOLS))
  .addEdge("__start__", "classifyIntentionNode")
  .addConditionalEdges(
    "classifyIntentionNode",
    routeByIntentNode,
  )
  .addEdge("conversationNode", "__end__")
  .addEdge("consultNode", "__end__")
  .addEdge("scheduledNode", "__end__")
  .addEdge("cancelNode", "__end__")
  .addEdge("unknownIntentNode", "__end__")

export const graph = workflow.compile({
  interruptBefore: [],
  interruptAfter: [],
  checkpointer
});

