import { Collection } from "../types";
import { ArrowRight, DollarSign } from "lucide-react";

interface CollectionFeedProps {
  collections: Collection[];
}

const paymentMethodColors: Record<string, string> = {
  mobile_money: 'text-blue-400 bg-blue-500/10',
  cash: 'text-green-400 bg-green-500/10',
  pos: 'text-purple-400 bg-purple-500/10',
  other: 'text-slate-400 bg-slate-500/10'
};

export function CollectionFeed({ collections }: CollectionFeedProps) {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">Recent Collections</h3>
          <span className="text-xs text-slate-400">Live Feed</span>
        </div>
      </div>
      
      <div className="divide-y divide-slate-700/50 max-h-80 overflow-auto">
        {collections.map((collection) => (
          <div key={collection.id} className="p-4 hover:bg-slate-700/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{collection.businessName}</p>
                  <p className="text-xs text-slate-400">{collection.officerName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-green-400">GHS {collection.amount.toLocaleString()}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${paymentMethodColors[collection.paymentMethod]}`}>
                  {collection.paymentMethod.replace('_', ' ')}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono">{collection.receiptNumber}</span>
              <span>{new Date(collection.collectionDate).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full p-3 border-t border-slate-700/50 flex items-center justify-center gap-2 text-sm text-orange-400 hover:text-orange-300 hover:bg-slate-700/30 transition-colors">
        View All Collections
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}