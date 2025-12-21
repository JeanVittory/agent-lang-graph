import { initChatModel } from 'langchain/chat_models/universal';

/**
 * Load a chat model from a fully specified name.
 * @param fullySpecifiedName - String in the format 'provider/model' or 'provider/account/provider/model'.
 * @returns A Promise that resolves to a BaseChatModel instance.
 */
export async function loadChatModel(fullySpecifiedName: string) {
  const index = fullySpecifiedName.indexOf('/');
  if (index === -1) {
    return await initChatModel(fullySpecifiedName);
  } else {
    const provider = fullySpecifiedName.slice(0, index);
    const model = fullySpecifiedName.slice(index + 1);
    return await initChatModel(model, { modelProvider: provider });
  }
}

export const contentToString = (content: unknown): string => {
  if (typeof content === 'string') return content;

  if (Array.isArray(content)) {
    return content
      .map((element) => (typeof element?.text === 'string' ? element.text : ''))
      .join('')
      .trim();
  }
  return String(content ?? '').trim();
};
