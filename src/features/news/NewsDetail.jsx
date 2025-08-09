import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { supabase } from "../../services/supabaseClient";
import InteractiveText from "../../components/InteractiveText";
import AudioButton from "../../components/AudioButton";
import ColumnToggle from "../../components/ColumnToggle";

export default function NewsDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const visibleColumns = useSelector((state) => state.columns);

  useEffect(() => {
    const fetchArticle = async () => {
      const { data } = await supabase
        .from("news")
        .select("*")
        .eq("id", id)
        .single();
      setArticle(data);
      setLoading(false);
    };
    fetchArticle();
  }, [id]);

  if (loading)
    return (
      <p className="text-center py-10 text-accent-dark">Loading article...</p>
    );
  if (!article)
    return <p className="text-center py-10 text-red-500">Article not found.</p>;

  const ContentSection = ({ title, text, lang, isInteractive = false }) => (
    <div className="py-4">
      <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">
        {title}
      </h3>
      {isInteractive ? (
        <InteractiveText text={text} />
      ) : (
        <p className="text-text-primary leading-loose font-mono text-lg">
          {text}
        </p>
      )}
    </div>
  );

  return (
    <article className="py-8">
      <Link
        to="/news"
        className="text-accent-medium hover:underline mb-8 block"
      >
        &larr; Back to News
      </Link>

      {article.image_url && (
        <img
          src={article.image_url}
          alt={article.title}
          className="w-full h-auto max-h-96 object-cover rounded-lg mb-6 bg-accent-light shadow-md"
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-heading">{article.title}</h1>
        {(article.traditional || article.simplified) && (
          <AudioButton
            text={article.traditional || article.simplified}
            lang="zh-TW"
          />
        )}
      </div>

      <div className="bg-card-bg p-6 rounded-lg border border-border shadow-sm space-y-4 divide-y divide-border">
        <ColumnToggle />

        {visibleColumns.simplified && article.simplified && (
          <ContentSection
            title="Simplified"
            text={article.simplified}
            isInteractive
          />
        )}
        {visibleColumns.traditional && article.traditional && (
          <ContentSection
            title="Traditional"
            text={article.traditional}
            isInteractive
          />
        )}
        {visibleColumns.pinyin && article.pinyin && (
          <ContentSection title="Pinyin" text={article.pinyin} />
        )}
        {visibleColumns.english && article.english && (
          <ContentSection title="English" text={article.english} />
        )}
      </div>
    </article>
  );
}
