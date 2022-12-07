import React, { useRef, useState } from "react";

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import { MAPS_API_KEY } from "~/db/connectMaps.server";

//style
import style from "~/styles/geolocation.css";
import { useLoaderData } from "@remix-run/react";

export const links = () => [
  {
    rel: "stylesheet",
    href: style,
  },
];
const center = { lat: 48.0, lng: 2.0 };

export async function loader() {
  return MAPS_API_KEY;
}

export default function Geolocation() {
  const MAPS_API_KEY = useLoaderData();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: MAPS_API_KEY,
    libraries: ["places"],
  });

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));

  const originRef = useRef();

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="geoContainer">
      <div className="geoMapContainer">
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={map => setMap(map)}
        >
          <Marker position={center} />
        </GoogleMap>
      </div>
      <div className="geoInputContainer">
        <Autocomplete className="geoInputAutocomplete">
          <input type="text" placeholder="location" ref={originRef} />
        </Autocomplete>
        <p onClick={() => map.panTo(center)}>Go To Adress</p>

      </div>
    </div>
  );
}
