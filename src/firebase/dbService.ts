import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './config';
import { handleFirestoreError, OperationType } from './errorHandler';

export interface SavedAnalysisRecord {
  id: string;
  userId: string;
  timeframe: string;
  title: string;
  goldPrice: number;
  bias: 'Bullish' | 'Bearish' | 'Neutral';
  entryZone: string;
  stopLoss: string;
  takeProfit1: string;
  takeProfit2: string;
  riskRewardRatio: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TradeJournalRecord {
  id: string;
  userId: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  lotSize: number;
  pnl?: number;
  status: 'OPEN' | 'TP_HIT' | 'SL_HIT' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

// -------------------------------------------------------------
// SAVED ANALYSES
// -------------------------------------------------------------

export async function saveAnalysisToFirestore(userId: string, data: Omit<SavedAnalysisRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const id = `analysis_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const path = `users/${userId}/savedAnalyses/${id}`;
  const now = new Date().toISOString();

  const record: SavedAnalysisRecord = {
    ...data,
    id,
    userId,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await setDoc(doc(db, 'users', userId, 'savedAnalyses', id), record);
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export function subscribeUserSavedAnalyses(
  userId: string,
  onUpdate: (items: SavedAnalysisRecord[]) => void,
  onError?: (err: Error) => void
) {
  const path = `users/${userId}/savedAnalyses`;
  const q = query(collection(db, 'users', userId, 'savedAnalyses'));

  return onSnapshot(
    q,
    (snapshot) => {
      const list: SavedAnalysisRecord[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as SavedAnalysisRecord);
      });
      // Sort newest first
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(list);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function deleteSavedAnalysis(userId: string, analysisId: string): Promise<void> {
  const path = `users/${userId}/savedAnalyses/${analysisId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'savedAnalyses', analysisId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// -------------------------------------------------------------
// TRADE JOURNAL
// -------------------------------------------------------------

export async function addTradeJournalEntry(
  userId: string,
  data: Omit<TradeJournalRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const id = `trade_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const path = `users/${userId}/tradeJournal/${id}`;
  const now = new Date().toISOString();

  const record: TradeJournalRecord = {
    ...data,
    id,
    userId,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await setDoc(doc(db, 'users', userId, 'tradeJournal', id), record);
    return id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export function subscribeUserTradeJournal(
  userId: string,
  onUpdate: (items: TradeJournalRecord[]) => void,
  onError?: (err: Error) => void
) {
  const path = `users/${userId}/tradeJournal`;
  const q = query(collection(db, 'users', userId, 'tradeJournal'));

  return onSnapshot(
    q,
    (snapshot) => {
      const list: TradeJournalRecord[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as TradeJournalRecord);
      });
      // Sort newest first
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onUpdate(list);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function updateTradeJournalStatus(
  userId: string,
  tradeId: string,
  status: TradeJournalRecord['status'],
  pnl?: number
): Promise<void> {
  const path = `users/${userId}/tradeJournal/${tradeId}`;
  try {
    const updatePayload: any = {
      status,
      updatedAt: new Date().toISOString(),
    };
    if (pnl !== undefined) updatePayload.pnl = pnl;

    await setDoc(doc(db, 'users', userId, 'tradeJournal', tradeId), updatePayload, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function deleteTradeJournalEntry(userId: string, tradeId: string): Promise<void> {
  const path = `users/${userId}/tradeJournal/${tradeId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'tradeJournal', tradeId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}
