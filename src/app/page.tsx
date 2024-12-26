import type { JSX } from "react";

export default function Home(): JSX.Element {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">AI Form Factory</h1>
        <p className="text-xl text-center text-gray-600 mb-8">
          Create and manage forms with AI assistance
        </p>
        <div className="flex justify-center">
          <a
            href="/chat"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Chat Demo
          </a>
        </div>
      </div>
    </main>
  );
}
