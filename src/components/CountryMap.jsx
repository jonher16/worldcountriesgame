// src/components/CountryMap.jsx
import { useState, useEffect, useRef } from 'react';
import countryPaths from '../assets/updated_grouped_country_paths.json';

export default function CountryMap({ matchedCountries, children }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewBox, setViewBox] = useState("0 0 2000 857");
  const [isMobile, setIsMobile] = useState(false);
  const originalWidth = 2000;
  const originalHeight = 857;
  const maxZoomLevel = isMobile ? 8 : 4; // Higher max zoom for mobile (8x)
  const minZoomLevel = 1;
  
  const svgRef = useRef(null);

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

  const handleMobileZoom = (event) => {
    // Prevent default to avoid unwanted browser behaviors
    event.preventDefault();
    
    const svg = event.currentTarget;
    const svgRect = svg.getBoundingClientRect();

    // Current viewBox parameters
    const [currentX, currentY, currentWidth, currentHeight] = viewBox.split(' ').map(Number);

    // Calculate tap position relative to the current viewBox
    const clientX = event.clientX || (event.touches && event.touches[0] ? event.touches[0].clientX : 0);
    const clientY = event.clientY || (event.touches && event.touches[0] ? event.touches[0].clientY : 0);
    
    const tapX = currentX + (clientX - svgRect.left) / svgRect.width * currentWidth;
    const tapY = currentY + (clientY - svgRect.top) / svgRect.height * currentHeight;

    // Use same zoom increment as desktop for consistency, but allow higher levels for mobile
    let newZoomLevel = zoomLevel * 2;
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
      <div className="mobile-map-container">
        <style>{`
          .mobile-map-container {
            width: 100%; 
            height: 100%;
            min-height: 100px;
            flex-grow: 1;
            overflow: hidden;
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .mobile-map-svg {
            width: 100%;
            height: 100%;
            display: block;
            touch-action: manipulation;
            user-select: none;
          }
          
          /* Simple zoom indicator */
          .zoom-indicator {
            position: absolute;
            top: 5px;
            left: 5px;
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            padding: 2px 5px;
            border-radius: 3px;
            font-size: 12px;
            pointer-events: none;
          }
          
          /* Flash animation for mobile - same as desktop */
          @keyframes ledFlash {
            0% { opacity: 0; transform: scale(0.95); }
            50% { opacity: 1; transform: scale(1.0); }
            100% { opacity: 0; transform: scale(1.05); }
          }
        `}</style>
        
        {zoomLevel > 1 && (
          <div className="zoom-indicator">
            Zoom: {zoomLevel}x
          </div>
        )}
        
        <svg
          ref={svgRef}
          className="mobile-map-svg"
          viewBox={viewBox}
          onClick={handleMobileZoom}
          onDoubleClick={handleDoubleTouch}
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