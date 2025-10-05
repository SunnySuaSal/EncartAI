import React from 'react';
import { Volume2, Play, Download, ExternalLink } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

export function MultimediaGrid({ multimedia, onAudioClick, onVideoClick, onLinkClick }) {
  if (!multimedia || multimedia.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold text-[#0B3D91] mb-4">Multimedia Summaries</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {multimedia.map((item) => (
          <Card
            key={item.id}
            className={`p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-2 ${
              item.type === 'audio' 
                ? 'border-blue-200 hover:border-blue-300' 
                : 'border-purple-200 hover:border-purple-300'
            }`}
            onClick={() => {
              if (item.type === 'audio') {
                onAudioClick && onAudioClick(item);
              } else if (item.type === 'video') {
                onVideoClick && onVideoClick(item);
              }
            }}
          >
            <div className="text-center">
              {/* Icono principal */}
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                item.type === 'audio' 
                  ? 'bg-blue-100' 
                  : 'bg-purple-100'
              }`}>
                {item.type === 'audio' ? (
                  <Volume2 className="w-8 h-8 text-blue-600" />
                ) : (
                  <Play className="w-8 h-8 text-purple-600" />
                )}
              </div>

              {/* Título */}
              <h5 className="font-semibold text-[#0B3D91] mb-2 line-clamp-2">
                {item.title}
              </h5>

              {/* Descripción */}
              <p className="text-sm text-gray-600 mb-4">
                {item.type === 'audio' 
                  ? 'Audio summary of the article' 
                  : 'Video summary of the article'
                }
              </p>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLinkClick && onLinkClick(item.link);
                  }}
                  className={`w-full sm:w-auto ${
                    item.type === 'audio'
                      ? 'text-blue-600 border-blue-600 hover:bg-blue-50'
                      : 'text-purple-600 border-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(item.link, '_blank');
                  }}
                  className="w-full sm:w-auto text-[#FC3D21] border-[#FC3D21] hover:bg-[#FC3D21]/10"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Original
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
