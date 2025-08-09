import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

export default function NewsList() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("news")
        .select("id, title, image_url")
        .order("id");

      if (error) {
        console.error("Error fetching news:", error);
        setError(
          "Failed to load news articles. Please ensure the table exists and RLS policies are set correctly."
        );
        setNews([]);
      } else {
        setNews(data);
      }
      setLoading(false);
    };
    fetchNews();
  }, []);

  if (loading)
    return <p className="text-text-secondary">Loading news articles...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  if (!news || news.length === 0) {
    return <p className="text-text-secondary">No news articles found.</p>;
  }

  return (
    <div className="space-y-4">
      {news.map((article) => (
        <NavLink
          key={article.id}
          to={`/news/${article.id}`}
          className="flex items-center gap-6 p-4 bg-card-bg border border-border rounded-lg shadow-sm hover:border-accent-dark hover:shadow-md transition-all duration-200"
        >
          <img
            src={
              article.image_url ||
              `https://via.placeholder.com/150x100.png?text=HanziHub`
            }
            alt={article.title}
            className="w-36 h-24 object-cover rounded-md bg-accent-light"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-text-primary">
              {article.title}
            </h3>
          </div>
        </NavLink>
      ))}
    </div>
  );
}
