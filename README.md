# Jelly Belly Collection - Aardy

A modern Next.js application that showcases the Jelly Belly collection with advanced sorting and filtering capabilities, built with the latest Next.js features including Partial Prerendering (PPR).

## Features

- **Next.js 15.5.4** with Partial Prerendering (PPR) for optimal performance
- **Tailwind CSS v4** for modern, responsive styling
- **TypeScript** for type safety
- **Jelly Belly API Integration** - Fetches real data from the official API
- **Advanced Sorting** - Sort by name, flavor group, and sugar-free status
- **Smart Filtering** - Filter by flavor groups
- **Responsive Design** - Works perfectly on all device sizes
- **Accessibility** - Built with accessibility best practices
- **Image Optimization** - Next.js Image component for optimal loading
- **Loading States** - Smooth loading experience with Suspense

## Tech Stack

- **Framework**: Next.js 15.5.4 (latest)
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **API**: Jelly Belly Wiki API
- **Features**: Partial Prerendering, App Router, Server Components

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Aardy
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Key Features Explained

### Partial Prerendering (PPR)
The application uses Next.js PPR to prerender the static shell while keeping dynamic content client-side. The main page structure is prerendered, while the jelly bean data is fetched and rendered on the client.

### Sorting Options
- **Name (A-Z / Z-A)**: Alphabetical sorting
- **Flavor Group (A-Z / Z-A)**: Sort by flavor categories
- **Sugar-Free Status**: Show sugar-free or regular first

### Filtering
- **Flavor Groups**: Filter by specific flavor categories like "Sugar-Free Assorted Flavors", "Superfruit Flavors", etc.

### Responsive Design
- Mobile-first approach
- Grid layout that adapts from 1 column on mobile to 4 columns on desktop
- Touch-friendly interface elements

## API Integration

The application integrates with the Jelly Belly Wiki API:
- **Endpoint**: `https://jellybellywikiapi.onrender.com/api/Beans`
- **Caching**: 1-hour cache for optimal performance
- **Error Handling**: Graceful error handling with fallbacks

## Performance Optimizations

- **Image Optimization**: Next.js Image component with responsive sizing
- **Code Splitting**: Automatic code splitting with Next.js
- **Caching**: API responses cached for 1 hour
- **Partial Prerendering**: Static shell with dynamic content
- **Bundle Optimization**: Tree shaking and minification

## Accessibility Features

- **Semantic HTML**: Proper heading hierarchy and landmarks
- **ARIA Labels**: Screen reader friendly
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG compliant color schemes
- **Focus Management**: Clear focus indicators

## Future Enhancements

Given more time, I would implement:

1. **Search Functionality**: Full-text search across jelly bean names and descriptions
2. **Favorites System**: Allow users to save favorite jelly beans
3. **Advanced Filters**: Filter by ingredients, color, or other properties
4. **Dark Mode**: Toggle between light and dark themes
5. **Jelly Bean Details Modal**: Detailed view with more information