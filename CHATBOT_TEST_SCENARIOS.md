# 🧪 Chatbot Test Scenarios

Quick testing guide for the enhanced Itinerarly chatbot intelligence.

---

## ✅ Test Scenarios

### 1. **Greeting Intent**
| Input | Expected Response |
|-------|-------------------|
| `hi` | "Hello! 👋 Where would you like to travel today? I can help you..." |
| `hello` | Same greeting response |
| `hey` | Same greeting response |
| `namaste` | Same greeting response |

---

### 2. **FAQ Matching**
| Input | Expected Behavior |
|-------|-------------------|
| `what is itinerarly` | Returns answer from FAQ database about Itinerarly |
| `is this free` | "Yes! Itinerarly is completely free and open-source..." |
| `who created this` | Info about Heisen47 and the team |
| `how does it work` | Explanation of how Itinerarly works |
| `what devices` | "Itinerarly works on any device with a web browser..." |

---

### 3. **Trip Planning Intent**
| Input | Expected Response |
|-------|-------------------|
| `plan trip to goa` | "Sure! Let's start planning your trip to Goa. 🗺️ Click the 'Plan a Trip' button..." |
| `plan trip to kerala` | Same with "Kerala" instead of "Goa" |
| `plan a trip to rajasthan` | Same with "Rajasthan" |
| `plan trip` | Generic planning help message |

---

### 4. **Navigation Intent**
| Input | Action | Visual Feedback |
|-------|--------|-----------------|
| `take me to map` | Navigate to `/start` | "Opening the interactive India map for you... 🗺️" |
| `show map` | Navigate to `/start` | Same response |
| `open map` | Navigate to `/start` | Same response |
| `about` | Navigate to `/#about` | "Itinerarly is your intelligent AI-powered travel companion..." |
| `features` | Navigate to `/#features` | "Itinerarly offers AI-powered itinerary generation..." |
| `community` | Navigate to `/#community` | "Check out our Community Highlights section..." |
| `contact` | Navigate to `/#contact` | (Uses suggestion button logic) |

---

### 5. **Destination Recommendation Intent**
| Input | Expected Response |
|-------|-------------------|
| `where should i go` | "India has incredible diversity! 🌏 Tell me your preferences..." |
| `recommend a place` | Same response |
| `suggest destination` | Same response |

---

### 6. **Weather Intent**
| Input | Expected Response |
|-------|-------------------|
| `what's the weather` | "You can check the weather for any destination in India..." |
| `climate` | Same response |
| `weather in goa` | Same response |

---

### 7. **Budget Intent**
| Input | Expected Response |
|-------|-------------------|
| `how much does it cost` | "Budget planning is crucial! Indian destinations can accommodate all budget ranges..." |
| `budget` | Same response |
| `price` | Same response |

---

### 8. **Food Intent**
| Input | Expected Response |
|-------|-------------------|
| `what should i eat` | "India is a food lover's paradise! 🍛 Each state has its unique cuisine..." |
| `food in india` | Same response |
| `cuisine` | Same response |

---

### 9. **Random Tip Intent**
| Input | Expected Behavior |
|-------|-------------------|
| `give me a tip` | Returns a random travel tip from FAQ database |
| `travel advice` | Same behavior |
| `suggest something` | Same behavior |

---

### 10. **Help Intent**
| Input | Expected Response |
|-------|-------------------|
| `help` | "I'm here to help! 😊 I can assist you with: • Planning trips • Finding destinations..." |
| `how do i start` | Same response |
| `can you help me` | Same response |

---

### 11. **Thank You Intent**
| Input | Expected Response |
|-------|-------------------|
| `thank you` | "You're welcome! Happy to help make your Indian travel adventure amazing!" |
| `thanks` | Same response |
| `thank` | Same response |

---

### 12. **Fallback Test**
| Input | Expected Response |
|-------|-------------------|
| `asdfghjkl` | "I'm not sure about that yet 🌱 — but I can help you explore destinations..." |
| `xyz123` | Same fallback message |
| Random gibberish | Same fallback message |

---

## 🔄 Conversation Flow Tests

### Flow 1: New User Journey
```
1. User: "hi"
   Bot: Greeting + options

2. User: "what is itinerarly"
   Bot: FAQ answer about Itinerarly

3. User: "plan trip to goa"
   Bot: Trip planning response with Goa

4. User: "thanks"
   Bot: Thank you response
```

### Flow 2: Navigation Journey
```
1. User: "show me the map"
   Bot: Map response → navigates to /start

2. User: "about"
   Bot: About response → navigates to /#about

3. User: "community"
   Bot: Community response → navigates to /#community
```

### Flow 3: Information Gathering
```
1. User: "where should i go"
   Bot: Destination recommendation prompt

2. User: "how much will it cost"
   Bot: Budget information

3. User: "what should i eat"
   Bot: Food/cuisine information
```

---

## 📊 Success Criteria

✅ **All greetings** trigger the greeting intent  
✅ **FAQ questions** return correct answers from database  
✅ **Trip planning** extracts destination name correctly  
✅ **Navigation** redirects to correct pages after 1s delay  
✅ **Intents** match keywords accurately (case-insensitive)  
✅ **Fallback** triggers for unrecognized input  
✅ **All UI/animations** remain unchanged  

---

## 🐛 Known Edge Cases

1. **Multiple Intents in One Message**
   - Input: `"hi, plan trip to goa and show me the map"`
   - Behavior: Processes first matching intent (greeting)
   - Future: Could be enhanced to handle multiple intents

2. **Partial Destination Names**
   - Input: `"plan trip to goa beach"`
   - Behavior: Extracts "goa beach" as destination
   - Works as intended

3. **FAQ Partial Matches**
   - Input: `"free"`
   - Behavior: Searches FAQ for "free" keyword
   - Returns first match (pricing question)

---

## 🚀 Quick Test Command

Open the chatbot and try these in sequence:
1. `hi`
2. `what is itinerarly`
3. `plan trip to goa`
4. `show me the map`
5. `thanks`

Expected: All responses should be contextual and accurate! ✨

---

**Last Updated:** October 27, 2025  
**Test Coverage:** 12 intent patterns + 50+ FAQ responses
