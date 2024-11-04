import countries from '../assets/updated_grouped_country_paths.json';

export default function validateCountry(input) {
  // Normalize input to lowercase for case-insensitive comparison
  const normalizedInput = input.trim().toLowerCase();

  // Find a country where the normalized input matches any name in the `names` array
  const country = countries.find((country) =>
    country.names.some((name) => name.toLowerCase() === normalizedInput)
  );

  // Return the `class` of the matched country, or null if no match is found
  return country ? country.class : null;
}
