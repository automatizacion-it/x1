#!/bin/bash

# Crear carpeta
mkdir -p backend/models backend/routes
cd backend || exit

# Inicializar Node.js
npm init -y

# Instalar dependencias
npm install express mongoose multer cors dotenv

# Crear .env de ejemplo
cat <<EOF > .env
PORT=4000
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/x1?retryWrites=true&w=majority
EOF

# Crear archivo principal
cat <<'EOF' > index.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fileRoutes from "./routes/files.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/files", fileRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Conectado a MongoDB");
    app.listen(process.env.PORT, () =>
      console.log("Servidor backend en puerto", process.env.PORT)
    );
  })
  .catch((err) => console.error("Error de conexión:", err));
EOF

# Crear modelo File.js
cat <<'EOF' > models/File.js
import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  originalName: String,
  filePath: String,
  mimeType: String,
  letter: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("File", fileSchema);
EOF

# Crear rutas files.js
cat <<'EOF' > routes/files.js
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
EOF

echo "✅ Backend creado correctamente en ./backend"
echo "➡️ Para iniciar: cd backend && node index.js"
