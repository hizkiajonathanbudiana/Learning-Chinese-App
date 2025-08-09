import { useSelector } from "react-redux";
import AudioButton from "./AudioButton";

export default function DataTable({ headers, data }) {
  const visibleColumns = useSelector((state) => state.columns);

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-text-secondary">
        No data available for the selected filter.
      </div>
    );
  }

  return (
    <div className="bg-card-bg rounded-lg border border-border shadow-sm">
      {/* --- Tampilan Desktop --- */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-full text-sm text-left text-text-primary">
          <thead className="bg-background border-b border-border">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 w-16 font-semibold text-text-secondary uppercase tracking-wider text-center"
              >
                No.
              </th>
              {headers.map(
                (header) =>
                  (visibleColumns[header.key] ?? true) && (
                    <th
                      key={header.key}
                      scope="col"
                      className="px-6 py-3 font-semibold text-text-secondary uppercase tracking-wider"
                    >
                      {header.label}
                    </th>
                  )
              )}
              <th
                scope="col"
                className="px-6 py-3 font-semibold text-text-secondary uppercase tracking-wider"
              >
                Audio
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={row.id || index}
                className="border-b border-border last:border-b-0 hover:bg-accent-light/30 transition-colors"
              >
                <td className="px-4 py-4 font-mono text-text-secondary text-center">
                  {index + 1}
                </td>
                {headers.map(
                  (header) =>
                    (visibleColumns[header.key] ?? true) && (
                      <td
                        key={`${row.id}-${header.key}`}
                        className="px-6 py-4 font-mono"
                      >
                        {row[header.key]}
                      </td>
                    )
                )}
                <td className="px-6 py-4">
                  <AudioButton
                    text={row.traditional || row.simplified}
                    lang="zh-TW"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Tampilan Mobile --- */}
      <div className="block md:hidden">
        <div className="space-y-1 p-2">
          {data.map((row, index) => (
            <div
              key={row.id || index}
              className="bg-card-bg p-3 rounded-md border border-border"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-start gap-3">
                  <span className="text-xs font-mono text-text-secondary mt-1.5">
                    {index + 1}.
                  </span>
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      {visibleColumns.traditional && (
                        <p className="text-xl font-semibold text-text-primary font-mono">
                          {row.traditional}
                        </p>
                      )}
                      {visibleColumns.traditional &&
                        visibleColumns.simplified && (
                          <span className="text-lg font-light text-border">
                            |
                          </span>
                        )}
                      {visibleColumns.simplified && (
                        <p className="text-xl font-semibold text-accent-dark font-mono">
                          {row.simplified}
                        </p>
                      )}
                    </div>
                    {visibleColumns.pinyin && (
                      <p className="text-sm text-text-secondary font-mono -mt-1">
                        {row.pinyin}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <AudioButton
                    text={row.traditional || row.simplified}
                    lang="zh-TW"
                  />
                </div>
              </div>

              {(visibleColumns.english || visibleColumns.hsk_level) && (
                <div className="flex justify-between items-end mt-2 pt-2 border-t border-border/50">
                  {visibleColumns.english && (
                    <p className="text-sm text-text-primary font-mono mr-2 leading-tight">
                      {row.english}
                    </p>
                  )}
                  {visibleColumns.hsk_level && (
                    <div className="text-xs font-bold bg-accent-light text-accent-dark px-2 py-0.5 rounded-full flex-shrink-0">
                      HSK {row.hsk_level}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
