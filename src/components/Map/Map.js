import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import style from '../Map/map.module.css';

function Map(){
    return(
        <MapContainer className={style.map} center={[39.255632, -76.710665]} zoom={16} scrollWheelZoom={true}>
            <TileLayer
                attribution= '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </MapContainer>
    );
}

export default Map;