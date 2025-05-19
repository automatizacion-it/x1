import { useState, useEffect } from "react";

const letters = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
);
const colors = ["notaAmarilla", "notaVerde", "notaAzul"];

export default function LibretaNotas() {
  const [selectedLetter, setSelectedLetter] = useState("A");
  const [notes, setNotes] = useState({});
  const [newNoteText, setNewNoteText] = useState("");
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("libretaNotas")) || {};
    setNotes(savedNotes);
    const savedTheme = localStorage.getItem("temaOscuro") === "true";
    setDarkMode(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("libretaNotas", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("temaOscuro", darkMode);
  }, [darkMode]);

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    const timestamp = new Date().toLocaleString();
    const note = { text: newNoteText, timestamp, color: selectedColor };
    setNotes((prev) => ({
      ...prev,
      [selectedLetter]: [...(prev[selectedLetter] || []), note],
    }));
    setNewNoteText("");
  };

  const handleDeleteNote = (indexToDelete) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar esta nota?");
    if (!confirmar) return;

    setNotes((prev) => {
      const updatedNotes = [...(prev[selectedLetter] || [])];
      updatedNotes.splice(indexToDelete, 1);
      return {
        ...prev,
        [selectedLetter]: updatedNotes,
      };
    });
  };

  return (
    <div className="flex h-screen bg-fondoClaro dark:bg-fondoOscuro text-gray-900 dark:text-gray-100 transition-colors">
      {/* Barra lateral */}
      <aside className="w-16 bg-gray-100 dark:bg-gray-800 p-2 flex flex-col items-center space-y-2 overflow-y-auto">
        {letters.map((letter) => (
          <button
            key={letter}
            onClick={() => setSelectedLetter(letter)}
            className={`w-10 h-10 rounded-full font-bold ${
              selectedLetter === letter
                ? "bg-primario text-white"
                : "bg-white dark:bg-gray-700"
            }`}
          >
            {letter}
          </button>
        ))}
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">
            Notas para la letra "{selectedLetter}"
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700"
          >
            {darkMode ? "🌞 Claro" : "🌙 Oscuro"}
          </button>
        </div>

        {/* Selector de color */}
        <div className="flex space-x-2 mb-2">
          {colors.map((color) => (
            <button
              key={color}
              className={`w-8 h-8 rounded-full border-2 ${
                color === "notaAmarilla"
                  ? "bg-yellow-100"
                  : color === "notaVerde"
                  ? "bg-green-100"
                  : "bg-blue-100"
              } ${
                selectedColor === color
                  ? "border-black dark:border-white"
                  : "border-transparent"
              }`}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>

        {/* Área de texto */}
        <textarea
          value={newNoteText}
          onChange={(e) => setNewNoteText(e.target.value)}
          rows={3}
          className="w-full p-2 border rounded mb-2 text-black dark:text-white dark:bg-gray-800"
          placeholder="Escribe una nota..."
        />

        <button
          onClick={handleAddNote}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Agregar Nota
        </button>

        {/* Lista de notas */}
        <div className="mt-4 space-y-4">
          {(notes[selectedLetter] || []).map((note, index) => (
            <div
              key={index}
              className={`p-4 rounded shadow ${
                note.color === "notaAmarilla"
                  ? "bg-yellow-100"
                  : note.color === "notaVerde"
                  ? "bg-green-100"
                  : "bg-blue-100"
              }`}
            >
              <div className="text-sm text-gray-600">{note.timestamp}</div>
              <div className="mb-2">{note.text}</div>
              <button
                onClick={() => handleDeleteNote(index)}
                className="text-red-600 hover:underline text-sm"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
