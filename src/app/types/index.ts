export type Intent = 'conversation' | 'scheduled' | 'consult' | 'cancel' | 'unknown';
export type ErrorType = 'blocked' | 'error';
export type GuardrailResult = { ok: false } | { ok: true };
