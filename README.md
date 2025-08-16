# Itinerarly - Travel Planning Made Simple

## Overview
This is a fun project because all my friends couldn't decide where to go for our next trip and the itinerary of the trip isn't decided which wastes all of our time . Thus this is my attempt to solve my little problem , along with learning ,using and showcasing the skills i have gathered over the years. 

If you guys have any similar issues , feel free to use the tool which i have developed using a significant amount of my time. 

## Features
- Interactive India map visualization using react-simple-maps
- Modern, responsive UI with Tailwind CSS and shadcn/ui components
- Server-side rendering and app router with Next.js 14
- Type-safe development with TypeScript
- AI-powered travel recommendations using Google's Gemini API
- Interactive state and city selection with detailed information
- Dynamic itinerary creation and management
- Weather forecasts for destinations
- Accommodation and attraction suggestions
- Comprehensive database of 1000+ tourist destinations across India
- Curated collections of hill stations, historical sites, beaches, and wildlife sanctuaries

## Tech Stack
- **Framework**: Next.js 14
- **Language**: TypeScript 5.0+
- **Styling**: Tailwind CSS 3.3+
- **UI Components**: shadcn/ui
- **Maps**: react-simple-maps
- **Icons**: Lucide React
- **AI**: Google Gemini API
- **State Management**: Zustand
- **Testing**: Vitest & React Testing Library
- **Data Fetching**: SWR

## Data Coverage

### Comprehensive Tourist Destination Database
Itinerarly features an extensive database of 1000+ carefully curated tourist destinations across India, organized into four main categories:

#### 🏔️ Hill Stations
- Popular mountain retreats and scenic hill destinations
- Covering major hill station circuits across all states
- From the Himalayas to the Western and Eastern Ghats

#### 🏛️ Historical Sites
- UNESCO World Heritage Sites
- Ancient monuments, palaces, and forts
- Archaeological sites and heritage locations
- Cultural and religious landmarks

#### 🏖️ Beaches (150+ locations)
- **West Coast**: Gujarat, Maharashtra, Goa, Karnataka, Kerala
- **East Coast**: Tamil Nadu, Andhra Pradesh, Telangana, Odisha, West Bengal
- **Islands**: 
  - **Lakshadweep**: All major islands including Agatti, Bangaram, Kadmat, Kavaratti, Kalpeni, Minicoy
  - **Andaman & Nicobar**: Havelock, Neil Island, Ross Island, Baratang, Diglipur, and more
- **Union Territories**: Puducherry, Daman & Diu

#### 🦌 Wildlife Sanctuaries & National Parks (100+ locations)
Comprehensive coverage across all biogeographic regions of India:

- **Himalayan Region**: Snow leopard habitats, alpine ecosystems
- **Trans-Himalayan**: High-altitude wildlife reserves
- **Desert Region**: Rajasthan's unique desert wildlife
- **Semi-Arid**: Gujarat and western India sanctuaries
- **Western Ghats**: UNESCO World Heritage biodiversity hotspot
- **Deccan Peninsula**: Central and southern India parks
- **Gangetic Plain**: Terai and alluvial plain reserves
- **Coasts**: Coastal and marine sanctuaries
- **Islands**: Endemic species of Andaman & Nicobar, Lakshadweep
- **Northeast India**: Biodiversity-rich sanctuaries across all seven sister states

### State-wise Coverage
Every Indian state and union territory is comprehensively covered:
- **28 States**: From Andhra Pradesh to West Bengal
- **8 Union Territories**: Including specialized coverage for island territories
- **Special Focus**: Enhanced coverage for tourism-heavy states like Rajasthan, Kerala, Himachal Pradesh, Uttarakhand, and Goa

## Getting Started

## Special mention

