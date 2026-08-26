import { Router } from 'express';
import { 
  getTrips, 
  generatePlan, 
  saveTrip, 
  deleteTrip, 
  logExpense, 
  deleteExpense, 
  togglePackingItem, 
  addPackingItem, 
  deletePackingItem, 
  updateBudgetTotal 
} from '../controllers/tripController';
import { 
  getJournal, 
  saveJournalEntry, 
  deleteJournalEntry, 
  getEntrySummary 
} from '../controllers/journalController';
import { 
  getProfile, 
  updateProfileDetails, 
  gainXP, 
  unlockAchievement, 
  tickStreak, 
  completeTrip 
} from '../controllers/profileController';
import { handleChatMessage } from '../controllers/chatController';

const router = Router();

// --- Trips Endpoints ---
router.get('/trips', getTrips);
router.post('/trips/generate', generatePlan);
router.post('/trips', saveTrip);
router.delete('/trips/:id', deleteTrip);
router.post('/trips/:id/expenses', logExpense);
router.delete('/trips/:id/expenses/:expId', deleteExpense);
router.put('/trips/:id/packing/:itemId/toggle', togglePackingItem);
router.post('/trips/:id/packing', addPackingItem);
router.delete('/trips/:id/packing/:itemId', deletePackingItem);
router.put('/trips/:id/budget', updateBudgetTotal);

// --- Journal Endpoints ---
router.get('/journal', getJournal);
router.post('/journal', saveJournalEntry);
router.delete('/journal/:id', deleteJournalEntry);
router.post('/journal/:id/summary', getEntrySummary);

// --- Profile & Gamification Endpoints ---
router.get('/profile', getProfile);
router.put('/profile', updateProfileDetails);
router.post('/profile/xp', gainXP);
router.post('/profile/streak', tickStreak);
router.post('/profile/achievement/:id', unlockAchievement);
router.post('/profile/complete-trip', completeTrip);

// --- Chat Endpoints ---
router.post('/chat', handleChatMessage);

export default router;
