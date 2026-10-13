import React, { useState, useEffect } from 'react';
import { X, Bookmark, Trash2, Calendar, TrendingUp, TrendingDown, Target, ShieldCheck, Check, Plus, DollarSign } from 'lucide-react';
import { useAuth } from '../firebase/AuthContext';
import { 
  subscribeUserSavedAnalyses, 
  deleteSavedAnalysis, 
  SavedAnalysisRecord,
  subscribeUserTradeJournal,
  addTradeJournalEntry,
  deleteTradeJournalEntry,
  updateTradeJournalStatus,
  TradeJournalRecord
} from '../firebase/dbService';

interface SavedSetupsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySetup?: (setup: SavedAnalysisRecord) => void;
}

export const SavedSetupsModal: React.FC<SavedSetupsModalProps> = ({
  isOpen,
  onClose,
  onApplySetup,
}) => {
  const { user, signInWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState<'analyses' | 'journal'>('analyses');
  const [savedList, setSavedList] = useState<SavedAnalysisRecord[]>([]);
  const [journalList, setJournalList] = useState<TradeJournalRecord[]>([]);
  const [isAddingTrade, setIsAddingTrade] = useState<boolean>(false);

  // New trade form state
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [tradeEntry, setTradeEntry] = useState<number>(2684.50);
  const [tradeSl, setTradeSl] = useState<number>(2670.00);
  const [tradeTp, setTradeTp] = useState<number>(2710.00);
  const [tradeLot, setTradeLot] = useState<number>(0.10);

  useEffect(() => {
    if (!user) {
      setSavedList([]);
      setJournalList([]);
      return;
    }

    const unsubAnalyses = subscribeUserSavedAnalyses(user.uid, (items) => {
      setSavedList(items);
    });

    const unsubJournal = subscribeUserTradeJournal(user.uid, (items) => {
      setJournalList(items);
    });

    return () => {
      unsubAnalyses();
      unsubJournal();
    };
  }, [user]);

  if (!isOpen) return null;

  const handleDeleteAnalysis = async (id: string) => {
    if (!user) return;
    try {
      await deleteSavedAnalysis(user.uid, id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTrade = async (id: string) => {
    if (!user) return;
    try {
      await deleteTradeJournalEntry(user.uid, id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateStatus = async (id: string, status: TradeJournalRecord['status'], pnl?: number) => {
    if (!user) return;
    try {
      await updateTradeJournalStatus(user.uid, id, status, pnl);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await addTradeJournalEntry(user.uid, {
        type: tradeType,
        entryPrice: tradeEntry,
        stopLoss: tradeSl,
        takeProfit: tradeTp,
        lotSize: tradeLot,
        status: 'OPEN',
      });
      setIsAddingTrade(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Database Cloud & Jurnal Trading XAU/USD</h3>
              <p className="text-xs text-slate-400">Tersinkronisasi otomatis dengan Google Firestore</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth prompt if not logged in */}
        {!user ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h4 className="text-base font-bold text-white">Masuk dengan Akun Google</h4>
              <p className="text-xs text-slate-400">
                Hubungkan akun Google Anda untuk menyimpan setup analisis, mencatat jurnal trading, dan mengakses data dari perangkat mana pun.
              </p>
            </div>
            <button
              onClick={() => signInWithGoogle()}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-amber-500/20"
            >
              Masuk dengan Google
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="px-6 pt-3 bg-slate-950/60 border-b border-slate-800 flex items-center gap-4 text-xs">
              <button
                onClick={() => setActiveTab('analyses')}
                className={`pb-2.5 font-bold transition-all border-b-2 ${
                  activeTab === 'analyses'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Setup Pasar Tersimpan ({savedList.length})
              </button>
              <button
                onClick={() => setActiveTab('journal')}
                className={`pb-2.5 font-bold transition-all border-b-2 ${
                  activeTab === 'journal'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Jurnal Posisi Trading ({journalList.length})
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
              {activeTab === 'analyses' ? (
                savedList.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    Belum ada setup analisis yang disimpan. Klik tombol "Simpan Setup ke Cloud" pada bagian prediksi pasar untuk menyimpan.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedList.map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-amber-500/30 transition-all"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              item.bias === 'Bullish'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : item.bias === 'Bearish'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            }`}>
                              {item.bias}
                            </span>
                            <span className="text-xs font-bold text-white">{item.title}</span>
                            <span className="text-[10px] text-slate-500 font-mono">[{item.timeframe}]</span>
                          </div>
                          <div className="text-xs text-slate-400 flex items-center gap-3 font-mono">
                            <span>Entry: <strong className="text-amber-300">{item.entryZone}</strong></span>
                            <span>SL: <strong className="text-rose-400">{item.stopLoss}</strong></span>
                            <span>TP1: <strong className="text-emerald-400">{item.takeProfit1}</strong></span>
                            <span>R:R: <strong className="text-cyan-300">{item.riskRewardRatio}</strong></span>
                          </div>
                          {item.notes && (
                            <p className="text-[11px] text-slate-400 italic mt-1">"{item.notes}"</p>
                          )}
                          <span className="text-[10px] text-slate-600 block">
                            Disimpan pada: {new Date(item.createdAt).toLocaleString('id-ID')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {onApplySetup && (
                            <button
                              onClick={() => {
                                onApplySetup(item);
                                onClose();
                              }}
                              className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors"
                            >
                              Terapkan
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAnalysis(item.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                /* Trading Journal Tab */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">
                      Catat riwayat dan performa eksekusi trading Gold Anda
                    </span>
                    <button
                      onClick={() => setIsAddingTrade(!isAddingTrade)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isAddingTrade ? 'Tutup Form' : 'Catat Posisi Baru'}</span>
                    </button>
                  </div>

                  {/* Add Trade Form */}
                  {isAddingTrade && (
                    <form onSubmit={handleCreateTrade} className="bg-slate-950 border border-amber-500/30 rounded-xl p-4 space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Tipe</label>
                          <select
                            value={tradeType}
                            onChange={(e) => setTradeType(e.target.value as any)}
                            className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs font-bold text-white"
                          >
                            <option value="BUY">BUY (Long)</option>
                            <option value="SELL">SELL (Short)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Entry Price ($)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={tradeEntry}
                            onChange={(e) => setTradeEntry(parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs font-mono text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Stop Loss ($)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={tradeSl}
                            onChange={(e) => setTradeSl(parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs font-mono text-rose-400"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Take Profit ($)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={tradeTp}
                            onChange={(e) => setTradeTp(parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs font-mono text-emerald-400"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Ukuran Lot</label>
                          <input
                            type="number"
                            step="0.01"
                            value={tradeLot}
                            onChange={(e) => setTradeLot(parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs font-mono text-amber-300"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-850">
                        <button
                          type="button"
                          onClick={() => setIsAddingTrade(false)}
                          className="px-3 py-1.5 rounded text-xs text-slate-400 hover:text-white"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                        >
                          Simpan Posisi
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Journal List */}
                  {journalList.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-xs">
                      Belum ada catatan jurnal trading. Catat posisi terbuka Anda untuk melacak disiplin trading.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {journalList.map((trade) => (
                        <div
                          key={trade.id}
                          className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`px-2.5 py-1 rounded font-black font-mono text-xs ${
                              trade.type === 'BUY'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            }`}>
                              {trade.type}
                            </span>
                            <div className="space-y-0.5">
                              <div className="font-mono text-slate-200">
                                Entry: <strong className="text-white">${trade.entryPrice.toFixed(2)}</strong> ({trade.lotSize} Lots)
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono">
                                SL: ${trade.stopLoss.toFixed(2)} | TP: ${trade.takeProfit.toFixed(2)}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              trade.status === 'OPEN'
                                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                                : trade.status === 'TP_HIT'
                                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                                : 'bg-slate-800 text-slate-400'
                            }`}>
                              {trade.status}
                            </span>

                            {trade.status === 'OPEN' && (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleUpdateStatus(trade.id, 'TP_HIT', 250)}
                                  className="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold"
                                >
                                  Hit TP
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(trade.id, 'SL_HIT', -150)}
                                  className="px-2 py-0.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[10px] font-bold"
                                >
                                  Hit SL
                                </button>
                              </div>
                            )}

                            <button
                              onClick={() => handleDeleteTrade(trade.id)}
                              className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
