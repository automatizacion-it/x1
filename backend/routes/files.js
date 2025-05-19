import express from "express";
import multer from "multer";
import File from "../models/File.js";
import path from "path";
import fs from "fs";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Subir archivo
router.post("/upload", upload.single("file"), async (req, res) => {
  const { letter } = req.body;
  if (!req.file || !letter)
    return res.status(400).json({ error: "Archivo o letra faltante" });

  const newFile = new File({
    originalName: req.file.originalname,
    filePath: req.file.path,
    mimeType: req.file.mimetype,
    letter,
  });

  await newFile.save();
  res.status(201).json(newFile);
});

// Obtener archivos por letra
router.get("/:letter", async (req, res) => {
  const files = await File.find({ letter: req.params.letter });
  res.json(files);
});

// Descargar archivo por ID
router.get("/download/:id", async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) return res.status(404).send("Archivo no encontrado");
  res.download(file.filePath, file.originalName);
});

export default router;
