# Itinerarly - Travel Planning Made Simple

## Overview
Itinerarly is an AI-powered travel planning application that helps you create perfect itineraries for exploring India. Born from the frustration of indecisive group travel planning, this tool leverages AI to make travel planning effortless and enjoyable.

## Features & how to use

- you can write about the exact place you wanna go for the number of days and number of people , we will generate you an itinerary about and around that place
- you don't know where exactly to go but you know which month you gonna go with how many people and your budget , again we can help you generate a itinerary based on your budget and time duration
- you wanna visit a state , you can click on that state and we can tell you that particular indian state's cuisine , safety and the places to visit of that state.
- if you click on the dropdown , it will tell you the various wild life sanctuaries , hill stations , beaches , cities of this beautiful country . click on the selected destination, click on show details and we can show you the details of that particular place along with it's current weather .

I sincerely hope you enjoy the stay and visit of this beautiful country and your safety and security is maintained throughout. :D


**🎯 Quick Start**: Visit our live application and start planning your next adventure! 

## ✨ Key Features
- 🗺️ **Interactive India Map** with react-simple-maps visualization
- 🤖 **AI-Powered Recommendations** using Google's Gemini API
- 🏛️ **1000+ Curated Destinations** across India (Hill Stations, Historical Sites, Beaches, Wildlife Sanctuaries)
- 📱 **Modern Responsive UI** with Tailwind CSS and shadcn/ui
- ⚡ **Fast & Type-Safe** with Next.js 14 and TypeScript
- 🌤️ **Weather Integration** for destination planning
- 🏨 **Smart Suggestions** for accommodations and attractions

## 🛠️ Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript 5.0+
- **Styling**: Tailwind CSS + shadcn/ui
- **Maps**: react-simple-maps
- **AI**: Google Gemini API
- **State Management**: Zustand
- **Testing**: Vitest & React Testing Library

## 📊 Data Coverage
Itinerarly features **1000+ carefully curated destinations** across India:

- **🏔️ Hill Stations**: Mountain retreats from Himalayas to Western Ghats
- **🏛️ Historical Sites**: UNESCO sites, monuments, forts, and cultural landmarks  
- **🏖️ Beaches (150+)**: Complete coastal coverage including islands (Lakshadweep, Andaman & Nicobar)
- **🦌 Wildlife Sanctuaries (100+)**: National parks across all biogeographic regions

**Complete Coverage**: All 28 states and 8 union territories with verified, up-to-date information.

> 📍 **View Database**: [Tourist Destinations (sections.js)](./data/sections.js) | [Map Data (india-geoJson.json)](./app/start/india-geoJson.json)

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17+ 
- npm 9+ or yarn 1.22+
- Google Gemini API key ([Get it here](https://makersuite.google.com/app/apikey))

### Installation
```bash
# Clone and install
git clone https://github.com/yourusername/itinerarly-FE.git
cd itinerarly-FE
npm install

# Set up environment
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# Start development
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to start planning!

> 📖 **Need help?** Check our [Contributing Guide](./CONTRIBUTING.md) for detailed setup instructions.

## 📁 Project Structure
```
itinerarly-FE/
├── app/                   # Next.js app directory
│   ├── (routes)/         # Application routes  
│   └── start/india-geoJson.json # Map data
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── IndiaMap.tsx     # Interactive map
│   └── StateDetailsModal.tsx # AI recommendations
├── data/sections.js     # 1000+ destinations database
├── lib/                 # Utilities & API handlers
└── types/              # TypeScript definitions
```

## 🎯 Key Components
- **Interactive Map**: Click any state for detailed destination info
- **AI Recommendations**: Smart travel suggestions via Google Gemini
- **Destination Database**: 1000+ curated locations with regular updates

## 🔧 Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production  
npm run test     # Run tests
npm run lint     # Code linting
```

### Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API Key | ✅ |
| `NEXT_PUBLIC_API_URL` | Backend API URL | ❌ |

## 📚 Documentation

- **[Contributing Guide](./CONTRIBUTING.md)** - Setup, development workflow, and contribution guidelines
- **[Future Roadmap](./FUTURE-PLANS.md)** - Upcoming features and long-term vision
- **[Troubleshooting](./TROUBLESHOOT-403-CONSUME-ENDPOINT.md)** - Common issues and solutions

## 🤝 Contributing

We welcome contributions! Please check our [Contributing Guide](./CONTRIBUTING.md) for:
- Development setup instructions
- Coding standards and best practices  
- How to submit pull requests
- Testing requirements

## 📈 Recent Updates

### Version 2.0 - Major Data Expansion
- ✅ **500+ New Destinations** across all categories
- ✅ **Complete Island Coverage** (Lakshadweep, Andaman & Nicobar)
- ✅ **100+ Wildlife Sanctuaries** added
- ✅ **Enhanced UI/UX** with improved error handling
- ✅ **All States Covered** - comprehensive data for 28 states + 8 UTs

## 🚀 What's Next?

Exciting features coming soon! Check our [Future Plans](./FUTURE-PLANS.md) for:
- 🤖 Advanced AI personalization
- 💬 Social travel planning & group chat
- 📱 Mobile apps (iOS/Android)
- 💰 Premium features & token system
- 🌍 International destinations

## 📞 Support & Community

- 🐛 [Report Issues](https://github.com/Heisen47/itinerarly-FE/issues)
- 💡 [Feature Requests](https://github.com/Heisen47/itinerarly-FE/discussions)
- 📧 [Contact Us](mailto:iamrishi.dev47@gmail.com)
- ⭐ [Star on GitHub](https://github.com/Heisen47/itinerarly-FE) to stay updated

## 🙏 Acknowledgments

Special thanks to [Udit-001](https://github.com/udit-001/india-maps-data) for the comprehensive Indian geographic data compilation.

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

---

**Made with ❤️ for Indian travelers** | **[Start Planning Your Next Adventure →](http://localhost:3000)**
