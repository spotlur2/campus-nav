'use client'

import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Circle, Marker, Polyline, ImageOverlay, useMap } from 'react-leaflet';
import style from './map.module.css';
import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import POIPopup from '../popup/POIPopup';


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

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

//X: + goes up, - goes down
//Y: more neg goes left, more pos goes right
const AcademicOverlays = [
  { name: 'Information Technology and Engineering Building', url: 'https://upload.wikimedia.org/wikipedia/commons/2/22/ITE_%281%29.png', bounds:[[39.254205, -76.714465],[39.25401, -76.713828], [39.253440, -76.714078], [39.253635, -76.71473]], z: 1, opac: .3, interact: true},
  { name: 'Engineering Building', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/EngineeringUMBC.png', bounds:[[39.254170535654, -76.7143764200593], [39.25486763981565, -76.71353167818892]], z: 1, opac: .3, interact: true},
  { name: 'Fine Arts Building', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/FineArts.png', bounds:[[39.25480048685964, -76.71412677139425], [39.255558295739974, -76.71319129273988]], z: 1, opac: .3, interact: true},
  { name: 'Meyerhoff Chemistry Building', url: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/ChemUMBC.png', bounds:[[39.25453952348338, -76.71325919334863], [39.25530733375251, -76.71234846684347]], z: 1, opac: .3, interact: true},
  { name: 'University Center', url: 'https://upload.wikimedia.org/wikipedia/commons/3/31/UcUMBC.png', bounds:[[39.25400844095874, -76.71350852128446], [39.2546664490429, -76.71299035868697]], z: 1, opac: .3, interact: true},
  { name: 'Sherman Hall', url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Sherman.png', bounds:[[39.253276205528325, -76.71388534517192], [39.254008874476906, -76.71295873676108]], z: 1, opac: .3, interact: true},
  { name: 'Administration Building', url: 'https://upload.wikimedia.org/wikipedia/commons/5/50/AdminUMBC.png', bounds:[[39.25288071492984, -76.71371788581409], [39.25323758702623, -76.713269086354]], z: 1, opac: .3, interact: true},
  { name: 'Sondheim Hall', url: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Sondheim.png', bounds:[[39.25316715300227, -76.71303660729053],[39.25377010732074, -76.71254425292532]], z: 1, opac: .3, interact: true},
  { name: 'Interdisciplinary Life Sciences Building', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Umbcilsb.png', bounds:[[39.25368099319077, -76.7113194480998],[39.25421944687733, -76.71037440847265]], z: 1, opac: .3, interact: true},
  { name: 'Physics Building', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Umbcphys.png', bounds:[[39.25420413335488, -76.70991836024124],[39.25476944758286, -76.70922680804943]], z: 1, opac: .3, interact: true},
  { name: 'Math and Psychology Building', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Umbcmath.png', bounds:[[39.25380247455104, -76.71271463594683],[39.25440455099473, -76.7122295181268]], z: 1, opac: .3, interact: true},
  { name: 'Biological Sciences Building', url: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Umbcbio.png', bounds:[[39.2544482682781, -76.71244959766986],[39.25544873063857, -76.71171810444133]], z: 1, opac: .3, interact: true},
  { name: 'Performing Arts and Humanities Building', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Umbcpahb.png', bounds:[[39.25478540477454, -76.71613774852261],[39.25584358802797, -76.71459984384417]], z: 1, opac: .3, interact: true},
  { name: 'Albin O. Kuhn Library & Gallery', url: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Umbclib.png', bounds:[[39.25606674446351, -76.71246210741242],[39.25707974464078, -76.7107067198907]], z: 1, opac: .3, interact: true},
  { name: 'Public Policy Building', url: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Umbcpup.png', bounds:[[39.2549825212351, -76.7095150211758],[39.25541790150362, -76.70874270143506]], z: 1, opac: .3, interact: true},
];

//X: + goes up, - goes down
//Y: more neg goes left, more pos goes right
const RecOverlays = [
  { name: 'The Center for Well-Being', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Umbchealth.png', bounds:[[39.255878452374325, -76.70916505097642],[39.25624054142026, -76.70866669869644]], z: 1, opac: .3, interact: true},
  { name: 'Retriever Activities Center', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Umbcrac.png', bounds:[[39.252307057669926, -76.7131793184523],[39.253406400018686, -76.71192710981711]], z: 1, opac: .3, interact: true},
  { name: 'The Commons', url: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Umbccommons.png', bounds:[[39.25441036651792, -76.71163912443332],[39.2553225267232, -76.71047918566166]], z: 1, opac: .3, interact: true},
]
const ParkingPOIs = [
  {name: 'Administration Drive Garage', center: [39.252050,-76.712743]},
  {name: 'Commons Drive Garage', center: [39.253459351003,-76.70988436380637]},
  {name: 'Walker Avenue Garage', center: [39.25733967577822,-76.71237861482834]},
  {name: 'Lot 1', center: [39.25350888249007,-76.70850292273148]},
  {name: 'Lot 2', center: [39.25429432478357,-76.70889844576566]},
  {name: 'Lot 3', center: [39.25442580927875, -76.70766078138759]},
  {name: 'Lot 4', center: [39.25482782773867,-76.70827964359925]},
  {name: 'Lot 5', center: [39.25772810832697,-76.70802358617365]},
  {name: 'Lot 6', center: [39.25862386427897,-76.7110124390106]},
  {name: 'Lot 7', center: [39.25712546791812,-76.71060763258053]},
  {name: 'Lot 8', center: [39.2561151240322,-76.71562438201605]},
  {name: 'Lot 9', center: [39.25449255925222,-76.71517675194633]},
  {name: 'Lot 10', center: [39.2577756078262,-76.7137077575889]},
  {name: 'Lot 11', center: [39.25621233852476,-76.70815496697239]},
  {name: 'Lot 12', center: [39.25641587432619,-76.70681118027422]},
  {name: 'Lot 20', center: [39.2608297948732,-76.7143695522274]},
  {name: 'Lot 21', center: [39.25928061307836,-76.7150822753429]},
  {name: 'Lot 22', center: [39.25739636783017,-76.7179582584592]},
  {name: 'Lot 23', center: [39.25481572114567,-76.70522967468509]},
  {name: 'Lot 24', center: [39.254277278232266,-76.70423129796498]},
  {name: 'Lot 25', center: [39.254646723523116,-76.70283922922277]},
  {name: 'Lot 26', center: [39.25262678861871,-76.70484493718644]},
  {name: 'Lot 27', center: [39.252273696860556,-76.70625577907481]},
  {name: 'Lot 28', center: [39.25139719081476,-76.70709799266281]},
  {name: 'Lot 29', center: [39.25845892861631,-76.71615977632929]},
  {name: 'Lot 30', center: [39.25836982624469,-76.71721817770758]},
  {name: 'Lot 31', center: [39.259851677140674,-76.71462441699336]},
]

// Build POIS with calculated center for overlays
const POIS = [
  ...ParkingPOIs,
  ...AcademicOverlays.map(a => ({
    name: a.name,
    center: [
      (a.bounds[0][0] + a.bounds[1][0]) / 2,
      (a.bounds[0][1] + a.bounds[1][1]) / 2
    ]
  })),
  ...RecOverlays.map(r => ({
    name: r.name,
    center: [
      (r.bounds[0][0] + r.bounds[1][0]) / 2,
      (r.bounds[0][1] + r.bounds[1][1]) / 2
    ]
  }))
];

const fillBlueOptions = { fillOpacity: 1, fillColor: 'blue', color: '' };
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

function RoutePolyline({ path }) {
  const map = useMap();
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

function FlyToPOI({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 18);
  }, [coords, map]);
  return null;
}

export default function Map({ selectedPOI: externalPOI }) {
  const [poiState, setPoiState] = useState({ name: null, data: null, coords: null });
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState(null);

  const handlePOIClick = async (poiName) => {
    setLoading(true);
    try {
      const docSnap = await getDoc(doc(db, 'searchBar', poiName));
      const data = docSnap.exists() ? docSnap.data() : {};
      const poiCoords = POIS.find(p => p.name === poiName)?.center || null;
      setPoiState({ name: poiName, data, coords: poiCoords });
    } catch (err) {
      console.error('Error fetching POI data:', err);
      const poiCoords = POIS.find(p => p.name === poiName)?.center || null;
      setPoiState({ name: poiName, data: {}, coords: poiCoords });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (externalPOI) handlePOIClick(externalPOI);
  }, [externalPOI]);

  const closePopup = () => setPoiState({ name: null, data: null, coords: null });

  const navigateToPOI = async () => {
    if (!userLocation || !poiState.name) return;
    setLoading(true);
    try {
      const res = await fetch('/api/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userLocation, endPOI: poiState.name }),
      });
      const data = await res.json();
      if (data.path) setPath(data.path);
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
        <LocationMarker setUserLocation={setUserLocation} />
        <FlyToPOI coords={poiState.coords} />

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
        {RecOverlays.map(poi => (
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
        {ParkingPOIs.map(poi => (
          <Marker
            key={poi.name}
            position={poi.center}
            eventHandlers={{ click: () => handlePOIClick(poi.name) }}
          />
        ))}

        <TileLayer
          attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {path && <RoutePolyline path={path} />}
      </MapContainer>

      {poiState.name && (
        <POIPopup
          poiName={poiState.name}
          poiData={poiState.data}
          loading={loading}
          onClose={closePopup}
          onNavigate={navigateToPOI}
        />
      )}
    </div>
  );
}
