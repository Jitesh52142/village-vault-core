import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockMembers, mockVSLAs } from '@/data/mockData';
import { useState } from 'react';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateLoanPage() {
  const navigate = useNavigate();
  const [vslaId, setVslaId] = useState('');
  const [memberId, setMemberId] = useState('');
  const [principal, setPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('10');
  const [duration, setDuration] = useState('6');
  const [frequency, setFrequency] = useState('monthly');

  const availableMembers = mockMembers.filter(m => m.vslaId === vslaId && !m.hasActiveLoan);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vslaId || !memberId || !principal) {
      toast.error('Please fill all required fields');
      return;
    }
    const member = mockMembers.find(m => m.id === memberId);
    if (member?.hasActiveLoan) {
      toast.error('This member already has an active loan');
      return;
    }
    toast.success('Loan created successfully! Status: NEW');
    navigate('/loans');
  };

  const principalNum = parseFloat(principal) || 0;
  const rateNum = parseFloat(interestRate) || 0;
  const totalDue = principalNum + (principalNum * rateNum / 100);

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

      <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">VSLA *</label>
            <Select value={vslaId} onValueChange={v => { setVslaId(v); setMemberId(''); }}>
              <SelectTrigger><SelectValue placeholder="Select VSLA" /></SelectTrigger>
              <SelectContent>
                {mockVSLAs.map(v => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Member *</label>
            <Select value={memberId} onValueChange={setMemberId} disabled={!vslaId}>
              <SelectTrigger><SelectValue placeholder="Select member" /></SelectTrigger>
              <SelectContent>
                {availableMembers.length > 0 ? availableMembers.map(m => (
                  <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                )) : (
                  <SelectItem value="none" disabled>No eligible members</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Principal Amount *</label>
            <Input type="number" placeholder="e.g. 150000" value={principal} onChange={e => setPrincipal(e.target.value)} min="0" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Interest Rate (%)</label>
            <Input type="number" value={interestRate} onChange={e => setInterestRate(e.target.value)} min="0" max="100" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Duration (months)</label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
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

        {/* Summary */}
        {principalNum > 0 && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Loan Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p className="text-muted-foreground">Principal:</p>
              <p className="font-medium text-foreground">{principalNum.toLocaleString()}</p>
              <p className="text-muted-foreground">Interest ({rateNum}%):</p>
              <p className="font-medium text-foreground">{(principalNum * rateNum / 100).toLocaleString()}</p>
              <p className="text-muted-foreground">Total Due:</p>
              <p className="font-bold text-foreground">{totalDue.toLocaleString()}</p>
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
