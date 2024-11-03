import countryPaths from '../assets/grouped_country_paths.json';

export default function CountryMap({ matchedCountries }) {
  return (
    <div style={styles.container}>
      <svg width="100%" height="100%" viewBox="0 0 2000 857">
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
