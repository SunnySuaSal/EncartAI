import { Header } from "./components/Header";
import { LeftSidebar } from "./components/LeftSidebar";
import { RightSidebar } from "./components/RightSidebar";
import { ChatInterface } from "./components/ChatInterface";

export default function App() {
  return (
    <div className="h-screen bg-[#e6f3ff] flex flex-col font-sans">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <LeftSidebar />
        
        {/* Central Chat Interface */}
        <ChatInterface />
        
        {/* Right Sidebar */}
        <RightSidebar />
      </div>

      {/* Footer decorativo retro */}
      <footer className="h-2 bg-[#0B3D91]"></footer>
    </div>
  );
}
