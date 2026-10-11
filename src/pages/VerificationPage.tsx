import { useState } from 'react';
import { useClimate } from '@/context/ClimateContext';
import { Shield, Hash, Clock, Link2, Cpu, Wallet, Download, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { generateVerificationHistory } from '@/lib/mock-data';
import { format } from 'date-fns';

export default function VerificationPage() {
  const { data, loading, city } = useClimate();
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [history] = useState(() => generateVerificationHistory());

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerificationResult({
        status: 'verified',
        tx_id: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        block_number: Math.floor(Math.random() * 9000000 + 1000000),
        gas_used: '0.00042 MATIC',
        timestamp: new Date().toISOString(),
      });
      setVerifying(false);
    }, 2500);
  };

  const exportCSV = () => {
    const csv = 'Timestamp,Data Hash,Status,TX ID\n' + history.map(h => `${h.timestamp},${h.dataHash},${h.status},${h.txId}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `climateforge-verification-${city}.csv`;
    a.click();
  };

  if (loading || !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="glass-card p-6 h-64 animate-pulse">
          <div className="h-4 bg-secondary rounded w-1/3 mb-4" />
          <div className="h-8 bg-secondary rounded w-1/4" />
        </div>
      </div>
    );
  }

  const v = verificationResult || data.verification;
  const status = v.status;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="section-title">Immutable Climate Records — <span className="gradient-text">{city}</span></h1>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Verification Status */}
        <div className={`glass-card p-6 space-y-4 border-l-4 ${
          status === 'verified' ? 'border-l-safe glow-safe' :
          status === 'flagged' ? 'border-l-danger glow-danger' :
          'border-l-warning glow-warning'
        }`}>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold text-lg">Verification Status</h3>
          </div>
          <div className={`text-3xl font-bold font-display capitalize ${
            status === 'verified' ? 'text-safe' : status === 'flagged' ? 'text-danger' : 'text-warning'
          }`}>
            {status === 'verified' ? <CheckCircle2 className="w-8 h-8 inline mr-2" /> : <AlertCircle className="w-8 h-8 inline mr-2" />}
            {status}
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Last verification: {format(new Date(v.timestamp), 'PPpp')}</div>
            <div>Network: Polygon Testnet (Ready)</div>
          </div>
          <button
            onClick={handleVerify}
            disabled={verifying}
            className="w-full mt-2 bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {verifying ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</> : 'Verify Data'}
          </button>
        </div>

        {/* Data Integrity */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-info" />
            <h3 className="font-display font-bold text-lg">Data Integrity</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground text-xs">Current Data Hash (SHA-256)</span>
              <div className="font-mono text-xs bg-secondary/50 px-3 py-2 rounded-lg mt-1 break-all">{data.verification.data_hash.substring(0, 18)}...{data.verification.data_hash.substring(58)}</div>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">Previous Hash</span>
              <div className="font-mono text-xs bg-secondary/50 px-3 py-2 rounded-lg mt-1 break-all">{data.verification.previous_hash.substring(0, 18)}...{data.verification.previous_hash.substring(58)}</div>
            </div>
            <div className="text-xs text-muted-foreground">Generated: {format(new Date(), 'HH:mm:ss')}</div>
          </div>
        </div>
      </div>

      {/* Blockchain Transaction */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold text-lg">Blockchain Transaction</h3>
          </div>
          <div className="space-y-2 text-sm">
            {[
              { label: 'Transaction ID', value: verificationResult?.tx_id ? `${verificationResult.tx_id.substring(0, 14)}...` : 'Pending...' },
              { label: 'Block Number', value: verificationResult?.block_number || 'Pending...' },
              { label: 'Gas Used', value: verificationResult?.gas_used || 'Pending...' },
              { label: 'Timestamp', value: verificationResult ? format(new Date(verificationResult.timestamp), 'PPpp') : 'Pending...' },
              { label: 'Network', value: 'Polygon Mumbai Testnet' },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center py-1.5 border-b border-border/30">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-mono text-xs">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Contract Info */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-warning" />
            <h3 className="font-display font-bold text-lg">Smart Contract</h3>
          </div>
          <div className="space-y-2 text-sm">
            {[
              { label: 'Contract', value: '0x7a3f...9e2d' },
              { label: 'Network', value: 'Polygon Mumbai' },
              { label: 'Verification Cost', value: '~0.001 MATIC' },
              { label: 'Standard', value: 'ERC-721 (Metadata)' },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center py-1.5 border-b border-border/30">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-mono text-xs">{row.value}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-2 border border-warning text-warning py-2.5 rounded-lg font-semibold text-sm transition-all hover:bg-warning/10 flex items-center justify-center gap-2">
            <Wallet className="w-4 h-4" /> Connect Wallet (MetaMask)
          </button>
        </div>
      </div>

      {/* Verification History */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-display font-bold text-lg">Verification History</h3>
          </div>
          <button onClick={exportCSV} className="text-xs text-primary hover:underline flex items-center gap-1">
            <Download className="w-3 h-3" /> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border/50">
                <th className="pb-2 pr-4">Timestamp</th>
                <th className="pb-2 pr-4">Data Hash</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2">TX ID</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id} className="border-b border-border/20">
                  <td className="py-2 pr-4 text-xs text-muted-foreground whitespace-nowrap">{format(new Date(h.timestamp), 'HH:mm:ss')}</td>
                  <td className="py-2 pr-4 font-mono text-xs">{h.dataHash}</td>
                  <td className="py-2 pr-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      h.status === 'Verified' ? 'bg-safe/10 text-safe' :
                      h.status === 'Flagged' ? 'bg-danger/10 text-danger' :
                      'bg-warning/10 text-warning'
                    }`}>{h.status}</span>
                  </td>
                  <td className="py-2 font-mono text-xs">{h.txId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
