const calculateDistance = (coord1, coord2) => {
  // coord1 and coord2 should be [lat, lng]
  if (!coord1 || !coord2 || coord1.length < 2 || coord2.length < 2) {
    return 0;
  }

  const toRad = Math.PI / 180;
  const R = 6371; // Earth's radius in km

  const lat1 = coord1[0] * toRad;
  const lat2 = coord2[0] * toRad;
  const deltaLat = (coord2[0] - coord1[0]) * toRad;
  const deltaLng = (coord2[1] - coord1[1]) * toRad;

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

const isWithinRadius = (coord1, coord2, radiusKm) => {
  return calculateDistance(coord1, coord2) <= radiusKm;
};

module.exports = {
  calculateDistance,
  isWithinRadius
};
