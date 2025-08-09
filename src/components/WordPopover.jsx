export default function WordPopover({
  definition,
  loading,
  error,
  position,
  onClose,
}) {
  if (!position) return null;

  const style = {
    top: `${position.top}px`,
    left: `${position.left}px`,
  };

  return (
    <div
      style={style}
      className="absolute z-10 w-64 p-4 bg-night border border-brand rounded-lg shadow-lg"
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-silver hover:text-white"
      >
        &times;
      </button>
      {loading && <p className="text-silver">Loading...</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {definition && !loading && (
        <div>
          <h4 className="text-lg font-bold text-white">
            {definition.simplified}
          </h4>
          <p className="text-md text-brand font-mono">[{definition.pinyin}]</p>
          {/* Kembalikan ke format list karena data kita sekarang konsisten */}
          <ul className="mt-2 text-sm text-light-silver list-disc list-inside space-y-1">
            {definition.definitions.map((def, index) => (
              <li key={index}>{def}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
