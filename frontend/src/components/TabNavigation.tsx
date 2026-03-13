import { cn } from "../lib/utils";
import type { LucideIcon } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: any) => void;
}

export const TabNavigation = ({ tabs, activeTab, onChange }: TabNavigationProps) => {
  return (
    <div className="flex gap-2 bg-black/20 p-1.5 rounded-2xl w-fit backdrop-blur-sm">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase italic text-[10px] transition-all",
              isActive 
                ? "bg-white text-orange-600 shadow-xl" 
                : "text-gray-400 hover:text-white"
            )}
          >
            <Icon size={14} /> {tab.label}
          </button>
        );
      })}
    </div>
  );
};