import json
import re

# Input and output file paths
input_file = "grouped_country_paths.json"
output_file = "updated_grouped_country_paths.json"

def extract_coordinates(path_d):
    """
    Parse space-separated coordinate pairs that follow 'M/m' or 'L/l' commands.
    Returns a flat list of (x,y) tuples.
    """
    coords = []
    # Regex: capture all numeric sequences after 'M/m' or 'L/l' until next command.
    pattern = r"[MmLl]\s*((?:-?\d+(?:\.\d+)?\s+){1,}-?\d+(?:\.\d+)?)"
    chunks = re.findall(pattern, path_d)

    for chunk in chunks:
        numbers = chunk.strip().split()
        for i in range(0, len(numbers), 2):
            if i + 1 < len(numbers):
                x = float(numbers[i])
                y = float(numbers[i + 1])
                coords.append((x, y))
    return coords


def polygon_area_and_centroid(coords):
    """
    Compute (area, cx, cy) for the polygon described by coords,
    using the shoelace formula for area and centroid.

    Returns:
      (abs_area, centroid_x, centroid_y)

    If the polygon has fewer than 3 distinct points or the area is near zero,
    area is returned as 0, and centroid reverts to a naive average.
    """
    n = len(coords)
    if n < 3:
        # Fewer than 3 points => no real polygon
        if n == 0:
            return 0, 0, 0
        x_avg = sum(x for x, _ in coords) / n
        y_avg = sum(y for _, y in coords) / n
        return 0, x_avg, y_avg

    # Ensure polygon is "closed" for shoelace
    if coords[0] != coords[-1]:
        coords = coords + [coords[0]]

    area_sum = 0
    cx_sum = 0
    cy_sum = 0
    for i in range(len(coords) - 1):
        x_i, y_i = coords[i]
        x_next, y_next = coords[i + 1]
        cross = x_i * y_next - x_next * y_i
        area_sum += cross
        cx_sum += (x_i + x_next) * cross
        cy_sum += (y_i + y_next) * cross

    signed_area = 0.5 * area_sum
    abs_area = abs(signed_area)

    if abs_area < 1e-9:
        # Very small or zero area; revert to naive average
        coords_no_repeat = coords[:-1]  # since we closed it above
        nnr = len(coords_no_repeat)
        x_avg = sum(x for x, _ in coords_no_repeat) / nnr
        y_avg = sum(y for _, y in coords_no_repeat) / nnr
        return 0, x_avg, y_avg

    cx = (1.0 / (6.0 * signed_area)) * cx_sum
    cy = (1.0 / (6.0 * signed_area)) * cy_sum
    return abs_area, cx, cy


# Load the JSON file
with open(input_file, "r", encoding="utf-8") as file:
    countries = json.load(file)

for country in countries:
    paths = country.get("paths", [])
    if not paths:
        # No paths => default center
        print(f"No centroid for {country.get('class','???')}. No paths. Using (0,0).")
        country["center"] = {"x": 0, "y": 0}
        continue

    largest_area = 0
    best_centroid = None
    best_coords = None

    # Evaluate each path
    for path_obj in paths:
        path_d = path_obj["d"]
        coords = extract_coordinates(path_d)
        area, cx, cy = polygon_area_and_centroid(coords)
        if area > largest_area:
            largest_area = area
            best_centroid = (cx, cy)
            best_coords = coords

    # If no centroid was set or area was zero => fallback to naive if we have coords
    if best_centroid is None:
        # Possibly all polygons had near-zero area or no coords
        print(f"No centroid for {country.get('class','???')}. Adding fallback point.")
        if best_coords:
            x_vals = [pt[0] for pt in best_coords]
            y_vals = [pt[1] for pt in best_coords]
            cx = sum(x_vals) / len(x_vals)
            cy = sum(y_vals) / len(y_vals)
            best_centroid = (cx, cy)
        else:
            best_centroid = (0, 0)

    # Store final centroid
    country["center"] = {"x": best_centroid[0], "y": best_centroid[1]}


# Write out the updated JSON
with open(output_file, "w", encoding="utf-8") as file:
    json.dump(countries, file, indent=2)

print(f"Updated JSON saved to {output_file}")
