import "@rainbow-me/rainbowkit/styles.css";
import { Toaster } from "react-hot-toast";
import { Header } from "~~/components/Header";
import { ThemeProvider } from "~~/components/ThemeProvider";
import { Providers } from "~~/providers/Providers";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({ title: "Arrakis challenge", description: "Arrakis challenge" });

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider enableSystem>
          <Providers>
            <div className={`flex flex-col min-h-screen `}>
              <Header />
              <main className="relative flex flex-col flex-1">{children}</main>
            </div>
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
