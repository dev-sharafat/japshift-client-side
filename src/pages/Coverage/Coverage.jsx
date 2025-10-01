import React, { useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useLoaderData } from "react-router";

// Fix leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Helper to control map
const FlyToDistrict = ({ position }) => {
  const map = useMap();
  if (position) {
    map.flyTo(position, 10, { duration: 1.5 });
  }
  return null;
};

const Coverage = () => {
  const districts = useLoaderData();
  const centerPosition = [23.685, 90.3563];
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [focusPosition, setFocusPosition] = useState(null);
  const markerRefs = useRef({});

  // Filter suggestions while typing
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setSuggestions([]);
    } else {
      const filtered = districts.filter((d) =>
        d.district.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    }
  };

  // Handle suggestion click
  const handleSelect = (districtObj) => {
    setSearchTerm(districtObj.district);
    setSuggestions([]);
    flyToMarker(districtObj);
  };

  // Pressing Enter key to jump
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const match = districts.find(
        (d) => d.district.toLowerCase() === searchTerm.toLowerCase()
      );
      if (match) {
        setSuggestions([]);
        flyToMarker(match);
      }
    }
  };

  // Reusable fly & popup logic
  const flyToMarker = (districtObj) => {
    const pos = [districtObj.latitude, districtObj.longitude];
    setFocusPosition(pos);

    setTimeout(() => {
      if (markerRefs.current[districtObj.district]) {
        markerRefs.current[districtObj.district].openPopup();
      }
    }, 500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <h2 className="text-2xl md:text-3xl font-bold text-center">
        We deliver almost all over Bangladesh
      </h2>

      {/* Search Box */}
      <div className="relative flex justify-center z-20">
        <input
          type="text"
          placeholder="Search District..."
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="input input-bordered w-full max-w-md"
        />

        {/* Suggestions overlap the map */}
        {suggestions.length > 0 && (
          <ul className="absolute top-full mt-2 bg-white shadow-lg rounded-md w-full max-w-md z-30">
            {suggestions.map((d) => (
              <li
                key={d.district}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(d)}
              >
                {d.district}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Map Section */}
      <div className="relative mt-8 h-[600px] w-full z-10">
        <MapContainer
          center={centerPosition}
          zoom={7}
          scrollWheelZoom={false}
          className="h-full w-full rounded-xl shadow-md"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />

          {focusPosition && <FlyToDistrict position={focusPosition} />}

          {districts.map((district) => (
            <Marker
              key={district.district}
              position={[district.latitude, district.longitude]}
              ref={(ref) => (markerRefs.current[district.district] = ref)}
            >
              <Popup>
                <p>We are available in {district.district}</p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Coverage;
