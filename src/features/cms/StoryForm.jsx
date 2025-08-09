import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import { uploadToCloudinary } from "../../services/cloudinary";

export default function StoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    traditional: "",
    simplified: "",
    pinyin: "",
    english: "",
    image_url: "",
  });

  const [imageSourceType, setImageSourceType] = useState("url");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [formLoading, setFormLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (id) {
      setFormLoading(true);
      const fetchItem = async () => {
        const { data } = await supabase
          .from("story")
          .select("*")
          .eq("id", id)
          .single();
        if (data) {
          setFormData(data);
          if (data.image_url) {
            setImagePreview(data.image_url);
            setImageSourceType("url");
          }
        }
        setFormLoading(false);
      };
      fetchItem();
    }
  }, [id]);

  useEffect(() => {
    if (imageSourceType === "upload" && imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    if (imageSourceType === "url") {
      setImagePreview(formData.image_url);
    }
  }, [imageFile, formData.image_url, imageSourceType]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setFormData((prev) => ({ ...prev, image_url: "" }));
    }
  };

  const handleUrlChange = (e) => {
    setFormData({ ...formData, image_url: e.target.value });
    setImageFile(null);
  };

  const handleGenerateContent = async () => {
    if (!aiPrompt) {
      alert("Please enter a prompt for the AI.");
      return;
    }
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "generate-content",
        {
          body: { prompt: aiPrompt },
        }
      );
      if (error) throw error;
      setFormData((prev) => ({
        ...prev,
        simplified: data.simplified || "",
        pinyin: data.pinyin || "",
        english: data.english || "",
      }));
    } catch (error) {
      alert(`AI content generation failed: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    let finalImageUrl = formData.image_url;
    if (imageSourceType === "upload" && imageFile) {
      try {
        finalImageUrl = await uploadToCloudinary(imageFile);
      } catch (error) {
        alert("Image upload failed. Please try again.");
        setFormLoading(false);
        return;
      }
    }
    const { id: formId, created_at, ...restOfData } = formData;
    const dataToSubmit = { ...restOfData, image_url: finalImageUrl };
    const result = id
      ? await supabase.from("story").update(dataToSubmit).eq("id", id)
      : await supabase.from("story").insert([dataToSubmit]);
    setFormLoading(false);
    if (result.error) {
      alert(`Error: ${result.error.message}`);
    } else {
      navigate("/cms/stories");
    }
  };

  const renderTextarea = (name, label) => (
    <div>
      <label className="field-label">{label}</label>
      <textarea
        name={name}
        value={formData[name] || ""}
        onChange={handleChange}
        rows="5"
        className="field-input font-mono"
      />
    </div>
  );

  const getButtonClass = (method) =>
    imageSourceType === method
      ? "btn-primary !py-1.5"
      : "btn-secondary !py-1.5";

  return (
    <div>
      <h2 className="text-heading mb-6">{id ? "Edit" : "Add New"} Story</h2>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label className="field-label">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="field-input"
          />
        </div>
        <div>
          <label className="field-label">Cover Image</label>
          <div className="flex space-x-2 my-2">
            <button
              type="button"
              onClick={() => setImageSourceType("url")}
              className={getButtonClass("url")}
            >
              Image URL
            </button>
            <button
              type="button"
              onClick={() => setImageSourceType("upload")}
              className={getButtonClass("upload")}
            >
              Upload File
            </button>
          </div>
          {imageSourceType === "upload" ? (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-accent-light file:text-accent-dark hover:file:bg-accent-special"
            />
          ) : (
            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              value={formData.image_url}
              onChange={handleUrlChange}
              className="field-input"
            />
          )}
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-48 h-auto rounded-md object-cover border border-border"
              />
            </div>
          )}
        </div>
        <div className="border border-accent-light rounded-lg p-4 space-y-3 bg-accent-light/20">
          <label className="block text-sm font-bold text-accent-dark">
            AI Content Generator
          </label>
          <textarea
            placeholder="e.g., Buatkan cerita pendek tentang seekor naga yang belajar memasak..."
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            rows="3"
            className="field-input font-mono"
          />
          <button
            type="button"
            onClick={handleGenerateContent}
            disabled={isGenerating}
            className="btn-primary !bg-accent-medium !py-1.5 disabled:cursor-wait"
          >
            {isGenerating ? "Generating..." : "✨ Generate with AI"}
          </button>
        </div>
        {renderTextarea("simplified", "Simplified Content")}
        {renderTextarea("pinyin", "Pinyin Content")}
        {renderTextarea("english", "English Translation")}
        {renderTextarea("traditional", "Traditional Content (optional)")}
        <div className="flex items-center space-x-4 pt-4">
          <button
            type="submit"
            disabled={formLoading || isGenerating}
            className="btn-primary"
          >
            {formLoading ? "Saving..." : "Save Story"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/cms/stories")}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
