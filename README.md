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

## Getting Started

## Special mention

Huge shoutout to [Udit-001](https://github.com/udit-001/india-maps-data)  for compiling the data of Indian states and geography 

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
│   └── page.tsx       # Home page
├── components/         # Reusable components
│   ├── ui/            # UI components
│   └── map/           # Map-related components
├── lib/               # Utility functions and API handlers
├── hooks/             # Custom React hooks
├── store/             # State management
├── styles/            # Global styles
├── public/            # Static assets
├── __tests__/         # Test files
└── types/             # TypeScript type definitions
```

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
