import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockMembers, mockVSLAs } from '@/data/mockData';
import { validateLoanCreation } from '@/lib/validators';
import { LOAN_MAX_DURATION_MONTHS } from '@/types';
import { useState } from 'react';
import { ArrowLeft, CreditCard, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { getPermissions } from '@/lib/permissions';

export default function CreateLoanPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vslaId, setVslaId] = useState('');
  const [memberId, setMemberId] = useState('');
  const [principal, setPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('10');
  const [duration, setDuration] = useState('6');
  const [frequency, setFrequency] = useState('monthly');
  const [errors, setErrors] = useState<string[]>([]);

  if (!user) return null;
  const perms = getPermissions(user.role);

  if (!perms.canCreateLoan) {
    return (
      <div className="text-center py-20">
        <AlertTriangle className="h-12 w-12 mx-auto text-destructive mb-4" />
        <h2 className="text-xl font-bold text-foreground">Access Restricted</h2>
        <p className="text-muted-foreground mt-2">Your role does not allow creating loans.</p>
      </div>
    );
  }

  // Filter VSLAs based on user role and assignments
  const availableVSLAs = (user.role === 'super_admin' || user.role === 'admin')
    ? mockVSLAs
    : mockVSLAs.filter(v => user.assignedVslaIds.includes(v.id));

  const availableMembers = mockMembers.filter(m => m.vslaId === vslaId);
  const eligibleMembers = availableMembers.filter(m => !m.hasActiveLoan);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const validation = validateLoanCreation({
      vslaId,
      memberId,
      principal: parseFloat(principal) || 0,
      interestRate: parseFloat(interestRate) || 0,
      durationMonths: parseInt(duration) || 0,
      frequency,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      validation.errors.forEach(err => toast.error(err));
      return;
    }

    toast.success('Loan created successfully! Status: NEW (will activate after 7 days)');
    navigate('/loans');
  };

  const principalNum = parseFloat(principal) || 0;
  const rateNum = parseFloat(interestRate) || 0;
  const interestAmount = principalNum * rateNum / 100;
  const totalDue = principalNum + interestAmount;
  const durationNum = parseInt(duration) || 1;
  const installments = frequency === 'weekly' ? durationNum * 4 : durationNum;
  const installmentAmount = installments > 0 ? totalDue / installments : 0;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="page-header">Create New Loan</h1>
          <p className="page-subtitle">Issue a loan to a VSLA member</p>
        </div>
      </div>

      {/* Validation Errors */}
      {errors.length > 0 && (
        <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 space-y-1">
          {errors.map((err, i) => (
            <p key={i} className="text-sm text-destructive flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              {err}
            </p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">VSLA *</label>
            <Select value={vslaId} onValueChange={v => { setVslaId(v); setMemberId(''); setErrors([]); }}>
              <SelectTrigger><SelectValue placeholder="Select VSLA" /></SelectTrigger>
              <SelectContent>
                {availableVSLAs.map(v => <SelectItem key={v.id} value={v.id}>{v.name} ({v.friendlyId})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Member *</label>
            <Select value={memberId} onValueChange={v => { setMemberId(v); setErrors([]); }} disabled={!vslaId}>
              <SelectTrigger><SelectValue placeholder="Select member" /></SelectTrigger>
              <SelectContent>
                {eligibleMembers.length > 0 ? eligibleMembers.map(m => (
                  <SelectItem key={m.id} value={m.id}>{m.name} ({m.friendlyId})</SelectItem>
                )) : (
                  <SelectItem value="none" disabled>No eligible members (all have active loans)</SelectItem>
                )}
              </SelectContent>
            </Select>
            {vslaId && availableMembers.length > 0 && eligibleMembers.length === 0 && (
              <p className="text-xs text-warning mt-1">⚠ All members in this VSLA have active loans</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Principal Amount *</label>
            <Input type="number" placeholder="e.g. 150000" value={principal} onChange={e => setPrincipal(e.target.value)} min="1" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Interest Rate (%)</label>
            <Input type="number" value={interestRate} onChange={e => setInterestRate(e.target.value)} min="0" max="100" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Duration (max {LOAN_MAX_DURATION_MONTHS} months)</label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Array.from({ length: LOAN_MAX_DURATION_MONTHS }, (_, i) => i + 1).map(m => (
                  <SelectItem key={m} value={String(m)}>{m} month{m > 1 ? 's' : ''}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Repayment Frequency</label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loan Summary */}
        {principalNum > 0 && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Loan Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p className="text-muted-foreground">Principal:</p>
              <p className="font-medium text-foreground">{principalNum.toLocaleString()}</p>
              <p className="text-muted-foreground">Interest ({rateNum}%):</p>
              <p className="font-medium text-foreground">{interestAmount.toLocaleString()}</p>
              <p className="text-muted-foreground">Total Due:</p>
              <p className="font-bold text-foreground">{totalDue.toLocaleString()}</p>
              <p className="text-muted-foreground">Installments:</p>
              <p className="font-medium text-foreground">{installments} × {Math.round(installmentAmount).toLocaleString()}</p>
              <p className="text-muted-foreground">Initial Status:</p>
              <p className="font-medium text-foreground">NEW (7-day grace period)</p>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="submit" className="flex-1">
            <CreditCard className="h-4 w-4 mr-2" />
            Create Loan
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
