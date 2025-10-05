import { useState, useEffect } from "react";
import { Search, Filter, X, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

const categories = [
  {
    id: "biologia",
    title: "Biología Humana",
    description: "Efectos del espacio en el cuerpo humano"
  },
  {
    id: "plantas",
    title: "Plantas en el Espacio",
    description: "Agricultura y botánica espacial"
  },
  {
    id: "radiacion",
    title: "Radiación",
    description: "Exposición y protección radiológica"
  },
  {
    id: "microgravedad",
    title: "Microgravedad",
    description: "Efectos de la gravedad reducida"
  },
  {
    id: "tecnologia",
    title: "Tecnología",
    description: "Innovaciones y sistemas espaciales"
  },
  {
    id: "medicina",
    title: "Medicina",
    description: "Investigación médica en el espacio"
  }
];

export function AdvancedSearchToolbar({ onNavigateBack }) {
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(100);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const performAdvancedSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      
      if (query.trim()) {
        params.append('q', query.trim());
      }
      
      if (selectedCategories.length > 0) {
        params.append('categories', selectedCategories.join(','));
      }
      
      params.append('skip', skip.toString());
      params.append('limit', limit.toString());

      const response = await fetch(`http://127.0.0.1:8000/articles/search/advanced/?${params.toString()}`, {
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
      setShowResults(true);
    } catch (err) {
      setError(err.message);
      setResults([]);
      console.error("Advanced search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performAdvancedSearch();
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const removeCategory = (categoryId) => {
    setSelectedCategories(prev => prev.filter(id => id !== categoryId));
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setQuery("");
    setSkip(0);
    setLimit(100);
    setResults([]);
    setShowResults(false);
  };

  const getCategoryTitle = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.title : categoryId;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card className="p-6 bg-gradient-to-br from-white/95 to-blue-50/30 backdrop-blur-sm border border-white/60 shadow-lg">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onNavigateBack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNavigateBack}
                  className="flex items-center gap-2 text-[#0B3D91] hover:bg-[#0B3D91]/10"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver
                </Button>
              )}
              <div>
                <h2 className="text-2xl font-bold text-[#0B3D91] mb-2">Búsqueda Avanzada</h2>
                <p className="text-gray-600">Busca artículos por título y categorías específicas</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtros
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar por título del artículo..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 h-12 text-lg border-2 border-gray-200 rounded-xl focus:border-[#FC3D21] focus:ring-2 focus:ring-[#FC3D21]/30 transition-all duration-200"
              />
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="space-y-4 p-4 bg-gray-50/50 rounded-xl border border-gray-200">
                <h3 className="font-semibold text-[#0B3D91]">Filtros Avanzados</h3>
                
                {/* Categories Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categorías ({selectedCategories.length} seleccionadas)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleCategory(category.id)}
                        className={`text-left justify-start h-auto p-3 ${
                          selectedCategories.includes(category.id)
                            ? 'bg-[#FC3D21] text-white hover:bg-[#FC3D21]/90'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <div>
                          <div className="font-medium">{category.title}</div>
                          <div className="text-xs opacity-75">{category.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Pagination Controls */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Saltar artículos
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={skip}
                      onChange={(e) => setSkip(parseInt(e.target.value) || 0)}
                      className="h-10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Límite de resultados
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="1000"
                      value={limit}
                      onChange={(e) => setLimit(parseInt(e.target.value) || 100)}
                      className="h-10"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Selected Categories Display */}
            {selectedCategories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Categorías seleccionadas:</span>
                {selectedCategories.map((categoryId) => (
                  <Badge
                    key={categoryId}
                    variant="secondary"
                    className="bg-[#0B3D91]/10 text-[#0B3D91] hover:bg-[#0B3D21]/10 hover:text-[#FC3D21] cursor-pointer"
                    onClick={() => removeCategory(categoryId)}
                  >
                    {getCategoryTitle(categoryId)}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 h-12 bg-[#FC3D21] hover:bg-[#FC3D21]/90 text-white font-semibold rounded-xl"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Buscar Artículos
                  </>
                )}
              </Button>
              
              {(selectedCategories.length > 0 || query || showResults) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearAllFilters}
                  className="h-12 px-6 rounded-xl"
                >
                  Limpiar Filtros
                </Button>
              )}
            </div>
          </form>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 font-medium">Error en la búsqueda:</p>
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {/* Results Display */}
          {showResults && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#0B3D91]">
                  Resultados ({results.length})
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowResults(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {results.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {results.map((article) => (
                    <Card
                      key={article.id}
                      className="p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
                      onClick={() => window.open(article.link, '_blank')}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-[#0B3D91] mb-2 line-clamp-2">
                            {article.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            ID: {article.id}
                          </p>
                          <a
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[#FC3D21] hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Ver artículo →
                          </a>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No se encontraron artículos con los criterios especificados.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
