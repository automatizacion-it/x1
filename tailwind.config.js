/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class", // habilita modo oscuro con clase 'dark'
  theme: {
    extend: {
      colors: {
        fondoClaro: "#f9fafb", // fondo claro por defecto
        fondoOscuro: "#1f2937", // fondo oscuro típico
        primario: "#3b82f6", // azul Tailwind (puedes personalizarlo)
        notaRoja: "#fecaca", // rojo claro (bg-red-200)
        notaAzul: "#bfdbfe", // azul claro (bg-blue-200)
        notaAmarilla: "#fef9c3" // amarillo claro (bg-yellow-200)
      },
    },
  },
  plugins: [],
};
