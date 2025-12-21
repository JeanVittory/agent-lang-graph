import { AIMessage } from 'langchain';
import { AgentState } from '../configuration.js';

export const unknownIntentNode = async (): Promise<typeof AgentState.Update> => {
  return {
    messages: [
      new AIMessage(
        'Lo siento, no logré entender bien tu solicitud. ¿Podrías explicarte mejor, por favor?',
      ),
    ],
  };
};
