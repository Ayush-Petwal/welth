import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  subsets: ["latin"]
})

export const metadata = {
  title: "Welth",
  description: "AI powered financial tracking and management app",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.className}`}
          cz-shortcut-listen="true"
          data-new-gr-c-s-check-loaded="14.1232.0"
          data-gr-ext-installed=""
        >
          <Header />
          <main className="min-h-screen">{children}</main>
          <footer className="bg-blue-50 py-12">
            <div className="container mx-auto text-center px-4 text-gray-600 ">
              <p>
                Made by{" "}
                <a
                  href="https://ayushpetwal.tech/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Ayush Petwal
                </a>
                .
              </p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
