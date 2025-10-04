import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Header() {
  return (
    <header className="h-16 bg-[#0B3D91] border-b-2 border-[#FC3D21] shadow-lg">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo y título */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white rounded-full p-1 shadow-md">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1636614484105-6b199a1fbdca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOQVNBJTIwbG9nbyUyMHNwYWNlJTIwYWdlbmN5fGVufDF8fHx8MTc1OTYwMTgxNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="NASA Logo"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div>
            <h1 className="text-white font-bold tracking-wide">NASA SPACE ENCARTA</h1>
            <p className="text-blue-200 text-sm">Enciclopedia Espacial Interactiva</p>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="relative max-w-md w-full mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input
              type="text"
              placeholder="Buscar en la enciclopedia espacial..."
              className="pl-10 bg-white border-2 border-white rounded-full h-10 shadow-inner focus:border-[#FC3D21] focus:ring-2 focus:ring-[#FC3D21]/30 transition-all duration-200"
            />
          </div>
        </div>

        {/* Elemento decorativo */}
        <div className="hidden md:flex items-center space-x-2">
          <div className="w-3 h-3 bg-[#FC3D21] rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-75"></div>
          <div className="w-3 h-3 bg-[#FC3D21] rounded-full animate-pulse delay-150"></div>
        </div>
      </div>
    </header>
  );
}
