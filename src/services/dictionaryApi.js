let dictionaryMap = null;

// Fungsi ini akan mengambil file JSON lokal dan mengubahnya menjadi struktur data
// yang sangat cepat untuk pencarian (sebuah Map).
async function initializeDictionary() {
  if (dictionaryMap) return; // Hanya load sekali

  try {
    const response = await fetch("/cedict.json"); // Mengambil dari folder /public
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    const tempMap = new Map();
    for (const entry of data) {
      // Menyimpan entri berdasarkan karakter simplified dan traditional
      if (entry.simplified) tempMap.set(entry.simplified, entry);
      if (entry.traditional) tempMap.set(entry.traditional, entry);
    }
    dictionaryMap = tempMap;
    console.log("Local dictionary loaded successfully.");
  } catch (error) {
    console.error("Failed to load or parse local dictionary:", error);
    dictionaryMap = new Map(); // Inisialisasi kosong jika gagal
  }
}

// Panggil fungsi inisialisasi saat aplikasi pertama kali dimuat
const dictionaryPromise = initializeDictionary();

export async function getWordDefinition(word) {
  await dictionaryPromise; // Pastikan kamus sudah siap sebelum mencari

  if (!dictionaryMap || !dictionaryMap.has(word)) {
    throw new Error(`Definition not found for "${word}"`);
  }

  // Mengembalikan data dari Map secara instan
  return dictionaryMap.get(word);
}
