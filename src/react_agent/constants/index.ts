export const API_KEY_REGEX = /\bsk-(?:proj-|org-|live-)?[a-zA-Z0-9]{20,}\b/;

export enum OPEN_AI_MODEL {
  SIMPLE_FAST = 'gpt-4o-mini',
  SIMPLE_ULTRA_CHEAP = 'gpt-4.1-nano',
  SIMPLE_STRUCTURED = 'gpt-4.1-mini',
  DECISION_AGENT = 'gpt-4.1',
  CUSTOMER_SUPPORT = 'gpt-4o-mini',
}
