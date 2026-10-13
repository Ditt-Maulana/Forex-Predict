import React, { useState, useEffect, useMemo } from 'react';
import { 
  DEFAULT_ANALYSIS_DATA, 
  INTERMARKET_LIVE_DATA, 
  generateCandlestickSeries, 
  AnalysisPayload,
  CandlestickData
} from './data/goldData';
import { HeaderTicker } from './components/HeaderTicker';
import { InteractiveChart } from './components/InteractiveChart';
import { AnalysisSections } from './components/AnalysisSections';
import { RiskCalculatorModal } from './components/RiskCalculatorModal';
import { AiAnalysisModal } from './components/AiAnalysisModal';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { ExportModal } from './components/ExportModal';
import { SavedSetupsModal } from './components/SavedSetupsModal';
import { AuthProvider } from './firebase/AuthContext';
import { 
  BarChart3, 
  FileText, 
  Layers, 
  Globe2, 
  Sparkles, 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Activity,
  Flame,
  Scale
} from 'lucide-react';

export function TerminalContent() {
  const [timeframe, setTimeframe] = useState<'H1' | 'H4' | 'Daily'>('H4');
  const [allAnalyses, setAllAnalyses] = useState<Record<'H1' | 'H4' | 'Daily', AnalysisPayload>>(DEFAULT_ANALYSIS_DATA);
  const [currentPrice, setCurrentPrice] = useState<number>(2684.50);
  const [activeTab, setActiveTab] = useState<'analysis' | 'chart' | 'scenarios' | 'fundamental'>('analysis');

  // Modals state
  const [isCalcModalOpen, setIsCalcModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [calcPrefill, setCalcPrefill] = useState({
    entry: '2678.00',
    sl: '2663.00',
    tp1: '2698.00',
    tp2: '2718.00',
  });

  // Current analysis data
  const currentAnalysis = allAnalyses[timeframe];

  // Generated candle data
  const candleSeries = useMemo(() => {
    const intv = timeframe === 'H1' ? '1H' : timeframe === 'H4' ? '4H' : 'Daily';
    return generateCandlestickSeries(intv, 45);
  }, [timeframe]);

  // Subtle real-time price fluctuation simulator for live terminal feel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice((prev) => {
        const delta = (Math.random() - 0.48) * 0.40;
        return Math.round((prev + delta) * 100) / 100;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleOpenCalcWithSetup = (entry: string, sl: string, tp1: string, tp2: string) => {
    setCalcPrefill({ entry, sl, tp1, tp2 });
    setIsCalcModalOpen(true);
  };

  const handleAiSuccess = (newPayload: AnalysisPayload, tf: 'H1' | 'H4' | 'Daily') => {
    setAllAnalyses(prev => ({ ...prev, [tf]: newPayload }));
    setTimeframe(tf);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Terminal Header */}
      <HeaderTicker
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        currentPrice={currentPrice}
        bias={currentAnalysis.prediksiSetupTrading.biasUtama}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onOpenCalcModal={() => setIsCalcModalOpen(true)}
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
        onExportReport={() => setIsExportModalOpen(true)}
        isAiLoading={false}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Market Vital Tape */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-amber-400 font-bold flex items-center gap-1.5 uppercase tracking-wide">
              <Activity className="w-4 h-4 text-amber-400" />
              Market Vitals:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Average True Range (ATR 14):</span>
              <span className="text-slate-200 font-mono font-bold">$24.80 / Hari</span>
            </div>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Korelasi DXY:</span>
              <span className="text-rose-400 font-mono font-bold">-0.84 (Kuat Terbalik)</span>
            </div>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Volatilitas:</span>
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> Normal-Tinggi
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-slate-500 text-[11px]">Model Analis:</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-mono text-[11px] border border-slate-700">
              Gold Pro Engine v4.2
            </span>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-3">
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 flex-wrap">
            <button
              onClick={() => setActiveTab('analysis')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'analysis'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Analisis Lengkap (6 Poin)</span>
            </button>

            <button
              onClick={() => setActiveTab('chart')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'chart'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Chart & Indikator Teknikal</span>
            </button>

            <button
              onClick={() => setActiveTab('scenarios')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'scenarios'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Simulator Skenario & Invalidation</span>
            </button>

            <button
              onClick={() => setActiveTab('fundamental')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'fundamental'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>Intermarket & Logika Fundamental</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-amber-500/40 text-amber-400 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kustomisasi Parameter Pasar</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Comprehensive 6-Section Breakdown (Default View) */}
        {activeTab === 'analysis' && (
          <div className="space-y-6">
            {/* Quick mini chart embedded at top of analysis view */}
            <InteractiveChart
              timeframe={timeframe}
              currentPrice={currentPrice}
              entryZone={currentAnalysis.prediksiSetupTrading.entryZone}
              takeProfit1={currentAnalysis.prediksiSetupTrading.takeProfit1}
              takeProfit2={currentAnalysis.prediksiSetupTrading.takeProfit2}
              stopLoss={currentAnalysis.prediksiSetupTrading.stopLoss}
              invalidationLevel={currentAnalysis.prediksiSetupTrading.invalidationLevel}
              initialInterval={timeframe === 'H1' ? '1H' : timeframe === 'H4' ? '4H' : 'Daily'}
              onIntervalChange={(intv) => {
                if (intv === '1H') setTimeframe('H1');
                else if (intv === '4H') setTimeframe('H4');
                else if (intv === 'Daily') setTimeframe('Daily');
              }}
            />

            {/* Complete 6 Points Analysis */}
            <AnalysisSections
              data={currentAnalysis}
              timeframe={timeframe}
              onUseInCalculator={handleOpenCalcWithSetup}
            />
          </div>
        )}

        {/* Tab 2: Full Chart & Technical Indicators Focus */}
        {activeTab === 'chart' && (
          <div className="space-y-6">
            <InteractiveChart
              timeframe={timeframe}
              currentPrice={currentPrice}
              entryZone={currentAnalysis.prediksiSetupTrading.entryZone}
              takeProfit1={currentAnalysis.prediksiSetupTrading.takeProfit1}
              takeProfit2={currentAnalysis.prediksiSetupTrading.takeProfit2}
              stopLoss={currentAnalysis.prediksiSetupTrading.stopLoss}
              invalidationLevel={currentAnalysis.prediksiSetupTrading.invalidationLevel}
              initialInterval={timeframe === 'H1' ? '1H' : timeframe === 'H4' ? '4H' : 'Daily'}
              onIntervalChange={(intv) => {
                if (intv === '1H') setTimeframe('H1');
                else if (intv === '4H') setTimeframe('H4');
                else if (intv === 'Daily') setTimeframe('Daily');
              }}
            />

            {/* Technical Detail Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Support & Demand Levels
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {currentAnalysis.analisisTeknikal.supportUtama.map((s, i) => (
                    <li key={i} className="p-2 rounded bg-slate-950 font-mono border border-slate-800">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                  Resistance & Supply Levels
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {currentAnalysis.analisisTeknikal.resistanceUtama.map((r, i) => (
                    <li key={i} className="p-2 rounded bg-slate-950 font-mono border border-slate-800">
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Level Psikologis Bulat
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {currentAnalysis.analisisTeknikal.levelPsikologis.map((p, i) => (
                    <li key={i} className="p-2 rounded bg-slate-950 font-mono border border-amber-500/20 text-amber-200">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Multi-scenario Simulator */}
        {activeTab === 'scenarios' && (
          <div className="space-y-6">
            <ScenarioSimulator
              currentPrice={currentPrice}
              timeframe={timeframe}
              entryZone={currentAnalysis.prediksiSetupTrading.entryZone}
              tp1={currentAnalysis.prediksiSetupTrading.takeProfit1}
              tp2={currentAnalysis.prediksiSetupTrading.takeProfit2}
              sl={currentAnalysis.prediksiSetupTrading.stopLoss}
              invalidation={currentAnalysis.prediksiSetupTrading.invalidationLevel}
            />

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">Ingin menguji perhitungan ukuran lot untuk skenario di atas?</h4>
                <p className="text-xs text-slate-400">Gunakan kalkulator ukuran posisi institusional untuk mengukur risiko secara akurat.</p>
              </div>
              <button
                onClick={() => handleOpenCalcWithSetup(
                  currentAnalysis.prediksiSetupTrading.entryZone,
                  currentAnalysis.prediksiSetupTrading.stopLoss,
                  currentAnalysis.prediksiSetupTrading.takeProfit1,
                  currentAnalysis.prediksiSetupTrading.takeProfit2
                )}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <Calculator className="w-4 h-4" />
                <span>Buka Kalkulator Risiko</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Intermarket & Fundamental Logic */}
        {activeTab === 'fundamental' && (
          <div className="space-y-6">
            {/* Macro Intermarket Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 uppercase">US Dollar Index (DXY)</span>
                  <span className="text-xs font-mono font-bold text-rose-400">{INTERMARKET_LIVE_DATA.dxy.value}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentAnalysis.analisisFundamental.dxyPengaruh}
                </p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase">US 10Y Treasury Yield</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{INTERMARKET_LIVE_DATA.us10y.value}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentAnalysis.analisisFundamental.yield10YTreasury}
                </p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 uppercase">The Fed & FOMC Policy</span>
                  <span className="text-xs font-bold text-cyan-300">Rate Cut Cycle</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentAnalysis.analisisFundamental.kebijakanFedFOMC}
                </p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase block">Rilis Data Ekonomi (CPI, NFP)</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentAnalysis.analisisFundamental.dataEkonomiRilis}
                </p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-2">
                <span className="text-xs font-bold text-red-400 uppercase block">Geopolitik & Safe-Haven Flows</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentAnalysis.analisisFundamental.geopolitikSafeHaven}
                </p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-2">
                <span className="text-xs font-bold text-yellow-400 uppercase block">Akumulasi Bank Sentral (PBoC, RBI)</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentAnalysis.analisisFundamental.sentimenEmasFisikBankSentral}
                </p>
              </div>
            </div>

            {/* Deep Macro Economics Logic Section */}
            <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-400" />
                Logika Fundamental Pergerakan Harga Emas Saat Ini
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                {currentAnalysis.logikaPergerakanHarga.rangkumanLogika}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1.5">
                  <span className="text-xs font-bold text-emerald-400 uppercase">Faktor Pendorong Utama</span>
                  <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                    {currentAnalysis.logikaPergerakanHarga.faktorPendorongUtama}
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1.5">
                  <span className="text-xs font-bold text-rose-400 uppercase">Risiko Pembalikan Tren</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentAnalysis.logikaPergerakanHarga.risikoPembalikan}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 px-4 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
            <span className="text-slate-300 font-semibold">XAU/USD Pro Gold Analyst Terminal</span>
            <span>— Analisis Objektif Komoditas & Valas</span>
          </div>

          <p className="text-center md:text-right text-[11px] text-slate-500 max-w-xl">
            Disclaimer: Analisis ini disusun untuk tujuan edukasi dan referensi keputusan trading profesional. Perdagangan komoditas emas (XAU/USD) melibatkan risiko modal tinggi. Selalu terapkan manajemen risiko dan batasi risiko per trade.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <RiskCalculatorModal
        isOpen={isCalcModalOpen}
        onClose={() => setIsCalcModalOpen(false)}
        initialEntry={calcPrefill.entry}
        initialSl={calcPrefill.sl}
        initialTp1={calcPrefill.tp1}
        initialTp2={calcPrefill.tp2}
      />

      <AiAnalysisModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        activeTimeframe={timeframe}
        currentPrice={currentPrice}
        onSuccess={handleAiSuccess}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={currentAnalysis}
        timeframe={timeframe}
      />

      <SavedSetupsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TerminalContent />
    </AuthProvider>
  );
}
