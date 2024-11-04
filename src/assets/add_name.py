import json

# Load the JSON data from the file
input_file = 'grouped_country_paths.json'
output_file = 'updated_grouped_country_paths.json'

with open(input_file, 'r') as file:
    data = json.load(file)

# Update each entry with a new `names` field that duplicates the `class` value
for country in data:
    # Create a names array with the current class value as the only entry
    country['names'] = [country['class']]

# Save the updated data to a new file
with open(output_file, 'w') as file:
    json.dump(data, file, indent=2)

print(f"Updated JSON data saved to {output_file}")
