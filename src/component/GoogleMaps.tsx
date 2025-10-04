import { Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

export default function GoogleMaps({
  markers,
}: {
  markers?: { lat: number; lng: number }[];
}) {
  const isSingleMarker = markers?.length === 1;
  return (
    <Map
      defaultCenter={
        isSingleMarker
          ? markers?.[0]
          : { lat: -36.8959556817715, lng: -60.328641079582454 }
      } // Olavarría
      defaultZoom={isSingleMarker ? 16 : 10}
      mapId={import.meta.env.VITE_GOOGLE_MAPS_ID} // Requerido para AdvancedMarker
      className="w-1/2"
    >
      {markers?.map((marker, index) => (
        <AdvancedMarker key={index} position={marker}>
          <Pin
            background={"#FF0000"}
            borderColor={"#FFFFFF"}
            glyphColor={"#FFFFFF"}
          />
        </AdvancedMarker>
      ))}
    </Map>
  );
}
