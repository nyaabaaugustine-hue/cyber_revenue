import { typography } from '../../utils/designTokens';

export function TypographyShowcase() {
  const fontStacks = [
    { name: 'Sora', weight: '800', usage: 'Display headings, hero text', sample: 'CYBERREVENUE' },
    { name: 'Inter', weight: '400-700', usage: 'Body text, UI labels, buttons', sample: 'Revenue officers can register businesses efficiently.' },
    { name: 'JetBrains Mono', weight: '400-500', usage: 'IDs, amounts, GPS coordinates', sample: 'KMA-0087-SHOP · GHS 480.00' },
  ];

  const typeScale = [
    { name: 'Display', size: '32px', weight: '800', sample: 'District Revenue Dashboard', notes: 'Page titles only' },
    { name: 'Heading 1', size: '24px', weight: '700', sample: 'Zone 3 — Adum', notes: 'Section headers' },
    { name: 'Heading 2', size: '18px', weight: '700', sample: 'Collection Summary', notes: 'Card headers' },
    { name: 'Subtitle', size: '15px', weight: '600', sample: 'Revenue officers can register a business in under 60 seconds.', notes: 'Emphasized body' },
    { name: 'Body', size: '14px', weight: '400', sample: 'Revenue officers can register a business in under 60 seconds using GPS coordinates and a photo.', notes: 'Default text' },
    { name: 'Caption', size: '12px', weight: '400', sample: 'Last visited: 14 June 2024 · Officer: Emmanuel Owusu', notes: 'Secondary info' },
    { name: 'Mono / ID', size: '14px', weight: '400', sample: 'KMA-0087-SHOP', notes: 'Business IDs', mono: true },
    { name: 'Mono / Amount', size: '16px', weight: '500', sample: 'GHS 480.00', notes: 'Money amounts', mono: true },
  ];

  return (
    <div className="space-y-8">
      {/* Font Stack */}
      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Font Stack</h3>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-500 uppercase tracking-wider">
            <span>Font</span>
            <span>Weight</span>
            <span>Usage</span>
          </div>
          {fontStacks.map((font) => (
            <div key={font.name} className="grid grid-cols-3 gap-4 p-4 border-b border-slate-100 last:border-0 items-center">
              <div>
                <span className="font-semibold text-slate-900">{font.name}</span>
              </div>
              <div>
                <span className="text-slate-600">{font.weight}</span>
              </div>
              <div>
                <span className="text-slate-600">{font.usage}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Type Scale */}
      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Type Scale</h3>
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-6">
          {typeScale.map((type) => (
            <div key={type.name} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded">
                  {type.name}
                </span>
                <span className="text-xs text-slate-400">{type.size} · {type.weight}</span>
              </div>
              <p 
                className="text-slate-900"
                style={{ 
                  fontSize: type.size, 
                  fontWeight: type.weight,
                  fontFamily: type.mono ? typography.fontFamily.mono : typography.fontFamily.body
                }}
              >
                {type.sample}
              </p>
              <p className="text-xs text-slate-400 mt-1">{type.notes}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Rules */}
      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Typography Rules</h3>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-900">
            <strong>Rule:</strong> All business IDs, receipt numbers, GPS coordinates, and money amounts must use <code className="bg-amber-100 px-1 rounded">JetBrains Mono</code>. Everything else uses Inter. Display headings (hero, page titles) use Sora.
          </p>
        </div>
      </section>
    </div>
  );
}