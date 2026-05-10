import { useCallback, useState } from 'react';
import type { Message } from '@/lib/types';
import { useLocalStorage } from './useLocalStorage';

export function useChat() {
  const [messages, setMessages] = useLocalStorage<Message[]>('chat-history', []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    const nextMessages = [...messages, userMessage];
  setMessages(nextMessages);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages.slice(-10), temperature: 0.4 }),
      });

      if (!response.ok) {
        throw new Error('Unable to generate a response right now.');
      }

      const data = (await response.json()) as { response: string };
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages([...nextMessages, assistantMessage]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  }, [messages, setMessages]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, [setMessages]);

  const retryLastMessage = useCallback(async () => {
    const lastUserMessage = [...messages].reverse().find((message) => message.role === 'user');
    if (lastUserMessage) {
      await sendMessage(lastUserMessage.content);
    }
  }, [messages, sendMessage]);

  return { messages, sendMessage, isLoading, error, clearChat, retryLastMessage };
}
