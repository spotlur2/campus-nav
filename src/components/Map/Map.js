'use client'

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Circle, Rectangle, Polygon, useMap, Polyline, ImageOverlay, SVGOverlay } from 'react-leaflet';
import style from './map.module.css';
import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import Image from 'next/image';

// FIREBASE INITIALIZATION
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

if (!getApps().length) initializeApp(firebaseConfig);
const db = getFirestore();

// DATA
const AcademicPOIS = [
  { name: 'Albin O. Kuhn Library & Gallery', center: [39.256510, -76.711616], radius: 55 },
  { name: 'Retriever Activities Center', center: [39.252813, -76.712444], radius: 50 },
  //{ name: 'Administration Building', center: [39.253056, -76.713491], radius: 20 },
  //{ name: 'Information Technology and Engineering Building', center: [39.253845, -76.714270], radius: 35 },
  //{ name: 'Engineering Building', center: [39.254540, -76.7139501], radius: 35 },
  //{ name: 'Fine Arts Building', center: [39.255173, -76.7136548], radius: 35 },
  //{ name: 'Meyerhoff Chemistry Building', center: [39.254917, -76.712790], radius: 35 },
  //{ name: 'University Center', center: [39.254291, -76.713233], radius: 30 },
  //{ name: 'Sherman Hall', center: [39.253636, -76.713423], radius: 37 },
  { name: 'Sondheim Hall', center: [39.253441, -76.712769], radius: 25 },
  { name: 'Math and Psychology Building', center: [39.254107, -76.712454], radius: 20 },
  { name: 'Interdisciplinary Life Sciences Building', center: [39.253916, -76.710854], radius: 30 },
  { name: 'The Commons', center: [39.254916, -76.711014], radius: 40 },
  { name: 'Physics Building', center: [39.254448, -76.709589], radius: 30 },
  { name: 'Public Policy Building', center: [39.255166, -76.709107], radius: 30 },
  { name: 'The Center for Well-Being', center: [39.256064, -76.708909], radius: 25 },
  { name: 'Performing Arts and Humanities Building', center: [39.25522, -76.715312], radius: 70 },
  { name: 'Biological Sciences Building', center: [39.254690, -76.712221], radius: 20 },
];


