/**
 * Chatbot FAQ Data
 * 
 * Structured list of commonly asked questions and answers for Itinerarly.
 * Covers frequent travel-related questions for Indian destinations.
 * 
 * This data powers the chatbot's auto-suggested FAQs and quick responses.
 * 
 * Example usage:
 * import { chatbotFAQs, getCategoryQuestions } from './data/chatbotData';
 */

export interface ChatbotFAQCategory {
  category: string;
  questions: { q: string; a: string }[];
}

/**
 * Comprehensive FAQ database organized by category
 */
export const chatbotFAQs: ChatbotFAQCategory[] = [
  // 🗓️ TRIP PLANNING BASICS
  {
    category: "Trip Planning Basics",
    questions: [
      {
        q: "how do I plan a trip",
        a: "Start by choosing your destination, travel dates, and budget 💰. I can help you with itinerary ideas and top spots once you pick a place!",
      },
      {
        q: "how to create itinerary",
        a: "You can create an itinerary by listing places to visit day-by-day 🗓️ — include travel time, rest, meals, and sightseeing.",
      },
      {
        q: "how many days are enough for a trip",
        a: "It depends on your destination! For example, Goa = 3–5 days 🏖️, Kerala backwaters = 5–7 days 🌴, Himachal = 7–10 days 🏔️.",
      },
      {
        q: "what should I pack for india trip",
        a: "Light cotton clothes, comfortable walking shoes, sunscreen, power bank, and a reusable water bottle 💧. Don't forget medicines and adapters!",
      },
      {
        q: "best time to visit india",
        a: "October to March offers pleasant weather across most destinations 🌤️. Hill stations are great in summer, and Kerala shines during monsoons!",
      },
      {
        q: "how to plan solo trip",
        a: "Choose safe destinations, book stays in advance, keep family updated 📱, and join traveler communities online. India is great for solo travel!",
      },
      {
        q: "group trip planning tips",
        a: "Set a common budget, take majority votes on destinations 🗳️, book accommodations early, and assign tasks like bookings, itinerary, and food planning.",
      },
      {
        q: "family trip tips india",
        a: "Pick family-friendly destinations like Goa, Kerala, or Rajasthan 👨‍👩‍👧‍👦. Book spacious stays, plan for rest time, and include kid-friendly activities!",
      },
    ],
  },

  // 🇮🇳 POPULAR INDIAN DESTINATIONS
  {
    category: "Popular Indian Destinations",
    questions: [
      {
        q: "best places to visit in india",
        a: "Top picks 🇮🇳: Goa for beaches, Rajasthan for culture, Kerala for nature, Himachal for mountains, and Delhi for history.",
      },
      {
        q: "things to do in goa",
        a: "Explore beaches (Baga, Palolem), Fort Aguada, water sports, and sunset cruises 🚤. Don't miss Goan seafood 🍤!",
      },
      {
        q: "places to visit in kerala",
        a: "Houseboats in Alleppey, Munnar tea gardens, Kochi's old town, and Kovalam beach 🏞️🌴.",
      },
      {
        q: "tourist spots in delhi",
        a: "India Gate, Qutub Minar, Red Fort, Humayun's Tomb, and Chandni Chowk for street food 🍢.",
      },
      {
        q: "places to visit in rajasthan",
        a: "Jaipur's palaces, Jodhpur's blue city, Udaipur lakes, and Jaisalmer's sand dunes 🏜️.",
      },
      {
        q: "best hill stations in india",
        a: "Shimla, Manali, Ooty, Nainital, Darjeeling, and Munnar are all great picks for cool weather 🌄.",
      },
      {
        q: "places to visit in himachal",
        a: "Manali for adventure 🏔️, Shimla for colonial charm, Dharamshala for spirituality, and Kasol for backpacker vibes.",
      },
      {
        q: "things to do in mumbai",
        a: "Visit Gateway of India, Marine Drive, Elephanta Caves, and try street food at Juhu Beach 🌊🍿.",
      },
      {
        q: "places to visit in south india",
        a: "Kerala backwaters, Hampi ruins, Coorg coffee plantations, Pondicherry beaches, and Madurai temples 🛕.",
      },
      {
        q: "offbeat destinations india",
        a: "Try Spiti Valley, Ziro Valley, Tawang, Majuli Island, Gokarna, and Chettinad 🗺️ for unexplored beauty!",
      },
      {
        q: "beach destinations in india",
        a: "Goa, Andaman Islands, Gokarna, Varkala, Kovalam, and Pondicherry have stunning beaches 🏖️.",
      },
      {
        q: "adventure places in india",
        a: "Rishikesh for rafting 🚣, Ladakh for biking 🏍️, Manali for paragliding, and Goa for scuba diving 🤿!",
      },
    ],
  },

  // 💰 BUDGET & TRAVEL TIPS
  {
    category: "Budget & Travel Tips",
    questions: [
      {
        q: "how to travel on budget",
        a: "Use trains or buses 🚆, stay in hostels or homestays 🏡, and eat local food stalls 🍛. Off-season trips save money too!",
      },
      {
        q: "when is the cheapest time to travel in india",
        a: "Generally June–September (monsoon) and late January–March are less expensive 🗓️.",
      },
      {
        q: "how much does trip to goa cost",
        a: "Budget: ₹8,000–₹12,000 for 3 days 🏖️; Mid-range: ₹20,000–₹30,000; Luxury: ₹40,000+.",
      },
      {
        q: "how much does trip to kerala cost",
        a: "Budget: ₹15,000–₹20,000 for 5 days 🌴; Mid-range: ₹35,000–₹50,000; Luxury: ₹70,000+.",
      },
      {
        q: "cheap places to travel in india",
        a: "Rishikesh, Mcleodganj, Pondicherry, Gokarna, and Hampi are budget-friendly with great experiences 💸.",
      },
      {
        q: "how to save money while traveling",
        a: "Book in advance 📅, travel off-season, use public transport, eat street food, and look for free attractions!",
      },
      {
        q: "backpacking tips india",
        a: "Pack light 🎒, stay in hostels, use sleeper trains, try local food, and connect with fellow backpackers!",
      },
      {
        q: "student travel tips",
        a: "Carry your student ID for discounts 🎓, travel in groups, use youth hostels, and explore free walking tours!",
      },
    ],
  },

  // 🚆 TRANSPORT & STAY
  {
    category: "Transport & Stay",
    questions: [
      {
        q: "how to book trains in india",
        a: "You can book through the IRCTC website or apps like MakeMyTrip or Paytm 🚆.",
      },
      {
        q: "best way to travel between cities",
        a: "Short trips: trains 🚉 or Volvo buses 🚌; Long trips: domestic flights ✈️ like IndiGo or Air India.",
      },
      {
        q: "where to stay in goa",
        a: "North Goa for nightlife 🎉 (Baga, Calangute), South Goa for peace 🌅 (Palolem, Agonda).",
      },
      {
        q: "how to book bus tickets",
        a: "Use RedBus, AbhiBus, or state transport websites 🚌. Book early for Volvo/sleeper buses on popular routes!",
      },
      {
        q: "best accommodation options india",
        a: "Budget: Hostels & homestays 🏡; Mid-range: 3-star hotels; Luxury: Heritage hotels & resorts 🏰.",
      },
      {
        q: "how to find hostels in india",
        a: "Use Hostelworld, Zostel, Booking.com, or Airbnb 🛏️. Major cities and tourist spots have great hostels!",
      },
      {
        q: "local transport in cities",
        a: "Use metro in Delhi/Bangalore/Mumbai 🚇, auto-rickshaws, Uber/Ola, or local buses. Bargain with autos!",
      },
      {
        q: "domestic flight booking tips",
        a: "Book 2-3 months ahead ✈️, fly mid-week for cheaper fares, compare on Skyscanner or Google Flights!",
      },
    ],
  },

  // 🙏 CULTURE & SAFETY
  {
    category: "Culture & Safety",
    questions: [
      {
        q: "is india safe for tourists",
        a: "Yes! Just follow normal travel safety — avoid isolated areas at night and keep valuables secure 🧳.",
      },
      {
        q: "how to dress in india",
        a: "Dress modestly when visiting temples or rural areas 🙏. Light cottons are perfect for hot weather.",
      },
      {
        q: "how to respect local culture",
        a: "Remove shoes before entering temples 🛕, ask before taking photos, and greet people with a smile or 'Namaste' 🙌.",
      },
      {
        q: "is india safe for solo female travelers",
        a: "Yes, but stay alert 👀. Stick to well-lit areas, use trusted transport, dress modestly, and keep contacts handy.",
      },
      {
        q: "tipping culture in india",
        a: "Tip 10% at restaurants 🍽️, ₹20-50 to hotel staff, ₹50-100 to drivers. Not mandatory but appreciated!",
      },
      {
        q: "indian food hygiene tips",
        a: "Eat at busy places 🍛, drink bottled water, avoid raw salads, and carry hand sanitizer. Street food is usually safe!",
      },
      {
        q: "cultural dos and donts india",
        a: "Do: Remove shoes at temples 🛕, use right hand for eating. Don't: Touch religious idols, point feet at people.",
      },
      {
        q: "language barrier in india",
        a: "English is widely spoken in cities and tourist areas 🗣️. Learn basic Hindi phrases — locals appreciate it!",
      },
    ],
  },

  // 🗓️ ITINERARY INSPIRATION
  {
    category: "Itinerary Inspiration",
    questions: [
      {
        q: "give me an itinerary for goa",
        a: "🗓️ 3-Day Goa Plan: Day 1 – Beaches & Baga Nightlife, Day 2 – Old Goa Churches & Panjim Cruise, Day 3 – Fort Aguada & Markets.",
      },
      {
        q: "itinerary for kerala",
        a: "🛶 5-Day Kerala Plan: Day 1 – Kochi, Day 2 – Munnar Tea Gardens, Day 3 – Alleppey Houseboat, Day 4 – Thekkady Wildlife, Day 5 – Kovalam Beach.",
      },
      {
        q: "north india trip itinerary",
        a: "🕌 7-Day North India: Delhi → Agra (Taj Mahal) → Jaipur → Pushkar → Udaipur → back to Delhi.",
      },
      {
        q: "rajasthan itinerary 10 days",
        a: "🏜️ Jaipur (2) → Pushkar (1) → Jodhpur (2) → Jaisalmer (2) → Udaipur (2) → Mount Abu (1). Perfect cultural trip!",
      },
      {
        q: "himachal itinerary 7 days",
        a: "🏔️ Delhi → Shimla (2) → Manali (3) → Kasol (1) → Chandigarh → Delhi. Great for mountains & adventure!",
      },
      {
        q: "south india itinerary 2 weeks",
        a: "🌴 Bangalore → Mysore → Coorg → Kerala (Kochi, Munnar, Alleppey) → Pondicherry → Chennai. 14 days of bliss!",
      },
      {
        q: "weekend getaway from delhi",
        a: "🚗 Agra (Taj Mahal), Jaipur, Rishikesh, Mussoorie, Nainital, or Jim Corbett — all 4-6 hours away!",
      },
      {
        q: "weekend trip from mumbai",
        a: "🌊 Lonavala, Alibaug, Mahabaleshwar, Matheran, Igatpuri, or Goa (if 3 days). Perfect for quick escapes!",
      },
      {
        q: "weekend trip from bangalore",
        a: "☕ Coorg, Ooty, Mysore, Chikmagalur, Wayanad, or Pondicherry. Great for nature & coffee lovers!",
      },
    ],
  },

  // 🎉 FUN & FACTS
  {
    category: "Fun & Facts",
    questions: [
      {
        q: "fun facts about india",
        a: "India has the world's largest rail network 🚂 and the wettest place on Earth — Mawsynram, Meghalaya 🌧️!",
      },
      {
        q: "must try indian food",
        a: "Biryani 🍗, Dosa 🥞, Chaat 🍢, Butter Chicken 🍛, and Jalebi 🍬 are must-tries!",
      },
      {
        q: "street food to try in india",
        a: "Pani puri, vada pav, chole bhature, momos, and dosa 🍽️. Each region has unique street food!",
      },
      {
        q: "festivals to experience in india",
        a: "Diwali 🪔, Holi 🎨, Durga Puja, Navratri, Onam, and Pushkar Camel Fair 🐪 are incredible experiences!",
      },
      {
        q: "best photography spots india",
        a: "Taj Mahal 📸, Varanasi ghats, Hampi ruins, Kerala backwaters, Ladakh landscapes, and Jaipur palaces!",
      },
      {
        q: "unique experiences in india",
        a: "Houseboat stay in Kerala 🛶, camel safari in Jaisalmer 🐪, Ganga aarti in Varanasi 🔱, and tea tasting in Darjeeling!",
      },
      {
        q: "what is india famous for",
        a: "The Taj Mahal, yoga, Bollywood, spices, diverse cultures, and incredible hospitality 🙏✨!",
      },
      {
        q: "shopping tips india",
        a: "Bargain at local markets 🛍️, buy handicrafts in Jaipur, spices in Kerala, and pashmina in Kashmir. Shop smart!",
      },
      {
        q: "monsoon travel tips",
        a: "Carry raincoat/umbrella ☔, waterproof bags, avoid hill stations prone to landslides, but enjoy Kerala's greenery 🌴!",
      },
      {
        q: "summer travel tips india",
        a: "Head to hill stations 🏔️, carry sunscreen & hats 🧢, stay hydrated, and avoid noon travel in plains.",
      },
    ],
  },

  // ℹ️ ABOUT ITINERARLY
  {
    category: "About Itinerarly",
    questions: [
      {
        q: "what is itinerarly",
        a: "Itinerarly is your AI-powered travel companion for exploring India 🇮🇳! I help you plan trips, discover destinations, and create custom itineraries.",
      },
      {
        q: "how does itinerarly work",
        a: "Just tell me where you want to go, your budget, and travel dates 📅 — I'll generate a personalized itinerary with places to visit, stay, and eat!",
      },
      {
        q: "is itinerarly free",
        a: "Yes! Itinerarly is completely free to use 🎉. No hidden charges, just smart travel planning for everyone!",
      },
      {
        q: "can you plan my entire trip",
        a: "Absolutely! 🗺️ Tell me your destination, budget, and number of days — I'll create a day-by-day plan with attractions, stays, and food!",
      },
      {
        q: "what makes itinerarly different",
        a: "I combine AI smarts 🤖 with local Indian travel knowledge to give you authentic, budget-friendly, and personalized trip plans!",
      },
    ],
  },
];

