const ALERT_TYPES = {
  ACCIDENT: 'ACCIDENT',
  HAZARD: 'HAZARD',
  REPORT: 'REPORT',
  EMERGENCY: 'EMERGENCY',
  TRAFFIC_JAM: 'TRAFFIC_JAM'
};

const REPORT_TYPES = {
  POLICE_HARASSMENT: 'police_harassment',
  EXTORTION: 'extortion',
  UNSAFE_PARKING: 'unsafe_parking',
  ACCIDENT_ZONE: 'accident_zone',
  POOR_ROAD: 'poor_road',
  ACCIDENT: 'accident',
  ROAD_CLOSED: 'road_closed',
  HAZARD: 'hazard',
  POTHOLE: 'pothole',
  SLIPPERY_ROAD: 'slippery_road',
  LANDSLIDE: 'landslide',
  FOG_AREA: 'fog_area',
  OTHER: 'other'
};

const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  STATE_ADMIN: 'STATE_ADMIN',
  AUTHORITY: 'AUTHORITY',
  DRIVER: 'DRIVER'
};

const ALERT_STATUS = {
  ACTIVE: 'ACTIVE',
  RESPONDED: 'RESPONDED',
  RESOLVED: 'RESOLVED'
};

const ALERT_SEVERITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

module.exports = {
  ALERT_TYPES,
  REPORT_TYPES,
  USER_ROLES,
  ALERT_STATUS,
  ALERT_SEVERITY
};
