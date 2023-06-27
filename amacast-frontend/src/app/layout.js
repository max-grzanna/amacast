import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AMACAST",
  description:
    "Assisted Monitoring, ALerting and Forecasting in an Industrial Context",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <div className="container mx-auto">{children}</div>
      </body>
    </html>
  );
}
