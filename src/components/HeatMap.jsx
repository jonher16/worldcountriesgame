// components/HeatMap.js
import React from 'react';
import countryPaths from '../assets/updated_grouped_country_paths.json';

export default function HeatMap({ heatmapData }) {
  const getColor = (country) => {
    const normalizedCountry = country.trim().toLowerCase();
    const percentage = heatmapData[normalizedCountry];
    if (percentage === undefined) return '#ececec'; // Default color
    const hue = (percentage * 120) / 100; // 0 (red) to 120 (green)
    const saturation = 60; // Reduced saturation for softer colors
    const lightness = 60; // Higher lightness for a more pleasant look
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  return (
    <svg width="100%" height="100%" viewBox="0 0 2000 857">
      {countryPaths.map((country) =>
        country.paths.map((path, index) => (
          <path
            key={`${country.class}-${index}`}
            d={path.d}
            fill={getColor(country.class)}
            stroke="black"
            strokeWidth="0.5"
          />
        ))
      )}
    </svg>
  );
}
