import { ImageWithFallback } from "./figma/ImageWithFallback";
import NASA_logo from "../assets/NASA_logo.png";

export function Header() {
  return (
    <header className="h-16 bg-[#0B3D91] border-b-2 border-[#FC3D21] shadow-lg">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo y título */}
        <div className="flex items-center space-x-4">
          <ImageWithFallback 
            src={NASA_logo}
            alt="NASA Logo"
            className="w-12 h-12 object-contain"
          />
                <div>
                  <h1 className="text-white font-bold tracking-wide">NASA SPACE ENCARTA</h1>
                  <p className="text-blue-200 text-sm">Interactive Space Encyclopedia</p>
                </div>
        </div>

        {/* Elementos decorativos */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#FC3D21] rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-75"></div>
            <div className="w-3 h-3 bg-[#FC3D21] rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
    </header>
  );
}
