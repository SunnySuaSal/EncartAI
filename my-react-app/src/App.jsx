import { useState } from "react";
import { Header } from "./components/Header";
import { LeftSidebar } from "./components/LeftSidebar";
import { RightSidebar } from "./components/RightSidebar";
import { ChatInterface } from "./components/ChatInterface";
import { AdvancedSearchToolbar } from "./components/AdvancedSearchToolbar";

export default function App() {
  const [currentView, setCurrentView] = useState('chat'); // 'chat' or 'advanced-search'
  const [leftSidebarVisible, setLeftSidebarVisible] = useState(true);
  const [rightSidebarVisible, setRightSidebarVisible] = useState(true);

  const handleNavigateToAdvancedSearch = () => {
    setCurrentView('advanced-search');
  };

  const handleNavigateToChat = () => {
    setCurrentView('chat');
  };

  const toggleLeftSidebar = () => {
    setLeftSidebarVisible(!leftSidebarVisible);
  };

  const toggleRightSidebar = () => {
    setRightSidebarVisible(!rightSidebarVisible);
  };

  return (
    <div className="h-screen bg-[#e6f3ff] flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        {leftSidebarVisible && (
          <LeftSidebar 
            onNavigateToAdvancedSearch={handleNavigateToAdvancedSearch}
            onToggle={toggleLeftSidebar}
          />
        )}
        
        {/* Central Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {currentView === 'chat' && (
            <ChatInterface 
              leftSidebarVisible={leftSidebarVisible}
              rightSidebarVisible={rightSidebarVisible}
              onToggleLeftSidebar={toggleLeftSidebar}
              onToggleRightSidebar={toggleRightSidebar}
            />
          )}
          {currentView === 'advanced-search' && (
            <div className="flex-1 overflow-auto">
              <AdvancedSearchToolbar onNavigateBack={handleNavigateToChat} />
            </div>
          )}
        </div>
        
        {/* Right Sidebar */}
        {rightSidebarVisible && (
          <RightSidebar onToggle={toggleRightSidebar} />
        )}
      </div>

      {/* Footer decorativo retro */}
      <footer className="h-2 bg-[#0B3D91] flex-shrink-0"></footer>
    </div>
  );
}
