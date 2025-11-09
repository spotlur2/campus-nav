'use client'
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Popup, Circle, Button, CircleMarker} from 'react-leaflet';
import style from '../Map/map.module.css';
import * as L from "leaflet";

const fillBlueOptions = { fillColor: 'blue' }

const centerLibrary = [39.256510, -76.711616];
const centerRAC = [39.252813, -76.712444];
const centerAdmin = [39.253056, -76.713491];
const centerITE = [39.253845, -76.714270];

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
            <Circle center={centerLibrary} pathOptions={fillBlueOptions} radius={55}>
                <Popup>This is the library</Popup>
            </Circle>
            <Circle center={centerRAC} pathOptions={fillBlueOptions} radius={50}>
                <Popup>This is the RAC</Popup>
            </Circle>
            <Circle center={centerAdmin} pathOptions={fillBlueOptions} radius={20}>
                <Popup>This is the Admin Building</Popup>
            </Circle>
            <Circle center={centerITE} pathOptions={fillBlueOptions} radius={35}>
                <Popup>This is the ITE building</Popup>
            </Circle>
        </MapContainer>



    );
}

export default Map;