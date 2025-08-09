import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { supabase } from "../../services/supabaseClient";
import InteractiveText from "../../components/InteractiveText";
import AudioButton from "../../components/AudioButton";
import ColumnToggle from "../../components/ColumnToggle";

export default function StoryDetail() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const visibleColumns = useSelector((state) => state.columns);

  useEffect(() => {
    const fetchStory = async () => {
      const { data } = await supabase
        .from("story")
        .select("*")
        .eq("id", id)
        .single();
      setStory(data);
      setLoading(false);
    };
    fetchStory();
  }, [id]);

  if (loading)
    return (
      <p className="text-center py-10 text-accent-dark">Loading story...</p>
    );
  if (!story)
    return <p className="text-center py-10 text-red-500">Story not found.</p>;

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
        to="/story"
        className="text-accent-medium hover:underline mb-8 block"
      >
        &larr; Back to Stories
      </Link>

      {story.image_url && (
        <img
          src={story.image_url}
          alt={story.title}
          className="w-full h-auto max-h-96 object-cover rounded-lg mb-6 bg-accent-light shadow-md"
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-heading">{story.title}</h1>
        {/* PERUBAHAN DI SINI */}
        {(story.traditional || story.simplified) && (
          <AudioButton
            text={story.traditional || story.simplified}
            lang="zh-TW"
          />
        )}
      </div>

      <div className="bg-card-bg p-6 rounded-lg border border-border shadow-sm space-y-4 divide-y divide-border">
        <ColumnToggle />

        {visibleColumns.simplified && story.simplified && (
          <ContentSection
            title="Simplified"
            text={story.simplified}
            isInteractive
          />
        )}
        {visibleColumns.traditional && story.traditional && (
          <ContentSection
            title="Traditional"
            text={story.traditional}
            isInteractive
          />
        )}
        {visibleColumns.pinyin && story.pinyin && (
          <ContentSection title="Pinyin" text={story.pinyin} />
        )}
        {visibleColumns.english && story.english && (
          <ContentSection title="English" text={story.english} />
        )}
      </div>
    </article>
  );
}
