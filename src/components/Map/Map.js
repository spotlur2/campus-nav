'use client'
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Popup, Circle, Button, CircleMarker} from 'react-leaflet';
import style from '../Map/map.module.css';
import * as L from "leaflet";

const fillBlueOptions = { fillColor: 'blue' }

//When the page loads up, the first val is y axis, more = move circle up, less = move circle down
//second val is x axis, increase = move left, decrease = move right ***this val is negative already so watch signs

const centerLibrary = [39.256510, -76.711616];
const centerRAC = [39.252813, -76.712444];
const centerAdmin = [39.253056, -76.713491];
const centerITE = [39.253845, -76.714270];
const centerEngie = [39.254540, -76.7139501];
const centerFineArts = [39.255173, -76.7136548];
const centerMeyerhoff = [39.254917, -76.712790];
const centerUC = [39.254291, -76.713233];
const centerSherman = [39.253636, -76.713423];
const centerSondheim = [39.253441, -76.712769];
const centerMath = [39.254107, -76.712454];
const centerILSB = [39.253916, -76.710854];
const centerCommons = [39.254916, -76.711014];
const centerPhys = [39.254448, -76.709589];
const centerPUP = [39.255166, -76.709107];
const centerWellBeing = [39.256064, -76.708909];
const centerPAHB = [39.25522, -76.715312];

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
            <Circle center={centerEngie} pathOptions={fillBlueOptions} radius={35}>
                <Popup>This is the Engineering Building</Popup>
            </Circle>
            <Circle center={centerFineArts} pathOptions={fillBlueOptions} radius={35}>
                <Popup>This is the Fine Arts Building</Popup>
            </Circle>
            <Circle center={centerMeyerhoff} pathOptions={fillBlueOptions} radius={35}>
                <Popup>This is the Meyerhoff Building</Popup>
            </Circle>
            <Circle center={centerUC} pathOptions={fillBlueOptions} radius={30}>
                <Popup>This is the University Center</Popup>
            </Circle>
            <Circle center={centerSherman} pathOptions={fillBlueOptions} radius={37}>
                <Popup>This is the Sherman Hall Building</Popup>
            </Circle>
            <Circle center={centerSondheim} pathOptions={fillBlueOptions} radius={25}>
                <Popup>This is Sondheim Building</Popup>
            </Circle>
            <Circle center={centerMath} pathOptions={fillBlueOptions} radius={20}>
                <Popup>This is the Math and Psychology Building</Popup>
            </Circle>
            <Circle center={centerCommons} pathOptions={fillBlueOptions} radius={40}>
                <Popup>This is the Commons </Popup>
            </Circle>
            <Circle center={centerPhys} pathOptions={fillBlueOptions} radius={30}>
                <Popup>This is the Physics Building</Popup>
            </Circle>
            <Circle center={centerPUP} pathOptions={fillBlueOptions} radius={30}>
                <Popup>This is the Public Policy Building</Popup>
            </Circle>
            <Circle center={centerWellBeing} pathOptions={fillBlueOptions} radius={25}>
                <Popup>This is Center for Well Being</Popup>
            </Circle>
            <Circle center={centerMath} pathOptions={fillBlueOptions} radius={20}>
                <Popup>This is the Math and Psychology Building</Popup>
            </Circle>
            <Circle center={centerPAHB} pathOptions={fillBlueOptions} radius={50}>
                <Popup>This is the Performing Arts and Humanities Building </Popup>
            </Circle>
            <Circle center={centerILSB} pathOptions={fillBlueOptions} radius={30}>
                <Popup>This is the ILSB</Popup>
            </Circle>
        </MapContainer>



    );
}

export default Map;