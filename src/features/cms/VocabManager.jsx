import { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { supabase } from "../../services/supabaseClient";

const HSK_LEVELS = ["All", "1", "2", "3", "4", "5", "6"];
const PAGE_SIZE = 50;

export default function VocabManager() {
  const [vocab, setVocab] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  const loadMoreVocab = useCallback(
    async (isInitialLoad = false) => {
      if (loading || !hasMore) return;
      setLoading(true);

      const currentPage = isInitialLoad ? 0 : page;
      const from = currentPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      try {
        const { data, error } = await supabase
          .from("vocab")
          .select("*")
          .order("hsk_level", { ascending: true, nullsFirst: false })
          .order("pinyin", { ascending: true })
          .range(from, to);

        if (error) throw error;

        if (data) {
          if (isInitialLoad) {
            setVocab(data);
          } else {
            setVocab((prev) => [...prev, ...data]);
          }

          if (data.length < PAGE_SIZE) {
            setHasMore(false);
          }
          setPage(currentPage + 1);
        }
      } catch (err) {
        setError("Failed to load vocabulary.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [page, loading, hasMore]
  );

  useEffect(() => {
    if (vocab.length === 0 && hasMore) {
      loadMoreVocab(true);
    }
  }, [hasMore, loadMoreVocab, vocab.length]);

  useEffect(() => {
    if (inView && hasMore && vocab.length > 0) {
      loadMoreVocab();
    }
  }, [inView, hasMore, vocab.length, loadMoreVocab]);

  const filteredVocab = useMemo(() => {
    if (activeFilter === "All") {
      return vocab;
    }
    return vocab.filter((item) => item.hsk_level === Number(activeFilter));
  }, [vocab, activeFilter]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const { error } = await supabase.from("vocab").delete().eq("id", id);
      if (error) {
        alert(`Error: ${error.message}`);
      } else {
        setVocab([]);
        setPage(0);
        setHasMore(true);
      }
    }
  };

  const getButtonClass = (level) => {
    const baseClass =
      "px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200";
    if (level === activeFilter) {
      return `${baseClass} bg-accent-dark text-accent-text shadow-sm`;
    }
    return `${baseClass} bg-card-bg border border-border text-text-secondary hover:bg-accent-light/50 hover:text-accent-dark`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-heading">Manage Vocabulary</h2>
        <Link to="/cms/vocab/new" className="btn-primary">
          Add New
        </Link>
      </div>
      <div className="bg-background/50 border border-border rounded-lg p-3 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-text-primary mr-2">
            Filter by HSK:
          </p>
          {HSK_LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => setActiveFilter(level)}
              className={getButtonClass(level)}
            >
              {level === "All" ? "All" : `Lvl ${level}`}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto bg-card-bg rounded-lg border border-border hidden md:block">
        <table className="min-w-full text-sm text-left text-text-primary">
          <thead className="bg-background border-b border-border">
            <tr>
              <th className="px-4 py-3 w-16 font-semibold text-text-secondary uppercase tracking-wider text-center">
                No.
              </th>
              <th className="px-4 py-3 w-16 font-semibold text-text-secondary uppercase tracking-wider">
                HSK
              </th>
              <th className="px-4 py-3 font-semibold text-text-secondary uppercase tracking-wider">
                Traditional
              </th>
              <th className="px-4 py-3 font-semibold text-text-secondary uppercase tracking-wider">
                Simplified
              </th>
              <th className="px-4 py-3 font-semibold text-text-secondary uppercase tracking-wider">
                Pinyin
              </th>
              <th className="px-4 py-3 font-semibold text-text-secondary uppercase tracking-wider">
                English
              </th>
              <th className="px-4 py-3 text-right font-semibold text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredVocab.map((item, index) => (
              <tr
                key={item.id}
                className="border-t border-border hover:bg-accent-light/30"
              >
                <td className="px-4 py-3 font-mono text-text-secondary text-center">
                  {index + 1}
                </td>
                <td className="px-4 py-3 font-mono text-center">
                  {item.hsk_level || "-"}
                </td>
                <td className="px-4 py-3 font-mono">{item.traditional}</td>
                <td className="px-4 py-3 font-mono">{item.simplified}</td>
                <td className="px-4 py-3 font-mono">{item.pinyin}</td>
                <td className="px-4 py-3 font-mono">{item.english}</td>
                <td className="px-4 py-3 text-right space-x-4">
                  <Link
                    to={`/cms/vocab/edit/${item.id}`}
                    className="font-semibold text-accent-medium hover:text-accent-dark"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="font-semibold text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {loading && (
              <tr>
                <td colSpan="7" className="text-center p-4 text-text-secondary">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && !hasMore && vocab.length > 0 && (
              <tr>
                <td colSpan="7" className="text-center p-4 text-text-secondary">
                  -- End of list --
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div ref={ref}></div>
      </div>

      <div className="block md:hidden space-y-2">
        {filteredVocab.map((item, index) => (
          <div
            key={item.id}
            className="bg-card-bg p-3 rounded-md border border-border"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-2">
                <span className="text-xs font-mono text-text-secondary mt-1.5">
                  {index + 1}.
                </span>
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <p className="text-xl font-semibold text-text-primary font-mono">
                      {item.traditional}
                    </p>
                    <span className="text-lg font-light text-border">|</span>
                    <p className="text-xl font-semibold text-accent-dark font-mono">
                      {item.simplified}
                    </p>
                  </div>
                  <p className="text-sm text-text-secondary font-mono -mt-1">
                    {item.pinyin}
                  </p>
                </div>
              </div>
              <div className="text-xs font-bold bg-accent-light text-accent-dark px-2 py-0.5 rounded-full flex-shrink-0">
                HSK {item.hsk_level || "?"}
              </div>
            </div>
            <div className="flex justify-between items-end mt-2 pt-2 border-t border-border/50">
              <p className="text-sm text-text-primary font-mono mr-2 leading-tight">
                {item.english}
              </p>
              <div className="text-sm space-x-4 flex-shrink-0">
                <Link
                  to={`/cms/vocab/edit/${item.id}`}
                  className="font-semibold text-accent-medium hover:text-accent-dark"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="font-semibold text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        <div
          ref={ref}
          className="h-20 text-center flex justify-center items-center"
        >
          {loading && <div className="text-accent-dark">Loading more...</div>}
          {!loading && !hasMore && vocab.length > 0 && (
            <div className="text-text-secondary">You've reached the end.</div>
          )}
        </div>
      </div>
    </div>
  );
}
