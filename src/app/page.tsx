'use client'

import dynamic from 'next/dynamic';
import SearchBar from '../components/search_element/SearchBar';
import FilterButton from '../components/filter_element/FilterButton';
import ProfileSelector from '../components/profile_elements/ProfileButtons'; // <-- add your import

const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function Home() {
  return (
    <main className="relative h-screen w-screen flex flex-col">

      {/* Top-left Profile Radio Buttons */}
      <div className="fixed top-4 right-4 z-[9999]">
        <ProfileSelector />
      </div>

      {/* Top Search Bar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] w-[300px]">
        <SearchBar
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            console.log('Search:', e.target.value)}
        />
      </div>

      {/* Bottom-right Filter Button */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <FilterButton />
      </div>

      {/* Fullscreen Map */}
      <div className="App">
        <Map />
      </div>

    </main>
  );
}
