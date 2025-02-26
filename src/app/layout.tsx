import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "¿Manija de HAA?",
  description: "Capítulos aleatorios de HAA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
