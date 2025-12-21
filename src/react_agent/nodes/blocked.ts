import { AIMessage } from 'langchain';
import { AgentState } from '../configuration.js';

export const blockedNode = async (): Promise<typeof AgentState.Update> => {
  return {
    messages: [new AIMessage('Lo siento, no puedo ayudarte con eso.')],
  };
};
