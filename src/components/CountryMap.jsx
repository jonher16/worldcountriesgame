import { useState } from 'react';
import countryPaths from '../assets/grouped_country_paths.json';

export default function CountryMap({ matchedCountries }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewBox, setViewBox] = useState("0 0 2000 857");
  const originalWidth = 2000;
  const originalHeight = 857;

  const handleLeftClick = (event) => {
    const svgRect = event.target.getBoundingClientRect();
    const clickX = ((event.clientX - svgRect.left) / svgRect.width) * originalWidth;
    const clickY = ((event.clientY - svgRect.top) / svgRect.height) * originalHeight;

    // Increase zoom level up to a maximum and reset if needed
    const newZoomLevel = zoomLevel < 8 ? zoomLevel * 2 : 1; // Reset zoom after reaching maximum
    setZoomLevel(newZoomLevel);

    // Calculate the new viewBox size based on the zoom level
    const viewBoxWidth = originalWidth / newZoomLevel;
    const viewBoxHeight = originalHeight / newZoomLevel;

    // Set viewBox to center around the clicked point
    const newViewBox = `${clickX - viewBoxWidth / 2} ${clickY - viewBoxHeight / 2} ${viewBoxWidth} ${viewBoxHeight}`;
    setViewBox(newViewBox);
  };

  const handleRightClick = (event) => {
    event.preventDefault();
    // Reset zoom level and viewBox to initial state
    setZoomLevel(1);
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
