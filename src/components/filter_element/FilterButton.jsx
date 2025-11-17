"use client";
import styles from "./filter.module.css";

export default function FilterButton() {
  return (
    <button className={styles.faqButton}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        className={styles.icon}
      >
        <path d="M3.9 54.6A32 32 0 0 1 32 32h448a32 32 0 0 1 28.1 48.6L320 320v128a32 32 0 0 1-51.2 25.6l-64-48A32 32 0 0 1 192 400V320L3.9 80.6A32 32 0 0 1 3.9 54.6z" />
      </svg>
      <span className={styles.tooltip}>Filter</span>
    </button>
  );
}