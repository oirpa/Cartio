import logo from "@/assets/temu-logo.png.asset.json";
import lightLogo from "@/assets/temu-logo-dark.png.asset.json";

export function TemuLogo({ className, light = false }: { className?: string; light?: boolean }) {
  return <img src={light ? lightLogo.url : logo.url} alt="TEMU" className={className} />;
}