import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Send, PanelLeft, PanelRight } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ArticlesList } from "./ArticlesList";
import { ArticleReader } from "./ArticleReader";
import { FileViewer } from "./FileViewer";
import { AudioPlayer } from "./AudioPlayer";
import { VideoPlayer } from "./VideoPlayer";
import { MultimediaGrid } from "./MultimediaGrid";
import sampleArticles from "../assets/sampleListArticles.json";

export function ChatInterface({ 
  leftSidebarVisible, 
  rightSidebarVisible, 
  onToggleLeftSidebar, 
  onToggleRightSidebar 
}) {
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

    // Simular respuesta del bot (10s)
    setTimeout(async () => {
      const response = await generateBotResponse(message);
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
    }, 10000);
  };

  const generateBotResponse = async (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Detectar si la pregunta es sobre artículos o investigación
    const isArticleQuery = lowerMessage.includes('artículo') || 
                         lowerMessage.includes('investigación') ||
                         lowerMessage.includes('estudio') ||
                         lowerMessage.includes('investigar') ||
                         lowerMessage.includes('article') ||
                         lowerMessage.includes('research') ||
                         lowerMessage.includes('study') ||
                         lowerMessage.includes('investigate') ||
                         lowerMessage.includes('document') ||
                         lowerMessage.includes('documento');

    if (isArticleQuery) {
      return {
        content: `I found relevant information about "${userMessage}". Here are some documents and summaries related to your query:`,
        pdfs: sampleArticles.pdfs,
        multimedia: sampleArticles.multimedia
      };
    }

    // Para mensajes no relacionados con investigación, intentar generar respuesta vía backend AI
    try {
      const resp = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are a helpful assistant that can answer questions about the documents and summaries provided. You will give a concise answer to the question and a summary of the documents in less than 3 sentences.' },
            { role: 'user', content: userMessage }
          ],
          max_tokens: 256,
          temperature: 0.3
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data && data.content) {
          return { content: data.content, pdfs: null, multimedia: null };
        }
      }
    } catch (e) {
      // Si falla, continuar con respuestas locales
    }

    // Respuestas específicas para diferentes temas (fallback local)
    if (lowerMessage.includes('microgravity') || lowerMessage.includes('gravity')) {
      return {
        content: "Microgravity is one of the most fascinating aspects of space research! In the absence of Earth's gravity, biological systems behave completely differently. NASA studies show that microgravity affects everything from bone density to fluid distribution in the body. Astronauts experience muscle atrophy, bone loss, and changes in cardiovascular function. These effects are crucial to understand for long-duration missions to Mars.",
        pdfs: null,
        multimedia: null
      };
    }

    if (lowerMessage.includes('radiation') || lowerMessage.includes('space radiation')) {
      return {
        content: "Space radiation is a major concern for human spaceflight! Beyond Earth's protective atmosphere, astronauts are exposed to cosmic rays and solar particle events. NASA research focuses on understanding radiation effects on DNA, cellular function, and long-term health. Current studies are developing better shielding materials and monitoring systems to protect future Mars explorers.",
        pdfs: null,
        multimedia: null
      };
    }

    if (lowerMessage.includes('plants') || lowerMessage.includes('agriculture') || lowerMessage.includes('food')) {
      return {
        content: "Space agriculture is essential for future long-duration missions! NASA's Veggie experiments on the ISS have successfully grown lettuce, radishes, and other crops in microgravity. Plants in space grow differently - their roots don't follow gravity, and they require special lighting systems. This research is crucial for developing sustainable food production systems for Mars colonies.",
        pdfs: null,
        multimedia: null
      };
    }

    if (lowerMessage.includes('mars') || lowerMessage.includes('mission')) {
      return {
        content: "Mars missions represent the next frontier in human space exploration! NASA's Artemis program is preparing for lunar missions that will serve as stepping stones to Mars. The challenges include radiation exposure, microgravity effects, psychological isolation, and life support systems. Current research focuses on developing technologies for sustainable Mars habitation and return missions.",
        pdfs: null,
        multimedia: null
      };
    }

    if (lowerMessage.includes('health') || lowerMessage.includes('medical') || lowerMessage.includes('medicine')) {
      return {
        content: "Space medicine is a rapidly evolving field! NASA researchers study how spaceflight affects human health, from immediate effects like space motion sickness to long-term concerns like vision changes and bone loss. The research has led to medical advances on Earth, including improved osteoporosis treatments and better understanding of balance disorders.",
        pdfs: null,
        multimedia: null
      };
    }

    const responses = [
      "Excellent question about space research. According to NASA data, this topic involves multiple factors that we must consider. The microgravity environment creates unique conditions that affect biological systems in ways we're still discovering.",
      
      "Studies conducted on the International Space Station show fascinating results on this topic. I can explain more details about how space conditions impact human physiology and biological processes.",
      
      "Space research in this area has revealed surprising data. Astronauts have observed unique effects that cannot be replicated on Earth, providing valuable insights for both space exploration and medical research.",
      
      "This is a very active field of research at NASA. Recent studies suggest new directions for future missions, particularly in understanding how long-duration spaceflight affects human health.",
      
      "That's a fascinating aspect of space biology! NASA's research has shown that exposure to space radiation and microgravity can have profound effects on cellular function and gene expression.",
      
      "Great question! The International Space Station serves as our primary laboratory for studying biological processes in space. Recent experiments have revealed how plants and microorganisms adapt to space conditions.",
      
      "NASA's bioastronautics research is crucial for future Mars missions. Understanding how the human body responds to space conditions is essential for mission planning and astronaut safety.",
      
      "Interesting topic! Space medicine research has led to breakthroughs in understanding bone density loss, muscle atrophy, and cardiovascular changes that occur in microgravity environments.",
      
      "The effects of space on biological systems are complex and multifaceted. NASA's research covers everything from cellular biology to whole-body physiology, providing insights for both space exploration and Earth-based medicine.",
      
      "That's an important area of study! NASA researchers are investigating how space conditions affect everything from DNA repair mechanisms to immune system function, with implications for long-term space habitation.",
      
      "Space biology research has revealed that organisms adapt to microgravity in surprising ways. These adaptations could have applications for biotechnology and medical research on Earth.",
      
      "Excellent question! NASA's research in this field combines cutting-edge technology with fundamental biology to understand how life responds to the unique challenges of space exploration."
    ];
    return {
      content: responses[Math.floor(Math.random() * responses.length)],
      pdfs: null,
      multimedia: null
    };
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
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
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Botones de toggle para sidebars */}
      <div className="flex justify-between items-center p-2 bg-gray-50 border-b border-gray-200">
        <div className="flex-1">
          {!leftSidebarVisible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleLeftSidebar}
              className="text-[#0B3D91] hover:bg-[#0B3D91]/10"
              title="Show left sidebar"
            >
              <PanelLeft className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        <div className="flex-1 flex justify-end">
          {!rightSidebarVisible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleRightSidebar}
              className="text-[#0B3D91] hover:bg-[#0B3D91]/10"
              title="Show right sidebar"
            >
              <PanelRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="space-y-6 max-w-3xl mx-auto pb-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-4 rounded-2xl ${
                  message.type === 'user' 
                    ? 'bg-[#0B3D91] text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="leading-relaxed prose prose-sm max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                  
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
                    <p className="text-gray-500 text-lg">Write your question to get started</p>
                  </div>
                </div>
              )}
        </div>
      </div>

          {/* Input de mensaje */}
          <div className="p-8 bg-white border-t border-gray-200">
            <div className="flex space-x-4 max-w-3xl mx-auto">
              <Input
                type="text"
                placeholder="Write your message..."
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
            
            {/* Disclaimer discreto */}
            <div className="mt-4 pt-4 border-t border-gray-200/50 max-w-3xl mx-auto">
              <p className="text-xs text-gray-500/70 text-center italic">
                Responses generated by AI, may not be accurate
              </p>
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
                className="text-gray-800 border-white hover:bg-white/20 hover:text-white font-medium bg-white/10"
              >
                Close
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
                className="text-gray-800 border-white hover:bg-white/20 hover:text-white font-medium bg-white/10"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
