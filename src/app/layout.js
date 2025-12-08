import { Inter } from "next/font/google"; // Esto carga la fuente
import "./globals.css";
import Navbar from "@/components/Navbar";
import BotonVolverArriba from "@/components/BotonVolverArriba";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Famaillá Emprende",
  description: "Bolsa de trabajo y eventos para emprendedores",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <Navbar />
        {children}
        <BotonVolverArriba />
      </body>
    </html>
  );
}