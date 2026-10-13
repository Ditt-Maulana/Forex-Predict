import React, { useState } from 'react';
import { X, Sparkles, RefreshCw, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { AnalysisPayload } from '../data/goldData';

interface AiAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTimeframe: 'H1' | 'H4' | 'Daily';
  currentPrice: number;
  onSuccess: (newPayload: AnalysisPayload, tf: 'H1' | 'H4' | 'Daily') => void;
}

export const AiAnalysisModal: React.FC<AiAnalysisModalProps> = ({
  isOpen,
  onClose,
  activeTimeframe,
  currentPrice,
  onSuccess,
}) => {
  const [timeframe, setTimeframe] = useState<'H1' | 'H4' | 'Daily'>(activeTimeframe);
  const [priceInput, setPriceInput] = useState<string>(currentPrice.toFixed(2));
  const [dxyInput, setDxyInput] = useState<string>('102.85');
  const [us10yInput, setUs10yInput] = useState<string>('4.08%');
  const [fedStance, setFedStance] = useState<string>('Dovish bias (Siklus pemangkasan suku bunga aktif)');
  const [customQuery, setCustomQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/analyze-gold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timeframe,
          currentPrice: priceInput,
          dxyValue: dxyInput,
          us10yValue: us10yInput,
          fedStance,
          customQuery,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Gagal menghubungi server Gemini AI.');
      }

      onSuccess(result.data, timeframe);
      onClose();
    } catch (err: any) {
      console.error('AI Generation failed:', err);
      setErrorMsg(err.message || 'Terjadi kesalahan saat memproses data analisis.');
    } finally {
      setIsLoading(false);
    }
  };

  const presetQueries = [
    'Fokus pada konfirmasi breakout level resistensi psikologis $2,700.00',
    'Analisis dampak rilis data inflasi US CPI & Core PCE terhadap XAU/USD',
    'Skenario reaksi harga jika DXY mengalami technical rebound ke 103.50',
    'Evaluasi potensi order block demand di zona $2,650 - $2,660',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Analisis Emas AI Mandiri (Gemini 3.8 Flash)
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  INSTITUTIONAL GRADE
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Hasilkan prediksi objektif, level teknikal presisi, dan logika fundamental realtime.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleGenerate} className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Gagal Menghasilkan Analisis AI:</strong>
                <span>{errorMsg}</span>
              </div>
            </div>
          )}

          {/* Timeframe Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Target Timeframe Analisis
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['H1', 'H4', 'Daily'] as const).map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setTimeframe(tf)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                    timeframe === tf
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {tf === 'Daily' ? 'Daily (Makro Tren)' : tf === 'H4' ? 'H4 (Struktur Swing)' : 'H1 (Intraday Scalp)'}
                </button>
              ))}
            </div>
          </div>

          {/* Macro & Price Variables Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Harga Acuan Gold ($)
              </label>
              <input
                type="text"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                placeholder="2684.50"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-amber-300 font-mono text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                US Dollar Index (DXY)
              </label>
              <input
                type="text"
                value={dxyInput}
                onChange={(e) => setDxyInput(e.target.value)}
                placeholder="102.85"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 font-mono text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                US 10Y Treasury Yield
              </label>
              <input
                type="text"
                value={us10yInput}
                onChange={(e) => setUs10yInput(e.target.value)}
                placeholder="4.08%"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 font-mono text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Fed Stance Option */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Sentimen Kebijakan Moneter The Fed
            </label>
            <select
              value={fedStance}
              onChange={(e) => setFedStance(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-amber-400"
            >
              <option value="Dovish bias (Siklus pemangkasan suku bunga aktif)">Dovish Bias (Siklus Pemangkasan Suku Bunga Aktif / Easing Cycle)</option>
              <option value="Neutral / Data-dependent (Tunggu rilis inflasi & tenaga kerja)">Neutral / Data-Dependent (Sikap Wait-and-See)</option>
              <option value="Hawkish hold (Kekhawatiran inflasi bertahan tinggi / Higher for Longer)">Hawkish Hold (Risiko Penahanan Bunga Tinggi / Sticky Inflation)</option>
            </select>
          </div>

          {/* Custom Question or Focus */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Fokus Khusus / Pertanyaan Tambahan Trader (Opsional)
              </label>
              <span className="text-[11px] text-slate-500">Konteks trading spesifik</span>
            </div>
            <textarea
              rows={2}
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="Contoh: Bagaimana potensi pergerakan jika nanti malam rilis NFP lebih rendah dari ekspektasi? Apakah aman buy di $2,680?"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-amber-400"
            />

            {/* Quick Preset Buttons */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {presetQueries.map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCustomQuery(q)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-300 text-[10px] transition-colors text-left"
                >
                  + {q}
                </button>
              ))}
            </div>
          </div>

          {/* Loading Animation Status */}
          {isLoading && (
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-amber-400 animate-spin shrink-0" />
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-amber-300">
                  AI sedang menyusun analisis institusional 6-poin...
                </p>
                <p className="text-[11px] text-slate-400">
                  Menghitung konfluensi teknikal, korelasi intermarket DXY/Yields, dan validasi rasio R:R.
                </p>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-800">
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Didukung oleh Google Gemini 3.8 Flash model
            </span>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Mulai Analisis AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