const AcademicOverlays = [
  { name: 'Information Technology and Engineering Building', url: 'https://upload.wikimedia.org/wikipedia/commons/2/22/ITE_%281%29.png', bounds:[[39.254205, -76.714465],[39.25401, -76.713828], [39.253440, -76.714078], [39.253635, -76.71473]], z: 1, opac: .3, interact: true},
  { name: 'Engineering Building', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/EngineeringUMBC.png', bounds:[[39.254170535654, -76.7143764200593], [39.25486763981565, -76.71353167818892]], z: 1, opac: .3, interact: true},
  { name: 'Fine Arts Building', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/FineArts.png', bounds:[[39.25480048685964, -76.71412677139425], [39.255558295739974, -76.71319129273988]], z: 1, opac: .3, interact: true},
  { name: 'Meyerhoff Chemistry Building', url: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/ChemUMBC.png', bounds:[[39.25453952348338, -76.71325919334863], [39.25530733375251, -76.71234846684347]], z: 1, opac: .3, interact: true},
  { name: 'University Center', url: 'https://upload.wikimedia.org/wikipedia/commons/3/31/UcUMBC.png', bounds:[[39.25400844095874, -76.71350852128446], [39.2546664490429, -76.71299035868697]], z: 1, opac: .3, interact: true},
  { name: 'Sherman Hall', url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Sherman.png', bounds:[[39.253276205528325, -76.71388534517192], [39.254008874476906, -76.71295873676108]], z: 1, opac: .3, interact: true},
  { name: 'Administration Building', url: 'https://upload.wikimedia.org/wikipedia/commons/5/50/AdminUMBC.png', bounds:[[39.25288071492984, -76.71371788581409], [39.25323758702623, -76.713269086354]], z: 1, opac: .3, interact: true},

];

//ORDER SHOULD GO TOP LEFT, TOP RIGHT, BOTTOM RIGHT, BOTTOM LEFT
//X: + goes up, - goes down
//Y: more neg goes left, more pos goes right
// const AcademicPolygon = [
//   { name: 'Engineering Building', positions: [[39.2548813, -76.71415], [39.2547098, -76.71353], [39.254174, -76.713775], [39.25435700535654, -76.7144264200593] ]},
//   { name: 'Information Technology and Engineering Building', positions: [[39.254189, -76.714465],[39.25401, -76.713815], [39.253460, -76.714078], [39.253635, -76.71473]] },
//   { name: 'Fine Arts Building', positions: [[39.255563, -76.713865], [39.255368295739974, -76.71319129273988], [39.25479648550013, -76.71346085473921], [39.25498548685964, -76.71413677139425] ]},
//   { name: 'Meyerhoff Chemistry Building', positions: [[39.25531156492454, -76.71302365466272], [39.25514333375251, -76.71235846684347], [39.25452232877047, -76.71258913681304], [39.25474352348338, -76.71328919334863] ]},
// ];

const ParkingPOIs = [
  {name: 'Administration Drive Garage', center: [39.252050,-76.712743], radius: 20},
  {name: 'Commons Drive Garage', center: [39.253459351003,-76.70958436380637], radius: 20},
  {name: 'Walker Avenue Garage', center: [39.25733967577822,-76.71237861482834], radius: 20},
  {name: 'Lot 1', center: [39.25350888249007,-76.70850292273148], radius: 20},
  {name: 'Lot 2', center: [39.25429432478357,-76.70889844576566], radius: 20},
  {name: 'Lot 3', center: [39.253973233085304,-76.70746307991577], radius: 20},
  {name: 'Lot 4', center: [39.25482782773867,-76.70827964359925], radius: 20},
  {name: 'Lot 5', center: [39.25772810832697,-76.70802358617365], radius: 20},
  {name: 'Lot 6', center: [39.25874588231905,-76.71139193648042], radius: 20},
  {name: 'Lot 7', center: [39.25712546791812,-76.71060763258053], radius: 20},
  {name: 'Lot 8', center: [39.2561151240322,-76.71562438201605], radius: 20},
]

const fillBlueOptions = { fillOpacity: .16, fillColor: 'blue', color: '' };
const daysOrder = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

// Format time from 2400 to 12-hour format
function formatTime(hourNum) {
  if (hourNum === 2400) return '12:00 AM';
  const str = hourNum.toString().padStart(4, '0');
  let hours = parseInt(str.slice(0, 2), 10);
  const minutes = parseInt(str.slice(2), 10);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes.toString().padStart(2,'0')} ${ampm}`;
}

// Center map on user location
function LocationMarker({ setUserLocation }) {
  const [position, setPosition] = useState(null);
  const map = useMap();
  const defaultCoords = [39.255632, -76.710665];

  useEffect(() => {
    if (!map) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setPosition(coords);
          setUserLocation(coords);
          map.flyTo(coords, 16);
        },
        () => {
          setPosition(defaultCoords);
          map.flyTo(defaultCoords, 16);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setPosition(defaultCoords);
      map.flyTo(defaultCoords, 16);
    }
  }, [map, setUserLocation]);

  return position ? <Circle center={position} pathOptions={fillBlueOptions} radius={10} /> : null;
}

// Component for rendering the route and auto-zooming
function RoutePolyline({ path }) {
  const map = useMap();

  // Filter out invalid nodes
  const validPath = path?.filter(p => p && typeof p.lat === 'number' && typeof p.long === 'number');

  useEffect(() => {
    if (validPath && validPath.length > 0) {
      map.fitBounds(validPath.map(p => [p.lat, p.long]));
    }
  }, [validPath, map]);

  return validPath && validPath.length > 0
    ? <Polyline positions={validPath.map(p => [p.lat, p.long])} color="red" weight={4} />
    : null;
}


// MAIN MAP COMPONENT
export default function Map() {
  const [selectedPOI, setSelectedPOI] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [poiData, setPoiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState(null);
  const [BuildingOverlay, setOverlay] = useState(true);

  const handlePOIClick = async (poiName) => {
    setLoading(true);
    setSelectedPOI(poiName);
    try {
      const docRef = doc(db, 'searchBar', poiName);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setPoiData(docSnap.data());
      else {
        setPoiData({});
        console.warn(`No document found for: ${poiName}`);
      }
    } catch (err) {
      console.error('Error fetching POI data:', err);
      setPoiData({});
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setSelectedPOI(null);
    setPoiData(null);
    setPath(null);
  };

  const navigateToPOI = async () => {
    if (!userLocation || !selectedPOI) return;
    setLoading(true);
    try {
      const res = await fetch('/api/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userLocation, endPOI: selectedPOI }),
      });
      const data = await res.json();
      if (data.path) setPath(data.path);
      else console.warn('No path returned from Neo4j');
    } catch (err) {
      console.error('Error fetching path:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <MapContainer
        className={style.map}
        center={[39.255632, -76.710665]}
        zoom={16}
        scrollWheelZoom
        minZoom={16}
        maxZoom={18}
      >
        {AcademicOverlays.map(poi => (
          <ImageOverlay
            key={poi.name}
            interactive={poi.interact}
            url={poi.url}
            bounds={poi.bounds}
            opacity={poi.opac}
            zIndex={poi.z}
            eventHandlers={{ click: () => handlePOIClick(poi.name) }}
          />
        ))}

        <TileLayer
          attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker setUserLocation={setUserLocation} />
        {AcademicPOIS.map(poi => (
          <Circle
            key={poi.name}
            center={poi.center}
            pathOptions={fillBlueOptions}
            radius={poi.radius}
            eventHandlers={{ click: () => handlePOIClick(poi.name) }}
          />
        ))}
        {path && <RoutePolyline path={path} />}
      </MapContainer>

      {/* Bottom Popup */}
      {selectedPOI && poiData && !loading && (
        <div className={style.bottomPopup}>
          <button
            onClick={closePopup}
            style={{
              position: 'absolute',
              top: '-10px',
              right: '12px',
              background: 'transparent',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#555',
            }}
          >
            ×
          </button>
          <h3>{selectedPOI}</h3>
          {poiData.description && <p>{poiData.description}</p>}
          {poiData.floor && <p>Floor: {poiData.floor}</p>}
          {poiData.room && <p>Room Number: {poiData.room}</p>}

          {poiData.hours && typeof poiData.hours === 'object' && (
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
          )}
          <button onClick={navigateToPOI}>Navigate</button>
        </div>
      )}

      {/* Loading Data */}
      {loading && selectedPOI && (
        <div className={style.bottomPopup}>
          <h3>Loading {selectedPOI}...</h3>
        </div>
      )}
    </div>
  );
}
