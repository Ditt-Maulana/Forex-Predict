import React, { useState } from 'react';
import { 
  AnalysisPayload,
  AnalysisTimeframe 
} from '../data/goldData';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  ShieldAlert, 
  Compass, 
  LineChart, 
  Globe2, 
  Coins, 
  AlertTriangle, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Brain,
  Layers,
  Scale,
  Zap,
  CheckCircle2,
  HelpCircle,
  Bookmark
} from 'lucide-react';
import { useAuth } from '../firebase/AuthContext';
import { saveAnalysisToFirestore } from '../firebase/dbService';

interface AnalysisSectionsProps {
  data: AnalysisPayload;
  timeframe: AnalysisTimeframe;
  onUseInCalculator: (entry: string, sl: string, tp1: string, tp2: string) => void;
  onRequireAuth?: () => void;
}

export const AnalysisSections: React.FC<AnalysisSectionsProps> = ({
  data,
  timeframe,
  onUseInCalculator,
  onRequireAuth,
}) => {
  const { user, signInWithGoogle } = useAuth();
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    kondisi: true,
    teknikal: true,
    fundamental: true,
    trading: true,
    risiko: true,
    logika: true,
  });

  const handleSaveToFirestore = async () => {
    if (!user) {
      if (onRequireAuth) {
        onRequireAuth();
      } else {
        await signInWithGoogle();
      }
      return;
    }

    setIsSaving(true);
    try {
      await saveAnalysisToFirestore(user.uid, {
        timeframe,
        title: `Setup XAU/USD [${timeframe}] — ${data.prediksiSetupTrading.biasUtama}`,
        goldPrice: parseFloat(data.kondisiPasar.hargaTerkini.replace(/[^0-9.]/g, '')) || 2684.50,
        bias: data.prediksiSetupTrading.biasUtama,
        entryZone: data.prediksiSetupTrading.entryZone,
        stopLoss: data.prediksiSetupTrading.stopLoss,
        takeProfit1: data.prediksiSetupTrading.takeProfit1,
        takeProfit2: data.prediksiSetupTrading.takeProfit2,
        riskRewardRatio: data.prediksiSetupTrading.riskRewardRatio,
        notes: data.prediksiSetupTrading.skenarioPalingMungkin,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save analysis:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const {
    kondisiPasar,
    analisisTeknikal,
    analisisFundamental,
    prediksiSetupTrading,
    manajemenRisiko,
    logikaPergerakanHarga,
  } = data;

  const biasColor =
    prediksiSetupTrading.biasUtama === 'Bullish'
      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
      : prediksiSetupTrading.biasUtama === 'Bearish'
      ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
      : 'text-amber-400 bg-amber-500/10 border-amber-500/30';

  return (
    <div className="space-y-6">
      {/* ============================================================== */}
      {/* SECTION 4: HIGHLIGHT PREDIKSI & SETUP TRADING (FEATURED HERO) */}
      {/* ============================================================== */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/30 rounded-2xl p-5 md:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">BAGIAN 4</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">Timeframe: <strong className="text-white font-mono">{timeframe}</strong></span>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Prediksi & Setup Trading Institusional
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${biasColor}`}>
              {prediksiSetupTrading.biasUtama === 'Bullish' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              BIAS: {prediksiSetupTrading.biasUtama.toUpperCase()}
            </span>

            <button
              onClick={() => onUseInCalculator(
                prediksiSetupTrading.entryZone,
                prediksiSetupTrading.stopLoss,
                prediksiSetupTrading.takeProfit1,
                prediksiSetupTrading.takeProfit2
              )}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20"
            >
              Kirim ke Kalkulator
            </button>

            <button
              onClick={handleSaveToFirestore}
              disabled={isSaving}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                savedSuccess
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
              title="Simpan prediksi & setup ini ke database Cloud Firestore"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tersimpan di Cloud</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan ke Cloud'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Setup Parameters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 my-5">
          <div className="bg-slate-900/90 border border-amber-500/20 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Entry Zone</span>
            <span className="text-sm md:text-base font-black text-amber-300 font-mono block">
              {prediksiSetupTrading.entryZone.split('(')[0].trim()}
            </span>
            <span className="text-[10px] text-amber-400/80">Optimal Pullback</span>
          </div>

          <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Take Profit 1</span>
            <span className="text-sm md:text-base font-black text-emerald-400 font-mono block">
              {prediksiSetupTrading.takeProfit1.split('(')[0].trim()}
            </span>
            <span className="text-[10px] text-emerald-500/80">TP Konservatif</span>
          </div>

          <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Take Profit 2</span>
            <span className="text-sm md:text-base font-black text-emerald-300 font-mono block">
              {prediksiSetupTrading.takeProfit2.split('(')[0].trim()}
            </span>
            <span className="text-[10px] text-emerald-500/80">Target Ekstensi</span>
          </div>

          <div className="bg-slate-900/90 border border-rose-500/30 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Stop Loss</span>
            <span className="text-sm md:text-base font-black text-rose-400 font-mono block">
              {prediksiSetupTrading.stopLoss.split('(')[0].trim()}
            </span>
            <span className="text-[10px] text-rose-400/80">Proteksi Terukur</span>
          </div>

          <div className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Risk / Reward</span>
            <span className="text-sm md:text-base font-black text-cyan-300 font-mono block">
              {prediksiSetupTrading.riskRewardRatio}
            </span>
            <span className="text-[10px] text-cyan-400/80">Rasio Matematis</span>
          </div>

          <div className="bg-slate-900/90 border border-rose-500/40 bg-rose-950/20 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 block mb-1">Invalidation</span>
            <span className="text-sm md:text-base font-black text-rose-300 font-mono block">
              {prediksiSetupTrading.invalidationLevel.split('(')[0].trim()}
            </span>
            <span className="text-[10px] text-rose-400">Pembatal Setup</span>
          </div>
        </div>

        {/* Detailed Scenario Narrative */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-1">
              <Zap className="w-3.5 h-3.5" />
              Skenario Paling Mungkin (Primary Path)
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {prediksiSetupTrading.skenarioPalingMungkin}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Konfluensi & Alasan Setup (Rationale)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {prediksiSetupTrading.alasanSetup}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-800/40 text-xs text-rose-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-rose-300">Level Invalidation: </span>
              {prediksiSetupTrading.invalidationLevel}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 1: KONDISI PASAR SAAT INI */}
      {/* ============================================================== */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg transition-all">
        <button
          onClick={() => toggleSection('kondisi')}
          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-850 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">POIN 1</span>
              <h3 className="text-base font-bold text-white">Kondisi Pasar Saat Ini (Market Condition)</h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-slate-800 text-amber-400 border border-slate-700">
              {kondisiPasar.hargaTerkini}
            </span>
            {expandedSections.kondisi ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </button>

        {expandedSections.kondisi && (
          <div className="px-5 pb-5 pt-1 border-t border-slate-800/80 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold uppercase block mb-1">Harga Terkini Gold</span>
                <span className="text-xl font-black text-amber-400 font-mono">{kondisiPasar.hargaTerkini}</span>
                <span className="text-xs text-slate-400 block mt-1">Acuan Spot XAU/USD</span>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold uppercase block mb-1">Trend Utama ({timeframe})</span>
                <span className="text-lg font-bold text-emerald-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  {kondisiPasar.trendUtama}
                </span>
                <span className="text-xs text-slate-400 block mt-1">Struktur Trend Dominan</span>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold uppercase block mb-1">Fase Pasar</span>
                <span className="text-sm font-bold text-cyan-300">Markup / Bullish Continuation</span>
                <span className="text-xs text-slate-400 block mt-1">Penjaga Likuiditas Institutional</span>
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Struktur Pasar (Market Structure)
              </h4>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
                {kondisiPasar.strukturPasar}
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs text-slate-300 leading-relaxed">
              <strong className="text-amber-300 font-semibold">Ringkasan Kondisi: </strong>
              {kondisiPasar.ringkasanKondisi}
            </div>
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* SECTION 2: ANALISIS TEKNIKAL */}
      {/* ============================================================== */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg transition-all">
        <button
          onClick={() => toggleSection('teknikal')}
          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-850 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <LineChart className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">POIN 2</span>
              <h3 className="text-base font-bold text-white">Analisis Teknikal & Indikator Kunci</h3>
            </div>
          </div>
          {expandedSections.teknikal ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {expandedSections.teknikal && (
          <div className="px-5 pb-5 pt-1 border-t border-slate-800/80 space-y-4">
            {/* S/R and Psychological levels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                  Support Utama
                </span>
                <ul className="space-y-1.5 text-xs">
                  {analisisTeknikal.supportUtama.map((s, i) => (
                    <li key={i} className="text-slate-300 font-mono bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block mb-2">
                  Resistance Utama
                </span>
                <ul className="space-y-1.5 text-xs">
                  {analisisTeknikal.resistanceUtama.map((r, i) => (
                    <li key={i} className="text-slate-300 font-mono bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">
                  Level Psikologis Bulat
                </span>
                <ul className="space-y-1.5 text-xs">
                  {analisisTeknikal.levelPsikologis.map((p, i) => (
                    <li key={i} className="text-amber-200/90 font-mono bg-amber-500/5 px-2 py-1 rounded border border-amber-500/20">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Technical Indicators Breakdown Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-cyan-400 uppercase">EMA 50 & EMA 200 ({timeframe})</span>
                <p className="text-xs text-slate-300 leading-relaxed">{analisisTeknikal.ema50_200}</p>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-purple-400 uppercase">Bollinger Bands (20, 2)</span>
                <p className="text-xs text-slate-300 leading-relaxed">{analisisTeknikal.bollingerBands}</p>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-400 uppercase">Relative Strength Index (RSI 14)</span>
                  <span className="text-xs font-mono font-bold text-amber-300">{analisisTeknikal.rsi.nilai}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white">{analisisTeknikal.rsi.kondisi}</strong> — {analisisTeknikal.rsi.catatan}
                </p>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase">MACD (12, 26, 9)</span>
                  <span className="text-xs font-mono font-bold text-emerald-300">{analisisTeknikal.macd.histogram}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white">{analisisTeknikal.macd.status}</strong> — {analisisTeknikal.macd.catatan}
                </p>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-amber-300 uppercase">Pola Candlestick & Chart Pattern</span>
                <p className="text-xs text-slate-300 leading-relaxed">{analisisTeknikal.chartPattern}</p>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-amber-300 uppercase">Fibonacci Retracement & Extension</span>
                <p className="text-xs text-slate-300 leading-relaxed">{analisisTeknikal.fibonacci}</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
              <strong className="text-cyan-300 font-semibold">Volume & Institutional Momentum: </strong>
              {analisisTeknikal.volumeMomentum}
            </div>
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* SECTION 3: ANALISIS FUNDAMENTAL & SENTIMENT */}
      {/* ============================================================== */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg transition-all">
        <button
          onClick={() => toggleSection('fundamental')}
          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-850 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Globe2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">POIN 3</span>
              <h3 className="text-base font-bold text-white">Analisis Fundamental & Sentiment Makro</h3>
            </div>
          </div>
          {expandedSections.fundamental ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {expandedSections.fundamental && (
          <div className="px-5 pb-5 pt-1 border-t border-slate-800/80 space-y-3.5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-rose-400 uppercase">Korelasi Dolar AS (USD Index / DXY)</span>
                <p className="text-xs text-slate-300 leading-relaxed">{analisisFundamental.dxyPengaruh}</p>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-emerald-400 uppercase">Yield Obligasi AS (US 10Y Treasury Yield)</span>
                <p className="text-xs text-slate-300 leading-relaxed">{analisisFundamental.yield10YTreasury}</p>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-cyan-400 uppercase">Kebijakan Moneter The Fed & FOMC</span>
                <p className="text-xs text-slate-300 leading-relaxed">{analisisFundamental.kebijakanFedFOMC}</p>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-amber-400 uppercase">Data Ekonomi Kunci (CPI, NFP, PCE)</span>
                <p className="text-xs text-slate-300 leading-relaxed">{analisisFundamental.dataEkonomiRilis}</p>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-red-400 uppercase">Geopolitik & Safe-Haven Demand</span>
                <p className="text-xs text-slate-300 leading-relaxed">{analisisFundamental.geopolitikSafeHaven}</p>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-yellow-400 uppercase">Akumulasi Fisik Bank Sentral (PBoC, RBI)</span>
                <p className="text-xs text-slate-300 leading-relaxed">{analisisFundamental.sentimenEmasFisikBankSentral}</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* SECTION 5: MANAJEMEN RISIKO & CATATAN PENTING */}
      {/* ============================================================== */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg transition-all">
        <button
          onClick={() => toggleSection('risiko')}
          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-850 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">POIN 5</span>
              <h3 className="text-base font-bold text-white">Manajemen Risiko & Protokol Proteksi Modal</h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${
              manajemenRisiko.tingkatKeyakinan === 'High' 
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
            }`}>
              Keyakinan: {manajemenRisiko.tingkatKeyakinan}
            </span>
            {expandedSections.risiko ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </button>

        {expandedSections.risiko && (
          <div className="px-5 pb-5 pt-1 border-t border-slate-800/80 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  Persentase Risiko yang Disarankan
                </span>
                <p className="text-sm font-semibold text-white font-mono">{manajemenRisiko.persentaseRisiko}</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Jangan pernah mempertaruhkan lebih dari toleransi risiko per posisi pada instrumen volatilitas tinggi seperti XAU/USD.
                </p>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                  Tingkat Keyakinan Prediksi
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-base font-bold text-emerald-400">{manajemenRisiko.tingkatKeyakinan} Confidence</span>
                  <span className="text-xs text-slate-400">• Konfluensi 3+ faktor terpenuhi</span>
                </div>
              </div>
            </div>

            <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Kondisi Pasar Berisiko Tinggi (Waspada No-Trade Zone)
              </h4>
              <ul className="space-y-1.5 text-xs text-rose-200/90 pl-1">
                {manajemenRisiko.kondisiRisikoTinggi.map((k, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{k}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <strong className="text-amber-300 font-semibold">Aturan Eksekusi & Manajemen Posisi: </strong>
              {manajemenRisiko.catatanPenting}
            </div>
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* SECTION 6: ANALISIS LOGIKA PERGERAKAN HARGA EMAS */}
      {/* ============================================================== */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg transition-all">
        <button
          onClick={() => toggleSection('logika')}
          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-850 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">POIN 6</span>
              <h3 className="text-base font-bold text-white">Logika Fundamental Pergerakan Harga Emas</h3>
            </div>
          </div>
          {expandedSections.logika ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {expandedSections.logika && (
          <div className="px-5 pb-5 pt-1 border-t border-slate-800/80 space-y-4">
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Logika Makro Ekonomi Mengapa Harga Emas Berada di Posisi Saat Ini
              </h4>
              <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-sans">
                {logikaPergerakanHarga.rangkumanLogika}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Faktor Pendorong Utama (Core Catalysts)
                </span>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {logikaPergerakanHarga.faktorPendorongUtama}
                </p>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-rose-400 uppercase flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Katalis Risiko Pembalikan Tren (Reversal Risks)
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {logikaPergerakanHarga.risikoPembalikan}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
