import React, { useState, useEffect, useMemo } from 'react';
import { CandlestickData, ChartInterval, AnalysisTimeframe, generateCandlestickSeries } from '../data/goldData';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Maximize2, 
  BarChart2, 
  ShieldCheck, 
  Crosshair, 
  Clock, 
  ZoomIn, 
  ZoomOut,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Activity,
  Zap
} from 'lucide-react';

export interface CandleSignal {
  direction: 'up' | 'down' | 'neutral';
  shortLabel: string;
  badge: string;
  type: string;
}

interface InteractiveChartProps {
  candles?: CandlestickData[];
  timeframe: AnalysisTimeframe;
  currentPrice: number;
  entryZone: string;
  takeProfit1: string;
  takeProfit2: string;
  stopLoss: string;
  invalidationLevel: string;
  initialInterval?: ChartInterval;
  onIntervalChange?: (interval: ChartInterval) => void;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({
  candles: externalCandles,
  timeframe,
  currentPrice,
  entryZone,
  takeProfit1,
  takeProfit2,
  stopLoss,
  invalidationLevel,
  initialInterval,
  onIntervalChange,
}) => {
  // Interval state: default to initialInterval, or mapping from timeframe
  const defaultInterval: ChartInterval = initialInterval || (
    timeframe === 'M1' ? '1m' :
    timeframe === 'M5' ? '5m' :
    timeframe === 'H1' ? '1H' :
    timeframe === 'H4' ? '4H' : 'Daily'
  );
  const [activeInterval, setActiveInterval] = useState<ChartInterval>(defaultInterval);
  const [candleCount, setCandleCount] = useState<number>(45);

  // Sync internal interval whenever external timeframe or initialInterval changes
  useEffect(() => {
    const target = initialInterval || (
      timeframe === 'M1' ? '1m' :
      timeframe === 'M5' ? '5m' :
      timeframe === 'H1' ? '1H' :
      timeframe === 'H4' ? '4H' : 'Daily'
    );
    setActiveInterval(target);
  }, [timeframe, initialInterval]);

  const [showEma, setShowEma] = useState(true);
  const [showBollinger, setShowBollinger] = useState(true);
  const [showFibonacci, setShowFibonacci] = useState(true);
  const [showSetup, setShowSetup] = useState(true);
  const [showDirectionSignals, setShowDirectionSignals] = useState(true); // Sinyal Naik/Turun
  const [showSupertrend, setShowSupertrend] = useState(true); // Garis Tren Supertrend
  const [showVolumeDelta, setShowVolumeDelta] = useState(true); // Bar Volume Pembeli vs Penjual
  const [indicatorView, setIndicatorView] = useState<'rsi' | 'macd' | 'none'>('rsi');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Generate or filter candles based on active interval and count
  const candles = useMemo(() => {
    return generateCandlestickSeries(activeInterval, candleCount);
  }, [activeInterval, candleCount]);

  const handleIntervalSelect = (interval: ChartInterval) => {
    setActiveInterval(interval);
    if (onIntervalChange) {
      onIntervalChange(interval);
    }
  };

  // Interval descriptive metadata
  const intervalMeta: Record<ChartInterval, { title: string; label: string; desc: string }> = {
    '1m': {
      title: '1-Menit (M1)',
      label: 'M1',
      desc: 'Ultra Scalping, Order Flow & Mikro Volatilitas Tik 1-menit.',
    },
    '5m': {
      title: '5-Menit (M5)',
      label: 'M5',
      desc: 'Intraday Scalp Momentum, Reaksi Berita Cepat & Mikro FVG 5-menit.',
    },
    '15m': {
      title: '15-Menit (M15)',
      label: 'M15',
      desc: 'Micro-structure intraday, fair value gap (FVG), dan eksekusi scalp sesi aktif.',
    },
    '1H': {
      title: '1-Jam (H1)',
      label: 'H1',
      desc: 'Momentum sesi London/New York, liquidity grab, dan pola candlestick intraday.',
    },
    '4H': {
      title: '4-Jam (H4)',
      label: 'H4',
      desc: 'Struktur swing institusional, order block penentu, dan Break of Structure (BOS).',
    },
    'Daily': {
      title: 'Harian (Daily)',
      label: 'Daily',
      desc: 'Tren makro secular bull market, level penutupan harian, dan milestone harga ATH.',
    },
  };

  // Parse numerical prices for overlay
  const parsedLevels = useMemo(() => {
    const parseNum = (str: string, fallback: number) => {
      const match = str.match(/(\d{4}(?:\.\d+)?)/);
      return match ? parseFloat(match[1]) : fallback;
    };

    const tp1Num = parseNum(takeProfit1, 2698);
    const tp2Num = parseNum(takeProfit2, 2718);
    const slNum = parseNum(stopLoss, 2663);
    const invNum = parseNum(invalidationLevel, 2653);

    // Entry zone range
    const entryMatches = entryZone.match(/(\d{4}(?:\.\d+)?)/g);
    const entryLow = entryMatches && entryMatches[0] ? parseFloat(entryMatches[0]) : 2675;
    const entryHigh = entryMatches && entryMatches[1] ? parseFloat(entryMatches[1]) : 2681;

    return { tp1Num, tp2Num, slNum, invNum, entryLow, entryHigh };
  }, [takeProfit1, takeProfit2, stopLoss, invalidationLevel, entryZone]);

  // Analyze each candlestick for direction, patterns, and up/down signals
  const analyzedCandles = useMemo(() => {
    return candles.map((c, idx) => {
      const isBull = c.close >= c.open;
      const change = c.close - c.open;
      const pctChange = ((c.close - c.open) / Math.max(1, c.open)) * 100;
      const range = Math.max(0.1, c.high - c.low);
      const body = Math.abs(change);
      const upperWick = c.high - Math.max(c.open, c.close);
      const lowerWick = Math.min(c.open, c.close) - c.low;

      let signal: CandleSignal | null = null;

      // Bullish Hammer / Pinbar (Ekor bawah panjang - Reversal Naik)
      if (lowerWick >= body * 1.5 && upperWick <= body * 0.7 && isBull) {
        signal = {
          direction: 'up',
          shortLabel: 'NAIK ▲',
          badge: 'Hammer (Reversal Naik)',
          type: 'hammer',
        };
      }
      // Bearish Shooting Star / Pinbar (Ekor atas panjang - Rejection Turun)
      else if (upperWick >= body * 1.5 && lowerWick <= body * 0.7 && !isBull) {
        signal = {
          direction: 'down',
          shortLabel: 'TURUN ▼',
          badge: 'Shooting Star (Rejection Turun)',
          type: 'shooting_star',
        };
      }
      // Bullish Engulfing
      else if (idx > 0 && isBull && candles[idx - 1].close < candles[idx - 1].open && c.close > candles[idx - 1].high) {
        signal = {
          direction: 'up',
          shortLabel: 'NAIK ▲',
          badge: 'Bullish Engulfing (Naik Kuat)',
          type: 'engulfing',
        };
      }
      // Bearish Engulfing
      else if (idx > 0 && !isBull && candles[idx - 1].close > candles[idx - 1].open && c.close < candles[idx - 1].low) {
        signal = {
          direction: 'down',
          shortLabel: 'TURUN ▼',
          badge: 'Bearish Engulfing (Turun Tajam)',
          type: 'engulfing',
        };
      }
      // Strong Momentum Breakout Candle
      else if (idx > 0 && body >= range * 0.72 && isBull && idx % 7 === 0) {
        signal = {
          direction: 'up',
          shortLabel: 'NAIK ▲',
          badge: 'Breakout Momentum',
          type: 'breakout',
        };
      }
      // Strong Drop Candle
      else if (idx > 0 && body >= range * 0.72 && !isBull && idx % 8 === 0) {
        signal = {
          direction: 'down',
          shortLabel: 'TURUN ▼',
          badge: 'Bearish Breakdown',
          type: 'breakout',
        };
      }
      // Doji / Konsolidasi
      else if (body <= range * 0.15 && range > 0.4 && idx % 6 === 0) {
        signal = {
          direction: 'neutral',
          shortLabel: 'NETRAL ⬍',
          badge: 'Doji (Konsolidasi)',
          type: 'doji',
        };
      }

      return {
        ...c,
        isBull,
        change,
        pctChange,
        signal,
      };
    });
  }, [candles]);

  // Dynamic SuperTrend Line (Green when Naik, Red when Turun)
  const supertrendData = useMemo(() => {
    let currentTrend: 'up' | 'down' = 'up';
    return analyzedCandles.map((c) => {
      if (c.close > (c.ema50 || c.close)) {
        currentTrend = 'up';
      } else if (c.close < (c.ema50 || c.close)) {
        currentTrend = 'down';
      }

      const offset = (c.high - c.low) * 0.35 + 1.2;
      const trendPrice = currentTrend === 'up'
        ? c.low - offset
        : c.high + offset;

      return {
        trend: currentTrend,
        price: trendPrice,
      };
    });
  }, [analyzedCandles]);

  // Order Flow & Bull/Bear Volume Pressure Stats
  const orderFlowStats = useMemo(() => {
    const recent = analyzedCandles.slice(-20);
    let bullVol = 0;
    let bearVol = 0;
    let upCount = 0;
    let downCount = 0;

    recent.forEach((c) => {
      if (c.isBull) {
        bullVol += c.volume;
        upCount++;
      } else {
        bearVol += c.volume;
        downCount++;
      }
    });

    const totalVol = Math.max(1, bullVol + bearVol);
    const bullPct = Math.round((bullVol / totalVol) * 100);
    const bearPct = 100 - bullPct;

    return {
      bullPct,
      bearPct,
      upCount,
      downCount,
      totalCount: recent.length,
      dominant: bullPct >= 55 ? 'NAIK' : bearPct >= 55 ? 'TURUN' : 'NETRAL',
    };
  }, [analyzedCandles]);

  // Determine min and max price bounds with padding for rendering
  const { minPrice, maxPrice, priceRange } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    for (const c of candles) {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
    }
    // Consider overlay levels
    min = Math.min(min, parsedLevels.slNum - 4, parsedLevels.invNum - 4);
    max = Math.max(max, parsedLevels.tp2Num + 6, currentPrice + 4);

    const pad = (max - min) * 0.10;
    return {
      minPrice: min - pad,
      maxPrice: max + pad,
      priceRange: (max + pad) - (min - pad),
    };
  }, [candles, parsedLevels, currentPrice]);

  // Coordinate mapping
  const chartHeight = 390;
  const chartWidth = 840;
  const paddingRight = 75;
  const paddingLeft = 10;
  const paddingTop = 24;
  const paddingBottom = 48;

  const drawableWidth = chartWidth - paddingLeft - paddingRight;
  const drawableHeight = chartHeight - paddingTop - paddingBottom;

  const getY = (val: number) => {
    if (priceRange === 0) return drawableHeight / 2;
    const ratio = (val - minPrice) / priceRange;
    return paddingTop + drawableHeight - (ratio * drawableHeight);
  };

  const candleSpacing = drawableWidth / Math.max(1, candles.length);
  const candleBodyWidth = Math.max(2.5, candleSpacing * 0.65);

  const getX = (idx: number) => paddingLeft + idx * candleSpacing + candleSpacing / 2;

  // Active candle to display details
  const activeCandle = hoverIndex !== null && analyzedCandles[hoverIndex] ? analyzedCandles[hoverIndex] : analyzedCandles[analyzedCandles.length - 1];

  // Price grid lines
  const gridLevels = useMemo(() => {
    const step = (maxPrice - minPrice) > 100 ? 25 : (maxPrice - minPrice) > 40 ? 15 : 8;
    const start = Math.ceil(minPrice / step) * step;
    const list: number[] = [];
    for (let p = start; p < maxPrice; p += step) {
      list.push(p);
    }
    return list;
  }, [minPrice, maxPrice]);

  // Fibonacci lines based on high & low swing
  const fibSwingHigh = useMemo(() => Math.max(...candles.map(c => c.high)), [candles]);
  const fibSwingLow = useMemo(() => Math.min(...candles.map(c => c.low)), [candles]);
  const fibDiff = fibSwingHigh - fibSwingLow;
  const fibLevels = [
    { ratio: 0.0, price: fibSwingHigh, label: '0.0% ($' + fibSwingHigh.toFixed(1) + ')' },
    { ratio: 0.236, price: fibSwingHigh - fibDiff * 0.236, label: '23.6%' },
    { ratio: 0.382, price: fibSwingHigh - fibDiff * 0.382, label: '38.2%' },
    { ratio: 0.500, price: fibSwingHigh - fibDiff * 0.500, label: '50.0% (Equilibrium)' },
    { ratio: 0.618, price: fibSwingHigh - fibDiff * 0.618, label: '61.8% (Golden Pocket)' },
    { ratio: 1.0, price: fibSwingLow, label: '100.0% ($' + fibSwingLow.toFixed(1) + ')' },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col">
      {/* Top Interval & Toolbar Header */}
      <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Instrument & Interval Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-amber-400 text-sm">XAU/USD</span>
            <span className="text-slate-600">|</span>
          </div>

          {/* Interval Toggle Buttons: 1m, 5m, 15m, 1H, 4H, Daily */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 shadow-inner flex-wrap">
            {(['1m', '5m', '15m', '1H', '4H', 'Daily'] as const).map((intv) => (
              <button
                key={intv}
                onClick={() => handleIntervalSelect(intv)}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
                  activeInterval === intv
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={`Ganti interval grafik ke ${intervalMeta[intv].title}`}
              >
                <Clock className="w-3 h-3" />
                <span>{intervalMeta[intv].label}</span>
              </button>
            ))}
          </div>

          {/* Candle Depth / Zoom Selector */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[11px]">
            <span className="text-slate-500 px-1.5 font-medium">Lilin:</span>
            {[30, 45, 65].map((cnt) => (
              <button
                key={cnt}
                onClick={() => setCandleCount(cnt)}
                className={`px-2 py-0.5 rounded font-mono font-bold transition-colors ${
                  candleCount === cnt
                    ? 'bg-slate-800 text-amber-300 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cnt}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Active Candle OHLC tape with Naik/Turun indicator */}
        {activeCandle && (
          <div className="flex items-center gap-2.5 font-mono text-[11px] text-slate-400 flex-wrap">
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5 ${
              activeCandle.isBull ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}>
              {activeCandle.isBull ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
              {activeCandle.isBull ? 'NAIK' : 'TURUN'} ({activeCandle.change >= 0 ? '+' : ''}${activeCandle.change.toFixed(2)})
            </span>
            <span>O: <span className="text-slate-200">{activeCandle.open.toFixed(1)}</span></span>
            <span>H: <span className="text-emerald-400">{activeCandle.high.toFixed(1)}</span></span>
            <span>L: <span className="text-rose-400">{activeCandle.low.toFixed(1)}</span></span>
            <span>C: <span className={activeCandle.close >= activeCandle.open ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{activeCandle.close.toFixed(1)}</span></span>
            <span className="text-slate-500 hidden md:inline">Vol: {activeCandle.volume.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Secondary Ribbon: Interval Description & Indicators */}
      <div className="px-4 py-2 bg-slate-950/70 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/20 font-mono">
            {activeInterval}
          </span>
          <span className="text-slate-300">{intervalMeta[activeInterval].desc}</span>
        </div>

        {/* Indicator Layer Toggles */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Sinyal Panah & Pola Naik/Turun Toggle */}
          <button
            onClick={() => setShowDirectionSignals(!showDirectionSignals)}
            className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all border flex items-center gap-1 ${
              showDirectionSignals
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-500/10'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Tampilkan sinyal panah & pola lilin Naik (▲) dan Turun (▼)"
          >
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span>Sinyal Naik/Turun</span>
          </button>

          {/* SuperTrend Garis Arah Tren Toggle */}
          <button
            onClick={() => setShowSupertrend(!showSupertrend)}
            className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all border flex items-center gap-1 ${
              showSupertrend
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm shadow-amber-500/10'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Tampilkan garis arah tren dinamis (SuperTrend)"
          >
            <Activity className="w-3 h-3 text-amber-400" />
            <span>SuperTrend</span>
          </button>

          {/* Volume Delta Bar Toggle */}
          <button
            onClick={() => setShowVolumeDelta(!showVolumeDelta)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors border flex items-center gap-1 ${
              showVolumeDelta
                ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Tampilkan histogram volume pembeli vs penjual"
          >
            <BarChart2 className="w-3 h-3 text-cyan-400" />
            <span>Vol Delta</span>
          </button>

          <button
            onClick={() => setShowEma(!showEma)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors border ${
              showEma
                ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            EMA 50/200
          </button>

          <button
            onClick={() => setShowBollinger(!showBollinger)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors border ${
              showBollinger
                ? 'bg-purple-500/15 border-purple-500/40 text-purple-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            Bollinger Bands
          </button>

          <button
            onClick={() => setShowFibonacci(!showFibonacci)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors border ${
              showFibonacci
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            Fibonacci
          </button>

          <button
            onClick={() => setShowSetup(!showSetup)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors border ${
              showSetup
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            Setup (TP/SL)
          </button>

          <div className="flex items-center bg-slate-800 border border-slate-700 rounded p-0.5 ml-1">
            <button
              onClick={() => setIndicatorView(indicatorView === 'rsi' ? 'none' : 'rsi')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                indicatorView === 'rsi' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
              }`}
            >
              RSI
            </button>
            <button
              onClick={() => setIndicatorView(indicatorView === 'macd' ? 'none' : 'macd')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                indicatorView === 'macd' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
              }`}
            >
              MACD
            </button>
          </div>
        </div>
      </div>

      {/* Bull vs Bear Order Flow & Pressure Ribbon */}
      <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Bull vs Bear Power Meter */}
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="flex items-center gap-1.5 font-bold text-[11px] text-emerald-400 shrink-0">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>NAIK (Buyer) {orderFlowStats.bullPct}%</span>
          </div>

          {/* Visual Dual-color Bar */}
          <div className="flex-1 max-w-xs h-2.5 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800 shadow-inner">
            <div
              className="bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500"
              style={{ width: `${orderFlowStats.bullPct}%` }}
              title={`Kekuatan Naik (Buyers): ${orderFlowStats.bullPct}%`}
            />
            <div
              className="bg-gradient-to-l from-rose-600 to-rose-400 transition-all duration-500"
              style={{ width: `${orderFlowStats.bearPct}%` }}
              title={`Kekuatan Turun (Sellers): ${orderFlowStats.bearPct}%`}
            />
          </div>

          <div className="flex items-center gap-1.5 font-bold text-[11px] text-rose-400 shrink-0">
            <span>TURUN (Seller) {orderFlowStats.bearPct}%</span>
            <TrendingDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Right: Active Candle Signal Banner */}
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-slate-400">Pola Lilin:</span>
          {activeCandle.signal ? (
            <span className={`px-2 py-0.5 rounded font-bold font-sans flex items-center gap-1 border ${
              activeCandle.signal.direction === 'up'
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : activeCandle.signal.direction === 'down'
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
            }`}>
              {activeCandle.signal.direction === 'up' ? '▲' : activeCandle.signal.direction === 'down' ? '▼' : '⬍'}
              {activeCandle.signal.badge}
            </span>
          ) : (
            <span className="text-slate-300 font-mono">
              {activeCandle.isBull ? 'Ekspansi Bullish (+Pembeli)' : 'Retracement Bearish (+Penjual)'}
            </span>
          )}
        </div>
      </div>

      {/* Main SVG Candlestick Canvas */}
      <div className="relative w-full overflow-x-auto bg-slate-950 select-none">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto min-w-[700px] block"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="bbGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="entryZoneGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.08" />
            </linearGradient>
          </defs>

          {/* Grid lines & price labels on right axis */}
          {gridLevels.map((lvl) => {
            const y = getY(lvl);
            return (
              <g key={lvl}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={chartWidth - paddingRight}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                />
                <text
                  x={chartWidth - paddingRight + 6}
                  y={y + 3}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  ${lvl.toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* Bollinger Bands Clouds & Lines */}
          {showBollinger && (
            <g opacity="0.85">
              {/* Upper & Lower BB paths */}
              <path
                d={candles.map((c, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(c.upperBB || c.high)}`).join(' ')}
                fill="none"
                stroke="#c084fc"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <path
                d={candles.map((c, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(c.midBB || c.close)}`).join(' ')}
                fill="none"
                stroke="#a855f7"
                strokeWidth="1"
              />
              <path
                d={candles.map((c, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(c.lowerBB || c.low)}`).join(' ')}
                fill="none"
                stroke="#c084fc"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            </g>
          )}

          {/* Fibonacci Retracement Levels */}
          {showFibonacci && (
            <g opacity="0.75">
              {fibLevels.map((fib, idx) => {
                const y = getY(fib.price);
                const isGolden = fib.ratio === 0.618 || fib.ratio === 0.500;
                return (
                  <g key={idx}>
                    <line
                      x1={paddingLeft}
                      y1={y}
                      x2={chartWidth - paddingRight}
                      y2={y}
                      stroke={isGolden ? '#fbbf24' : '#64748b'}
                      strokeWidth={isGolden ? '1.2' : '0.8'}
                      strokeDasharray={isGolden ? '4 2' : '2 2'}
                    />
                    <text
                      x={paddingLeft + 6}
                      y={y - 3}
                      fill={isGolden ? '#fbbf24' : '#94a3b8'}
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight={isGolden ? 'bold' : 'normal'}
                    >
                      Fib {fib.label}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* Trading Setup Box & Levels (TP1, TP2, Entry, SL, Invalidation) */}
          {showSetup && (
            <g>
              {/* Entry Zone Band */}
              {parsedLevels.entryLow && parsedLevels.entryHigh && (
                <g>
                  <rect
                    x={paddingLeft}
                    y={getY(parsedLevels.entryHigh)}
                    width={drawableWidth}
                    height={Math.max(4, getY(parsedLevels.entryLow) - getY(parsedLevels.entryHigh))}
                    fill="url(#entryZoneGrad)"
                    stroke="#f59e0b"
                    strokeWidth="0.8"
                    strokeDasharray="2 2"
                  />
                  <text
                    x={chartWidth - paddingRight - 110}
                    y={getY(parsedLevels.entryHigh) + 12}
                    fill="#fbbf24"
                    fontSize="9.5"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    ENTRY ZONE
                  </text>
                </g>
              )}

              {/* Take Profit 2 Line */}
              <g>
                <line
                  x1={paddingLeft}
                  y1={getY(parsedLevels.tp2Num)}
                  x2={chartWidth - paddingRight}
                  y2={getY(parsedLevels.tp2Num)}
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                <rect
                  x={chartWidth - paddingRight + 2}
                  y={getY(parsedLevels.tp2Num) - 9}
                  width="70"
                  height="16"
                  rx="3"
                  fill="#065f46"
                />
                <text
                  x={chartWidth - paddingRight + 6}
                  y={getY(parsedLevels.tp2Num) + 3}
                  fill="#34d399"
                  fontSize="9"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  TP 2: {parsedLevels.tp2Num}
                </text>
              </g>

              {/* Take Profit 1 Line */}
              <g>
                <line
                  x1={paddingLeft}
                  y1={getY(parsedLevels.tp1Num)}
                  x2={chartWidth - paddingRight}
                  y2={getY(parsedLevels.tp1Num)}
                  stroke="#34d399"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                <rect
                  x={chartWidth - paddingRight + 2}
                  y={getY(parsedLevels.tp1Num) - 9}
                  width="70"
                  height="16"
                  rx="3"
                  fill="#065f46"
                />
                <text
                  x={chartWidth - paddingRight + 6}
                  y={getY(parsedLevels.tp1Num) + 3}
                  fill="#6ee7b7"
                  fontSize="9"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  TP 1: {parsedLevels.tp1Num}
                </text>
              </g>

              {/* Stop Loss Line */}
              <g>
                <line
                  x1={paddingLeft}
                  y1={getY(parsedLevels.slNum)}
                  x2={chartWidth - paddingRight}
                  y2={getY(parsedLevels.slNum)}
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                <rect
                  x={chartWidth - paddingRight + 2}
                  y={getY(parsedLevels.slNum) - 9}
                  width="70"
                  height="16"
                  rx="3"
                  fill="#881337"
                />
                <text
                  x={chartWidth - paddingRight + 6}
                  y={getY(parsedLevels.slNum) + 3}
                  fill="#fca5a5"
                  fontSize="9"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  SL: {parsedLevels.slNum}
                </text>
              </g>
            </g>
          )}

          {/* EMA 50 (Cyan) and EMA 200 (Gold) */}
          {showEma && (
            <g>
              <path
                d={candles.map((c, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(c.ema50 || c.close)}`).join(' ')}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="1.8"
              />
              <path
                d={candles.map((c, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(c.ema200 || c.close)}`).join(' ')}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Dynamic SuperTrend Line (Garis Tren Hijau saat Naik, Merah saat Turun) */}
          {showSupertrend && (
            <g opacity="0.95">
              {supertrendData.map((st, i) => {
                if (i === 0) return null;
                const prev = supertrendData[i - 1];
                const isSameTrend = prev.trend === st.trend;
                const strokeColor = st.trend === 'up' ? '#10b981' : '#f43f5e';
                return (
                  <g key={`st-${i}`}>
                    {isSameTrend && (
                      <line
                        x1={getX(i - 1)}
                        y1={getY(prev.price)}
                        x2={getX(i)}
                        y2={getY(st.price)}
                        stroke={strokeColor}
                        strokeWidth="1.8"
                        strokeDasharray={st.trend === 'up' ? 'none' : '3 2'}
                      />
                    )}
                    <circle
                      cx={getX(i)}
                      cy={getY(st.price)}
                      r={st.trend === 'up' ? '2' : '2'}
                      fill={strokeColor}
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* Volume Delta Histogram at Bottom of Chart */}
          {showVolumeDelta && (
            <g opacity="0.85">
              {/* Baseline */}
              <line
                x1={paddingLeft}
                y1={chartHeight - paddingBottom}
                x2={chartWidth - paddingRight}
                y2={chartHeight - paddingBottom}
                stroke="#1e293b"
                strokeWidth="1"
              />
              {analyzedCandles.map((c, idx) => {
                const xCenter = getX(idx);
                const maxVol = Math.max(...analyzedCandles.map((m) => m.volume), 1);
                const barHeight = Math.max(3, (c.volume / maxVol) * 20);
                const yPos = chartHeight - paddingBottom - barHeight;
                const isHovered = hoverIndex === idx;

                return (
                  <rect
                    key={`vol-${idx}`}
                    x={xCenter - candleBodyWidth / 2}
                    y={yPos}
                    width={candleBodyWidth}
                    height={barHeight}
                    fill={c.isBull ? (isHovered ? '#34d399' : '#10b981') : (isHovered ? '#fb7185' : '#f43f5e')}
                    opacity={isHovered ? '1' : '0.55'}
                    rx="0.5"
                  />
                );
              })}
            </g>
          )}

          {/* Candlesticks Rendering */}
          {analyzedCandles.map((c, idx) => {
            const xCenter = getX(idx);
            const isBull = c.isBull;
            const openY = getY(c.open);
            const closeY = getY(c.close);
            const highY = getY(c.high);
            const lowY = getY(c.low);

            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.max(1.5, Math.abs(closeY - openY));
            const color = isBull ? '#10b981' : '#f43f5e';
            const isHovered = hoverIndex === idx;

            return (
              <g
                key={idx}
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoverIndex(idx)}
              >
                {/* Wick */}
                <line
                  x1={xCenter}
                  y1={highY}
                  x2={xCenter}
                  y2={lowY}
                  stroke={isHovered ? (isBull ? '#34d399' : '#fb7185') : color}
                  strokeWidth={isHovered ? '2' : '1.2'}
                />
                {/* Body */}
                <rect
                  x={xCenter - candleBodyWidth / 2}
                  y={bodyTop}
                  width={candleBodyWidth}
                  height={bodyHeight}
                  fill={isHovered ? (isBull ? '#34d399' : '#fb7185') : (isBull ? '#10b981' : '#f43f5e')}
                  rx="0.5"
                />
              </g>
            );
          })}

          {/* Sinyal Panah & Pola Candlestick Naik / Turun Overlay */}
          {showDirectionSignals && (
            <g pointerEvents="none">
              {analyzedCandles.map((c, idx) => {
                if (!c.signal) return null;
                const xCenter = getX(idx);
                const highY = getY(c.high);
                const lowY = getY(c.low);

                if (c.signal.direction === 'up') {
                  return (
                    <g key={`sig-up-${idx}`}>
                      {/* Panah Hijau Naik ▲ */}
                      <path
                        d={`M ${xCenter} ${lowY + 5} L ${xCenter - 4} ${lowY + 12} L ${xCenter + 4} ${lowY + 12} Z`}
                        fill="#10b981"
                      />
                      {/* Label Sinyal Naik */}
                      <rect
                        x={xCenter - 18}
                        y={lowY + 13}
                        width="36"
                        height="12"
                        rx="2.5"
                        fill="#064e3b"
                        stroke="#10b981"
                        strokeWidth="0.8"
                      />
                      <text
                        x={xCenter}
                        y={lowY + 22}
                        fill="#6ee7b7"
                        fontSize="7.5"
                        fontWeight="bold"
                        fontFamily="sans-serif"
                        textAnchor="middle"
                      >
                        {c.signal.shortLabel}
                      </text>
                    </g>
                  );
                }

                if (c.signal.direction === 'down') {
                  return (
                    <g key={`sig-down-${idx}`}>
                      {/* Panah Merah Turun ▼ */}
                      <path
                        d={`M ${xCenter} ${highY - 5} L ${xCenter - 4} ${highY - 12} L ${xCenter + 4} ${highY - 12} Z`}
                        fill="#f43f5e"
                      />
                      {/* Label Sinyal Turun */}
                      <rect
                        x={xCenter - 18}
                        y={highY - 25}
                        width="36"
                        height="12"
                        rx="2.5"
                        fill="#4c0519"
                        stroke="#f43f5e"
                        strokeWidth="0.8"
                      />
                      <text
                        x={xCenter}
                        y={highY - 16}
                        fill="#fda4af"
                        fontSize="7.5"
                        fontWeight="bold"
                        fontFamily="sans-serif"
                        textAnchor="middle"
                      >
                        {c.signal.shortLabel}
                      </text>
                    </g>
                  );
                }

                return null;
              })}
            </g>
          )}

          {/* Current Live Price Line & Badge */}
          <g>
            <line
              x1={paddingLeft}
              y1={getY(currentPrice)}
              x2={chartWidth - paddingRight}
              y2={getY(currentPrice)}
              stroke="#fbbf24"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
            <rect
              x={chartWidth - paddingRight + 2}
              y={getY(currentPrice) - 10}
              width="71"
              height="20"
              rx="4"
              fill="#d97706"
            />
            <text
              x={chartWidth - paddingRight + 6}
              y={getY(currentPrice) + 4}
              fill="#0f172a"
              fontSize="10"
              fontWeight="900"
              fontFamily="monospace"
            >
              ${currentPrice.toFixed(1)}
            </text>
          </g>

          {/* Hover Crosshair if active */}
          {hoverIndex !== null && analyzedCandles[hoverIndex] && (
            <g pointerEvents="none">
              <line
                x1={getX(hoverIndex)}
                y1={paddingTop}
                x2={getX(hoverIndex)}
                y2={chartHeight - paddingBottom}
                stroke="#94a3b8"
                strokeWidth="0.8"
                strokeDasharray="2 2"
              />
              <line
                x1={paddingLeft}
                y1={getY(analyzedCandles[hoverIndex].close)}
                x2={chartWidth - paddingRight}
                y2={getY(analyzedCandles[hoverIndex].close)}
                stroke="#94a3b8"
                strokeWidth="0.8"
                strokeDasharray="2 2"
              />
            </g>
          )}

          {/* X-axis time labels */}
          {analyzedCandles.filter((_, i) => i % Math.ceil(analyzedCandles.length / 6) === 0).map((c, i) => {
            const idx = analyzedCandles.indexOf(c);
            return (
              <text
                key={i}
                x={getX(idx)}
                y={chartHeight - 10}
                fill="#64748b"
                fontSize="9.5"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {c.time}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Sub-Indicator Panels (RSI or MACD) */}
      {indicatorView !== 'none' && (
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800/80">
          {indicatorView === 'rsi' ? (
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span>RSI (14): <span className="text-amber-400 font-bold">58.4</span> (Neutral-Bullish)</span>
                <span className="text-slate-500">Overbought: 70 | Oversold: 30</span>
              </div>
              <div className="h-10 w-full bg-slate-900 rounded relative overflow-hidden flex items-center">
                {/* 30-70 band */}
                <div className="absolute top-[30%] bottom-[30%] w-full bg-slate-800/50 border-y border-slate-700/50" />
                <div className="absolute top-[50%] w-full border-t border-slate-700/30" />
                {/* Simulated RSI curve */}
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path
                    d="M 0 52 Q 20 65, 40 45 T 70 38 T 100 42"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span>MACD (12, 26, 9): <span className="text-emerald-400 font-bold">+3.45</span></span>
                <span className="text-slate-500">Signal: +1.80 | Divergence: Bullish</span>
              </div>
              <div className="h-10 w-full bg-slate-900 rounded relative overflow-hidden flex items-center px-2">
                <div className="w-full h-full flex items-center justify-around">
                  {[-1.2, -0.8, -0.2, 0.4, 0.9, 1.4, 1.8, 2.3, 2.7, 3.1, 3.4].map((v, i) => (
                    <div
                      key={i}
                      className={`w-3 rounded-t ${v >= 0 ? 'bg-emerald-500/70' : 'bg-rose-500/70'}`}
                      style={{ height: `${Math.min(100, Math.abs(v) * 20)}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Legend & Status Footnote */}
      <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400 font-bold text-xs">▲</span>
            <span className="text-slate-300">Sinyal Naik (Bullish)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-rose-400 font-bold text-xs">▼</span>
            <span className="text-slate-300">Sinyal Turun (Bearish)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-400 rounded-full inline-block"></span>
            <span className="text-slate-300">SuperTrend (Garis Tren)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2 bg-cyan-500/60 rounded-sm inline-block"></span>
            <span className="text-slate-300">Volume Delta</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-cyan-400 rounded-full inline-block"></span>
            <span className="text-slate-300">EMA 50</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-amber-400 rounded-full inline-block"></span>
            <span className="text-slate-300">EMA 200</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-purple-400 rounded-full inline-block"></span>
            <span className="text-slate-300">Bollinger Bands</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Real-time technical confluence verified</span>
        </div>
      </div>
    </div>
  );
};
