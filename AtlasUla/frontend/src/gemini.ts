import { GoogleGenerativeAI } from '@google/generative-ai';
import { MOCK_ITINERARY_TEMPLATES } from './utils/mockData';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let aiModel: any = null;

if (apiKey) {
  try {
    const ai = new GoogleGenerativeAI(apiKey);
    aiModel = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
  } catch (error) {
    console.error('Gemini API initialization failed:', error);
  }
}

// Check if Gemini is configured
export const isGeminiConfigured = !!aiModel;

// Helper to clean Markdown JSON formatting from Gemini output
function cleanJsonResponse(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  return cleaned.trim();
}

/**
 * Generate a complete trip itinerary based on user inputs.
 */
export async function generateAITrip(params: {
  destination: string;
  days: number;
  budgetTier: 'budget' | 'moderate' | 'luxury';
  travelType: string;
  interests: string[];
  travelStyle: string;
}): Promise<any> {
  const { destination, days, budgetTier, travelType, interests, travelStyle } = params;

  if (isGeminiConfigured) {
    try {
      const prompt = `
        You are AtlasUla, a premium AI Travel Companion.
        Generate a comprehensive JSON travel itinerary for a ${days}-day trip to ${destination}.
        
        Trip Details:
        - Budget Tier: ${budgetTier} (budget: low cost/free items, moderate: mid range, luxury: premium/high end)
        - Travel Type: ${travelType} (solo, couple, family, friends)
        - Interests: ${interests.join(', ')}
        - Travel Style: ${travelStyle}
        
        Response Format (MUST BE PURE JSON, DO NOT ADD ANY MARKDOWN FORMATTING OUTSIDE THE JSON STRUCTURE):
        {
          "destination": "${destination}",
          "safetyScore": 85, // out of 100
          "aiTravelTips": ["Tip 1", "Tip 2", "Tip 3"],
          "budgetDistribution": {
            "Hotel": 0.45, // percentage of budget
            "Food": 0.25,
            "Transport": 0.12,
            "Shopping": 0.08,
            "Emergency": 0.05,
            "Entertainment": 0.05
          },
          "packingSuggestions": [
            { "name": "Item Name", "category": "Essentials|Clothing|Toiletries|Electronics|Activities|Other", "weatherSensitive": false }
          ],
          "itinerary": [
            {
              "dayNumber": 1,
              "title": "Day theme/title",
              "morning": {
                "title": "Activity name",
                "description": "Short details",
                "cost": 15, // in USD
                "duration": "2 hours"
              },
              "afternoon": {
                "title": "Activity name",
                "description": "Short details",
                "cost": 25,
                "duration": "3 hours"
              },
              "evening": {
                "title": "Activity name",
                "description": "Short details",
                "cost": 40,
                "duration": "3 hours"
              },
              "estimatedCost": 80,
              "travelTime": "1 hour total travel",
              "alternativePlan": "Alternative backup activity description"
            }
          ]
        }
      `;

      const result = await aiModel.generateContent(prompt);
      const text = result.response.text();
      const cleaned = cleanJsonResponse(text);
      return JSON.parse(cleaned);
    } catch (error) {
      console.error('Gemini Trip Generation failed, falling back to mock:', error);
    }
  }

  // MOCK FALLBACK SYSTEM
  return generateMockTrip(destination, days, budgetTier, travelType, interests, travelStyle);
}

/**
 * Generate a smart response for the chat assistant.
 */
