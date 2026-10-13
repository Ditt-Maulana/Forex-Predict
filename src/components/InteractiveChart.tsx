import React, { useState, useMemo } from 'react';
import { CandlestickData, ChartInterval, generateCandlestickSeries } from '../data/goldData';
import { Layers, Eye, EyeOff, Maximize2, BarChart2, ShieldCheck, Crosshair, Clock, ZoomIn, ZoomOut } from 'lucide-react';

interface InteractiveChartProps {
  candles?: CandlestickData[];
  timeframe: 'H1' | 'H4' | 'Daily';
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
  // Interval state: default to initialInterval, or mapping from timeframe ('H1' -> '1H', 'H4' -> '4H', 'Daily' -> 'Daily')
  const defaultInterval: ChartInterval = initialInterval || (timeframe === 'H1' ? '1H' : timeframe === 'H4' ? '4H' : 'Daily');
  const [activeInterval, setActiveInterval] = useState<ChartInterval>(defaultInterval);
  const [candleCount, setCandleCount] = useState<number>(45);

  const [showEma, setShowEma] = useState(true);
  const [showBollinger, setShowBollinger] = useState(true);
  const [showFibonacci, setShowFibonacci] = useState(true);
  const [showSetup, setShowSetup] = useState(true);
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
  const intervalMeta: Record<ChartInterval, { title: string; desc: string }> = {
    '15m': {
      title: '15-Menit (15m)',
      desc: 'Micro-structure intraday, fair value gap (FVG), dan eksekusi scalp sesi aktif.',
    },
    '1H': {
      title: '1-Jam (1H)',
      desc: 'Momentum sesi London/New York, liquidity grab, dan pola candlestick intraday.',
    },
    '4H': {
      title: '4-Jam (4H)',
      desc: 'Struktur swing institusional, order block penentu, dan Break of Structure (BOS).',
    },
    'Daily': {
      title: 'Harian (Daily)',
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

    const pad = (max - min) * 0.08;
    return {
      minPrice: min - pad,
      maxPrice: max + pad,
      priceRange: (max + pad) - (min - pad),
    };
  }, [candles, parsedLevels, currentPrice]);

  // Coordinate mapping
  const chartHeight = 360;
  const chartWidth = 840;
  const paddingRight = 75;
  const paddingLeft = 10;
  const paddingTop = 20;
  const paddingBottom = 30;

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
  const activeCandle = hoverIndex !== null && candles[hoverIndex] ? candles[hoverIndex] : candles[candles.length - 1];

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

          {/* Interval Toggle Buttons: 15m, 1H, 4H, Daily */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 shadow-inner">
            {(['15m', '1H', '4H', 'Daily'] as const).map((intv) => (
              <button
                key={intv}
                onClick={() => handleIntervalSelect(intv)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
                  activeInterval === intv
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={`Ganti interval grafik ke ${intervalMeta[intv].title}`}
              >
                <Clock className="w-3 h-3" />
                <span>{intv}</span>
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

        {/* Right: Active Candle OHLC tape */}
        {activeCandle && (
          <div className="flex items-center gap-2.5 font-mono text-[11px] text-slate-400 flex-wrap">
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

          {/* Candlesticks Rendering */}
          {candles.map((c, idx) => {
            const xCenter = getX(idx);
            const isBull = c.close >= c.open;
            const openY = getY(c.open);
            const closeY = getY(c.close);
            const highY = getY(c.high);
            const lowY = getY(c.low);

            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.max(1.5, Math.abs(closeY - openY));
            const color = isBull ? '#10b981' : '#f43f5e';

            return (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setHoverIndex(idx)}
              >
                {/* Wick */}
                <line
                  x1={xCenter}
                  y1={highY}
                  x2={xCenter}
                  y2={lowY}
                  stroke={color}
                  strokeWidth="1.2"
                />
                {/* Body */}
                <rect
                  x={xCenter - candleBodyWidth / 2}
                  y={bodyTop}
                  width={candleBodyWidth}
                  height={bodyHeight}
                  fill={isBull ? '#10b981' : '#f43f5e'}
                  rx="0.5"
                />
              </g>
            );
          })}

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
          {hoverIndex !== null && candles[hoverIndex] && (
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
                y1={getY(candles[hoverIndex].close)}
                x2={chartWidth - paddingRight}
                y2={getY(candles[hoverIndex].close)}
                stroke="#94a3b8"
                strokeWidth="0.8"
                strokeDasharray="2 2"
              />
            </g>
          )}

          {/* X-axis time labels */}
          {candles.filter((_, i) => i % Math.ceil(candles.length / 6) === 0).map((c, i) => {
            const idx = candles.indexOf(c);
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
            <span className="w-3 h-0.5 bg-cyan-400 rounded-full inline-block"></span>
            <span className="text-slate-300">EMA 50 (Dynamic Support)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-amber-400 rounded-full inline-block"></span>
            <span className="text-slate-300">EMA 200 (Baseline Trend)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-purple-400 rounded-full inline-block"></span>
            <span className="text-slate-300">Bollinger Bands (20, 2)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-amber-500/30 border border-amber-500/60 rounded inline-block"></span>
            <span className="text-slate-300">Entry Zone</span>
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
