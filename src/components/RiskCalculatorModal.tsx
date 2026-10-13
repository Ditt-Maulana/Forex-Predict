import React, { useState, useEffect } from 'react';
import { X, Calculator, ShieldCheck, AlertTriangle, ArrowRight } from 'lucide-react';

interface RiskCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEntry?: string;
  initialSl?: string;
  initialTp1?: string;
  initialTp2?: string;
}

export const RiskCalculatorModal: React.FC<RiskCalculatorModalProps> = ({
  isOpen,
  onClose,
  initialEntry = '2678.00',
  initialSl = '2663.00',
  initialTp1 = '2698.00',
  initialTp2 = '2718.00',
}) => {
  const [balance, setBalance] = useState<number>(10000);
  const [riskPercent, setRiskPercent] = useState<number>(1.0);
  const [entryPrice, setEntryPrice] = useState<number>(2678.00);
  const [stopLoss, setStopLoss] = useState<number>(2663.00);
  const [takeProfit1, setTakeProfit1] = useState<number>(2698.00);
  const [takeProfit2, setTakeProfit2] = useState<number>(2718.00);

  // Sync initial values if provided
  useEffect(() => {
    const parseNum = (str: string, fallback: number) => {
      const match = str.match(/(\d{4}(?:\.\d+)?)/);
      return match ? parseFloat(match[1]) : fallback;
    };
    if (initialEntry) setEntryPrice(parseNum(initialEntry, 2678));
    if (initialSl) setStopLoss(parseNum(initialSl, 2663));
    if (initialTp1) setTakeProfit1(parseNum(initialTp1, 2698));
    if (initialTp2) setTakeProfit2(parseNum(initialTp2, 2718));
  }, [initialEntry, initialSl, initialTp1, initialTp2]);

  if (!isOpen) return null;

  // Math for XAU/USD (1 standard lot = 100 oz, $1 price move = $100 per lot)
  const dollarRisk = (balance * riskPercent) / 100;
  const slDistance = Math.abs(entryPrice - stopLoss);
  const tp1Distance = Math.abs(takeProfit1 - entryPrice);
  const tp2Distance = Math.abs(takeProfit2 - entryPrice);

  // Calculated lot size
  const calculatedLotSize = slDistance > 0 ? dollarRisk / (slDistance * 100) : 0;
  const roundedLotSize = Math.max(0.01, Math.round(calculatedLotSize * 100) / 100);

  // Profit calculations based on rounded lot
  const profitAtTp1 = tp1Distance * 100 * roundedLotSize;
  const profitAtTp2 = tp2Distance * 100 * roundedLotSize;

  const actualRisk = slDistance * 100 * roundedLotSize;
  const rrTp1 = slDistance > 0 ? (tp1Distance / slDistance).toFixed(2) : '0';
  const rrTp2 = slDistance > 0 ? (tp2Distance / slDistance).toFixed(2) : '0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Kalkulator Ukuran Lot & Manajemen Risiko</h3>
              <p className="text-xs text-slate-400">Spesifikasi Kontrak XAU/USD: 100 Troy Ounce / Standar Lot</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Saldo Akun (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 text-sm">$</span>
                <input
                  type="number"
                  value={balance}
                  onChange={(e) => setBalance(parseFloat(e.target.value) || 0)}
                  className="w-full pl-7 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Toleransi Risiko (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-amber-400"
                />
                <div className="flex gap-1">
                  {[1.0, 1.5, 2.0].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setRiskPercent(pct)}
                      className={`px-2 py-1 rounded text-xs font-mono font-bold border ${
                        riskPercent === pct
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Harga Masuk (Entry Price)
              </label>
              <input
                type="number"
                step="0.1"
                value={entryPrice}
                onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-amber-300 font-mono text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Stop Loss (Proteksi)
              </label>
              <input
                type="number"
                step="0.1"
                value={stopLoss}
                onChange={(e) => setStopLoss(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-rose-400 font-mono text-sm focus:outline-none focus:border-rose-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Take Profit 1
              </label>
              <input
                type="number"
                step="0.1"
                value={takeProfit1}
                onChange={(e) => setTakeProfit1(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-emerald-400 font-mono text-sm focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Take Profit 2
              </label>
              <input
                type="number"
                step="0.1"
                value={takeProfit2}
                onChange={(e) => setTakeProfit2(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-emerald-300 font-mono text-sm focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Results Hero Card */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-amber-500/40 rounded-xl p-5 shadow-lg">
            <div className="text-center pb-4 border-b border-slate-800">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Ukuran Posisi Disarankan (Recommended Position Size)
              </span>
              <div className="text-3xl md:text-4xl font-black text-amber-400 font-mono my-1 tracking-tight">
                {roundedLotSize.toFixed(2)} <span className="text-lg font-bold text-slate-300">Lots</span>
              </div>
              <p className="text-xs text-slate-400">
                Maksimal Risiko Ditoleransi: <strong className="text-rose-400 font-mono">${actualRisk.toFixed(2)}</strong> ({riskPercent}% dari saldo)
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-center">
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Jarak SL</span>
                <span className="text-sm font-bold text-rose-400 font-mono">${slDistance.toFixed(2)}</span>
                <span className="text-[10px] text-slate-500 block">{(slDistance * 10).toFixed(0)} pips</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Profit TP 1</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">+${profitAtTp1.toFixed(2)}</span>
                <span className="text-[10px] text-emerald-500 block">R:R 1 : {rrTp1}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Profit TP 2</span>
                <span className="text-sm font-bold text-emerald-300 font-mono">+${profitAtTp2.toFixed(2)}</span>
                <span className="text-[10px] text-emerald-400 block">R:R 1 : {rrTp2}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">R:R TP 2</span>
                <span className="text-sm font-bold text-cyan-300 font-mono">1 : {rrTp2}</span>
                <span className="text-[10px] text-cyan-400 block">Asimetris Sehat</span>
              </div>
            </div>
          </div>

          {/* Institutional Execution Rules */}
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Protokol Proteksi Modal Institusional:</span>
            </div>
            <p>1. Jika harga mencapai Take Profit 1, segera geser Stop Loss ke Break Even Point (BEP) di level ${entryPrice.toFixed(2)}.</p>
            <p>2. Lakukan likuidasi parsial (Partial Close) sebesar 50% lot pada TP1 untuk mengamankan keuntungan bersih ${ (profitAtTp1 * 0.5).toFixed(2) }.</p>
            <p>3. Biarkan sisa 50% lot mengalir bebas menuju TP2 ${takeProfit2.toFixed(2)} tanpa risiko kerugian modal awal.</p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
          >
            Terapkan ke Terminal
          </button>
        </div>
      </div>
    </div>
  );
};
