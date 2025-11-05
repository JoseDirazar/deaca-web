import { Map, AdvancedMarker, Pin, useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";
function FitBounds({ markers }: { markers: { lat: number; lng: number }[] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || markers.length === 0) return;

    if (markers.length === 1) {
      // Si solo hay un marcador, centramos y seteamos zoom manual
      map.setCenter(markers[0]);
      map.setZoom(16);
    } else {
      // Creamos límites y ajustamos la vista
      const bounds = new google.maps.LatLngBounds();
      markers.forEach((m) => bounds.extend(m));
      map.fitBounds(bounds, 50); // 50px de padding opcional
    }
  }, [map, markers]);

  return null;
}
export default function GoogleMaps({
  markers,
  className,
}: {
  markers?: { lat: number; lng: number; title: string }[];
  className?: string;
}) {
  return (
    <Map
      defaultCenter={{ lat: -36.8959556817715, lng: -60.328641079582454 }}
      defaultZoom={14}
      mapId={import.meta.env.VITE_GOOGLE_MAPS_ID}
      className={className}
    >
      <FitBounds markers={markers || []} />

      {markers?.map((marker, index) => (
        <AdvancedMarker key={index} position={marker} title={marker.title}>
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
