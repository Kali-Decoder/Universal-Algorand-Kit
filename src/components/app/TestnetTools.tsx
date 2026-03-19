import { useState } from 'react';
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check.js';
import Coins from 'lucide-react/dist/esm/icons/coins.js';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle.js';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2.js';
import { useWallet } from '../../lib/hooks/useWallet';
import { useTokenBalance } from '../../lib/hooks/useTokenBalance';
import { ADDRESSES } from '../../lib/contracts';

export default function TestnetTools() {
  const { address, isConnected, isCorrectNetwork } = useWallet();

  const { formatted: usdcBalance } = useTokenBalance(ADDRESSES.USDC);
  const [kycApproved, setKycApproved] = useState(false);
  const [kycLoading, setKycLoading] = useState(false);
  const [kycPending, setKycPending] = useState(false);
  const [faucetPending, setFaucetPending] = useState(false);
  const [faucetSuccess, setFaucetSuccess] = useState(false);
  const [kycError, setKycError] = useState<string | null>(null);
  const [faucetError, setFaucetError] = useState<string | null>(null);

  const handleApproveKyc = () => {
    if (!address) return;
    setKycError(null);
    setKycPending(true);
    setKycLoading(true);
    setTimeout(() => {
      setKycApproved(true);
      setKycPending(false);
      setKycLoading(false);
    }, 700);
  };

  const handleFaucet = () => {
    if (!address) return;
    setFaucetError(null);
    setFaucetPending(true);
    setTimeout(() => {
      setFaucetSuccess(true);
      setFaucetPending(false);
    }, 700);
  };

  if (!isConnected || !isCorrectNetwork) return null;

  const errorKyc = kycError ?? null;
  const errorFaucet = faucetError ?? null;

  return (
    <div className="w-full mb-6">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-white font-bold text-xl">Testnet Tools</h2>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
          Testnet Only
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* KYC Card */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="text-white font-semibold">KYC Self-Approval</p>
              <p className="text-white/50 text-xs">Approve your own KYC on testnet</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            {kycLoading ? (
              <span className="text-white/40">Checking status…</span>
            ) : kycApproved ? (
              <>
                <CheckCircle size={16} className="text-emerald-400" />
                <span className="text-emerald-400 font-medium">KYC Approved</span>
              </>
            ) : (
              <span className="text-white/50">Not yet approved</span>
            )}
          </div>

          {errorKyc && (
            <p className="text-red-400 text-xs break-all">{errorKyc}</p>
          )}

          <button
            onClick={handleApproveKyc}
            disabled={kycApproved === true || kycPending || kycLoading}
            className="mt-auto flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all
              bg-blue-600 hover:bg-blue-500 text-white
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {kycPending ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Approving…
              </>
            ) : (
              'Approve My KYC'
            )}
          </button>
        </div>

        {/* Faucet Card */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Coins size={22} />
            </div>
            <div>
              <p className="text-white font-semibold">USDC Faucet</p>
              <p className="text-white/50 text-xs">Mint test USDC to your wallet</p>
            </div>
          </div>

          <div className="text-sm text-white/50">
            Balance:{' '}
            <span className="text-white font-medium">{usdcBalance} USDC</span>
          </div>

          {faucetSuccess && (
            <p className="text-emerald-400 text-xs font-medium">
              10,000 USDC added to your wallet
            </p>
          )}
          {errorFaucet && (
            <p className="text-red-400 text-xs break-all">{errorFaucet}</p>
          )}

          <button
            onClick={handleFaucet}
            disabled={faucetPending}
            className="mt-auto flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all
              bg-emerald-600 hover:bg-emerald-500 text-white
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {faucetPending ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Minting…
              </>
            ) : (
              'Get 10,000 USDC'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
