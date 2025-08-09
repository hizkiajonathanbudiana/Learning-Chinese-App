import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

export default function StoryList() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      const { data } = await supabase
        .from("story")
        .select("id, title, image_url")
        .order("id");
      setStories(data || []);
      setLoading(false);
    };
    fetchStories();
  }, []);

  if (loading) return <p className="text-text-secondary">Loading stories...</p>;

  return (
    <div className="space-y-4">
      {stories.map((story) => (
        <NavLink
          key={story.id}
          to={`/story/${story.id}`}
          className="flex items-center gap-6 p-4 bg-card-bg border border-border rounded-lg shadow-sm hover:border-accent-dark hover:shadow-md transition-all duration-200"
        >
          <img
            src={
              story.image_url ||
              `https://via.placeholder.com/150x100.png?text=HanziHub`
            }
            alt={story.title}
            className="w-36 h-24 object-cover rounded-md bg-accent-light"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-text-primary">
              {story.title}
            </h3>
          </div>
        </NavLink>
      ))}
    </div>
  );
}
