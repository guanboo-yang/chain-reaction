import { createLazyFileRoute, Link } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="relative text-4xl w-full flex flex-col items-center duration-300 transition-colors justify-center h-screen bg-neutral-300">
      <h1 className="mb-4">Chain Reaction</h1>
      <Link
        to="/game"
        className="bg-white py-2 px-4 rounded-xl hover:bg-neutral-100 transition-colors active:bg-neutral-200"
      >
        Start
      </Link>
    </div>
  );
}
