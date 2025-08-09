import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import {
  BookOpenIcon,
  NewspaperIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

export default function CMSDashboard() {
  const [stats, setStats] = useState({ vocab: 0, stories: 0, news: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      const [vocabRes, storiesRes, newsRes] = await Promise.all([
        supabase.from("vocab").select("*", { count: "exact", head: true }),
        supabase.from("story").select("*", { count: "exact", head: true }),
        supabase.from("news").select("*", { count: "exact", head: true }),
      ]);
      setStats({
        vocab: vocabRes.count || 0,
        stories: storiesRes.count || 0,
        news: newsRes.count || 0,
      });
      setLoading(false);
    };
    fetchCounts();
  }, []);

  const statCards = [
    {
      name: "Vocabulary Items",
      count: stats.vocab,
      href: "/cms/vocab",
      icon: BookOpenIcon,
    },
    {
      name: "Stories",
      count: stats.stories,
      href: "/cms/stories",
      icon: ChatBubbleLeftRightIcon,
    },
    {
      name: "News Articles",
      count: stats.news,
      href: "/cms/news",
      icon: NewspaperIcon,
    },
  ];

  return (
    <div>
      <h2 className="text-heading mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <Link
            key={card.name}
            to={card.href}
            className="bg-background p-6 rounded-lg border border-border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">
                  {card.name}
                </p>
                <p className="text-3xl font-bold text-accent-dark">
                  {loading ? "..." : card.count}
                </p>
              </div>
              <card.icon className="h-10 w-10 text-accent-medium" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
