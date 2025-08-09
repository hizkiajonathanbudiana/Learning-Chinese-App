import { useEffect, useState, useMemo, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { supabase } from "../../services/supabaseClient";
import DataTable from "../../components/DataTable";

const PAGE_SIZE = 50; // Ambil 50 item per halaman

export default function VocabList({ activeFilter }) {
  const [vocab, setVocab] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  const loadMoreVocab = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    try {
      const { data, error } = await supabase
        .from("vocab")
        .select("*")
        .order("hsk_level", { ascending: true })
        .order("pinyin", { ascending: true })
        .range(from, to);

      if (error) throw error;

      if (data) {
        setVocab((prev) => [...prev, ...data]);
        if (data.length < PAGE_SIZE) {
          setHasMore(false);
        }
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching vocab:", err);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    if (inView && hasMore) {
      loadMoreVocab();
    }
  }, [inView, hasMore, loadMoreVocab]);

  const filteredVocab = useMemo(() => {
    if (!vocab) return [];
    if (activeFilter === "All") {
      return vocab;
    }
    return vocab.filter((item) => item.hsk_level === Number(activeFilter));
  }, [vocab, activeFilter]);

  const headers = [
    { key: "hsk_level", label: "HSK" },
    { key: "traditional", label: "Traditional" },
    { key: "simplified", label: "Simplified" },
    { key: "pinyin", label: "Pinyin" },
    { key: "english", label: "English" },
  ];

  if (vocab.length === 0 && loading) {
    return (
      <div className="text-center py-10 text-accent-dark">
        Loading vocabulary...
      </div>
    );
  }
  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <DataTable headers={headers} data={filteredVocab} />
      <div
        ref={ref}
        className="h-20 text-center flex justify-center items-center"
      >
        {loading && <div className="text-accent-dark">Loading more...</div>}
        {!loading && !hasMore && vocab.length > 0 && (
          <div className="text-text-secondary">You've reached the end.</div>
        )}
      </div>
    </>
  );
}
