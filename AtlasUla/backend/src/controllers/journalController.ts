import { Request, Response } from 'express';
import { readJournal, writeJournal } from '../config/db';
import { generateJournalSummary } from '../services/geminiService';

export const getJournal = (req: Request, res: Response) => {
  const journal = readJournal();
  res.json(journal);
};

export const saveJournalEntry = (req: Request, res: Response) => {
  const journal = readJournal();
  const entry = req.body;
  if (!entry.id || !entry.title || !entry.content) {
    return res.status(400).json({ error: 'Invalid journal entry.' });
  }
  journal.unshift(entry);
  writeJournal(journal);
  res.status(201).json(entry);
};

export const deleteJournalEntry = (req: Request, res: Response) => {
  const { id } = req.params;
  const journal = readJournal();
  const filtered = journal.filter(e => e.id !== id);
  if (journal.length === filtered.length) {
    return res.status(404).json({ error: 'Entry not found.' });
  }
  writeJournal(filtered);
  res.json({ message: 'Journal entry deleted successfully.' });
};

export const getEntrySummary = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content, highlights } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Missing title or content.' });
  }
  try {
    const summary = await generateJournalSummary(title, content, highlights || []);
    
    // Save summary directly to DB if entry exists
    const journal = readJournal();
    const entryIdx = journal.findIndex(e => e.id === id);
    if (entryIdx !== -1) {
      journal[entryIdx].aiSummary = summary;
      writeJournal(journal);
    }
    res.json({ summary });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'AI summary generation failed.' });
  }
};