export async function getAIChatResponse(
  message: string,
  context?: { destination?: string; activeTrip?: any }
): Promise<string> {
  const cleanMsg = message.toLowerCase();

  if (isGeminiConfigured) {
    try {
      const activeTripInfo = context?.activeTrip 
        ? `User is currently planning a trip to ${context.activeTrip.destination} for ${context.activeTrip.days} days.` 
        : '';
      
      const prompt = `
        You are AtlasUla, a highly intelligent, empathetic, and premium travel companion.
        Context: ${activeTripInfo}
        The user is asking: "${message}"
        Provide a concise, helpful, and inspiring response. Suggest restaurants, clothing advice, tips, or itinerary adjustments where relevant.
        Keep it formatting in beautiful markdown.
      `;
      const result = await aiModel.generateContent(prompt);
      return result.response.text();
    } catch (e) {
      console.error('Gemini Chat failed:', e);
    }
  }

  // Heuristic mock responses
  if (cleanMsg.includes('hello') || cleanMsg.includes('hi ')) {
    return `Hey there! ✈️ I'm **AtlasUla**, your AI Travel Companion. Where are we heading next, or how can I help you refine your current adventure?`;
  }
  if (cleanMsg.includes('weather') || cleanMsg.includes('wear') || cleanMsg.includes('pack')) {
    const dest = context?.destination || 'your destination';
    return `For **${dest}**, I highly recommend packing in layers.
- Check out the **Weather Tab** to see the 5-day outlook.
- Make sure to pack comfortable walking shoes, a power bank, and a light jacket.
- If it predicts rain, AtlasUla will automatically tag weather-sensitive checklist items in your **Packing Assistant**!`;
  }
  if (cleanMsg.includes('budget') || cleanMsg.includes('expensive') || cleanMsg.includes('cost')) {
    return `Staying on budget is an art! 💳
- I've divided your budget into categories (Lodging, Dinings, Transit). 
- Open the **Budget Planner** to log your expenses.
- *AI Insight*: Street food and public transit are your best friends to keep costs low. Try to set aside an emergency fund of 5-10% of your total budget.`;
  }
  if (cleanMsg.includes('restaurant') || cleanMsg.includes('eat') || cleanMsg.includes('food')) {
    const dest = context?.destination || 'your destination';
    return `Here are some culinary tips for **${dest}**:
- Seek out small alleys and local stalls with lines—they're usually the best value and taste!
- Check out the **Restaurants Tab** to discover local hidden gems, vegetarian spots, and top-rated eateries nearby.
- Be sure to try the local specialty (e.g. Crepes in Paris, Ramen in Tokyo, Gelato in Rome).`;
  }
  if (cleanMsg.includes('scam') || cleanMsg.includes('safe') || cleanMsg.includes('danger')) {
    return `Safety first! 🛡️ I recommend checking the **Safety Center** page:
- It lists common local scams (like the friendship bracelet trick, or unregistered taxis).
- Keep copy of your passport in your Firebase Travel Vault.
- Know the local emergency number (e.g., 112 in Europe, 110 in Japan).`;
  }
  if (cleanMsg.includes('summarize') || cleanMsg.includes('journal') || cleanMsg.includes('memories')) {
    return `Reflecting on your journey is a great way to seal travel memories! 📖
- Head over to the **Travel Journal** to log your mood, add highlights, and upload travel photos.
- Click 'Generate AI Summary' inside the journal to get an automated emotional highlight reel of your trip!`;
  }

  const destination = context?.destination || 'your destination';
  return `That sounds like a wonderful plan! Visiting **${destination}** offers incredible sightseeing, food, and culture. 
  
I recommend logging your activities in the **Itinerary Page** and checking off items in your **Packing Assistant**. Let me know if you need specific details about transit, must-visit spots, or hidden gems!`;
}

/**
 * Generate an AI summary for a journal entry or a whole trip.
 */
export async function generateJournalSummary(title: string, content: string, highlights: string[]): Promise<string> {
  if (isGeminiConfigured) {
    try {
      const prompt = `
        Synthesize the following travel journal entry into a beautiful, evocative 2-sentence summary.
        Title: ${title}
        Content: ${content}
        Highlights: ${highlights.join(', ')}
      `;
      const result = await aiModel.generateContent(prompt);
      return result.response.text().trim();
    } catch (e) {
      console.error('Gemini Journal summary failed:', e);
    }
  }

  // Fallback
  return `Captured a memorable experience titled "${title}" highlighting: ${highlights.slice(0, 3).join(', ')}. Reflects a wonderful moment of discovery and travel exploration.`;
}

