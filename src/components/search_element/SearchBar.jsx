'use client'

import React, { useState, useEffect } from "react";
import styles from "./search.module.css";
import SearchDropdown from "./SearchDropdown";

import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

if (!getApps().length) initializeApp(firebaseConfig);
const db = getFirestore();

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState("");
  const [allNames, setAllNames] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function loadNames() {
      try {
        const snap = await getDocs(collection(db, "searchBar"));
        const names = snap.docs.map((d) => d.id);
        if (mounted) setAllNames(names);
      } catch (e) {
        console.error('SearchBar: error loading names', e);
      }
    }
    loadNames();
    return () => { mounted = false; };
  }, []);

  // Live filtering
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const filtered = allNames.filter((name) =>
      name.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered.slice(0, 8)); // max 8 results
  }, [query, allNames]);

  const handleSelect = (name) => {
    console.log('SearchBar: selected', name);
    try {
      if (typeof onSelect === 'function') onSelect(name);
    } catch (e) {
      console.warn('SearchBar: onSelect threw', e);
    }

    try {
      window.dispatchEvent(new CustomEvent('poi-selected', { detail: name }));
      console.log('SearchBar: dispatched poi-selected event for', name);
    } catch (e) {
      console.warn('SearchBar: failed to dispatch poi-selected event', e);
    }

    setQuery("");
    setResults([]);
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <label className={styles.searchLabel}>
        <input
          type="text"
          className={styles.input}
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <svg
          className={styles.searchIcon}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 56.966 56.966"
        >
          <path
            d="M55.146 51.887 41.588 37.786A22.926 22.926 0 0 0 46.984 23c0-12.682-10.318-23-23-23s-23 10.318-23 23 10.318 23 23 23c4.761 0 9.298-1.436 13.177-4.162l13.661 14.208c.571.593 1.339.92 2.162.92.779 0 1.518-.297 2.079-.837a3.004 3.004 0 0 0 .083-4.242zM23.984 6c9.374 0 17 7.626 17 17s-7.626 17-17 17-17-7.626-17-17 7.626-17 17-17z"
            fill="currentColor"
          />
        </svg>
      </label>

      <SearchDropdown
        results={results}
        onSelect={handleSelect}
      />
    </div>
  );
}
