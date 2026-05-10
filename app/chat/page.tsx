'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ChatMessage } from '@/components/Chat/ChatMessage';
import { useChat } from '@/hooks/useChat';

const examples = [
  'Explain photosynthesis in simple terms.',
  'Help me understand quadratic equations.',
  'Quiz me on the French Revolution.',
];

export default function ChatPage() {
  const { messages, sendMessage, isLoading, error, clearChat, retryLastMessage } = useChat();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const canSend = useMemo(() => input.trim().length > 0 && !isLoading, [input, isLoading]);

  const handleSubmit = async () => {
    if (!canSend) return;
    const value = input.trim();
    setInput('');
    await sendMessage(value);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Chat</h1>
          <p className="max-w-2xl text-sm leading-6 text-neutral-600">
            Ask for explanations, study help, or a second pass on a concept.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={clearChat}>
          Clear
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div ref={scrollRef} className="h-[60vh] space-y-4 overflow-y-auto px-4 py-6 sm:px-6">
          {messages.length === 0 ? (
            <div className="mx-auto max-w-xl space-y-4 rounded-3xl border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center">
              <h2 className="text-lg font-medium text-neutral-900">Start a conversation</h2>
              <p className="text-sm leading-6 text-neutral-600">Try one of these prompts or write your own.</p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {examples.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => setInput(example)}
                    className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => <ChatMessage key={message.id} message={message} />)
          )}
          {isLoading ? (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl bg-neutral-100 px-4 py-3 text-neutral-500">
                <LoadingSpinner size="sm" />
                <span className="text-sm">Preparing response</span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="border-t border-neutral-200 bg-white p-4 sm:p-6">
          <div className="space-y-4">
            <Input
              label="Message"
              placeholder="Write a question or paste a passage to discuss"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
                  event.preventDefault();
                  void handleSubmit();
                }
              }}
              showCharCount
              maxLength={2000}
              helperText="Press Ctrl or Cmd plus Enter to send."
            />
            {error ? (
              <div className="rounded-2xl border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700">
                <div className="flex items-center justify-between gap-4">
                  <p>{error}</p>
                  <Button variant="ghost" size="sm" onClick={retryLastMessage} className="text-error-700 hover:bg-transparent">
                    Retry
                  </Button>
                </div>
              </div>
            ) : null}
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-neutral-500">Clear, concise answers are easier to review later.</p>
              <Button onClick={() => void handleSubmit()} disabled={!canSend} isLoading={isLoading}>
                Send
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
