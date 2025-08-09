import NewsList from "../features/news/NewsList";

export default function NewsPage() {
  return (
    <div className="py-8">
      <header className="mb-8">
        <h1 className="text-heading">News</h1>
        <p className="subtext mt-2">
          Read news articles and click on characters to see definitions.
        </p>
      </header>
      <main>
        <NewsList />
      </main>
    </div>
  );
}
