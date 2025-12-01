'use client'

import dynamic from 'next/dynamic';
import SearchBar from '../components/search_element/SearchBar';
import FilterButton from '../components/filter_element/FilterButton';
import ProfileSelector from '../components/profile_elements/ProfileButtons';
import { useState, useEffect } from 'react';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function Home() {
  const [selectedPOI, setSelectedPOI] = useState<string | null>(null);

  const handleSearchSelect = (poiName: string) => {
    console.log("Selected from search:", poiName);
    setSelectedPOI(poiName);     // Send POI name to Map
  };

  useEffect(() => {
    const handler = (e: Event) => {
      try {
        // CustomEvent has detail, but TS/Event typing is generic, so guard
        const ce = e as CustomEvent;
        const name = ce?.detail;
        if (name && typeof name === 'string') {
          console.log('page.tsx: received poi-selected event for', name);
          setSelectedPOI(name);
        }
      } catch (err) {
        console.warn('page.tsx: error handling poi-selected event', err);
      }
    };
    window.addEventListener('poi-selected', handler);
    return () => window.removeEventListener('poi-selected', handler);
  }, []);

  return (
    <main className="relative h-screen w-screen flex flex-col">

      {/* Top-right Profile Radio Buttons */}
      <div className="fixed top-4 right-4 z-[9999]">
        <ProfileSelector />
      </div>

      {/* Top Search Bar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] w-[300px]">
        <SearchBar onSelect={handleSearchSelect} />
      </div>

      {/* Bottom-right Filter Button */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <FilterButton />
      </div>

      {/* Fullscreen Map */}
      <div className="App">
        <Map 
          selectedPOI={selectedPOI} 
          onClearSelectedPOI={() => setSelectedPOI(null)}
        />
      </div>

    </main>
  );
}