/**
 * Helper Functions
 */

/**
 * Get all questions from a specific category
 */
export const getCategoryQuestions = (category: string) => {
  const faqCategory = chatbotFAQs.find(
    (faq) => faq.category.toLowerCase() === category.toLowerCase()
  );
  return faqCategory ? faqCategory.questions : [];
};

/**
 * Get all categories
 */
export const getCategories = () => {
  return chatbotFAQs.map((faq) => faq.category);
};

/**
 * Search questions by keyword (case-insensitive partial match)
 */
export const searchQuestions = (keyword: string) => {
  const results: Array<{ category: string; q: string; a: string }> = [];
  const lowerKeyword = keyword.toLowerCase();

  chatbotFAQs.forEach((faq) => {
    faq.questions.forEach((question) => {
      const matchesQuestion = question.q.toLowerCase().includes(lowerKeyword);
      const matchesAnswer = question.a.toLowerCase().includes(lowerKeyword);

      if (matchesQuestion || matchesAnswer) {
        results.push({
          category: faq.category,
          q: question.q,
          a: question.a,
        });
      }
    });
  });

  return results;
};

/**
 * Get a random travel tip
 */
export const getRandomTip = () => {
  const funCategory = chatbotFAQs.find((faq) => faq.category === 'Fun & Facts');
  if (!funCategory || funCategory.questions.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * funCategory.questions.length);
  return funCategory.questions[randomIndex];
};

