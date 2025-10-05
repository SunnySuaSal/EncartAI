import { useState } from "react";
import { Send } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

export function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

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
      const botResponse = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateBotResponse(message),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userMessage) => {
    const responses = [
      "Excelente pregunta sobre la investigación espacial. Según los datos de la NASA, este tema involucra múltiples factores que debemos considerar...",
      "Los estudios realizados en la Estación Espacial Internacional muestran resultados fascinantes sobre este tema. Te puedo explicar más detalles...",
      "La investigación espacial en esta área ha revelado datos sorprendentes. Los astronautas han observado efectos únicos que no se pueden replicar en la Tierra...",
      "Este es un campo muy activo de investigación en NASA. Los últimos estudios sugieren nuevas direcciones para futuras misiones..."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-background">

      {/* Área de mensajes */}
      <ScrollArea className="flex-1 p-8">
        <div className="space-y-6 max-w-3xl mx-auto">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-4 rounded-2xl ${
                  message.type === 'user' 
                    ? 'bg-[#0B3D91] dark:bg-primary text-white dark:text-primary-foreground' 
                    : 'bg-gray-100 dark:bg-muted text-gray-900 dark:text-foreground'
                }`}>
                  <p className="leading-relaxed">{message.content}</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-muted-foreground mt-2 px-1">
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[75%]">
                <div className="inline-block p-4 rounded-2xl bg-gray-100 dark:bg-muted">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 dark:bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 dark:bg-muted-foreground rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-gray-400 dark:bg-muted-foreground rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center">
                <p className="text-gray-500 dark:text-muted-foreground text-lg">Escribe tu pregunta para comenzar</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input de mensaje */}
      <div className="p-8 bg-white dark:bg-background border-t border-gray-200 dark:border-border">
        <div className="flex space-x-4 max-w-3xl mx-auto">
          <Input
            type="text"
            placeholder="Escribe tu mensaje..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
            className="flex-1 border border-gray-300 dark:border-border focus:border-[#0B3D91] dark:focus:border-primary focus:ring-1 focus:ring-[#0B3D91] dark:focus:ring-primary rounded-xl h-12 px-4 bg-white dark:bg-input"
          />
          <Button
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim() || isTyping}
            className="bg-[#0B3D91] dark:bg-primary hover:bg-[#0B3D91]/90 dark:hover:bg-primary/90 text-white dark:text-primary-foreground rounded-xl h-12 px-6 transition-colors duration-200 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
