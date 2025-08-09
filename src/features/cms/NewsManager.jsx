import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

export default function NewsManager() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchNews() {
    setLoading(true);
    const { data, error } = await supabase
      .from("news")
      .select("id, title")
      .order("id");
    if (error) {
      setError("Failed to load news articles.");
      console.error(error);
    } else {
      setNews(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      const { error } = await supabase.from("news").delete().eq("id", id);
      if (error) {
        alert(`Error: ${error.message}`);
      } else {
        fetchNews();
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-heading">Manage News</h2>
        <Link to="/cms/news/new" className="btn-primary">
          Add New Article
        </Link>
      </div>
      <div className="overflow-x-auto bg-card-bg rounded-lg border border-border">
        <table className="min-w-full text-sm text-left text-text-primary">
          <thead className="bg-background border-b border-border">
            <tr>
              <th className="px-4 py-3 font-semibold text-text-secondary uppercase tracking-wider">
                Title
              </th>
              <th className="px-4 py-3 text-right font-semibold text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="2" className="text-center p-4 text-text-secondary">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="2" className="text-center p-4 text-red-500">
                  {error}
                </td>
              </tr>
            ) : (
              news.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-border hover:bg-accent-light/30"
                >
                  <td className="px-4 py-3 font-mono">{item.title}</td>
                  <td className="px-4 py-3 text-right space-x-4">
                    <Link
                      to={`/cms/news/edit/${item.id}`}
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
