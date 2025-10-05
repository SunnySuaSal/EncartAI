import { useState } from "react";
import { Send } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { ArticlesList } from "./ArticlesList";
import { ArticleReader } from "./ArticleReader";
import { FileViewer } from "./FileViewer";
import { AudioPlayer } from "./AudioPlayer";
import { VideoPlayer } from "./VideoPlayer";
import { MultimediaGrid } from "./MultimediaGrid";
import sampleArticles from "../assets/sampleListArticles.json";

export function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // Agregar mensaje del usuario
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simular respuesta del bot
    setTimeout(() => {
      const response = generateBotResponse(message);
      const botResponse = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.content,
        pdfs: response.pdfs,
        multimedia: response.multimedia,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userMessage) => {
    // Detectar si la pregunta es sobre artículos o investigación
    const isArticleQuery = userMessage.toLowerCase().includes('artículo') || 
                         userMessage.toLowerCase().includes('investigación') ||
                         userMessage.toLowerCase().includes('estudio') ||
                         userMessage.toLowerCase().includes('investigar');

    if (isArticleQuery) {
      return {
        content: `He encontrado información relevante sobre "${userMessage}". Aquí tienes algunos documentos y resúmenes relacionados con tu consulta:`,
        pdfs: sampleArticles.pdfs,
        multimedia: sampleArticles.multimedia
      };
    }

    const responses = [
      "Excelente pregunta sobre la investigación espacial. Según los datos de la NASA, este tema involucra múltiples factores que debemos considerar...",
      "Los estudios realizados en la Estación Espacial Internacional muestran resultados fascinantes sobre este tema. Te puedo explicar más detalles...",
      "La investigación espacial en esta área ha revelado datos sorprendentes. Los astronautas han observado efectos únicos que no se pueden replicar en la Tierra...",
      "Este es un campo muy activo de investigación en NASA. Los últimos estudios sugieren nuevas direcciones para futuras misiones..."
    ];
    return {
      content: responses[Math.floor(Math.random() * responses.length)],
      pdfs: null,
      multimedia: null
    };
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleArticleClick = (article) => {
    // Determinar qué tipo de archivo es y abrir el reproductor correspondiente
    switch (article.type) {
      case 'pdf':
        setSelectedFile(article);
        break;
      case 'audio':
        setSelectedAudio({
          ...article,
          src: '/src/assets/audio_resumen.mp3'
        });
        break;
      case 'video':
        setSelectedVideo({
          ...article,
          src: '/src/assets/video_resumen.mp4'
        });
        break;
      default:
        setSelectedFile(article);
    }
  };

  const handleLinkClick = (url) => {
    window.open(url, '_blank');
  };

  const handleCloseReader = () => {
    setSelectedArticle(null);
  };

  const handleCloseFileViewer = () => {
    setSelectedFile(null);
  };

  const handleCloseAudioPlayer = () => {
    setSelectedAudio(null);
  };

  const handleCloseVideoPlayer = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-white">

      {/* Área de mensajes */}
      <ScrollArea className="flex-1 p-8 h-full">
        <div className="space-y-6 max-w-3xl mx-auto pb-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-4 rounded-2xl ${
                  message.type === 'user' 
                    ? 'bg-[#0B3D91] text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="leading-relaxed">{message.content}</p>
                  
                  {/* Mostrar PDFs si existen */}
                  {message.pdfs && (
                    <div className="mt-4">
                      <ArticlesList 
                        articles={message.pdfs}
                        onArticleClick={handleArticleClick}
                        onLinkClick={handleLinkClick}
                      />
                    </div>
                  )}

                  {/* Mostrar multimedia si existe */}
                  {message.multimedia && (
                    <MultimediaGrid
                      multimedia={message.multimedia}
                      onAudioClick={handleArticleClick}
                      onVideoClick={handleArticleClick}
                      onLinkClick={handleLinkClick}
                    />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2 px-1">
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[75%]">
                <div className="inline-block p-4 rounded-2xl bg-gray-100">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {messages.length === 0 && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <p className="text-gray-500 text-lg">Escribe tu pregunta para comenzar</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input de mensaje */}
      <div className="p-8 bg-white border-t border-gray-200">
        <div className="flex space-x-4 max-w-3xl mx-auto">
          <Input
            type="text"
            placeholder="Escribe tu mensaje..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
            className="flex-1 border border-gray-300 focus:border-[#0B3D91] focus:ring-1 focus:ring-[#0B3D91] rounded-xl h-12 px-4 bg-white"
          />
          <Button
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim() || isTyping}
            className="bg-[#0B3D91] hover:bg-[#0B3D91]/90 text-white rounded-xl h-12 px-6 transition-colors duration-200 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Lector de artículos */}
      {selectedArticle && (
        <ArticleReader
          article={selectedArticle}
          onClose={handleCloseReader}
          onOpenOriginal={handleLinkClick}
        />
      )}

      {/* Visor de archivos */}
      {selectedFile && (
        <FileViewer
          file={selectedFile}
          onClose={handleCloseFileViewer}
          onOpenOriginal={handleLinkClick}
        />
      )}

      {/* Reproductor de audio */}
      {selectedAudio && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl">
            <AudioPlayer
              audio={selectedAudio}
              onDownload={handleLinkClick}
              onOpenOriginal={handleLinkClick}
            />
            <div className="mt-4 text-center">
              <Button
                onClick={handleCloseAudioPlayer}
                variant="outline"
                className="text-white border-white hover:bg-white/20"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reproductor de video */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl">
            <VideoPlayer
              video={selectedVideo}
              onDownload={handleLinkClick}
              onOpenOriginal={handleLinkClick}
            />
            <div className="mt-4 text-center">
              <Button
                onClick={handleCloseVideoPlayer}
                variant="outline"
                className="text-white border-white hover:bg-white/20"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
