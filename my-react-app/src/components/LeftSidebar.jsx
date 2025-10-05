import { useState, useEffect } from "react";
import { ChevronRight, FlaskConical, Leaf, Zap, Globe, Cpu, HeartPulse } from "lucide-react";
import { Card } from "./ui/card";

const categories = [
  {
    id: "biologia",
    title: "Biology",
    icon: HeartPulse,
    color: "bg-red-100",
    description: "Effects of space on the human body"
  },
  {
    id: "plantas",
    title: "Plants in Space",
    icon: Leaf,
    color: "bg-green-100",
    description: "Space agriculture and botany"
  },
  {
    id: "radiacion",
    title: "Radiation",
    icon: Zap,
    color: "bg-yellow-100",
    description: "Radiation exposure and protection"
  },
  {
    id: "microgravedad",
    title: "Microgravity",
    icon: Globe,
    color: "bg-blue-100",
    description: "Effects of reduced gravity"
  },
  {
    id: "tecnologia",
    title: "Technology",
    icon: Cpu,
    color: "bg-purple-100",
    description: "Space innovations and systems"
  },
  {
    id: "medicina",
    title: "Medicine",
    icon: FlaskConical,
    color: "bg-orange-100",
    description: "Medical research in space"
  }
];

export function LeftSidebar({ onNavigateToAdvancedSearch }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState({});

  const fetchCategoryCount = async (categoryId) => {
    try {
      setLoading(prev => ({ ...prev, [categoryId]: true }));
      const response = await fetch(`http://127.0.0.1:8000/categories/${categoryId}/count`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCategoryCounts(prev => ({ ...prev, [categoryId]: data.count }));
    } catch (error) {
      console.error(`Error fetching count for category ${categoryId}:`, error);
      // Set a default count of 0 on error
      setCategoryCounts(prev => ({ ...prev, [categoryId]: 0 }));
    } finally {
      setLoading(prev => ({ ...prev, [categoryId]: false }));
    }
  };

  useEffect(() => {
    // Fetch counts for all categories when component mounts
    categories.forEach(category => {
      fetchCategoryCount(category.id);
    });
  }, []);

  return (
    <div className="w-80 bg-[#f0f8ff] dark:bg-sidebar h-full overflow-y-auto relative">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-[#0B3D91] dark:text-sidebar-foreground mb-3 tracking-wide">RESEARCH CATEGORIES</h2>
          <div className="h-1 bg-[#0B3D91] dark:bg-primary rounded-full"></div>
        </div>

        <div className="space-y-6">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            
            return (
              <Card
                key={category.id}
                className={`p-4 cursor-pointer transition-all duration-500 bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-sm shadow-[0_8px_32px_-8px_rgba(11,61,145,0.15),_0_2px_8px_-2px_rgba(255,255,255,0.8)_inset] dark:shadow-[0_8px_32px_-8px_rgba(53,56,57,0.4),_0_2px_8px_-2px_rgba(0,0,0,0.3)_inset] hover:shadow-[0_16px_48px_-12px_rgba(11,61,145,0.25),_0_4px_16px_-4px_rgba(255,255,255,0.9)_inset] dark:hover:shadow-[0_16px_48px_-12px_rgba(53,56,57,0.5),_0_4px_16px_-4px_rgba(0,0,0,0.4)_inset] border border-white/60 dark:border-border/60 rounded-2xl transform-gpu perspective-1000 ${
                  isSelected 
                    ? 'rotate-x-2 rotate-y-1 -translate-y-2 border-[#FC3D21]/40 dark:border-accent/60 shadow-[0_20px_56px_-12px_rgba(252,61,33,0.3),_0_4px_20px_-4px_rgba(255,255,255,0.95)_inset] dark:shadow-[0_20px_56px_-12px_rgba(252,61,33,0.5),_0_4px_20px_-4px_rgba(0,0,0,0.4)_inset]' 
                    : 'rotate-x-1 hover:rotate-x-2 hover:rotate-y-1 hover:-translate-y-1.5 hover:border-[#0B3D91]/30 dark:hover:border-primary/50'
                } before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-blue-50/30 dark:before:from-primary/20 before:to-transparent before:pointer-events-none relative overflow-hidden`}
                onClick={() => setSelectedCategory(isSelected ? null : category.id)}
              >
                <div className="flex items-center space-x-3 relative z-10">
                  <div className={`p-3 rounded-xl ${category.color} dark:bg-secondary/30 border border-white/60 dark:border-border/40 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.1),_0_2px_4px_-1px_rgba(255,255,255,0.8)_inset] dark:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.3),_0_2px_4px_-1px_rgba(0,0,0,0.2)_inset] backdrop-blur-sm`}>
                    <Icon className="w-6 h-6 text-[#0B3D91] dark:text-primary drop-shadow-sm" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#0B3D91] dark:text-sidebar-foreground leading-tight drop-shadow-sm">{category.title}</h3>
                    <p className="text-xs text-gray-600/80 dark:text-muted-foreground mt-1">{category.description}</p>
                  </div>
                  <ChevronRight 
                    className={`w-5 h-5 text-[#0B3D91] dark:text-primary transition-transform duration-300 drop-shadow-sm ${
                      isSelected ? 'rotate-90' : ''
                    }`} 
                  />
                </div>
                
                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-[#0B3D91]/20 dark:border-primary/20">
                    <div className="space-y-3">
                      <div className="bg-gradient-to-br from-white/90 to-blue-50/40 backdrop-blur-sm rounded-xl p-3 border border-white/40 dark:border-border/50 shadow-[0_4px_16px_-4px_rgba(11,61,145,0.1),_0_2px_4px_-1px_rgba(255,255,255,0.6)_inset] dark:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.4),_0_2px_4px_-1px_rgba(0,0,0,0.2)_inset]"
                           style={{ backgroundColor: 'var(--secondary)' }}>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-3 h-3 bg-[#FC3D21] dark:bg-accent rounded-full shadow-sm"></div>
                          <span className="text-sm text-[#0B3D91] dark:text-sidebar-foreground">Studies</span>
                        </div>
                        <p className="text-xs text-gray-600/80 dark:text-muted-foreground">
                          {loading[category.id] 
                            ? "Loading..." 
                            : `${categoryCounts[category.id] || 0} research studies available`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Elemento decorativo retro - Modo Explorador */}
        <div 
          className="mt-8 p-4 bg-gradient-to-br from-white/95 to-orange-50/30 backdrop-blur-sm rounded-xl border border-white/60 dark:border-border/60 shadow-[0_8px_32px_-8px_rgba(252,61,33,0.15),_0_2px_8px_-2px_rgba(255,255,255,0.8)_inset] dark:shadow-[0_8px_32px_-8px_rgba(93,102,88,0.3),_0_2px_8px_-2px_rgba(0,0,0,0.3)_inset] transform-gpu perspective-1000 rotate-x-1 relative overflow-hidden before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-orange-100/20 dark:before:from-accent/20 before:to-transparent before:pointer-events-none cursor-pointer hover:rotate-x-2 hover:rotate-y-1 hover:-translate-y-1 hover:shadow-[0_16px_48px_-12px_rgba(252,61,33,0.25),_0_4px_16px_-4px_rgba(255,255,255,0.9)_inset] dark:hover:shadow-[0_16px_48px_-12px_rgba(93,102,88,0.5),_0_4px_16px_-4px_rgba(0,0,0,0.4)_inset] transition-all duration-300"
          style={{ backgroundColor: 'var(--muted)' }}
          onClick={onNavigateToAdvancedSearch}
        >
          <div className="flex items-center space-x-2 mb-2 relative z-10">
            <div className="w-3 h-3 bg-[#FC3D21] dark:bg-accent rounded-full shadow-sm"></div>
            <span className="text-sm text-[#0B3D91] dark:text-sidebar-foreground drop-shadow-sm font-medium">Explorer Mode</span>
          </div>
          <p className="text-xs text-gray-600/80 dark:text-muted-foreground relative z-10">
            Click to access advanced article search.
          </p>
        </div>
      </div>
    </div>
  );
}
