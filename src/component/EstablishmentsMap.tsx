import { generateImageUrl } from "@/lib/generate-image-url";
import { Map, AdvancedMarker, Pin, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router";

function FitBounds({ markers }: { markers: { lat: number; lng: number }[] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || markers.length === 0) return;

    if (markers.length === 1) {
      map.setCenter(markers[0]);
      map.setZoom(16);
    } else {
      const bounds = new google.maps.LatLngBounds();
      markers.forEach((m) => bounds.extend(m));
      map.fitBounds(bounds, 50);
    }
  }, [map, markers]);

  return null;
}

type MarkerData = {
  lat: number;
  lng: number;
  title: string;
  image?: string;
  slug: string;
};

export default function EstablishmentsMap({
  markers,
  className,
}: {
  markers?: MarkerData[];
  className?: string;
}) {
  const [selected, setSelected] = useState<MarkerData | null>(null);
  const map = useMap();

  // guardamos los bounds para restaurarlos después
  const bounds = useMemo(() => {
    if (!markers?.length) return null;
    const b = new google.maps.LatLngBounds();
    markers.forEach((m) => b.extend(m));
    return b;
  }, [markers]);

  useEffect(() => {
    if (selected && map) {
      // centramos el marcador seleccionado, pero desplazamos el centro hacia arriba
      const offsetLat = -0.0007; // mueve el punto un poco hacia abajo visualmente
      map.panTo({
        lat: selected.lat - offsetLat,
        lng: selected.lng,
      });
      map.setZoom(17);
    }
  }, [selected, map]);

  const handleClose = () => {
    setSelected(null);
    if (map && bounds) {
      map.fitBounds(bounds, 50);
    } else if (map) {
      map.setZoom(14);
    }
  };

  return (
    <div className="relative w-full">
      <Map
        defaultCenter={{ lat: -36.8959556817715, lng: -60.328641079582454 }}
        defaultZoom={14}
        mapId={import.meta.env.VITE_GOOGLE_MAPS_ID}
        className={className}
      >
        <FitBounds markers={markers || []} />

        {markers?.map((marker, index) => (
          <AdvancedMarker
            key={index}
            position={marker}
            title={marker.title}
            onClick={() => setSelected(marker)}
          >
            <Pin
              background={
                selected?.title === marker.title ? "#bd612a" : "#FF0000"
              }
              borderColor={"#FFFFFF"}
              glyphColor={"#FFFFFF"}
            />
          </AdvancedMarker>
        ))}
      </Map>

      {selected && (
        <div className="absolute top-4 left-1/2 w-58 -translate-x-1/2 animate-fade-in rounded-2xl bg-white shadow-lg transition-all duration-700">
          <button
            onClick={handleClose}
            className="absolute top-2 right-3 rounded-full bg-white px-2 font-bold text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
          <Link to={`/emprendimientos/${selected.slug}`}>
            <img
              src={generateImageUrl("establishment-logo", selected.image)}
              alt={selected.title}
              className="h-32 w-full rounded-t-xl object-cover"
            />
            <h3 className="m-4 text-center text-lg font-semibold text-gray-800">
              {selected.title}
            </h3>
          </Link>
        </div>
      )}
    </div>
  );
}
