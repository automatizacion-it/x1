// src/components/FileUploader.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const FileUploader = ({ selectedLetter }) => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchFiles = async () => {
    if (!selectedLetter) return;
    try {
      const res = await axios.get(`/api/files/${selectedLetter}`);
      setFiles(res.data);
    } catch (error) {
      console.error("Error al obtener archivos:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [selectedLetter]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedLetter) return;
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("letter", selectedLetter);

    try {
      await axios.post("/api/files/upload", formData);
      setSelectedFile(null);
      fetchFiles();
    } catch (error) {
      console.error("Error al subir archivo:", error);
    }
  };

  const handleDownload = async (id) => {
    try {
      const res = await axios.get(`/api/files/download/${id}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "archivo");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al descargar archivo:", error);
    }
  };

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-lg font-bold mb-2">Archivos de la letra: {selectedLetter}</h2>

      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Subir
      </button>

      <ul className="mt-4 space-y-2">
        {files.map((file) => (
          <li
            key={file._id}
            className="flex items-center justify-between bg-gray-100 p-2 rounded"
          >
            <span>{file.originalName}</span>
            <button
              onClick={() => handleDownload(file._id)}
              className="text-sm text-blue-600 hover:underline"
            >
              Descargar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileUploader;
