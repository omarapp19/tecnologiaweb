import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import { LanguageProvider } from "@/context/LanguageContext";
import { DesignProvider } from "@/context/DesignContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexusWeb Technologies | Software Studio & Soluciones Web",
  description: "Estudio de desarrollo de software, arquitectura cloud y diseño de productos web interactivos de alto rendimiento.",
  keywords: ["NexusWeb Technologies", "Software Studio", "Desarrollo Web", "Next.js", "React", "Cloud Architecture", "UI/UX", "Tecnología Web"],
  authors: [{ name: "NexusWeb Technologies Team" }],
  creator: "NexusWeb Technologies",
  openGraph: {
    title: "NexusWeb Technologies | Software Studio & Soluciones Web",
    description: "Estudio de desarrollo de software, arquitectura cloud y diseño de experiencias web.",
    siteName: "NexusWeb Technologies",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexusWeb Technologies | Software Studio",
    description: "Estudio de desarrollo de software y soluciones web.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'dark';
                  if (theme === 'light') {
                    document.documentElement.classList.add('light');
                  } else {
                    document.documentElement.classList.remove('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-background text-foreground min-h-screen selection:bg-blue-500/30 selection:text-blue-300">
        <LanguageProvider>
          <DesignProvider>
            {children}
            <ThemeToggle />
          </DesignProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
