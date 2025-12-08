import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import BotonVolverArriba from "@/components/BotonVolverArriba";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Famaillá Conecta",
  description: "Empleos, servicios y negocios locales de Famaillá",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Famaillá Conecta",
    description: "Empleos, servicios y negocios locales de Famaillá",
    images: ["/og-image.png"],
  },
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