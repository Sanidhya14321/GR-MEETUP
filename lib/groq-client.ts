const API_KEY = process.env.GROQ_API_KEY || process.env['GROQ-API-KEY'] || '';

if (!API_KEY) {
  console.warn('GROQ_API_KEY environment variable is not set');
}

const MODEL = 'llama-3.3-70b-versatile';
const MAX_TOKENS = 2048;
const TEMPERATURE = 0.7;

export { API_KEY, MODEL, MAX_TOKENS, TEMPERATURE };

export interface ChatCompletionMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GroqCompletionOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  model?: string;
}

export async function chatCompletion(
  messages: ChatCompletionMessage[],
  options: GroqCompletionOptions = {}
): Promise<string> {
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  const requestBody = {
    model: options.model || MODEL,
    messages,
    temperature: options.temperature ?? TEMPERATURE,
    max_tokens: options.maxTokens ?? MAX_TOKENS,
    top_p: options.topP,
    top_k: options.topK,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Groq API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function streamChatCompletion(
  messages: ChatCompletionMessage[],
  onChunk: (chunk: string) => void,
  options: GroqCompletionOptions = {}
): Promise<string> {
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: options.model || MODEL,
      messages,
      temperature: options.temperature ?? TEMPERATURE,
      max_tokens: options.maxTokens ?? MAX_TOKENS,
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`Groq API error: ${error.error?.message || response.statusText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n').filter((line) => line.startsWith('data: '));

    for (const line of lines) {
      const data = line.slice(6);
      if (data === '[DONE]') continue;

      try {
        const parsed = JSON.parse(data) as {
          choices?: Array<{ delta?: { content?: string } }>;
        };
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) {
          fullText += content;
          onChunk(content);
        }
      } catch {
        continue;
      }
    }
  }

  return fullText;
}

export async function completion(
  prompt: string,
  options: GroqCompletionOptions = {}
): Promise<string> {
  return chatCompletion(
    [
      {
        role: 'user',
        content: prompt,
      },
    ],
    options
  );
}
