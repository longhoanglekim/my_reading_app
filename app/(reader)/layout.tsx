"use client";

export default function ReaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <main className="w-full min-h-screen">
        {children}
      </main>
    </div>
  );
}
