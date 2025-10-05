import { useState } from "react";
import { BarChart3, CheckCircle, AlertTriangle, Eye, Database, TrendingUp } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

const explorationTools = [
  {
    id: "resultados",
    title: "Resultados",
    icon: CheckCircle,
    color: "bg-green-500",
    count: 1247,
    description: "Hallazgos principales de investigaciones"
  },
  {
    id: "conclusiones",
    title: "Conclusiones",
    icon: TrendingUp,
    color: "bg-blue-500",
    count: 89,
    description: "Análisis y síntesis de estudios"
  },
  {
    id: "brechas",
    title: "Brechas de Conocimiento",
    icon: AlertTriangle,
    color: "bg-orange-500",
    count: 156,
    description: "Áreas que requieren más investigación"
  },
  {
    id: "visualizaciones",
    title: "Visualizaciones",
    icon: Eye,
    color: "bg-purple-500",
    count: 324,
    description: "Gráficos, modelos y simulaciones"
  },
  {
    id: "datos",
    title: "Datos Brutos",
    icon: Database,
    color: "bg-gray-500",
    count: 2840,
    description: "Conjuntos de datos originales"
  }
];

const recentActivity = [
  { type: "resultado", title: "Efectos de radiación en células madre", time: "2h" },
  { type: "visualización", title: "Modelo 3D de crecimiento de plantas", time: "4h" },
  { type: "conclusión", title: "Impacto de microgravedad en huesos", time: "1d" },
  { type: "datos", title: "Dataset: Presión arterial en astronautas", time: "2d" }
];

