// src/components/CountryMap.jsx
import { useState, useEffect } from 'react';
import countryPaths from '../assets/updated_grouped_country_paths.json';

export default function CountryMap({ matchedCountries, children }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewBox, setViewBox] = useState("0 0 2000 857");
  const [isMobile, setIsMobile] = useState(false);
  const originalWidth = 2000;
  const originalHeight = 857;
  const maxZoomLevel = 4; // Allow only 2 zoom clicks (1 -> 2 -> 4)
  const minZoomLevel = 1;

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleInteraction = (event) => {
    // If on mobile, we'll use tap for zooming - desktop maintains original click behavior
    if (isMobile) {
      handleMobileZoom(event);
    } else {
      handleDesktopClick(event);
    }
  };

  const handleMobileZoom = (event) => {
    const svg = event.currentTarget;
    const svgRect = svg.getBoundingClientRect();

    // Current viewBox parameters
    const [currentX, currentY, currentWidth, currentHeight] = viewBox.split(' ').map(Number);

    // Calculate tap position relative to the current viewBox
    const tapX = currentX + ((event.clientX || event.touches[0].clientX) - svgRect.left) / svgRect.width * currentWidth;
    const tapY = currentY + ((event.clientY || event.touches[0].clientY) - svgRect.top) / svgRect.height * currentHeight;

    // Determine the new zoom level
    let newZoomLevel = zoomLevel * 1.5; // Slightly gentler zoom for mobile
    if (newZoomLevel > maxZoomLevel) {
      newZoomLevel = minZoomLevel; // Reset to initial zoom if max is reached
    }
    setZoomLevel(newZoomLevel);

    // Calculate the new viewBox size based on the zoom level
    const viewBoxWidth = originalWidth / newZoomLevel;
    const viewBoxHeight = originalHeight / newZoomLevel;

    // Calculate the top-left coordinates to center the viewBox around the tapped point
    let newViewBoxX = tapX - viewBoxWidth / 2;
    let newViewBoxY = tapY - viewBoxHeight / 2;

    // Clamp the viewBox coordinates to ensure they stay within the SVG boundaries
    if (newViewBoxX < 0) newViewBoxX = 0;
    if (newViewBoxY < 0) newViewBoxY = 0;
    if (newViewBoxX + viewBoxWidth > originalWidth) newViewBoxX = originalWidth - viewBoxWidth;
    if (newViewBoxY + viewBoxHeight > originalHeight) newViewBoxY = originalHeight - viewBoxHeight;

    // Set the new viewBox
    const newViewBoxStr = `${newViewBoxX} ${newViewBoxY} ${viewBoxWidth} ${viewBoxHeight}`;
    setViewBox(newViewBoxStr);
  };

  const handleDesktopClick = (event) => {
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

  const handleDoubleTouch = () => {
    // Reset zoom level on double tap for mobile
    if (isMobile) {
      setZoomLevel(minZoomLevel);
      setViewBox("0 0 2000 857");
    }
  };

  // Make mobile layout simpler to avoid interactions with keyboard
  if (isMobile) {
    return (
      <div className="mobile-map-container" style={{height: '100%', width: '100%'}}>
        <style>{`
          .mobile-map-container {
            width: 100%;
            height: 100%;
            overflow: hidden;
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
          }
          
          .mobile-map-svg {
            width: 100%;
            height: 100%;
            display: block;
            touch-action: manipulation;
            user-select: none;
          }
        `}</style>
        <svg
          className="mobile-map-svg"
          viewBox={viewBox}
          onClick={handleMobileZoom}
          onDoubleClick={handleDoubleTouch}
          onTouchEnd={handleInteraction}
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

  // Desktop layout unchanged
  return (
    <div style={styles.container}>
      <svg
        width="100%"
        height="100%"
        viewBox={viewBox}
        onClick={handleDesktopClick}
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