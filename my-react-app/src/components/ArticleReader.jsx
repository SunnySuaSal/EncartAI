import React from 'react';
import { X, ExternalLink, ArrowLeft } from 'lucide-react';
import { Card } from './ui/card';

export function ArticleReader({ article, onClose, onOpenOriginal }) {
  if (!article) return null;

  // Contenido simulado del artículo (en una app real vendría de una API)
  const articleContent = `
    Este es el contenido del artículo "${article.title}". 
    
    Aquí encontrarás información detallada sobre el tema relacionado con la investigación espacial de la NASA. 
    
    El artículo contiene datos científicos, análisis y conclusiones importantes para la comprensión de los fenómenos espaciales.
    
    Esta es una demostración del lector de artículos integrado en la aplicación NASA Space Encarta.
  `;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header del lector */}
        <div className="bg-[#0B3D91] text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Cerrar"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold truncate">{article.title}</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onOpenOriginal && onOpenOriginal(article.link)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors flex items-center space-x-2"
              title="Abrir enlace original"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm">Original</span>
            </button>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido del artículo */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {articleContent}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
