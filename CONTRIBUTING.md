# Contributing to Itinerarly

We welcome contributions to Itinerarly! This document provides guidelines for contributing to the project.

## Getting Started

### Prerequisites
- Node.js 18.17.0 or later
- npm 9+ or yarn 1.22+
- Google Gemini API key

### Installation
1. Fork the repo , create your own branch do the changes you want to make . Send a PR after you have tested the changes .
2. Clone the repository
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
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_API_URL=your_backend_api_url
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables
The following environment variables are required:

| Variable | Description | Required |
|----------|-------------|----------|
| GEMINI_API_KEY | Google Gemini API Key | Yes |
| NEXT_PUBLIC_API_URL | Backend API URL | No |

To obtain a Gemini API key:
1. Visit the [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create or sign in to your Google account
3. Generate an API key
4. Copy the key to your `.env.local` file

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

## Testing
The project uses Vitest and React Testing Library for testing. To run tests:
```bash
npm test
```

For watch mode:
```bash
npm run test:watch
```

## How to Contribute

### 1. Fork the Repository
Fork the repository to your own GitHub account.

### 2. Create a Feature Branch
Create a new branch for your feature or bug fix:
```bash
git checkout -b feature/AmazingFeature
```

### 3. Make Your Changes
- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new functionality
- Update documentation as needed

### 4. Test Your Changes
Before submitting your changes:
```bash
# Run all tests
npm test

# Check linting
npm run lint

# Build the project
npm run build
```

### 5. Commit Your Changes
```bash
git commit -m 'Add some AmazingFeature'
```

### 6. Push to Your Branch
```bash
git push origin feature/AmazingFeature
```

### 7. Open a Pull Request
Open a Pull Request against the dev branch with:
- Clear description of changes
- Screenshots (if applicable)
- Links to related issues

## Code Style Guidelines

### TypeScript
- Use TypeScript for all new code
- Define proper types for components and functions
- Avoid using `any` type unless absolutely necessary

### React Components
- Use functional components with hooks
- Follow the naming convention: PascalCase for components
- Keep components small and focused on a single responsibility

### File Structure
- Components go in the `components/` directory
- Utilities go in the `lib/` directory
- Types go in the `types/` directory
- Tests go in the `__tests__/` directory

### Styling
- Use Tailwind CSS classes for styling
- Follow the existing design patterns
- Ensure responsive design across all screen sizes

## Data Contributions

### Adding Tourist Destinations
To add new destinations to the database (`data/sections.js`):

1. Follow the existing data structure
2. Ensure accurate location information
3. Include relevant categories (Hill Station, Historical, Beach, Wildlife)
4. Verify data quality and accuracy

### Geographic Data
When updating map data (`app/start/india-geoJson.json`):
- Maintain GeoJSON format standards
- Ensure coordinate accuracy
- Test map rendering after changes

## Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser and device information
- Screenshots or error messages

## Feature Requests

For feature requests:
- Check existing issues first
- Provide clear use case and benefits
- Include mockups or examples if applicable
- Discuss implementation approach

## Troubleshooting

### Common Issues

**API rate limiting**: If encountering rate limiting with the Gemini API:
- The application automatically retries with exponential backoff
- Check your API quota in the Google AI Studio
- Consider implementing a caching strategy for common requests

**Build errors**:
- Ensure Node.js version is 18.17.0 or higher
- Clear the `.next` cache directory and rebuild

**Map rendering issues**:
- Check console for any CORS errors
- Ensure GeoJSON data is properly formatted

## Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow the project's code of conduct

## Special Thanks

Special mention to [Udit-001](https://github.com/udit-001/india-maps-data) for compiling the data of Indian states and geography.

## Questions?

If you have questions about contributing:
- 📧 [Contact us](mailto:iamrishi.dev47@gmail.com)
- 🐛 [Report issues](https://github.com/Heisen47/itinerarly-FE/issues) on GitHub

Thank you for contributing to Itinerarly! 🎉
