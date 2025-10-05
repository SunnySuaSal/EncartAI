import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';

export function FileViewer({ file, onClose, onOpenOriginal }) {
  if (!file) return null;

  // Importar los PDFs reales
  const TaskBookPDF = '/src/assets/TaskBook16068-10042025.pdf';
  const PMC1515272PDF = '/src/assets/PMC1515272.pdf';

  // Mapear archivos a PDFs reales
  const getPDFPath = (fileId) => {
    switch (fileId) {
      case 1:
        return TaskBookPDF;
      case 2:
        return PMC1515272PDF;
      default:
        return TaskBookPDF;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#0B3D91] truncate">{file.title}</h2>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onOpenOriginal && onOpenOriginal(file.link)}
              className="text-[#FC3D21] border-[#FC3D21] hover:bg-[#FC3D21]/10"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Ir a sitio web
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Contenido del PDF */}
        <div className="flex-1 p-4">
          <iframe
            src={getPDFPath(file.id)}
            className="w-full h-full border-0 rounded"
            title={file.title}
          />
        </div>
      </div>
    </div>
  );
}
