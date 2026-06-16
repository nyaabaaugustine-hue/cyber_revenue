import { useState, useEffect, useRef } from 'react';
import { Command } from 'cmdk';
import { IcnSearch as Search, IcnHome as Home, IcnBuilding as Building2, IcnUsers as Users, IcnDollar as DollarSign, IcnFile as FileText, IcnMap as Map, IcnSettings as Settings, IcnX as X, IcnChevronRight as ChevronRight } from '@/components/ui/Icons';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  action: () => void;
  keywords: string[];
}

export const CommandPalette = ({ open, onOpenChange }: CommandPaletteProps) => {
  const [search, setSearch] = useState('');
  const commandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (open) {
      setSearch('');
    }
  }, [open]);

  const commands: CommandItem[] = [
    {
      id: 'dashboard',
      title: 'Go to Dashboard',
      subtitle: 'View your revenue dashboard',
      icon: <Home className="w-4 h-4" />,
      action: () => window.location.href = '/',
      keywords: ['dashboard', 'home', 'overview'],
    },
    {
      id: 'businesses',
      title: 'Businesses',
      subtitle: 'Manage business registry',
      icon: <Building2 className="w-4 h-4" />,
      action: () => window.location.href = '/businesses',
      keywords: ['businesses', 'registry', 'companies'],
    },
    {
      id: 'agents',
      title: 'Agents',
      subtitle: 'Manage field agents',
      icon: <Users className="w-4 h-4" />,
      action: () => window.location.href = '/agents',
      keywords: ['agents', 'field officers', 'staff'],
    },
    {
      id: 'collections',
      title: 'Collections',
      subtitle: 'View collection log',
      icon: <DollarSign className="w-4 h-4" />,
      action: () => window.location.href = '/collections',
      keywords: ['collections', 'payments', 'revenue'],
    },
    {
      id: 'reports',
      title: 'Reports',
      subtitle: 'Generate reports',
      icon: <FileText className="w-4 h-4" />,
      action: () => window.location.href = '/reports',
      keywords: ['reports', 'analytics', 'export'],
    },
    {
      id: 'map',
      title: 'Live Map',
      subtitle: 'View live map',
      icon: <Map className="w-4 h-4" />,
      action: () => window.location.href = '/map',
      keywords: ['map', 'live', 'location'],
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'System settings',
      icon: <Settings className="w-4 h-4" />,
      action: () => window.location.href = '/settings',
      keywords: ['settings', 'config', 'preferences'],
    },
  ];

  const filteredCommands = commands.filter((command) =>
    command.title.toLowerCase().includes(search.toLowerCase()) ||
    command.subtitle.toLowerCase().includes(search.toLowerCase()) ||
    command.keywords.some(keyword => keyword.toLowerCase().includes(search.toLowerCase()))
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div
        ref={commandRef}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl p-4"
      >
        <Command
          className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              onOpenChange(false);
            }
          }}
        >
          <div className="flex items-center border-b border-slate-200 px-4">
            <Search className="w-5 h-5 text-slate-400 mr-3" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Type a command or search..."
              className="flex-1 py-4 text-sm bg-transparent border-none outline-none placeholder:text-slate-400"
            />
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          
          <Command.List className="max-h-96 overflow-auto">
            {filteredCommands.length === 0 ? (
              <div className="py-8 text-center text-slate-500">
                No commands found.
              </div>
            ) : (
              <Command.Empty className="py-8 text-center text-slate-500">
                No commands found.
              </Command.Empty>
            )}
            
            {filteredCommands.map((command) => (
              <Command.Item
                key={command.id}
                value={command.id}
                onSelect={() => {
                  command.action();
                  onOpenChange(false);
                }}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="flex-shrink-0 p-2 bg-slate-100 rounded-lg text-slate-600">
                  {command.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{command.title}</p>
                  <p className="text-xs text-slate-500 truncate">{command.subtitle}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </div>
    </div>
  );
};