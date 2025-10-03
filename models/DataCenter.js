const mongoose = require('mongoose');

// Custom validator for number fields that can be null
const validateNumber = {
  validator: function(v) {
    return v === null || !isNaN(v);
  },
  message: props => `${props.value} is not a valid number`
};

const dataCenterSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  location: String,
  city: String,
  country: String,
  coordinates: {
    lat: { type: Number, validate: validateNumber },
    lng: { type: Number, validate: validateNumber }
  },
  tier: String,
  description: String,
  website: String,
  established: String,
  operator: String,
  specifications: {
    totalSpace: String,
    power: String,
    cooling: String,
    floors: { type: Number, validate: validateNumber },
    rackCount: { type: Number, validate: validateNumber },
    powerDensity: String
  },
  capacity: {
    used: { type: Number, validate: validateNumber },
    availableRacks: { type: Number, validate: validateNumber },
    status: {
      type: String,
      enum: ['Available', 'Limited', 'Full']
    },
    lastUpdated: String
  },
  connectivity: {
    carriers: [String],
    bandwidth: String,
    internetExchanges: [String],
    fiberProviders: [String],
    cloudOnRamps: [String]
  },
  cablingType: {
    type: String,
    enum: ['none', 'local', 'undersea'],
    default: 'none'
  },
  services: [String],
  security: {
    level: String,
    accessControl: String,
    surveillance: String,
    compliance: [String]
  },
  certifications: [String],
  sustainability: {
    pue: { type: Number, validate: validateNumber },
    renewableEnergy: { type: Number, validate: validateNumber },
    carbonNeutral: Boolean,
    greenCertifications: [String]
  },
  contact: {
    phone: String,
    email: String,
    website: String,
    salesTeam: String,
    support: String
  },
  pricing: {
    colocation: String,
    dedicatedServer: String,
    cloudHosting: String,
    bandwidth: String,
    setup: String
  },
  amenities: [String],
  nearbyServices: [String],
  reviews: {
    rating: { type: Number, validate: validateNumber },
    totalReviews: { type: Number, validate: validateNumber },
    reliability: { type: Number, validate: validateNumber },
    support: { type: Number, validate: validateNumber },
    value: { type: Number, validate: validateNumber },
    recentReviews: [String]
  },
  realTimeData: {
    temperature: { type: Number, validate: validateNumber },
    humidity: { type: Number, validate: validateNumber },
    powerUsage: { type: Number, validate: validateNumber },
    networkLatency: { type: Number, validate: validateNumber },
    uptime: { type: Number, validate: validateNumber },
    seismicActivity: {
      magnitude: { type: Number, validate: validateNumber, default: null },
      depth: { type: Number, validate: validateNumber, default: null },
      timestamp: { type: String, default: null },
      location: {
        lat: { type: Number, validate: validateNumber, default: null },
        lng: { type: Number, validate: validateNumber, default: null },
        distance: { type: Number, validate: validateNumber, default: null } // Distance from data center in km
      },
      intensity: { type: Number, validate: validateNumber, default: null } // Modified Mercalli Intensity Scale
    }
  },
  disasterWarning: {
    activeWarnings: [{
      type: {
        type: String,
        enum: ['earthquake', 'flood', 'hurricane', 'tornado', 'tsunami', 'fire']
      },
      severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical']
      },
      message: String,
      timestamp: String,
      estimatedImpact: String,
      recommendedActions: [String]
    }],
    safetyMeasures: [{
      type: String,
      description: String,
      status: {
        type: String,
        enum: ['active', 'standby', 'maintenance']
      },
      lastTested: String
    }],
    evacuationRoutes: [{
      name: String,
      description: String,
      coordinates: [{
        lat: Number,
        lng: Number
      }]
    }],
    backupSystems: [{
      type: String,
      status: {
        type: String,
        enum: ['active', 'standby', 'maintenance']
      },
      capacity: String,
      runtime: String
    }]
  }
});

module.exports = mongoose.model('DataCenter', dataCenterSchema);