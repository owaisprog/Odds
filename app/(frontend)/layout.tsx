import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { SearchProvider } from "@/components/providers/SearchProvider";

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div suppressHydrationWarning={true}>
      <NavBar />
      {children}
      <Footer />
    </div>
  );
}
