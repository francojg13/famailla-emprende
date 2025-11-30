import { Inter } from "next/font/google"; // Esto carga la fuente
import "./globals.css";
import Navbar from "@/components/Navbar"; // 1. IMPORTAMOS EL COMPONENTE

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Famaillá Emprende",
  description: "Bolsa de trabajo y eventos para emprendedores",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        {/* 2. AQUÍ PONEMOS LA BARRA DE NAVEGACIÓN */}
        <Navbar />
        
        {/* Aquí se carga el contenido de cada página */}
        {children}
      </body>
    </html>
  );
}