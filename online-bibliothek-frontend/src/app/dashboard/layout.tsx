// app/layout.tsx
import "../globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "IT Support Dashboard",
  description: "IT Support Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/*
        No extra styling here.
        We'll rely on our CSS modules & globals.css.
      */}
      <body>{children}</body>
    </html>
  );
}
