import type { Metadata } from "next";
import { Inter, Barlow } from "next/font/google";
import { CartProvider } from "@/context/cartcontext";
import { SessionProvider } from "next-auth/react";
import Breadcrumb from "@/components/breadcrumb";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Favicons from "@/components/favicons";
import "./globals.css";
const inter = Inter({
  subsets: ["latin"],
});
const barlow = Barlow({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  preload: true,
  variable: "--font-barlow",
});
export const metadata: Metadata = {
  title: "Byte store",
  description: "Tienda electrónica de computadores portátiles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="min-h-screen ">
      <head>
        <Favicons />
      </head>
      <body className={` antialiased ${inter.className} ${barlow.variable}`}>
        {/* Contexto de session (autenticación)*/}
        <SessionProvider>
          {/*Contexto del carrito de compras*/}
          <CartProvider>
            <Header />
            <main className="container mx-auto mt-4 max-w-[100rem] px-[5dvw] min-h-screen">
              <Breadcrumb />
              {children}
            </main>
          </CartProvider>
        </SessionProvider>
        <Footer />
      </body>
    </html>
  );
}
