import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function MyGoogleMap({ context }) {
    return (
        <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
                mapContainerStyle={context.style ? context.style : null}
                center={context.center ? context.center : { lat: -27.45167, lng: -58.98667 }}
                zoom={context.zoom ? context.zoom : 15}>
                {context.center && (
                    <Marker position={context.center} />)
                }
            </GoogleMap>
        </LoadScript>
    );
}
export default MyGoogleMap;