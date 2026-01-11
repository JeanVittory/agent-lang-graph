import { AgentState } from '../configuration.js';
import { ErrorType, Intent } from '../types/index.js';

export function routeByIntentNode(state: typeof AgentState.State): Intent | ErrorType {
  switch (state.intent) {
    case 'conversation':
      return 'conversation';
    case 'consult':
      return 'consult';
    case 'scheduled':
      return 'scheduled';
    case 'cancel':
      return 'cancel';
    case 'blocked':
      return 'blocked';
    default:
      return 'unknown';
  }
}
