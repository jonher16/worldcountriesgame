import countries from '../assets/grouped_country_paths.json';

export default function validateCountry(input) {
  const country = countries.find((country) =>
    country.class.toLowerCase() === input.toLowerCase()
  );
  return country ? country.class : null;
}
