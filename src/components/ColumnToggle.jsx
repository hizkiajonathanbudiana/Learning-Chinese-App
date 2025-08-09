import { useSelector, useDispatch } from "react-redux";
import { toggleColumn } from "../store/columnSlice";

const columnsConfig = [
  { key: "hsk_level", label: "HSK" },
  { key: "traditional", label: "Traditional" },
  { key: "simplified", label: "Simplified" },
  { key: "pinyin", label: "Pinyin" },
  { key: "english", label: "English" },
];

export default function ColumnToggle() {
  const dispatch = useDispatch();
  const columnState = useSelector((state) => state.columns);

  return (
    <div className="bg-card-bg border border-border rounded-lg p-4 shadow-sm">
      <p className="font-semibold text-text-primary mb-3">Toggle Columns:</p>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {columnsConfig.map(({ key, label }) => (
          <label
            key={key}
            className="flex items-center space-x-2 cursor-pointer text-text-secondary"
          >
            <input
              type="checkbox"
              checked={columnState[key] ?? true}
              onChange={() => dispatch(toggleColumn(key))}
              className="form-checkbox h-4 w-4 rounded bg-accent-light/50 border-border text-accent-medium focus:ring-accent-dark"
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
