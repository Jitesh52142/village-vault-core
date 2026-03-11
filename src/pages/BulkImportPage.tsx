import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getPermissions } from '@/lib/permissions';
import { validateCSVHeaders } from '@/lib/validators';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { toast } from 'sonner';

interface ImportResult {
  total: number;
  valid: number;
  invalid: number;
  errors: string[];
}

const IMPORT_TYPES = [
  {
    key: 'members',
    label: 'Members',
    description: 'Import historical member records',
    requiredHeaders: ['name', 'phone', 'vsla_id'],
  },
  {
    key: 'loans',
    label: 'Loans',
    description: 'Import historical loan data',
    requiredHeaders: ['member_id', 'vsla_id', 'principal', 'interest_rate', 'duration_months', 'status'],
  },
  {
    key: 'repayments',
    label: 'Repayments',
    description: 'Import historical repayment records',
    requiredHeaders: ['loan_id', 'amount', 'payment_date', 'currency'],
  },
];

export default function BulkImportPage() {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string[][]>([]);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [validating, setValidating] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!user) return null;
  const perms = getPermissions(user.role);

  if (!perms.canBulkImport) {
    return (
      <div className="text-center py-20">
        <AlertTriangle className="h-12 w-12 mx-auto text-destructive mb-4" />
        <h2 className="text-xl font-bold text-foreground">Access Restricted</h2>
        <p className="text-muted-foreground mt-2">Only Admin and Super Admin can access bulk import.</p>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!f.name.endsWith('.csv')) {
      toast.error('Only CSV files are accepted');
      return;
    }

    setFile(f);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim());
      const parsed = lines.slice(0, 6).map(line =>
        line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
      );
      setPreview(parsed);
    };
    reader.readAsText(f);
  };

  const handleValidateAndImport = () => {
    if (!file || !selectedType) return;

    const importType = IMPORT_TYPES.find(t => t.key === selectedType);
    if (!importType) return;

    setValidating(true);

    // Simulate validation
    setTimeout(() => {
      const headers = preview[0] || [];
      const validation = validateCSVHeaders(headers, importType.requiredHeaders);

      if (!validation.valid) {
        setResult({
          total: preview.length - 1,
          valid: 0,
          invalid: preview.length - 1,
          errors: validation.errors,
        });
        setValidating(false);
        return;
      }

      const dataRows = preview.length - 1;
      const invalidRows = Math.floor(dataRows * 0.1); // Simulated 10% error rate
      setResult({
        total: dataRows,
        valid: dataRows - invalidRows,
        invalid: invalidRows,
        errors: invalidRows > 0 ? [`${invalidRows} rows have missing required fields`] : [],
      });
      setValidating(false);

      if (invalidRows === 0) {
        toast.success(`Successfully imported ${dataRows} ${importType.label.toLowerCase()}`);
      } else {
        toast.warning(`Imported ${dataRows - invalidRows} of ${dataRows} records. ${invalidRows} had errors.`);
      }
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="page-header">Bulk Import</h1>
        <p className="page-subtitle">Upload CSV files for historical data migration</p>
      </div>

      {/* Step 1: Select Type */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
        <h2 className="text-base font-semibold text-foreground">1. Select Import Type</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {IMPORT_TYPES.map(type => (
            <button
              key={type.key}
              onClick={() => { setSelectedType(type.key); setFile(null); setPreview([]); setResult(null); }}
              className={`p-4 rounded-xl border text-left transition-colors ${
                selectedType === type.key
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:bg-muted'
              }`}
            >
              <p className="font-semibold text-foreground text-sm">{type.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Required: {type.requiredHeaders.join(', ')}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Upload CSV */}
      {selectedType && (
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-foreground">2. Upload CSV File</h2>
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
          >
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-foreground font-medium">
              {file ? file.name : 'Click to select CSV file'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {file ? `${(file.size / 1024).toFixed(1)} KB` : 'CSV format only'}
            </p>
          </div>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />

          {/* Preview */}
          {preview.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-foreground">Preview (first 5 rows)</h3>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="data-table">
                  <thead>
                    <tr>
                      {preview[0]?.map((h, i) => (
                        <th key={i} className="text-xs">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.slice(1).map((row, ri) => (
                      <tr key={ri}>
                        {row.map((cell, ci) => (
                          <td key={ci} className="text-xs">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Validate & Import */}
      {file && selectedType && (
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-foreground">3. Validate & Import</h2>
          <Button onClick={handleValidateAndImport} disabled={validating} className="w-full">
            {validating ? 'Validating...' : 'Validate & Import'}
          </Button>

          {result && (
            <div className={`p-4 rounded-lg border ${result.invalid === 0 ? 'border-[hsl(var(--success))]/20 bg-[hsl(var(--success))]/5' : 'border-destructive/20 bg-destructive/5'}`}>
              <div className="flex items-center gap-2 mb-2">
                {result.invalid === 0 ? (
                  <CheckCircle className="h-5 w-5 text-[hsl(var(--success))]" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                )}
                <span className="font-semibold text-foreground text-sm">
                  {result.invalid === 0 ? 'Import Successful' : 'Import Completed with Errors'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Rows</p>
                  <p className="font-bold text-foreground">{result.total}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Valid</p>
                  <p className="font-bold text-[hsl(var(--success))]">{result.valid}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Invalid</p>
                  <p className="font-bold text-destructive">{result.invalid}</p>
                </div>
              </div>
              {result.errors.length > 0 && (
                <div className="mt-3 space-y-1">
                  {result.errors.map((err, i) => (
                    <p key={i} className="text-xs text-destructive flex items-center gap-1">
                      <X className="h-3 w-3" /> {err}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
