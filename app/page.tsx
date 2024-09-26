// /app/page.tsx
import DriftData from '@/components/DriftData';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-gray-100 dark:bg-gray-900">
      <div className="z-10 w-full max-w-6xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Drift Protocol Demo</h1>
        <DriftData />
      </div>
    </main>
  );
}
