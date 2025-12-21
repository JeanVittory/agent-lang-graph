import { BaseMessage } from 'langchain';
import { GuardrailResult } from '../types/index.js';
import { MessageStructure, MessageType } from '@langchain/core/messages';
import { API_KEY_REGEX } from '../constants/index.js';

export const inputGuardrail = (
  messages: BaseMessage<MessageStructure, MessageType>[],
): GuardrailResult => {
  const lastMessage = messages.at(-1)?.content.toString() ?? '';
  if (API_KEY_REGEX.test(lastMessage)) return { ok: false };
  return {
    ok: true,
  };
};
