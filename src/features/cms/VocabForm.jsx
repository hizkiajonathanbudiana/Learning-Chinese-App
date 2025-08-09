import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

export default function VocabForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hsk_level: "",
    traditional: "",
    simplified: "",
    pinyin: "",
    english: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchItem = async () => {
        const { data } = await supabase
          .from("vocab")
          .select("*")
          .eq("id", id)
          .single();
        if (data) setFormData(data);
      };
      fetchItem();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { id: formId, ...dataToSubmit } = formData;

    let result;
    if (id) {
      result = await supabase.from("vocab").update(dataToSubmit).eq("id", id);
    } else {
      result = await supabase.from("vocab").insert([dataToSubmit]);
    }

    setLoading(false);
    if (result.error) {
      alert(`Error: ${result.error.message}`);
    } else {
      navigate("/cms/vocab");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">
        {id ? "Edit" : "Add New"} Vocabulary
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-silver">
            HSK Level
          </label>
          <input
            type="number"
            name="hsk_level"
            value={formData.hsk_level}
            onChange={handleChange}
            className="mt-1 block w-full bg-steel border border-silver/20 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand focus:border-brand"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-silver">
            Traditional
          </label>
          <input
            type="text"
            name="traditional"
            value={formData.traditional}
            onChange={handleChange}
            className="mt-1 block w-full bg-steel border border-silver/20 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand focus:border-brand"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-silver">
            Simplified
          </label>
          <input
            type="text"
            name="simplified"
            value={formData.simplified}
            onChange={handleChange}
            required
            className="mt-1 block w-full bg-steel border border-silver/20 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand focus:border-brand"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-silver">
            Pinyin
          </label>
          <input
            type="text"
            name="pinyin"
            value={formData.pinyin}
            onChange={handleChange}
            required
            className="mt-1 block w-full bg-steel border border-silver/20 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand focus:border-brand"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-silver">
            English
          </label>
          <input
            type="text"
            name="english"
            value={formData.english}
            onChange={handleChange}
            required
            className="mt-1 block w-full bg-steel border border-silver/20 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-brand focus:border-brand"
          />
        </div>
        <div className="flex items-center space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-brand text-white font-bold py-2 px-4 rounded hover:bg-blue-400 transition-colors disabled:bg-steel"
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/cms/vocab")}
            className="bg-charcoal text-silver font-bold py-2 px-4 rounded hover:bg-steel transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
