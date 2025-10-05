import React from 'react';
import { ExternalLink, BookOpen } from 'lucide-react';
import { Card } from './ui/card';

export function ArticlesList({ articles, onArticleClick, onLinkClick }) {
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No hay archivos disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 mb-4">
        <BookOpen className="w-5 h-5 text-[#0B3D91]" />
        <h3 className="text-lg font-semibold text-[#0B3D91]">Archivos Encontrados</h3>
      </div>
      
      {articles.map((article) => (
        <Card
          key={article.id}
          className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-l-4 border-l-[#0B3D91]"
          onClick={() => onArticleClick && onArticleClick(article)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-[#0B3D91] mb-1 line-clamp-2">
                {article.title}
              </h4>
              <p className="text-sm text-gray-600">
                Haz clic para ver el archivo
              </p>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLinkClick && onLinkClick(article.link);
                }}
                className="p-2 text-[#FC3D21] hover:bg-[#FC3D21]/10 rounded-lg transition-colors"
                title="Ir a sitio web"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
