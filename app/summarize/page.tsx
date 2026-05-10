'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { countWords, estimateReadingTime, truncate } from '@/lib/utils/text';

export default function SummarizePage() {
  const [text, setText] = useState('');
  const [summaryType, setSummaryType] = useState<'brief' | 'detailed' | 'comprehensive'>('detailed');
  const [summary, setSummary] = useState('');
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const charCount = text.length;
  const wordCount = useMemo(() => countWords(text), [text]);
  const readingTime = useMemo(() => estimateReadingTime(text), [text]);
  const summaryWordCount = useMemo(() => countWords(summary), [summary]);
  const reductionPercent = useMemo(() => {
    if (!wordCount || !summaryWordCount) return 0;
    return Math.max(0, Math.round(((wordCount - summaryWordCount) / wordCount) * 100));
  }, [summaryWordCount, wordCount]);

  const handleSummarize = async () => {
    if (!text.trim()) {
      setError('Add text to summarize.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, summaryType }),
      });

      if (!response.ok) {
        throw new Error('Unable to summarize the document.');
      }

      const data = (await response.json()) as { summary: string; keyPoints: string[] };
      setSummary(data.summary);
      setKeyPoints(data.keyPoints);
      setCopied(false);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySummary = async () => {
    if (!summary) return;
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Summarize</h1>
        <p className="max-w-2xl text-sm leading-6 text-neutral-600">Paste text or upload a document to create a concise summary with key points.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-neutral-900">Paste text</label>
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                rows={16}
                className="w-full rounded-3xl border border-neutral-200 bg-white p-4 text-sm text-neutral-900 shadow-sm outline-none focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100"
                placeholder="Paste notes, article text, or lecture content here."
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-neutral-500">
              <div className="flex gap-4">
                <span>{charCount} characters</span>
                <span>{wordCount} words</span>
                <span>{readingTime} min read</span>
              </div>
              <div className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-neutral-700">
                Max 50,000 characters
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="text-sm font-medium text-neutral-900">Summary type</label>
              {(['brief', 'detailed', 'comprehensive'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSummaryType(option)}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${summaryType === option ? 'border-[#2f93d1] bg-[#2f93d1] text-white' : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'}`}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between gap-4">
              {error ? <p className="text-sm text-error-600">{error}</p> : <p className="text-sm text-neutral-500">The output stays concise and structured.</p>}
              <Button onClick={() => void handleSummarize()} isLoading={isLoading}>
                Summarize
              </Button>
            </div>
          </div>
        </Card>

        <Card header={<h2 className="text-lg font-semibold text-neutral-900">Result</h2>}>
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex items-center gap-2 text-sm text-neutral-500"><LoadingSpinner size="sm" /> Generating summary</div>
            ) : summary ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs font-medium uppercase tracking-wide text-neutral-700">
                      {summaryType} summary
                    </span>
                    <span className="rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs font-medium uppercase tracking-wide text-neutral-700">
                      Professional format
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => void handleCopySummary()}>
                    {copied ? 'Copied' : 'Copy summary'}
                  </Button>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Executive summary</h3>
                  <div className="rounded-2xl border border-neutral-200 bg-white p-4">
                    <p className="whitespace-pre-wrap text-sm leading-7 text-neutral-700">{summary}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Key points</h3>
                  <ul className="space-y-2 text-sm text-neutral-600">
                    {keyPoints.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-400" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm text-neutral-500">
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                    <p className="text-neutral-400">Original words</p>
                    <p className="mt-1 text-lg font-medium text-neutral-900">{wordCount}</p>
                  </div>
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                    <p className="text-neutral-400">Summary words</p>
                    <p className="mt-1 text-lg font-medium text-neutral-900">{summaryWordCount}</p>
                  </div>
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                    <p className="text-neutral-400">Reduction</p>
                    <p className="mt-1 text-lg font-medium text-neutral-900">{reductionPercent}%</p>
                  </div>
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                    <p className="text-neutral-400">Estimated reading</p>
                    <p className="mt-1 text-lg font-medium text-neutral-900">{readingTime} min</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-600">
                  <p>
                    Word count comparison: approximately {wordCount} words in the original text versus {summaryWordCount} words in the summary.
                  </p>
                </div>
              </>
            ) : (
              <div className="rounded-3xl border border-dashed border-neutral-200 bg-neutral-50 p-8 text-sm text-neutral-500">
                Paste text to see the summary here.
              </div>
            )}
            {summary ? <p className="text-xs text-neutral-400">{truncate(summary, 120)}</p> : null}
          </div>
        </Card>
      </div>
    </div>
  );
}
