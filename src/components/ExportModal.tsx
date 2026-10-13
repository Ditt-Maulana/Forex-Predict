import React, { useState } from 'react';
import { X, Copy, Check, Printer, FileText, Share2 } from 'lucide-react';
import { AnalysisPayload, AnalysisTimeframe } from '../data/goldData';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AnalysisPayload;
  timeframe: AnalysisTimeframe;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  data,
  timeframe,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const markdownReport = `=====================================================
LAPORAN ANALISIS OBJEKTIF KOMODITAS & FOREX: GOLD (XAU/USD)
TIMEFRAME: [${timeframe}] | TANGGAL: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
=====================================================

1. KONDISI PASAR SAAT INI
- Harga Terkini Gold: ${data.kondisiPasar.hargaTerkini}
- Trend Utama: ${data.kondisiPasar.trendUtama}
- Struktur Pasar: ${data.kondisiPasar.strukturPasar}
- Ringkasan Kondisi: ${data.kondisiPasar.ringkasanKondisi}

-----------------------------------------------------
2. ANALISIS TEKNIKAL
- Support Utama:
  ${data.analisisTeknikal.supportUtama.map(s => `  • ${s}`).join('\n')}
- Resistance Utama:
  ${data.analisisTeknikal.resistanceUtama.map(r => `  • ${r}`).join('\n')}
- Level Psikologis Utama:
  ${data.analisisTeknikal.levelPsikologis.map(p => `  • ${p}`).join('\n')}
- Moving Averages (EMA 50 & 200): ${data.analisisTeknikal.ema50_200}
- Relative Strength Index (RSI 14): ${data.analisisTeknikal.rsi.nilai} (${data.analisisTeknikal.rsi.kondisi}) - ${data.analisisTeknikal.rsi.catatan}
- MACD (12, 26, 9): ${data.analisisTeknikal.macd.histogram} - ${data.analisisTeknikal.macd.status} (${data.analisisTeknikal.macd.catatan})
- Bollinger Bands (20, 2): ${data.analisisTeknikal.bollingerBands}
- Chart Pattern: ${data.analisisTeknikal.chartPattern}
- Fibonacci Levels: ${data.analisisTeknikal.fibonacci}
- Volume & Momentum: ${data.analisisTeknikal.volumeMomentum}

-----------------------------------------------------
3. ANALISIS FUNDAMENTAL & SENTIMENT
- Pengaruh USD Index (DXY): ${data.analisisFundamental.dxyPengaruh}
- Yield Obligasi AS (US 10Y Yield): ${data.analisisFundamental.yield10YTreasury}
- Data Ekonomi Penting & Kebijakan The Fed (FOMC/CPI/NFP): ${data.analisisFundamental.kebijakanFedFOMC}
- Rilis Data Ekonomi: ${data.analisisFundamental.dataEkonomiRilis}
- Geopolitik & Risk Sentiment Safe-Haven: ${data.analisisFundamental.geopolitikSafeHaven}
- Sentimen Permintaan Emas Fisik & Bank Sentral: ${data.analisisFundamental.sentimenEmasFisikBankSentral}

-----------------------------------------------------
4. PREDIKSI & SETUP TRADING
- Bias Utama: ${data.prediksiSetupTrading.biasUtama.toUpperCase()}
- Skenario Paling Mungkin: ${data.prediksiSetupTrading.skenarioPalingMungkin}
- Entry Zone Ideal: ${data.prediksiSetupTrading.entryZone}
- Take Profit 1: ${data.prediksiSetupTrading.takeProfit1}
- Take Profit 2: ${data.prediksiSetupTrading.takeProfit2}
- Stop Loss: ${data.prediksiSetupTrading.stopLoss}
- Risk-Reward Ratio (RRR): ${data.prediksiSetupTrading.riskRewardRatio}
- Invalidation Level: ${data.prediksiSetupTrading.invalidationLevel}
- Alasan Setup (Rationale): ${data.prediksiSetupTrading.alasanSetup}

-----------------------------------------------------
5. MANAJEMEN RISIKO & CATATAN PENTING
- Persentase Risiko Disarankan: ${data.manajemenRisiko.persentaseRisiko}
- Tingkat Keyakinan Prediksi: ${data.manajemenRisiko.tingkatKeyakinan}
- Kondisi Pasar Berisiko Tinggi:
  ${data.manajemenRisiko.kondisiRisikoTinggi.map(k => `  • ${k}`).join('\n')}
- Catatan Penting & Protokol Eksekusi: ${data.manajemenRisiko.catatanPenting}

-----------------------------------------------------
6. ANALISIS FUNDAMENTAL TERKAIT LOGIKA PERGERAKAN HARGA EMAS SAAT INI
- Rangkuman Logika: ${data.logikaPergerakanHarga.rangkumanLogika}
- Faktor Pendorong Utama: ${data.logikaPergerakanHarga.faktorPendorongUtama}
- Risiko Pembalikan Tren: ${data.logikaPergerakanHarga.risikoPembalikan}
=====================================================
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Ekspor & Salin Laporan Analisis Emas (XAU/USD)</h3>
              <p className="text-xs text-slate-400">Format teks terstruktur profesional siap cetak / bagikan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Preview */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed select-all">
            {markdownReport}
          </pre>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Berisi 6 poin lengkap sesuai standar komoditas & forex profesional.
          </span>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Laporan</span>
            </button>

            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-amber-500/20"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Berhasil Disalin!' : 'Salin Teks Lengkap'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
