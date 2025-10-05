import { useState } from "react";
import { Header } from "./components/Header";
import { LeftSidebar } from "./components/LeftSidebar";
import { RightSidebar } from "./components/RightSidebar";
import { ChatInterface } from "./components/ChatInterface";
import { AdvancedSearchToolbar } from "./components/AdvancedSearchToolbar";

export default function App() {
  const [currentView, setCurrentView] = useState('chat'); // 'chat' or 'advanced-search'

  const handleNavigateToAdvancedSearch = () => {
    setCurrentView('advanced-search');
  };

  const handleNavigateToChat = () => {
    setCurrentView('chat');
  };

  return (
    <div className="h-screen bg-[#e6f3ff] flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <LeftSidebar onNavigateToAdvancedSearch={handleNavigateToAdvancedSearch} />
        
        {/* Central Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {currentView === 'chat' && <ChatInterface />}
          {currentView === 'advanced-search' && (
            <div className="flex-1 overflow-auto">
              <AdvancedSearchToolbar onNavigateBack={handleNavigateToChat} />
            </div>
          )}
        </div>
        
        {/* Right Sidebar */}
        <RightSidebar />
      </div>

      {/* Footer decorativo retro */}
      <footer className="h-2 bg-[#0B3D91] flex-shrink-0"></footer>
    </div>
  );
}
