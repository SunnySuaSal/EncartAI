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
                  <h1 className="text-white font-bold tracking-wide">
                    NASA BIO-SPACE ENCART<span className="text-[#FC3D21]">AI</span>
                  </h1>
                  <p className="text-blue-200 text-sm">Interactive Space Encyclopedia</p>
                </div>
        </div>

      </div>
    </header>
  );
}
