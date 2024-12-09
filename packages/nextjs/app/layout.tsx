import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Toaster } from "react-hot-toast";
import { Header } from "~~/components/Header";
import { Providers } from "~~/providers/Providers";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({ title: "Arrakis challenge", description: "Arrakis challenge" });

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html>
      <body>
        <Providers>
          <div className={`flex flex-col min-h-screen bg-neutral-800 relative`}>
            <Header />
            <main className="relative flex flex-col flex-1">{children}</main>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
