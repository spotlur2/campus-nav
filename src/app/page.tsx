'use client'

import dynamic from 'next/dynamic';
import SearchBar from '@/components/search_element/SearchBar';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function Home() {
  return (
    <main className="relative h-screen w-screen flex flex-col">
      {/* Top section: search bar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] w-[300px]">
          <SearchBar onChange={(e: React.ChangeEvent<HTMLInputElement>) => console.log('Search:', e.target.value)} />
          </div>
      {/* Fullscreen Map */}
    <div className="App">
      <Map />
    </div>
    </main>
  );
}
