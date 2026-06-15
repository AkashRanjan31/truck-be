const validators = {
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPhone: (phone) => {
    const phoneRegex = /^[0-9]{10}$/; // Indian phone number format
    return phoneRegex.test(phone);
  },

  isValidPassword: (password) => {
    // At least 6 characters
    return password && password.length >= 6;
  },

  isValidCoordinates: (lat, lng) => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
  },

  isValidRole: (role) => {
    return ['SUPER_ADMIN', 'STATE_ADMIN', 'AUTHORITY', 'DRIVER'].includes(role);
  },

  isValidAlertType: (type) => {
    return ['ACCIDENT', 'HAZARD', 'REPORT', 'EMERGENCY', 'TRAFFIC_JAM'].includes(type);
  },

  isValidReportType: (type) => {
    const validTypes = ['police_harassment', 'extortion', 'unsafe_parking', 'accident_zone', 
                         'poor_road', 'other', 'accident', 'road_closed', 'hazard', 'pothole', 
                         'slippery_road', 'landslide', 'fog_area'];
    return validTypes.includes(type);
  }
};

module.exports = validators;
