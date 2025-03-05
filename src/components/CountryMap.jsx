// src/components/CountryMap.js
import { useState } from 'react';
import countryPaths from '../assets/updated_grouped_country_paths.json';

export default function CountryMap({ matchedCountries, children }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewBox, setViewBox] = useState("0 0 2000 857");
  const originalWidth = 2000;
  const originalHeight = 857;
  const maxZoomLevel = 4; // Allow only 2 zoom clicks (1 -> 2 -> 4)
  const minZoomLevel = 1;

  const handleLeftClick = (event) => {
    const svg = event.currentTarget;
    const svgRect = svg.getBoundingClientRect();

    // Current viewBox parameters
    const [currentX, currentY, currentWidth, currentHeight] = viewBox.split(' ').map(Number);

    // Calculate click position relative to the current viewBox
    const clickX = currentX + ((event.clientX - svgRect.left) / svgRect.width) * currentWidth;
    const clickY = currentY + ((event.clientY - svgRect.top) / svgRect.height) * currentHeight;

    // Determine the new zoom level
    let newZoomLevel = zoomLevel * 2;
    if (newZoomLevel > maxZoomLevel) {
      newZoomLevel = minZoomLevel; // Reset to initial zoom if max is reached
    }
    setZoomLevel(newZoomLevel);

    // Calculate the new viewBox size based on the zoom level
    const viewBoxWidth = originalWidth / newZoomLevel;
    const viewBoxHeight = originalHeight / newZoomLevel;

    // Calculate the top-left coordinates to center the viewBox around the clicked point
    let newViewBoxX = clickX - viewBoxWidth / 2;
    let newViewBoxY = clickY - viewBoxHeight / 2;

    // Clamp the viewBox coordinates to ensure they stay within the SVG boundaries
    if (newViewBoxX < 0) newViewBoxX = 0;
    if (newViewBoxY < 0) newViewBoxY = 0;
    if (newViewBoxX + viewBoxWidth > originalWidth) newViewBoxX = originalWidth - viewBoxWidth;
    if (newViewBoxY + viewBoxHeight > originalHeight) newViewBoxY = originalHeight - viewBoxHeight;

    // Set the new viewBox
    const newViewBoxStr = `${newViewBoxX} ${newViewBoxY} ${viewBoxWidth} ${viewBoxHeight}`;
    setViewBox(newViewBoxStr);
  };

  const handleRightClick = (event) => {
    event.preventDefault();
    // Reset zoom level and viewBox to initial state
    setZoomLevel(minZoomLevel);
    setViewBox("0 0 2000 857");
  };

  return (
    <div style={styles.container}>
      <svg
        width="100%"
        height="100%"
        viewBox={viewBox}
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
        {children}
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
    position: 'relative',
    overflow: 'hidden',
  },
};