Huge shoutout to [Udit-001](https://github.com/udit-001/india-maps-data) for compiling the data of Indian states and geography

## Data Files

### 📍 [Tourist Destinations Database (sections.js)](./data/sections.js)
Complete database of 1000+ tourist destinations across India, organized by categories:
- Hill Stations, Historical Sites, Beaches, Wildlife Sanctuaries
- Comprehensive coverage of all Indian states and union territories

### 🗺️ [India GeoJSON Data (india-geoJson.json)](./app/start/india-geoJson.json)
Geographic boundary data for interactive map visualization:
- State and union territory boundaries
- Coordinates for map rendering with react-simple-maps
- Optimized for web performance 

### Prerequisites
- Node.js 18.17.0 or later
- npm 9+ or yarn 1.22+
- Google Gemini API key

### Installation
1. Clone the repository
```bash
git clone https://github.com/yourusername/itinerarly-FE.git
cd itinerarly-FE
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_API_URL=your_backend_api_url
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure
```
itinerarly-FE/
├── app/                # Next.js app directory
│   ├── (routes)/      # Application routes
│   ├── api/           # API routes
│   ├── layout.tsx     # Root layout
│   ├── page.tsx       # Home page
│   └── start/
│       └── india-geoJson.json # India map data → [View File](./app/start/india-geoJson.json)
├── components/         # Reusable components
│   ├── ui/            # UI components
│   ├── map/           # Map-related components
│   ├── IndiaMap.tsx   # Interactive India map component
│   └── StateDetailsModal.tsx # State details and AI recommendations
├── data/              # Static data files
│   └── sections.js    # 1000+ tourist destinations database → [View File](./data/sections.js)
├── lib/               # Utility functions and API handlers
├── hooks/             # Custom React hooks
├── store/             # State management
├── styles/            # Global styles
├── public/            # Static assets
├── __tests__/         # Test files
└── types/             # TypeScript type definitions
```

## Key Components

### Interactive Map (`IndiaMap.tsx`)
- Click on any Indian state to view detailed information
- Seamless state selection with visual feedback
- Integration with comprehensive destination database

### AI-Powered Recommendations (`StateDetailsModal.tsx`)
- Google Gemini API integration for intelligent travel suggestions
- Contextual recommendations based on selected state
- Dynamic itinerary generation with local insights

### Destination Database (`data/sections.js`)
- 1000+ curated tourist destinations → [**View Database**](./data/sections.js)
- Organized by category: Hill Stations, Historical Sites, Beaches, Wildlife Sanctuaries
- Complete coverage of all Indian states and union territories
- Regular updates with new destinations and seasonal recommendations

## Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run format       # Format code with Prettier
```

## Environment Variables
The following environment variables are required:

| Variable | Description | Required |
|----------|-------------|----------|
| NEXT_PUBLIC_GEMINI_API_KEY | Google Gemini API Key | Yes |
| NEXT_PUBLIC_API_URL | Backend API URL | No |

To obtain a Gemini API key:
1. Visit the [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create or sign in to your Google account
3. Generate an API key
4. Copy the key to your `.env.local` file

## Testing
The project uses Vitest and React Testing Library for testing. To run tests:
```bash
npm test
```

For watch mode:
```bash
npm run test:watch
```

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Recent Updates

### Version 2.0 - Comprehensive Data Expansion
- **Expanded Database**: Added 500+ new destinations across all categories
- **Enhanced Beach Coverage**: 150+ coastal destinations including complete island coverage
- **Wildlife Sanctuary Addition**: 100+ national parks and wildlife sanctuaries
- **Bug Fixes**: Resolved state selection issues in interactive map
- **Code Optimization**: Removed console logs and improved error handling
- **Complete Coverage**: All 28 states and 8 union territories now have comprehensive data

### Data Quality Improvements
- Verified and validated all location data
- Added geographical diversity across all biogeographic regions
- Enhanced coverage for northeastern states and island territories
- Seasonal destination recommendations

## Troubleshooting
- **API rate limiting**: If encountering rate limiting with the Gemini API:
    - The application automatically retries with exponential backoff
    - Check your API quota in the Google AI Studio
    - Consider implementing a caching strategy for common requests

- **Build errors**:
    - Ensure Node.js version is 18.17.0 or higher
    - Clear the `.next` cache directory and rebuild

- **Map rendering issues**:
    - Check console for any CORS errors
    - Ensure GeoJSON data is properly formatted

## License
This project is licensed under the MIT License - see the LICENSE file for details.
