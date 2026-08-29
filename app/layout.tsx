import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Современный Колизей — Гладиаторы успеха",
  description: "Интерактивная демо-версия книги Николая Максимовича Копылова",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