// Generate intelligent mock trip itinerary
function generateMockTrip(
  destination: string,
  days: number,
  budgetTier: 'budget' | 'moderate' | 'luxury',
  travelType: string,
  interests: string[],
  travelStyle: string
): any {
  const normDest = destination.toLowerCase();
  
  // Return preloaded template if matches
  if (normDest.includes('paris') && MOCK_ITINERARY_TEMPLATES.paris) {
    const template = JSON.parse(JSON.stringify(MOCK_ITINERARY_TEMPLATES.paris));
    template.itinerary = adjustItineraryDays(template.itinerary, days);
    return template;
  }
  if (normDest.includes('tokyo') && MOCK_ITINERARY_TEMPLATES.tokyo) {
    const template = JSON.parse(JSON.stringify(MOCK_ITINERARY_TEMPLATES.tokyo));
    template.itinerary = adjustItineraryDays(template.itinerary, days);
    return template;
  }

  // Otherwise, construct a custom heuristic itinerary
  const activitiesByInterest: Record<string, string[]> = {
    history: ['Old Town Palace', 'Ancient Ruins Walk', 'National History Museum', 'Cathedral Tour', 'Historic Library'],
    food: ['Street Food Market', 'Local Cooking Class', 'Food Tasting Tour', 'Fine Dining Experience', 'Roastery Café'],
    art: ['Modern Art Gallery', 'Street Art Alley', 'Sculpture Garden', 'National Art Museum', 'Artistic Quarter Walk'],
    shopping: ['Boutique Boulevard', 'Traditional Souk', 'Flea Market', 'Designer Shopping Complex', 'Local Craft Shops'],
    adventure: ['Zip-lining Park', 'Mountain Hiking Trail', 'River Kayaking', 'Scenic Bicycle Ride', 'Off-road Safari'],
    relaxation: ['Thermal Botanical Spa', 'Sandy Beach Lounge', 'Quiet Zen Garden', 'Sunset River Cruise', 'Scenic Picnic Overlook']
  };

  const selectedInterests = interests.length > 0 ? interests : ['relaxation', 'history'];
  const getActivitiesForInterest = (interest: string) => {
    const list = activitiesByInterest[interest.toLowerCase()] || activitiesByInterest.relaxation;
    return list;
  };

  const itinerary: any[] = [];
  const costMultiplier = budgetTier === 'budget' ? 0.5 : budgetTier === 'luxury' ? 2.5 : 1;

  for (let i = 1; i <= days; i++) {
    const primaryInterest = selectedInterests[(i - 1) % selectedInterests.length];
    const secondaryInterest = selectedInterests[i % selectedInterests.length];

    const morningActs = getActivitiesForInterest(primaryInterest);
    const afternoonActs = getActivitiesForInterest(secondaryInterest);
    const eveningActs = getActivitiesForInterest('food');

    const morningAct = morningActs[(i - 1) % morningActs.length];
    const afternoonAct = afternoonActs[i % afternoonActs.length];
    const eveningAct = eveningActs[(i + 1) % eveningActs.length];

    const morningCost = Math.round(15 * costMultiplier);
    const afternoonCost = Math.round(25 * costMultiplier);
    const eveningCost = Math.round(40 * costMultiplier);
    const estimatedCost = morningCost + afternoonCost + eveningCost;

    itinerary.push({
      dayNumber: i,
      title: `${destination} Exploration: ${primaryInterest.charAt(0).toUpperCase() + primaryInterest.slice(1)} & Vibes`,
      morning: {
        title: `${morningAct} in ${destination}`,
        description: `Explore the beautiful ${morningAct} during the peaceful morning hours when crowds are sparse.`,
        cost: morningCost,
        duration: '3 hours',
        category: 'sightseeing'
      },
      afternoon: {
        title: `${afternoonAct} & Coffee`,
        description: `Immerse in the ${afternoonAct}, stopping by a highly rated local espresso bar.`,
        cost: afternoonCost,
        duration: '2.5 hours',
        category: 'relaxation'
      },
      evening: {
        title: `Evening Feast: ${eveningAct}`,
        description: `Savor the flavors of the city with a visit to ${eveningAct} featuring regional delicacies.`,
        cost: eveningCost,
        duration: '3.5 hours',
        category: 'dining'
      },
      estimatedCost,
      travelTime: '1 hr total transit',
      alternativePlan: `If weather is bad, visit the local indoor museums and shopping passages instead of outdoor walking.`
    });
  }

  const packingSuggestions = [
    { name: 'Passport & Travel Documents', category: 'Essentials', weatherSensitive: false },
    { name: 'Universal Travel Adapter', category: 'Electronics', weatherSensitive: false },
    { name: 'Comfortable Walking Shoes', category: 'Clothing', weatherSensitive: false },
    { name: 'High-capacity Power Bank', category: 'Electronics', weatherSensitive: false },
    { name: 'Reusable Water Bottle', category: 'Essentials', weatherSensitive: false },
    { name: 'Weather-appropriate Layers', category: 'Clothing', weatherSensitive: true },
    { name: 'Personal Toiletries kit', category: 'Toiletries', weatherSensitive: false }
  ];

  return {
    destination,
    safetyScore: Math.floor(Math.random() * 15) + 80, // 80 - 95
    aiTravelTips: [
      `Learn basic greeting phrases in the local language to connect with locals.`,
      `Always keep a small amount of cash on hand for street vendors and small cafes.`,
      `Check public transit card passes (e.g. 3-day tourist cards) to save on transport costs.`
    ],
    budgetDistribution: {
      Hotel: 0.45,
      Food: 0.25,
      Transport: 0.12,
      Shopping: 0.08,
      Emergency: 0.05,
      Entertainment: 0.05
    },
    packingSuggestions,
    itinerary
  };
}

// Adjust mock templates if requested days differ
function adjustItineraryDays(itinerary: any[], days: number): any[] {
  if (itinerary.length === days) return itinerary;
  
  if (days < itinerary.length) {
    return itinerary.slice(0, days);
  }

  // Repeat/expand if user requests more days than mock itinerary template has
  const newItinerary = [...itinerary];
  let currentDay = itinerary.length + 1;
  
  while (newItinerary.length < days) {
    const copyDay = itinerary[(currentDay - 1) % itinerary.length];
    newItinerary.push({
      ...JSON.parse(JSON.stringify(copyDay)),
      dayNumber: currentDay,
      title: `${copyDay.title} (Extended Details)`
    });
    currentDay++;
  }
  
  return newItinerary;
}
