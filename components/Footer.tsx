import React from 'react'

const Footer: React.FC = () => (
  <footer className="bg-gray-800 p-4">
    <div className="container mx-auto">
      <p className="text-white text-center">&copy; {new Date().getFullYear()} Itinerary App. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer