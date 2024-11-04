import { useState } from 'react';
import countryPaths from '../assets/grouped_country_paths.json';

export default function CountryMap({ matchedCountries }) {
  // Initialize viewBox as an array of numbers [x, y, width, height]
  const [viewBox, setViewBox] = useState([0, 0, 2000, 857]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const maxZoomLevel = 8; // Define maximum zoom level
  const minZoomLevel = 1; // Define minimum zoom level (no zoom)

  const handleLeftClick = (event) => {
    const svg = event.currentTarget;
    const svgRect = svg.getBoundingClientRect();

    // Current viewBox values
    const [currentX, currentY, currentWidth, currentHeight] = viewBox;

    // Calculate click position relative to the current viewBox
    const clickX = ((event.clientX - svgRect.left) / svgRect.width) * currentWidth + currentX;
    const clickY = ((event.clientY - svgRect.top) / svgRect.height) * currentHeight + currentY;

    // Determine new zoom level
    const newZoomLevel = zoomLevel < maxZoomLevel ? zoomLevel * 2 : zoomLevel;

    // Calculate new viewBox dimensions
    const newWidth = 2000 / newZoomLevel;
    const newHeight = 857 / newZoomLevel;

    // Center the viewBox around the clicked point
    let newX = clickX - newWidth / 2;
    let newY = clickY - newHeight / 2;

    // Ensure the new viewBox does not exceed SVG boundaries
    newX = Math.max(0, Math.min(newX, 2000 - newWidth));
    newY = Math.max(0, Math.min(newY, 857 - newHeight));

    setViewBox([newX, newY, newWidth, newHeight]);
    setZoomLevel(newZoomLevel);
  };

  const handleRightClick = (event) => {
    event.preventDefault();
    // Reset to initial viewBox and zoom level
    setViewBox([0, 0, 2000, 857]);
    setZoomLevel(minZoomLevel);
  };

  return (
    <div style={styles.container}>
      <svg
        width="100%"
        height="100%"
        viewBox={viewBox.join(' ')}
        onClick={handleLeftClick}
        onContextMenu={handleRightClick} // Right-click to zoom out
      >
        {countryPaths.map((country) =>
          country.paths.map((path, index) => (
            <path
              key={`${country.class}-${index}`}
              d={path.d}
              fill={matchedCountries.includes(country.class) ? '#1fd655' : '#ececec'}
              stroke="black"
              strokeWidth="0.5"
            />
          ))
        )}
      </svg>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '69vh', // Adjust the height as needed to control overall map size
  },
};
