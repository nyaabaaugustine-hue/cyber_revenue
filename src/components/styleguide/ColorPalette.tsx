import { colors } from '../../utils/designTokens';

export function ColorPalette() {
  const primaryColors = [
    { name: 'Navy', hex: '#0F2B5B', usage: 'Brand / Sidebar / Headings' },
    { name: 'Navy Light', hex: '#1A3F7A', usage: 'Hover states' },
    { name: 'Navy Deep', hex: '#071A3A', usage: 'Active / pressed' },
    { name: 'Orange', hex: '#FF6B00', usage: 'CTAs / Accent / Revenue' },
    { name: 'Orange Light', hex: '#FF8C3A', usage: 'Hover on orange' },
    { name: 'Orange Pale', hex: '#FFF0E6', usage: 'Badge BG / tints' },
  ];

  const semanticColors = [
    { name: 'Success', hex: '#10B981', usage: 'Paid / Verified / Online' },
    { name: 'Warning', hex: '#F59E0B', usage: 'Due / Pending' },
    { name: 'Danger', hex: '#EF4444', usage: 'Overdue / Fraud / Error' },
    { name: 'Critical', hex: '#7C3AED', usage: 'Escalated / Critical flag' },
  ];

  const neutralColors = [
    { name: 'Surface', hex: '#F8FAFC', usage: 'Page / section BG' },
    { name: 'Card', hex: '#FFFFFF', usage: 'Cards / inputs' },
    { name: 'Border', hex: '#E2E8F0', usage: 'All borders / dividers' },
    { name: 'Text', hex: '#1E293B', usage: 'Primary text' },
    { name: 'Text Muted', hex: '#64748B', usage: 'Labels / secondary' },
    { name: 'Text Hint', hex: '#94A3B8', usage: 'Placeholders / hints' },
  ];

  const ColorRow = ({ name, hex, usage }: { name: string; hex: string; usage: string }) => (
    <div className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0">
      <div 
        className="w-16 h-10 rounded-lg border border-slate-200 flex-shrink-0"
        style={{ backgroundColor: hex }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-900">{name}</span>
          <code className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">{hex}</code>
        </div>
        <p className="text-sm text-slate-500 mt-0.5">{usage}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Primary Palette */}
      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Primary Palette</h3>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          {primaryColors.map((color) => (
            <ColorRow key={color.hex} {...color} />
          ))}
        </div>
      </section>

      {/* Semantic Palette */}
      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Semantic Palette</h3>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          {semanticColors.map((color) => (
            <ColorRow key={color.hex} {...color} />
          ))}
        </div>
      </section>

      {/* Neutral Palette */}
      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Neutral / Surface</h3>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          {neutralColors.map((color) => (
            <ColorRow key={color.hex} {...color} />
          ))}
        </div>
      </section>
    </div>
  );
}