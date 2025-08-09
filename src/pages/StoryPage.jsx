import StoryList from "../features/story/StoryList";

export default function StoryPage() {
  return (
    <div className="py-8">
      <header className="mb-8">
        <h1 className="text-heading">Stories</h1>
        <p className="subtext mt-2">
          Read stories and click on characters to see definitions.
        </p>
      </header>
      <main>
        <StoryList />
      </main>
    </div>
  );
}
