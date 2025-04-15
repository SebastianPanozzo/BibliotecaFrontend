import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '100vh'
};

const center = {
    lat: -27.45167,
    lng: -58.98667
};

function MyGoogleMap() {
    return (
        <LoadScript googleMapsApiKey="AIzaSyBHfojGelZfxKv9RXY1Y38yz8CjdkL5VAk">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={15}
            >
                <Marker position={center} />
            </GoogleMap>
        </LoadScript>
    );
}


function Location() {
    return (
        <div>
            <h1>Mi aplicación con Google Maps</h1>
            <MyGoogleMap />
        </div>
    );
}
export default Location;