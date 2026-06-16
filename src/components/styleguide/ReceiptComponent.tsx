import { QrCode } from 'lucide-react';

export function ReceiptComponent() {
  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Receipt Component</h3>
        <div className="max-w-sm">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 text-center">
              <h4 className="font-bold text-lg" style={{ fontFamily: 'Sora, sans-serif' }}>CYBERREVENUE</h4>
              <p className="text-xs text-slate-400 mt-1">Official Revenue Receipt</p>
            </div>

            {/* Receipt Number */}
            <div className="bg-orange-500 text-white text-center py-2">
              <code className="font-mono text-sm">KMA-2024-00012345</code>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <ReceiptRow label="Business" value="Afia's Provisions" />
              <ReceiptRow label="Business ID" value="KMA-0087-SHOP" mono />
              <ReceiptRow label="Zone" value="Zone 3 — Adum" />
              <ReceiptRow label="Levy Period" value="Q2 2024" />
              <ReceiptRow label="Payment" value="MTN Mobile Money" />
              <ReceiptRow label="MoMo Ref" value="GHA-284729" mono />
              
              <div className="border-t border-slate-200 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Total Paid</span>
                  <span className="text-xl font-bold text-slate-900" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    GHS 80.00
                  </span>
                </div>
              </div>

              <ReceiptRow label="Officer" value="Emmanuel Owusu" />
              <ReceiptRow label="Date" value="16 Jun 2024 · 10:42" />
            </div>

            {/* QR Code */}
            <div className="border-t border-slate-200 p-4 flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center mb-2">
                <QrCode className="w-12 h-12 text-slate-400" />
              </div>
              <p className="text-xs text-slate-500 text-center">
                Scan to verify · verify.cyberrevenue.gh
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ReceiptRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-start">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={`text-sm text-slate-900 ${mono ? 'font-mono' : 'font-medium'}`}>
        {value}
      </span>
    </div>
  );
}