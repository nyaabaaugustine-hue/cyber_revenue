import { Button } from '../ui/button';

export function ButtonShowcase() {
  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Primary Buttons</h3>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex flex-wrap gap-4">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Collect Levy
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              View Dashboard
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Export Report
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Primary CTA always uses Orange (#FF6B00)
          </p>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Secondary Buttons</h3>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
              Cancel
            </Button>
            <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
              View Details
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Secondary actions use Navy / Slate
          </p>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Destructive Buttons</h3>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex flex-wrap gap-4">
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              Flag Fraud
            </Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              Delete
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Destructive actions use Danger red
          </p>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Button Rules</h3>
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• Primary CTA always uses Orange (#FF6B00)</li>
            <li>• Secondary actions use Navy</li>
            <li>• Destructive actions use Danger red</li>
            <li>• Never mix button weights in the same action group</li>
          </ul>
        </div>
      </section>
    </div>
  );
}