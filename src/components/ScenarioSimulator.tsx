import React, { useState } from 'react';
import { Layers, TrendingUp, TrendingDown, RefreshCw, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

interface ScenarioSimulatorProps {
  currentPrice: number;
  timeframe: 'H1' | 'H4' | 'Daily';
  entryZone: string;
  tp1: string;
  tp2: string;
  sl: string;
  invalidation: string;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  currentPrice,
  timeframe,
  entryZone,
  tp1,
  tp2,
  sl,
  invalidation,
}) => {
  const [activeTab, setActiveTab] = useState<'A' | 'B' | 'C'>('A');

  const scenarios = {
    A: {
      title: 'Skenario A: Bullish Continuation & Breakout',
      probability: '65%',
      badge: 'SKENARIO UTAMA (PRIMARY)',
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      pemicu: `Harga melakukan pullback sehat ke zona entry ${entryZone}, membentuk rejection candle di H1/H4 (pinbar/engulfing), lalu breakout menembus resistensi psikologis $2,700.00.`,
      target: `${tp1} (Target 1) disusul ekspansi ke ${tp2} (Target 2).`,
      proteksi: `Stop loss disiplin di ${sl}.`,
      tindakanTrader: 'Eksekusi Buy on Dip pada zona entry. Jangan mengejar harga (fomo) jika sudah menembus $2,700 tanpa retest.',
      katalis: 'Pelemahan lanjutan DXY di bawah 102.50 dan penurunan yield US 10Y menuju 4.00% pasca rilis data ekonomi AS.',
    },
    B: {
      title: 'Skenario B: Konsolidasi Sideways & Liquidity Grab',
      probability: '25%',
      badge: 'SKENARIO ALTERNATIF (RANGE)',
      badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      pemicu: 'Harga gagal menembus $2,700.00 dan tertahan berulang kali di rentang $2,668.00 - $2,698.00 menjelang rilis berita high-impact.',
      target: 'Rotasi bolak-balik antara floor support $2,670 dan ceiling resistance $2,698.',
      proteksi: 'Hindari menahan posisi swing; gunakan target take-profit cepat 1:1.5.',
      tindakanTrader: 'Pilih strategi Range-Bound: Buy di dekat support $2,670 dan Sell cepat di dekat $2,695 dengan stop ketat di luar rentang.',
      katalis: 'Pasar bersikap "wait and see" menantikan pidato ketua The Fed atau rilis data ketenagakerjaan utama.',
    },
    C: {
      title: 'Skenario C: Deep Mean-Reversion / Invalidation',
      probability: '10%',
      badge: 'SKENARIO RISK OF REVERSAL',
      badgeColor: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      pemicu: `Terjadi penembusan ke bawah level penentu ${invalidation} dengan volume institusional besar (Break of Structure Bearish).`,
      target: 'Koreksi likuiditas yang lebih dalam menuju area base $2,630.00 - $2,610.00 (EMA 200).',
      proteksi: 'Semua posisi BUY wajib di-cut loss tanpa toleransi.',
      tindakanTrader: 'Batalkan setup buy. Tunggu konfirmasi pola retest di bawah support yang jebol untuk opsi short selling atau tunggu pembentukan base baru di $2,630.',
      katalis: 'Lonjakan inflasi kejutan di atas konsensus atau sinyal hawkish tak terduga dari The Fed yang mendongkrak DXY di atas 104.00.',
    },
  };

  const current = scenarios[activeTab];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Simulator Skenario & Invalidation Radar</h3>
            <p className="text-xs text-slate-400">Peta jalan antisipasi multi-skenario jika kondisi pasar berubah</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {(['A', 'B', 'C'] as const).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setActiveTab(tabKey)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeTab === tabKey
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tabKey === 'A' ? 'Skenario A (65%)' : tabKey === 'B' ? 'Skenario B (25%)' : 'Skenario C (10%)'}
            </button>
          ))}
        </div>
      </div>

      {/* Scenario Detail Card */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
            {current.title}
          </h4>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${current.badgeColor}`}>
              {current.badge}
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-800 text-white">
              Probabilitas: {current.probability}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-1">
            <span className="font-bold text-amber-400 uppercase text-[11px] block">Pemicu Teknis (Trigger):</span>
            <p className="text-slate-300 leading-relaxed">{current.pemicu}</p>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-1">
            <span className="font-bold text-cyan-400 uppercase text-[11px] block">Katalis Pasar (Market Drivers):</span>
            <p className="text-slate-300 leading-relaxed">{current.katalis}</p>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-1">
            <span className="font-bold text-emerald-400 uppercase text-[11px] block">Ekspektasi Target:</span>
            <p className="text-slate-300 leading-relaxed">{current.target}</p>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-1">
            <span className="font-bold text-rose-400 uppercase text-[11px] block">Batas Risiko & Proteksi:</span>
            <p className="text-slate-300 leading-relaxed">{current.proteksi}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
          <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300 font-semibold">Tindakan Trader yang Direkomendasikan: </strong>
            <span>{current.tindakanTrader}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
