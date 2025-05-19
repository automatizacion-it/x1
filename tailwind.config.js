/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class", // Modo oscuro activado por clase
  theme: {
    extend: {
      colors: {
        // Fondos base
        fondoClaro: "#f0f4f8",    // Gris claro azulado
        fondoOscuro: "#111827",   // Azul oscuro elegante

        // Color principal (para botones activos)
        primario: "#2563eb",      // Azul vibrante

        // Paleta de notas
        notaRoja: "#fca5a5",      // Rojo suave
        notaAzul: "#93c5fd",      // Azul claro
        notaAmarilla: "#fde68a",  // Amarillo cálido
      },
    },
  },
  plugins: [],
};
