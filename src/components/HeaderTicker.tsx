import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Activity, 
  Sparkles, 
  Calculator, 
  Share2, 
  RefreshCw,
  Bookmark,
  User as UserIcon,
  LogOut,
  LogIn
} from 'lucide-react';
import { INTERMARKET_LIVE_DATA } from '../data/goldData';
import { useAuth } from '../firebase/AuthContext';

interface HeaderTickerProps {
  timeframe: 'H1' | 'H4' | 'Daily';
  setTimeframe: (tf: 'H1' | 'H4' | 'Daily') => void;
  currentPrice: number;
  bias: 'Bullish' | 'Bearish' | 'Neutral';
  onOpenAiModal: () => void;
  onOpenCalcModal: () => void;
  onOpenSavedModal: () => void;
  onExportReport: () => void;
  isAiLoading: boolean;
}

export const HeaderTicker: React.FC<HeaderTickerProps> = ({
  timeframe,
  setTimeframe,
  currentPrice,
  bias,
  onOpenAiModal,
  onOpenCalcModal,
  onOpenSavedModal,
  onExportReport,
  isAiLoading,
}) => {
  const data = INTERMARKET_LIVE_DATA;
  const { user, signInWithGoogle, logout } = useAuth();

  return (
    <header className="border-b border-amber-500/20 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      {/* Top Utility Ribbon */}
      <div className="px-4 py-1.5 bg-slate-900/80 border-b border-slate-800/80 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-400">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="tracking-wide">MARKET OPEN</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">London / New York Session</span>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <span className="text-slate-500">Spread: <span className="text-slate-200 font-mono">0.30 pts (3.0 pips)</span></span>
            <span className="text-slate-700">•</span>
            <span className="text-slate-500">Kontrak: <span className="text-slate-200">100 oz / Lot</span></span>
            <span className="text-slate-700">•</span>
            <span className="text-slate-500">Waktu Server: <span className="text-slate-200 font-mono">16:36 UTC</span></span>
          </div>
        </div>

        {/* Intermarket Ticker Strip */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1">
            <span className="text-slate-400">DXY:</span>
            <span className="text-rose-400 font-semibold">{data.dxy.value}</span>
            <span className="text-rose-400 text-[10px]">({data.dxy.changePct}%)</span>
          </div>
          <span className="text-slate-700 hidden md:inline">•</span>
          <div className="hidden md:flex items-center gap-1">
            <span className="text-slate-400">US 10Y:</span>
            <span className="text-emerald-400 font-semibold">{data.us10y.value}</span>
            <span className="text-emerald-400 text-[10px]">(-3.8 bps)</span>
          </div>
          <span className="text-slate-700 hidden md:inline">•</span>
          <div className="hidden md:flex items-center gap-1">
            <span className="text-slate-400">Silver:</span>
            <span className="text-emerald-400 font-semibold">{data.silver.value}</span>
          </div>
        </div>
      </div>

      {/* Main Terminal Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Instrument & Live Price */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            AU
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 font-mono">
                XAU/USD
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-sans font-medium">
                  SPOT GOLD
                </span>
              </h1>
              <div className={`px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1 ${
                bias === 'Bullish' 
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                  : bias === 'Bearish'
                  ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              }`}>
                {bias === 'Bullish' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                Bias: {bias}
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
              <span>Gold Spot vs US Dollar</span>
              <span className="text-slate-600">•</span>
              <span>24h H: <span className="text-slate-200 font-mono">${data.xauusd.high24h.toFixed(2)}</span></span>
              <span>24h L: <span className="text-slate-200 font-mono">${data.xauusd.low24h.toFixed(2)}</span></span>
            </div>
          </div>

          {/* Big Live Price Display */}
          <div className="pl-3 border-l border-slate-800 ml-2 hidden sm:block">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl lg:text-3xl font-extrabold text-amber-400 font-mono tracking-tight">
                ${currentPrice.toFixed(2)}
              </span>
              <span className="text-xs font-semibold font-mono text-emerald-400 flex items-center">
                +${data.xauusd.change.toFixed(2)} (+{data.xauusd.changePct}%)
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Bid: <span className="text-slate-300 font-mono">${(currentPrice - 0.15).toFixed(2)}</span> | Ask: <span className="text-slate-300 font-mono">${(currentPrice + 0.15).toFixed(2)}</span>
            </p>
          </div>
        </div>

        {/* Center: Timeframe Pills */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
          {(['H1', 'H4', 'Daily'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                timeframe === tf
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Clock className="w-3 h-3" />
              {tf === 'Daily' ? 'DAILY (D1)' : tf}
            </button>
          ))}
        </div>

        {/* Right: Tools & AI Refresh */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSavedModal}
            className="px-3 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Database Setup Tersimpan & Jurnal Trading Cloud"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Database Cloud</span>
          </button>

          <button
            onClick={onOpenCalcModal}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Kalkulator Ukuran Lot & Manajemen Risiko"
          >
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Kalkulator</span>
          </button>

          <button
            onClick={onExportReport}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Salin / Ekspor Laporan Analisis Lengkap"
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Ekspor</span>
          </button>

          <button
            onClick={onOpenAiModal}
            disabled={isAiLoading}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all disabled:opacity-50"
          >
            {isAiLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>{isAiLoading ? 'Menganalisis...' : 'Analisis AI'}</span>
          </button>

          {/* Google Sign-In / User State */}
          <div className="pl-1 border-l border-slate-800 ml-1">
            {user ? (
              <div className="flex items-center gap-2">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-7 h-7 rounded-full border border-amber-500/40"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[10px] font-bold text-amber-300">
                    {user.displayName?.charAt(0) || 'U'}
                  </div>
                )}
                <button
                  onClick={() => logout()}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-850 transition-colors"
                  title="Keluar (Logout)"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => signInWithGoogle()}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                title="Masuk dengan Google untuk Menyimpan Setup & Jurnal"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Masuk</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
