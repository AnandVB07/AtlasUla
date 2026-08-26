import { Request, Response } from 'express';
import { readTrips, writeTrips } from '../config/db';
import { generateAITrip } from '../services/geminiService';

export const getTrips = (req: Request, res: Response) => {
  const trips = readTrips();
  res.json(trips);
};

export const generatePlan = async (req: Request, res: Response) => {
  try {
    const { destination, days, budgetTier, travelType, interests, travelStyle } = req.body;
    if (!destination || !days) {
      return res.status(400).json({ error: 'Missing destination or duration days.' });
    }
    const plan = await generateAITrip({
      destination,
      days: Number(days),
      budgetTier: budgetTier || 'moderate',
      travelType: travelType || 'solo',
      interests: interests || [],
      travelStyle: travelStyle || 'balanced'
    });
    res.json(plan);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Generation failed' });
  }
};

export const saveTrip = (req: Request, res: Response) => {
  const trips = readTrips();
  const newTrip = req.body;
  if (!newTrip.id || !newTrip.destination) {
    return res.status(400).json({ error: 'Invalid trip payload.' });
  }
  trips.push(newTrip);
  writeTrips(trips);
  res.status(201).json(newTrip);
};

export const deleteTrip = (req: Request, res: Response) => {
  const { id } = req.params;
  const trips = readTrips();
  const filtered = trips.filter(t => t.id !== id);
  if (trips.length === filtered.length) {
    return res.status(404).json({ error: 'Trip not found.' });
  }
  writeTrips(filtered);
  res.json({ message: 'Trip deleted successfully.' });
};

export const logExpense = (req: Request, res: Response) => {
  const { id } = req.params;
  const expense = req.body;
  if (!expense.id || !expense.title || !expense.amount) {
    return res.status(400).json({ error: 'Invalid expense payload.' });
  }
  const trips = readTrips();
  const tripIdx = trips.findIndex(t => t.id === id);
  if (tripIdx === -1) {
    return res.status(404).json({ error: 'Trip not found.' });
  }
  trips[tripIdx].expenses = [expense, ...trips[tripIdx].expenses];
  writeTrips(trips);
  res.json(trips[tripIdx]);
};

export const deleteExpense = (req: Request, res: Response) => {
  const { id, expId } = req.params;
  const trips = readTrips();
  const tripIdx = trips.findIndex(t => t.id === id);
  if (tripIdx === -1) {
    return res.status(404).json({ error: 'Trip not found.' });
  }
  trips[tripIdx].expenses = trips[tripIdx].expenses.filter((e: any) => e.id !== expId);
  writeTrips(trips);
  res.json(trips[tripIdx]);
};

export const togglePackingItem = (req: Request, res: Response) => {
  const { id, itemId } = req.params;
  const trips = readTrips();
  const tripIdx = trips.findIndex(t => t.id === id);
  if (tripIdx === -1) {
    return res.status(404).json({ error: 'Trip not found.' });
  }
  trips[tripIdx].packingList = trips[tripIdx].packingList.map((item: any) => {
    if (item.id === itemId) {
      return { ...item, packed: !item.packed };
    }
    return item;
  });
  writeTrips(trips);
  res.json(trips[tripIdx]);
};

export const addPackingItem = (req: Request, res: Response) => {
  const { id } = req.params;
  const item = req.body;
  if (!item.id || !item.name) {
    return res.status(400).json({ error: 'Invalid packing item.' });
  }
  const trips = readTrips();
  const tripIdx = trips.findIndex(t => t.id === id);
  if (tripIdx === -1) {
    return res.status(404).json({ error: 'Trip not found.' });
  }
  trips[tripIdx].packingList.push(item);
  writeTrips(trips);
  res.json(trips[tripIdx]);
};

export const deletePackingItem = (req: Request, res: Response) => {
  const { id, itemId } = req.params;
  const trips = readTrips();
  const tripIdx = trips.findIndex(t => t.id === id);
  if (tripIdx === -1) {
    return res.status(404).json({ error: 'Trip not found.' });
  }
  trips[tripIdx].packingList = trips[tripIdx].packingList.filter((item: any) => item.id !== itemId);
  writeTrips(trips);
  res.json(trips[tripIdx]);
};

export const updateBudgetTotal = (req: Request, res: Response) => {
  const { id } = req.params;
  const { total } = req.body;
  if (!total || isNaN(Number(total))) {
    return res.status(400).json({ error: 'Invalid total budget.' });
  }
  const trips = readTrips();
  const tripIdx = trips.findIndex(t => t.id === id);
  if (tripIdx === -1) {
    return res.status(404).json({ error: 'Trip not found.' });
  }
  const numTotal = Number(total);
  trips[tripIdx].budget = {
    total: numTotal,
    Hotel: Math.round(numTotal * 0.45),
    Food: Math.round(numTotal * 0.25),
    Transport: Math.round(numTotal * 0.12),
    Shopping: Math.round(numTotal * 0.08),
    Emergency: Math.round(numTotal * 0.05),
    Entertainment: Math.round(numTotal * 0.05),
  };
  writeTrips(trips);
  res.json(trips[tripIdx]);
};
