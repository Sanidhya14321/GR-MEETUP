import Link from 'next/link';
import { Card } from '@/components/ui/Card';

const features = [
  {
    title: 'Chat',
    description: 'Ask questions and get clear explanations in a calm, focused interface.',
    href: '/chat',
  },
  {
    title: 'Quiz',
    description: 'Generate structured practice questions by topic and difficulty.',
    href: '/quiz',
  },
  {
    title: 'Summarize',
    description: 'Turn long notes into concise summaries with key points.',
    href: '/summarize',
  },
  {
    title: 'Study Plan',
    description: 'Build a schedule that fits the time available before an exam.',
    href: '/study-plan',
  },
];

const steps = [
  'Choose a task: chat, quiz, summarize, or plan.',
  'Enter the subject or material you want to work with.',
  'Review the result and continue from where you left off.',
];

export default function HomePage() {
  return (
    <div className="bg-[radial-gradient(circle_at_top,#b9e0f7_0%,#edf6fc_34%,#f8fbfe_70%)]">
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-3xl space-y-8">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#7bb7df]">Chatraplaksh</p>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
            Focused study, built on a strategic interface.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-neutral-600">
            A clean, distraction-free workspace for tutoring, quiz generation, document summaries, and deadline-driven study planning.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/quiz" className="inline-flex h-12 items-center justify-center rounded-full border border-neutral-200 bg-white px-6 text-sm font-medium text-neutral-900 shadow-sm transition-colors hover:bg-neutral-50">
              Create a quiz
            </Link>
            <Link href="/chat" className="inline-flex h-12 items-center justify-center rounded-full bg-[#2f93d1] px-6 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#267db1]">
              Start with chat
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} hover className="h-full border-neutral-200 bg-white">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-neutral-900">{feature.title}</h2>
                <p className="text-sm leading-6 text-neutral-600">{feature.description}</p>
                <Link href={feature.href} className="inline-flex text-sm font-medium text-[#7bb7df] underline underline-offset-4">
                  Try now
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Card header={<h2 className="text-xl font-semibold text-neutral-900">How it works</h2>} className="border-neutral-200 bg-white">
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step} className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2f93d1] text-sm font-medium text-white">
                    {index + 1}
                  </div>
                  <p className="pt-1 text-sm leading-6 text-neutral-600">{step}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card header={<h2 className="text-xl font-semibold text-neutral-900">Designed for consistency</h2>} className="border-neutral-200 bg-white">
            <div className="space-y-4 text-sm leading-6 text-neutral-600">
              <p>
                Clean spacing, restrained color, and simple hierarchy keep the interface readable during long sessions.
              </p>
              <p>
                The same structure applies across each tool so the workflow stays predictable.
              </p>
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Card className="border-[#337eb0] bg-[linear-gradient(135deg,#154465_0%,#2f93d1_100%)] text-white">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight">Plan and study with precision.</h2>
              <p className="text-sm leading-6 text-blue-100">
                Open one tool, do the task, and move on without extra noise.
              </p>
            </div>
            <Link href="/study-plan" className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-neutral-900 shadow-sm transition-colors hover:bg-neutral-50">
              Build a study plan
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
