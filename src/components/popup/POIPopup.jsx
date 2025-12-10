'use client'

import React from 'react';
import style from './POIPopup.module.css';

const daysOrder = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function formatTime(hourNum) {
  if (hourNum === 2400) return '12:00 AM';
  const str = hourNum.toString().padStart(4, '0');
  let hours = parseInt(str.slice(0, 2), 10);
  const minutes = parseInt(str.slice(2), 10);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes.toString().padStart(2,'0')} ${ampm}`;
}

export default function POIPopup({ poiName, poiData, onClose, onNavigate, loading }) {
  if (loading) {
    return (
      <div className={style.bottomPopup}>
        <h3>Loading {poiName}...</h3>
      </div>
    );
  }

  if (!poiData) return null;

  return (
    <div className={style.bottomPopup}>
      <button onClick={onClose} className={style.closeButton}>×</button>
      <h3>{poiName}</h3>
      {poiData.description && <p>{poiData.description}</p>}
      {poiData.Floor && <p>Floor: {poiData.Floor}</p>}
      {poiData.Room && <p>Room Number: {poiData.Room}</p>}

      {poiData.hours && typeof poiData.hours === 'object' && (
        <div className={style.hoursContainer}>
          <table>
            <tbody>
              {daysOrder.map(day => {
                const times = poiData.hours?.[day];
                if (!Array.isArray(times) || times.length < 2) return null;
                const [open, close] = times;
                const display = open === 0 && close === 0 ? 'Closed' : `${formatTime(open)} - ${formatTime(close)}`;
                return (
                  <tr key={day}>
                    <td>{day}</td>
                    <td>{display}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {onNavigate && (
        <button className={style.navigateButton} onClick={onNavigate}>
          Navigate
        </button>
      )}
    </div>
  );
}
