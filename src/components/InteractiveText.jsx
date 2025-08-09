import { useState, useRef, useEffect } from "react";
import { getWordDefinition } from "../services/dictionaryApi";
import WordPopover from "./WordPopover";

export default function InteractiveText({ text }) {
  const [popoverState, setPopoverState] = useState({
    definition: null,
    loading: false,
    error: null,
    position: null,
  });
  const containerRef = useRef(null);

  const handleWordClick = async (e, word) => {
    e.stopPropagation();
    const rect = e.target.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    setPopoverState({
      definition: null,
      loading: true,
      error: null,
      position: {
        top: rect.bottom - containerRect.top + window.scrollY + 10,
        left: rect.left - containerRect.left + window.scrollX,
      },
    });

    try {
      const defData = await getWordDefinition(word);
      setPopoverState((prev) => ({
        ...prev,
        definition: defData,
        loading: false,
      }));
    } catch (err) {
      console.error("Original fetch error:", err);
      setPopoverState((prev) => ({
        ...prev,
        error: "Gagal memuat definisi. Cek koneksi atau coba lagi nanti.",
        loading: false,
      }));
    }
  };

  const closePopover = () => {
    setPopoverState((prev) => ({ ...prev, position: null }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverState.position &&
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        closePopover();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popoverState.position]);

  const words = text ? text.split("") : [];

  return (
    <div
      ref={containerRef}
      className="relative leading-loose text-xl text-text-primary"
      lang="zh"
    >
      {words.map((char, index) => (
        <span
          key={index}
          className="cursor-pointer hover:bg-accent-special hover:text-accent-dark rounded transition-colors"
          onClick={(e) => handleWordClick(e, char)}
        >
          {char}
        </span>
      ))}
      <WordPopover {...popoverState} onClose={closePopover} />
    </div>
  );
}
