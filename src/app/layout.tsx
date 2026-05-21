import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HomeUX - Servicios del Hogar",
  description: "Sistema de Gestion de Servicios del Hogar",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen relative overflow-x-hidden bg-gray-950">
        <div className="fixed inset-0 -z-10 bg-gray-950" style={{ backgroundImage: 'radial-gradient(at 40% 20%, rgba(30,64,175,0.2) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(96,165,250,0.15) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(59,130,246,0.15) 0px, transparent 50%), radial-gradient(at 80% 50%, rgba(30,64,175,0.2) 0px, transparent 50%)' }} />
        {children}
      </body>
    </html>
  );
}
