import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockMembers, mockLoans, formatCurrency, getCurrentFxRate } from '@/data/mockData';
import { validateRepayment, checkFxVariance } from '@/lib/validators';
import { FX_VARIANCE_THRESHOLD, FX_LOCK_DURATION_MINUTES } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, CheckCircle, Receipt, AlertTriangle, Lock } from 'lucide-react';
import { toast } from 'sonner';

type Step = 'select' | 'enter' | 'confirm' | 'success';

export default function RepaymentsPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('select');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState<string[]>([]);

  const membersWithLoans = mockMembers.filter(m => m.hasActiveLoan);
  const selectedMember = mockMembers.find(m => m.id === selectedMemberId);
  const activeLoan = mockLoans.find(l => l.memberId === selectedMemberId && (l.status === 'ACTIVE' || l.status === 'OVERDUE'));

  const handleSelectMember = (id: string) => {
    setSelectedMemberId(id);
    setStep('enter');
    setErrors([]);
  };

  const handleEnterAmount = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    if (!activeLoan) return;

    const validation = validateRepayment({
      amount: parseFloat(amount) || 0,
      remainingBalance: activeLoan.remainingBalance,
      paymentDate,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      validation.errors.forEach(err => toast.error(err));
      return;
    }

    setStep('confirm');
  };

  const handleConfirm = () => {
    if (!activeLoan) return;

    const amountNum = parseFloat(amount) || 0;
    const newBalance = activeLoan.remainingBalance - amountNum;

    if (newBalance === 0) {
      toast.success('Payment recorded! Loan is now COMPLETED.');
    } else {
      toast.success('Payment recorded successfully!');
    }
    setStep('success');
  };

  const handleReset = () => {
    setStep('select');
    setSelectedMemberId('');
    setAmount('');
    setErrors([]);
  };

  // FX calculations
  const fxRateData = activeLoan ? getCurrentFxRate(activeLoan.currency) : undefined;
  const fxRate = fxRateData?.referenceRate || 1280;
  const amountNum = parseFloat(amount) || 0;
  const usdEquiv = amountNum / fxRate;
  const fxCheck = checkFxVariance(fxRate, fxRateData?.referenceRate || fxRate);
  const isBackdated = paymentDate < new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      {step !== 'select' && step !== 'success' && (
        <Button variant="ghost" size="sm" onClick={() => { setStep(step === 'confirm' ? 'enter' : 'select'); setErrors([]); }}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      )}

      {/* Step 1: Select Member */}
      {step === 'select' && (
        <div className="space-y-4">
          <div>
            <h1 className="page-header">Collect Payment</h1>
            <p className="page-subtitle">Select a member to record a payment</p>
          </div>
          <div className="space-y-2">
            {membersWithLoans.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No members with active loans</p>
            )}
            {membersWithLoans.map(member => {
              const loan = mockLoans.find(l => l.memberId === member.id && (l.status === 'ACTIVE' || l.status === 'OVERDUE'));
              return (
                <button
                  key={member.id}
                  onClick={() => handleSelectMember(member.id)}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:bg-muted transition-colors text-left"
                >
                  <div>
                    <p className="font-semibold text-foreground">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.vslaName} · {member.friendlyId}</p>
                  </div>
                  {loan && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {formatCurrency(loan.remainingBalance, loan.currencySymbol)}
                      </p>
                      <span className={`status-badge ${loan.status === 'OVERDUE' ? 'status-overdue' : 'status-active'}`}>
                        {loan.status}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 2: Enter Payment */}
      {step === 'enter' && selectedMember && activeLoan && (
        <div className="space-y-4">
          <div>
            <h1 className="page-header">Enter Payment</h1>
            <p className="page-subtitle">For {selectedMember.name} ({selectedMember.friendlyId})</p>
          </div>

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

          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex justify-between text-sm mb-4">
              <span className="text-muted-foreground">Remaining Balance</span>
              <span className="font-bold text-foreground">{formatCurrency(activeLoan.remainingBalance, activeLoan.currencySymbol)}</span>
            </div>
            <form onSubmit={handleEnterAmount} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Payment Amount ({activeLoan.currency}) *</label>
                <Input
                  type="number"
                  placeholder="e.g. 27500"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  min="1"
                  max={activeLoan.remainingBalance}
                  className="text-lg"
                  autoFocus
                />
                <p className="text-xs text-muted-foreground mt-1">Max: {formatCurrency(activeLoan.remainingBalance, activeLoan.currencySymbol)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Payment Date</label>
                <Input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} />
                {isBackdated && (
                  <p className="text-xs text-warning mt-1 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Backdated entry — will be flagged for review
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full py-6 text-lg">
                Continue
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Step 3: FX Confirmation */}
      {step === 'confirm' && selectedMember && activeLoan && (
        <div className="space-y-4">
          <div>
            <h1 className="page-header">Confirm Payment</h1>
            <p className="page-subtitle">Review FX rate and details before submitting</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            {/* FX Lock indicator */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[hsl(var(--info))]/5 border border-[hsl(var(--info))]/10 text-sm">
              <Lock className="h-4 w-4 text-[hsl(var(--info))]" />
              <span className="text-foreground">FX rate locked for {FX_LOCK_DURATION_MINUTES} minutes</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Member</span>
                <span className="font-medium text-foreground">{selectedMember.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Loan</span>
                <span className="font-medium text-foreground">{activeLoan.friendlyId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-bold text-foreground text-lg">{formatCurrency(amountNum, activeLoan.currencySymbol)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">FX Rate</span>
                <span className="font-medium text-foreground">1 USD = {fxRate.toLocaleString()} {activeLoan.currency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">USD Equivalent</span>
                <span className="font-medium text-foreground">${usdEquiv.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Balance After</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(activeLoan.remainingBalance - amountNum, activeLoan.currencySymbol)}
                  {activeLoan.remainingBalance - amountNum === 0 && ' (COMPLETED)'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium text-foreground">{paymentDate}</span>
              </div>

              {isBackdated && (
                <div className="p-2 rounded bg-warning/10 text-warning text-xs font-medium flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Backdated entry — will be flagged for review
                </div>
              )}

              {fxCheck.flagged && (
                <div className="p-2 rounded bg-destructive/10 text-destructive text-xs font-medium flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  FX variance {fxCheck.variance}% exceeds {FX_VARIANCE_THRESHOLD}% threshold
                </div>
              )}
            </div>

            {/* Immutability notice */}
            <div className="p-3 rounded-lg bg-muted text-xs text-muted-foreground">
              ⚠ Repayments are immutable. Once recorded, this payment cannot be edited or deleted.
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleConfirm} className="flex-1 py-6 text-lg">
                <Receipt className="h-5 w-5 mr-2" />
                Confirm Payment
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 'success' && (
        <div className="text-center py-12 space-y-4 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[hsl(var(--success))]/10">
            <CheckCircle className="h-10 w-10 text-[hsl(var(--success))]" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Payment Recorded!</h1>
          <p className="text-muted-foreground">
            {formatCurrency(amountNum, activeLoan?.currencySymbol || 'FRw')} from {selectedMember?.name}
          </p>
          {activeLoan && activeLoan.remainingBalance - amountNum === 0 && (
            <p className="text-[hsl(var(--success))] font-medium">Loan is now COMPLETED ✅</p>
          )}
          <div className="flex flex-col gap-3 max-w-xs mx-auto pt-4">
            <Button onClick={handleReset} className="w-full py-6 text-lg">
              Record Another Payment
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
