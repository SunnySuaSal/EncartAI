import React from 'react';
import { ExternalLink, BookOpen, FileText } from 'lucide-react';
import { Card } from './ui/card';

export function ArticlesList({ articles, onArticleClick, onLinkClick }) {
  // Función para obtener el icono (solo PDFs ahora)
  const getTypeIcon = () => {
    return <FileText className="w-5 h-5 text-red-500" />;
  };

  // Función para obtener el color del borde (solo PDFs)
  const getBorderColor = () => {
    return 'border-l-red-500';
  };

  // Función para obtener el texto descriptivo (solo PDFs)
  const getDescription = () => {
    return 'Click to view the document';
  };

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 mb-4">
        <BookOpen className="w-5 h-5 text-[#0B3D91]" />
        <h3 className="text-lg font-semibold text-[#0B3D91]">Documents Found</h3>
      </div>
      
      {articles.map((article) => (
        <Card
          key={article.id}
          className={`p-4 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-l-4 ${getBorderColor()}`}
          onClick={() => onArticleClick && onArticleClick(article)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <div className="mt-1">
                {getTypeIcon()}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-[#0B3D91] mb-1 line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {getDescription()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLinkClick && onLinkClick(article.link);
                }}
                className="p-2 text-[#FC3D21] hover:bg-[#FC3D21]/10 rounded-lg transition-colors"
                title="Go to website"
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
