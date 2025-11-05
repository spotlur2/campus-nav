import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import style from '../Map/map.module.css';
import * as L from "leaflet";

function Map(){
    return(
        /*
        className: Takes style from components\Map\map.module.css
        center: center point of the map when the page loads
        zoom: default zoom level when the page loads
        scrollWheelzoom: allows the scroll wheel to perform zoom features
        minZoom/maxZoom: the min and max zoom values that a user can use, these are to limit the user from zooming too far in or out
        */
        <MapContainer className={style.map} center={[39.255632, -76.710665]}
             zoom={16} scrollWheelZoom={true} minZoom={16} maxZoom={18}>
            <TileLayer
                attribution= '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            const svgElement
        </MapContainer>
    );
}

export default Map;