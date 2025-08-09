import { useState } from "react";
import VocabList from "../features/vocab/VocabList";
import ColumnToggle from "../components/ColumnToggle";

const HSK_LEVELS = ["All", "1", "2", "3", "4", "5", "6"];

export default function VocabPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const getButtonClass = (level) => {
    const baseClass =
      "px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200";
    if (level === activeFilter) {
      return `${baseClass} bg-accent-dark text-accent-text shadow-md`;
    }
    return `${baseClass} bg-card-bg border border-border text-text-secondary hover:bg-accent-light/50 hover:text-accent-dark`;
  };

  return (
    <div className="py-8">
      <header className="mb-8">
        <h1 className="text-heading">Vocabulary List</h1>
        <p className="subtext mt-2">
          Browse vocabulary and customize your view.
        </p>
      </header>
      <main className="space-y-6">
        <div className="bg-card-bg border border-border rounded-lg p-4 shadow-sm">
          <p className="font-semibold text-text-primary mb-3">
            Filter by HSK Level:
          </p>
          <div className="flex flex-wrap gap-2">
            {HSK_LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => setActiveFilter(level)}
                className={getButtonClass(level)}
              >
                {level === "All" ? "All Levels" : `HSK ${level}`}
              </button>
            ))}
          </div>
        </div>

        <ColumnToggle />
        <VocabList activeFilter={activeFilter} />
      </main>
    </div>
  );
}
