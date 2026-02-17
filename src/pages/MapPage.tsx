import { mockVSLAs } from '@/data/mockData';
import { HealthScore } from '@/components/HealthScore';
import { formatCurrency } from '@/data/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { mockCountries } from '@/data/mockData';
import { MapPin } from 'lucide-react';

export default function MapPage() {
  const [countryFilter, setCountryFilter] = useState('all');

  const filtered = countryFilter === 'all'
    ? mockVSLAs
    : mockVSLAs.filter(v => {
      const country = mockCountries.find(c => c.name === v.countryName);
      return country?.id === countryFilter;
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-header">Map View</h1>
          <p className="page-subtitle">Geographic distribution of VSLAs</p>
        </div>
        <Select value={countryFilter} onValueChange={setCountryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Countries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {mockCountries.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Placeholder */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="aspect-[16/10] bg-muted/30 flex items-center justify-center relative">
            <div className="text-center text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-lg font-medium">Interactive Map</p>
              <p className="text-sm mt-1">Connect a mapping library to enable geographic view</p>
            </div>
            {/* Mock pin markers */}
            {filtered.map((v, i) => (
              <div
                key={v.id}
                className="absolute"
                style={{
                  top: `${20 + (i * 15) % 60}%`,
                  left: `${15 + (i * 20) % 70}%`,
                }}
              >
                <div className={`w-4 h-4 rounded-full border-2 border-card shadow-md ${
                  v.healthScore >= 80 ? 'bg-success' : v.healthScore >= 60 ? 'bg-warning' : 'bg-destructive'
                }`} />
              </div>
            ))}
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">VSLA List</h2>
          {filtered.map(v => (
            <div key={v.id} className="bg-card rounded-xl border border-border p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-foreground text-sm">{v.name}</p>
                  <p className="text-xs text-muted-foreground">{v.communityName}, {v.provinceName}</p>
                </div>
                <HealthScore score={v.healthScore} size="sm" />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Loans</p>
                  <p className="font-semibold text-foreground">{v.totalLoans}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Outstanding</p>
                  <p className="font-semibold text-foreground">{formatCurrency(v.outstandingBalance, 'FRw')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
