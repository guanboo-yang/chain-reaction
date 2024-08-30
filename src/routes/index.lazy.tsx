import { createLazyFileRoute, Link } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center bg-neutral-300 text-4xl transition-colors duration-300">
      <h1 className="mb-4">Chain Reaction</h1>
      <Link
        to="/game"
        className="rounded-xl bg-white px-4 py-2 transition-colors hover:bg-neutral-100 active:bg-neutral-200"
      >
        Start
      </Link>
    </div>
  );
}
