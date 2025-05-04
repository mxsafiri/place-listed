"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-red-600">
      <h2 className="text-2xl font-bold mb-2">Something went wrong!</h2>
      <pre className="mb-4 bg-red-100 p-2 rounded text-sm max-w-xl overflow-x-auto">{error.message}</pre>
      <button
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
