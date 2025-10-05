import { ImageWithFallback } from "./figma/ImageWithFallback";
import { SearchBar } from "./SearchBar";

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
        <SearchBar />

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