/**
 * Get all questions flattened with category info
 */
export const getAllQuestions = () => {
  const allQuestions: Array<{
    category: string;
    q: string;
    a: string;
  }> = [];

  chatbotFAQs.forEach((faq) => {
    faq.questions.forEach((question) => {
      allQuestions.push({
        category: faq.category,
        ...question,
      });
    });
  });

  return allQuestions;
};

/**
 * Get suggested questions based on user's current context
 */
export const getSuggestedQuestions = (
  context: 'planning' | 'browsing' | 'general' = 'general',
  limit = 3
) => {
  let relevantQuestions: Array<{ category: string; q: string; a: string }> = [];

  switch (context) {
    case 'planning':
      const planningFAQ = chatbotFAQs.find((faq) => faq.category === 'Trip Planning Basics');
      if (planningFAQ) {
        relevantQuestions = planningFAQ.questions.slice(0, limit).map((q) => ({
          category: planningFAQ.category,
          q: q.q,
          a: q.a,
        }));
      }
      break;

    case 'browsing':
      const destinationFAQ = chatbotFAQs.find((faq) => faq.category === 'Popular Indian Destinations');
      if (destinationFAQ) {
        relevantQuestions = destinationFAQ.questions.slice(0, limit).map((q) => ({
          category: destinationFAQ.category,
          q: q.q,
          a: q.a,
        }));
      }
      break;

    case 'general':
    default:
      // Get a mix from different categories
      const aboutFAQ = chatbotFAQs.find((faq) => faq.category === 'About Itinerarly');
      const tripFAQ = chatbotFAQs.find((faq) => faq.category === 'Trip Planning Basics');
      const destFAQ = chatbotFAQs.find((faq) => faq.category === 'Popular Indian Destinations');

      if (aboutFAQ && aboutFAQ.questions[0]) {
        relevantQuestions.push({
          category: aboutFAQ.category,
          q: aboutFAQ.questions[0].q,
          a: aboutFAQ.questions[0].a,
        });
      }
      if (tripFAQ && tripFAQ.questions[0]) {
        relevantQuestions.push({
          category: tripFAQ.category,
          q: tripFAQ.questions[0].q,
          a: tripFAQ.questions[0].a,
        });
      }
      if (destFAQ && destFAQ.questions[0]) {
        relevantQuestions.push({
          category: destFAQ.category,
          q: destFAQ.questions[0].q,
          a: destFAQ.questions[0].a,
        });
      }
      break;
  }

  return relevantQuestions;
};

/**
 * Get total question count
 */
export const getTotalQuestionsCount = () => {
  return chatbotFAQs.reduce((total, faq) => total + faq.questions.length, 0);
};

/**
 * Get a chatbot response based on user message
 * This is the main integration function
 */
export function getChatbotResponse(message: string): string {
  const lowerMsg = message.toLowerCase();

  // Search FAQs for matching questions
  for (const cat of chatbotFAQs) {
    for (const { q, a } of cat.questions) {
      if (lowerMsg.includes(q.toLowerCase())) return a;
    }
  }

  // Fallback response
  return "I'm not sure about that yet 🌱 — but I can help you explore destinations or plan trips! Try saying 'plan a trip to Goa' or 'show me the map'.";
}

// Example usage:
// import { chatbotFAQs, searchQuestions, getChatbotResponse } from './data/chatbotData';
// const results = searchQuestions('budget');
// const response = getChatbotResponse(userMessage);
