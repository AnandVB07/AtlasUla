import { Request, Response } from 'express';
import { getAIChatResponse } from '../services/geminiService';

export const handleChatMessage = async (req: Request, res: Response) => {
  const { message, context } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message content is required.' });
  }
  try {
    const aiResponse = await getAIChatResponse(message, context);
    res.json({ response: aiResponse });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Chat generation failed.' });
  }
};
