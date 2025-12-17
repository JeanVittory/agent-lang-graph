import { AgentState } from "../configuration.js";
import { IntentNodes } from "../types/index.js";

export function routeByIntentNode(state: typeof AgentState.State): IntentNodes {
    switch (state.intent) {
    case "conversation":
      return "conversationNode";
    case "consult":
      return "consultNode";
    case "scheduled":
      return "scheduledNode";
    case "cancel":
      return "cancelNode";
    default:
      return "unknownIntentNode";
  }
}
