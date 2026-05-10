import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { formatRelativeTime } from '@/lib/utils/date';
import type { Message } from '@/lib/types';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <Card className={`max-w-[85%] ${isUser ? 'bg-neutral-900 text-white' : 'bg-white'}`} padding="md">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <p className={`text-xs uppercase tracking-wide ${isUser ? 'text-neutral-300' : 'text-neutral-500'}`}>
              {isUser ? 'You' : 'Assistant'}
            </p>
            <p className={`text-xs ${isUser ? 'text-neutral-300' : 'text-neutral-400'}`}>
              {formatRelativeTime(message.timestamp)}
            </p>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
          {!isUser ? (
            <div className="pt-2">
              <Button variant="ghost" size="sm" className="px-0 text-neutral-500 hover:bg-transparent hover:text-neutral-900">
                Copy
              </Button>
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