export function RightSidebar() {
  const [selectedTool, setSelectedTool] = useState(null);

  return (
    <div className="w-80 bg-[#f0f8ff] dark:bg-sidebar h-full overflow-y-auto">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-[#0B3D91] dark:text-sidebar-foreground mb-3 tracking-wide">HERRAMIENTAS DE EXPLORACIÓN</h2>
          <div className="h-1 bg-[#FC3D21] dark:bg-accent rounded-full"></div>
        </div>

        <div className="space-y-6 mb-8">
          {explorationTools.map((tool) => {
            const Icon = tool.icon;
            const isSelected = selectedTool === tool.id;
            
            return (
              <Card
                key={tool.id}
                className={`p-4 cursor-pointer transition-all duration-500 bg-gradient-to-bl from-white/95 to-white/85 backdrop-blur-sm shadow-[0_8px_32px_-8px_rgba(11,61,145,0.15),_0_2px_8px_-2px_rgba(255,255,255,0.8)_inset] dark:shadow-[0_8px_32px_-8px_rgba(53,56,57,0.4),_0_2px_8px_-2px_rgba(0,0,0,0.3)_inset] hover:shadow-[0_16px_48px_-12px_rgba(11,61,145,0.25),_0_4px_16px_-4px_rgba(255,255,255,0.9)_inset] dark:hover:shadow-[0_16px_48px_-12px_rgba(53,56,57,0.5),_0_4px_16px_-4px_rgba(0,0,0,0.4)_inset] border border-white/60 dark:border-border/60 rounded-2xl transform-gpu perspective-1000 ${
                  isSelected 
                    ? 'rotate-x-2 -rotate-y-1 -translate-y-2 border-[#FC3D21]/40 dark:border-accent/60 shadow-[0_20px_56px_-12px_rgba(252,61,33,0.3),_0_4px_20px_-4px_rgba(255,255,255,0.95)_inset] dark:shadow-[0_20px_56px_-12px_rgba(252,61,33,0.5),_0_4px_20px_-4px_rgba(0,0,0,0.4)_inset]' 
                    : 'rotate-x-1 hover:rotate-x-2 hover:-rotate-y-1 hover:-translate-y-1.5 hover:border-[#0B3D91]/30 dark:hover:border-primary/50'
                } before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-bl before:from-purple-50/30 dark:before:from-accent/20 before:to-transparent before:pointer-events-none relative overflow-hidden`}
                onClick={() => setSelectedTool(isSelected ? null : tool.id)}
              >
                <div className="flex items-start space-x-3 relative z-10">
                  <div className={`p-3 rounded-xl ${tool.color.replace('bg-', 'bg-')}/20 dark:bg-secondary/30 border border-white/60 dark:border-border/40 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.1),_0_2px_4px_-1px_rgba(255,255,255,0.8)_inset] dark:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.3),_0_2px_4px_-1px_rgba(0,0,0,0.2)_inset] backdrop-blur-sm`}>
                    <Icon className={`w-6 h-6 ${tool.color.replace('bg-', 'text-')} drop-shadow-sm`} />
                  </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-[#0B3D91] dark:text-sidebar-foreground leading-tight drop-shadow-sm">{tool.title}</h3>
                        <Badge variant="secondary" className="bg-[#0B3D91] dark:bg-primary text-white dark:text-primary-foreground text-xs shadow-sm">
                          {tool.count}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600/80 dark:text-muted-foreground">{tool.description}</p>
                    </div>
                </div>
                
                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-[#0B3D91]/20">
                    <div className="bg-gradient-to-bl from-white/90 to-purple-50/40 backdrop-blur-sm rounded-xl p-3 border border-white/40 dark:border-border/50 shadow-[0_4px_16px_-4px_rgba(11,61,145,0.1),_0_2px_4px_-1px_rgba(255,255,255,0.6)_inset] dark:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.4),_0_2px_4px_-1px_rgba(0,0,0,0.2)_inset]"
                         style={{ backgroundColor: 'var(--secondary)' }}>
                      <div className="flex items-center space-x-2 mb-2">
                        <BarChart3 className="w-4 h-4 text-[#0B3D91] drop-shadow-sm" />
                        <span className="text-sm text-[#0B3D91]">Vista rápida</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-gradient-to-br from-blue-100/60 to-blue-50/40 backdrop-blur-sm rounded p-2 border border-white/30 dark:border-border/40 shadow-sm"
                             style={{ backgroundColor: 'var(--muted)' }}>
                          <div className="text-[#0B3D91] dark:text-primary">Recientes</div>
                          <div className="text-gray-600/80 dark:text-muted-foreground">24</div>
                        </div>
                        <div className="bg-gradient-to-br from-red-100/60 to-red-50/40 backdrop-blur-sm rounded p-2 border border-white/30 dark:border-border/40 shadow-sm"
                             style={{ backgroundColor: 'var(--muted)' }}>
                          <div className="text-[#FC3D21] dark:text-accent">Destacados</div>
                          <div className="text-gray-600/80 dark:text-muted-foreground">8</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Actividad reciente */}
        <div className="space-y-4">
          <h3 className="text-[#0B3D91] tracking-wide">ACTIVIDAD RECIENTE</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div 
                key={index}
                className="bg-gradient-to-bl from-white/90 to-white/80 backdrop-blur-sm rounded-xl p-3 border border-white/50 dark:border-border/50 shadow-[0_4px_16px_-4px_rgba(11,61,145,0.1),_0_2px_4px_-1px_rgba(255,255,255,0.7)_inset] dark:shadow-[0_4px_16px_-4px_rgba(0,0,0,0.3),_0_2px_4px_-1px_rgba(0,0,0,0.2)_inset] hover:shadow-[0_8px_24px_-6px_rgba(11,61,145,0.15),_0_3px_8px_-2px_rgba(255,255,255,0.8)_inset] dark:hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.4),_0_3px_8px_-2px_rgba(0,0,0,0.3)_inset] hover:transform hover:-translate-y-0.5 hover:rotate-x-1 transition-all duration-300 transform-gpu perspective-1000 relative overflow-hidden before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-bl before:from-blue-50/20 dark:before:from-primary/10 before:to-transparent before:pointer-events-none"
                style={{
                  backgroundColor: 'var(--card)'
                }}
              >
                <div className="flex items-start space-x-3 relative z-10">
                  <div className="w-3 h-3 bg-[#FC3D21] dark:bg-accent rounded-full mt-2 flex-shrink-0 shadow-sm"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#0B3D91] dark:text-sidebar-foreground leading-tight drop-shadow-sm">{activity.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs border-[#0B3D91]/30 dark:border-primary/40 text-[#0B3D91] dark:text-primary bg-white/60 dark:bg-secondary/40 backdrop-blur-sm">
                        {activity.type}
                      </Badge>
                      <span className="text-xs text-gray-500/80 dark:text-muted-foreground">{activity.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Elemento decorativo retro */}
        <div className="mt-8 p-4 bg-gradient-to-bl from-white/95 to-blue-50/30 backdrop-blur-sm rounded-xl border border-white/60 dark:border-border/60 shadow-[0_8px_32px_-8px_rgba(11,61,145,0.15),_0_2px_8px_-2px_rgba(255,255,255,0.8)_inset] dark:shadow-[0_8px_32px_-8px_rgba(53,56,57,0.3),_0_2px_8px_-2px_rgba(0,0,0,0.3)_inset] transform-gpu perspective-1000 rotate-x-1 relative overflow-hidden before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-bl before:from-blue-100/20 dark:before:from-primary/20 before:to-transparent before:pointer-events-none"
             style={{ backgroundColor: 'var(--muted)' }}>
          <div className="flex items-center space-x-2 mb-2 relative z-10">
            <div className="w-3 h-3 bg-[#0B3D91] dark:bg-primary rounded-full shadow-sm"></div>
            <span className="text-sm text-[#0B3D91] dark:text-sidebar-foreground drop-shadow-sm">Centro de Control</span>
          </div>
          <p className="text-xs text-gray-600/80 dark:text-muted-foreground relative z-10">
            Monitorea el progreso de tus investigaciones y explora nuevos datos.
          </p>
        </div>
      </div>
    </div>
  );
}
