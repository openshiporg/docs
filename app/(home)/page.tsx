import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col justify-center text-center">
      <h1 className="mb-4 text-2xl font-bold">Combined Documentation</h1>
      <div className="flex flex-col gap-4 max-w-md mx-auto">
        <p className="text-fd-muted-foreground mb-4">
          Choose which documentation to explore:
        </p>
        
        <Link
          href="/docs/openfront"
          className="text-fd-foreground font-semibold underline hover:opacity-80 transition-opacity"
        >
          Openfront Documentation
        </Link>
        
        <Link
          href="/docs/openship"
          className="text-fd-foreground font-semibold underline hover:opacity-80 transition-opacity"
        >
          Openship Documentation
        </Link>
      </div>
    </main>
  );
}
