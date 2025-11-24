'use client'

import React from 'react';
import styles from './searchDropdown.module.css';

export default function SearchDropdown({ results, onSelect }) {
  if (!results || results.length === 0) return null;

  return (
    <ul className={styles.dropdown}>
      {results.map((result) => (
        <li
          key={result}
          className={styles.item}
          onClick={() => onSelect(result)}
        >
          {result}
        </li>
      ))}
    </ul>
  );
}
