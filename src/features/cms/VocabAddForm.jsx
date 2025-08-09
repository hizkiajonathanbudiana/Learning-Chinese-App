import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

export default function VocabAddForm() {
  const navigate = useNavigate();
  const [addMethod, setAddMethod] = useState("rows");
  const [rows, setRows] = useState([
    { hsk_level: "", traditional: "", simplified: "", pinyin: "", english: "" },
  ]);
  const [bulkText, setBulkText] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  const handleInputChange = (index, event) => {
    const values = [...rows];
    values[index][event.target.name] = event.target.value;
    setRows(values);
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        hsk_level: "",
        traditional: "",
        simplified: "",
        pinyin: "",
        english: "",
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    const values = [...rows];
    values.splice(index, 1);
    setRows(values);
  };

  const handleRowSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const dataToInsert = rows
      .map((row) => ({
        ...row,
        hsk_level: row.hsk_level === "" ? null : Number(row.hsk_level),
      }))
      .filter((row) => row.simplified && row.pinyin && row.english);

    if (dataToInsert.length === 0) {
      alert("Please fill out at least one complete row.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("vocab").insert(dataToInsert);
    setLoading(false);
    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      navigate("/cms/vocab");
    }
  };

  const handleValidate = () => {
    setLoading(true);
    const lines = bulkText.split("\n").filter((line) => line.trim() !== "");
    const validRows = [];
    const invalidRows = [];

    lines.forEach((line, index) => {
      const parts = line.split(",").map((part) => part.trim());
      const hskLevel = Number(parts[0]);
      if (parts.length === 5 && !isNaN(hskLevel)) {
        validRows.push({
          hsk_level: hskLevel,
          traditional: parts[1],
          simplified: parts[2],
          pinyin: parts[3],
          english: parts[4],
        });
      } else {
        invalidRows.push({
          lineNumber: index + 1,
          content: line,
          reason:
            parts.length !== 5
              ? "Must have 5 columns"
              : "HSK level is not a number",
        });
      }
    });
    setValidationResult({ valid: validRows, invalid: invalidRows });
    setLoading(false);
  };

  const handleSaveValidated = async () => {
    if (
      !validationResult ||
      validationResult.invalid.length > 0 ||
      validationResult.valid.length === 0
    ) {
      alert("Please ensure all data is valid before saving.");
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("vocab")
      .insert(validationResult.valid);
    setLoading(false);
    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      alert(`${validationResult.valid.length} items successfully inserted!`);
      navigate("/cms/vocab");
    }
  };

  const getButtonClass = (method) =>
    addMethod === method ? "btn-primary" : "btn-secondary";

  return (
    <div>
      <h2 className="text-heading mb-6">Add New Vocabulary</h2>
      <div className="flex space-x-2 mb-6 border-b border-border pb-4">
        <button
          onClick={() => setAddMethod("rows")}
          className={getButtonClass("rows")}
        >
          Row-by-Row
        </button>
        <button
          onClick={() => setAddMethod("text")}
          className={getButtonClass("text")}
        >
          Bulk Text
        </button>
      </div>

      {addMethod === "rows" && (
        <form onSubmit={handleRowSubmit} className="space-y-6">
          {rows.map((row, index) => (
            <div
              key={index}
              className="flex items-end gap-2 p-4 border border-border rounded-lg bg-background/50"
            >
              <div className="w-16">
                <label className="field-label">HSK</label>
                <input
                  type="number"
                  name="hsk_level"
                  value={row.hsk_level}
                  onChange={(e) => handleInputChange(index, e)}
                  className="field-input"
                />
              </div>
              <div className="flex-1">
                <label className="field-label">Traditional</label>
                <input
                  type="text"
                  name="traditional"
                  value={row.traditional}
                  onChange={(e) => handleInputChange(index, e)}
                  className="field-input"
                />
              </div>
              <div className="flex-1">
                <label className="field-label">Simplified *</label>
                <input
                  type="text"
                  name="simplified"
                  value={row.simplified}
                  onChange={(e) => handleInputChange(index, e)}
                  required
                  className="field-input"
                />
              </div>
              <div className="flex-1">
                <label className="field-label">Pinyin *</label>
                <input
                  type="text"
                  name="pinyin"
                  value={row.pinyin}
                  onChange={(e) => handleInputChange(index, e)}
                  required
                  className="field-input"
                />
              </div>
              <div className="flex-1">
                <label className="field-label">English *</label>
                <input
                  type="text"
                  name="english"
                  value={row.english}
                  onChange={(e) => handleInputChange(index, e)}
                  required
                  className="field-input"
                />
              </div>
              {rows.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveRow(index)}
                  className="px-3 py-2 bg-red-200 text-red-800 rounded hover:bg-red-300"
                >
                  -
                </button>
              )}
            </div>
          ))}
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={handleAddRow}
              className="btn-secondary"
            >
              + Add Row
            </button>
          </div>
          <div className="flex items-center space-x-4 pt-4">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Saving..." : `Save ${rows.length} Items`}
            </button>
            <button
              type="button"
              onClick={() => navigate("/cms/vocab")}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {addMethod === "text" && (
        <div className="space-y-4">
          <div>
            <label className="field-label mb-2">Paste your data here</label>
            <p className="text-xs text-text-secondary mb-2">
              Format per baris:{" "}
              <code className="bg-accent-light/50 p-1 rounded">
                hsk_level,traditional,simplified,pinyin,english
              </code>
            </p>
            <textarea
              value={bulkText}
              onChange={(e) => {
                setBulkText(e.target.value);
                setValidationResult(null);
              }}
              placeholder={`1,有,有,yǒu,to have\n2,语言,语言,yǔyán,language\n...`}
              rows="10"
              className="w-full bg-charcoal p-2 rounded border border-steel font-mono text-sm"
            />
          </div>
          <div className="flex items-center space-x-4 pt-4">
            <button
              type="button"
              onClick={handleValidate}
              disabled={loading || !bulkText}
              className="btn-secondary"
            >
              {loading ? "Validating..." : "Validate Text"}
            </button>
            {validationResult && (
              <button
                type="button"
                onClick={handleSaveValidated}
                disabled={
                  loading ||
                  validationResult.invalid.length > 0 ||
                  validationResult.valid.length === 0
                }
                className="btn-primary"
              >
                {`Save ${validationResult.valid.length} Valid Items`}
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate("/cms/vocab")}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>

          {validationResult && (
            <div className="mt-6 p-4 border border-border rounded-lg bg-background/50">
              <h3 className="font-bold text-lg text-text-primary mb-4">
                Validation Report
              </h3>
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircleIcon className="w-5 h-5" />
                <span>{validationResult.valid.length} rows are valid.</span>
              </div>
              {validationResult.invalid.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-red-600">
                    <XCircleIcon className="w-5 h-5" />
                    <span>
                      {validationResult.invalid.length} rows are invalid and
                      need to be fixed:
                    </span>
                  </div>
                  <ul className="mt-2 list-disc list-inside text-sm text-red-700/80 space-y-1 pl-4 max-h-48 overflow-y-auto">
                    {validationResult.invalid.map((row) => (
                      <li key={row.lineNumber}>
                        <span className="font-semibold">
                          Line {row.lineNumber}:
                        </span>{" "}
                        <code className="bg-red-100 p-1 text-xs rounded">
                          {row.content}
                        </code>{" "}
                        ({row.reason})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
