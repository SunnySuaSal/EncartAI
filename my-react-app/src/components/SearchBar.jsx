import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { SearchResults } from "./SearchResults";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchAbstracts = async (searchQuery, skip = 0, limit = 10) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://192.168.137.229:8000/abstracts/search/?q=" + searchQuery + "&skip=" + skip + "&limit=" + limit, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
      setResults([]);
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchAbstracts(query);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    // Optional: Implement debounced search
    // if (e.target.value.trim()) {
    //   const timeoutId = setTimeout(() => {
    //     searchAbstracts(e.target.value);
    //   }, 500);
    //   return () => clearTimeout(timeoutId);
    // }
  };

  return (
    <div className="relative max-w-md w-full mx-8">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
        <Input
          type="text"
          placeholder="Buscar en la enciclopedia espacial..."
          value={query}
          onChange={handleInputChange}
          className="pl-10 bg-white border-2 border-white rounded-full h-10 shadow-inner focus:border-[#FC3D21] focus:ring-2 focus:ring-[#FC3D21]/30 transition-all duration-200"
        />
      </form>
      
      {/* Search Results */}
      {(results.length > 0 || loading || error) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {loading && (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FC3D21] mx-auto"></div>
              <p className="mt-2">Buscando...</p>
            </div>
          )}
          
          {error && (
            <div className="p-4 text-center text-red-500">
              <p>Error: {error}</p>
            </div>
          )}
          
          {!loading && !error && results.length > 0 && (
            <SearchResults results={results} />
          )}
          
          {!loading && !error && results.length === 0 && query && (
            <div className="p-4 text-center text-gray-500">
              <p>No se encontraron resultados para "{query}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
