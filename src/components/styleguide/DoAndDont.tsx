import { IcnCheck as Check, IcnX as X } from '@/components/ui/Icons';

export function DoAndDont() {
  const dos = [
    'Use Orange only for primary CTAs and revenue figures',
    'Use Navy for all structural elements and headings',
    'Use JetBrains Mono for all IDs, amounts, and GPS data',
    'Use semantic colors for status (green=paid, red=overdue)',
    'Use 0.5px borders — never 1px or 2px on cards',
    'Keep map pins strictly to the 6-color legend',
    'Use Tabler outline icons exclusively',
    'Left-align all data in tables',
    'Always show GHS prefix before money amounts',
  ];

  const donts = [
    'Never use gradients anywhere in the UI',
    'Never use drop shadows on cards',
    'Never use orange for error or warning states',
    'Never mix Sora and Inter in the same heading',
    'Never use filled Tabler icon variants',
    'Never show raw numbers without GHS prefix',
    'Never use custom colors outside the palette',
    'Never use ALL CAPS for body text (only labels)',
    'Never use more than 2 font weights per component',
  ];

  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Do & Don't Rules</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Do's */}
          <div className="bg-emerald-50 rounded-xl border border-emerald-200 overflow-hidden">
            <div className="bg-emerald-100 px-4 py-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600" />
              <h4 className="font-semibold text-emerald-900">DO</h4>
            </div>
            <ul className="p-4 space-y-2">
              {dos.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-emerald-900">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Don'ts */}
          <div className="bg-red-50 rounded-xl border border-red-200 overflow-hidden">
            <div className="bg-red-100 px-4 py-3 flex items-center gap-2">
              <X className="w-5 h-5 text-red-600" />
              <h4 className="font-semibold text-red-900">DON'T</h4>
            </div>
            <ul className="p-4 space-y-2">
              {donts.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-red-900">
                  <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}