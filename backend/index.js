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
