import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BRAND } from "@/lib/config";
import { getUser } from "@/lib/auth";
import CartProvider from "@/components/CartProvider";
import ContactFab from "@/components/ContactFab";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { BottomNav } from "@/components/HeaderClient";

export const metadata: Metadata = {
  title: { default: `${BRAND.name} - ${BRAND.tagline}`, template: `%s | ${BRAND.name}` },
  description: "اطلب أدويتك ومنتجات العناية والفيتامينات أونلاين مع توصيل سريع لكل مناطق المملكة، ودفع بمدى وApple Pay وstc pay وتمارا وتابي أو عند الاستلام.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#13201c",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  return (
    <html lang="ar" dir="rtl">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('shifa.big')==='1')document.documentElement.dataset.big='1'}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-dvh flex flex-col">
        <CartProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-[100] btn btn-primary"
          >
            تخطَّ إلى المحتوى
          </a>
          <Header user={user} />
          <main id="main" className="flex-1 pb-10">
            {children}
          </main>
          <Footer />
          <ContactFab />
          <BottomNav loggedIn={!!user} />
        </CartProvider>
      </body>
    </html>
  );
}
