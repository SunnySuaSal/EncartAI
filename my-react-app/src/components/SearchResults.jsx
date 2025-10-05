import { ExternalLink } from "lucide-react";

export function SearchResults({ results }) {
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="py-2">
      <div className="px-4 py-2 text-sm font-semibold text-gray-700 border-b border-gray-200">
        Resultados de búsqueda ({results.length})
      </div>
      <div className="max-h-80 overflow-y-auto">
        {results.map((item) => (
          <div
            key={item.id}
            className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 leading-5 line-clamp-2">
                  {item.title}
                </h3>
                <div className="mt-1 flex items-center text-xs text-gray-500">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                    ID: {item.id}
                  </span>
                </div>
              </div>
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 p-1 text-gray-400 hover:text-[#FC3D21] transition-colors duration-150"
                  title="Abrir enlace"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
