const mongoose = require('mongoose');
const DataCenter = require('./models/DataCenter');
require('dotenv').config();

const sampleDataCenters = [
  {
    id: 'dc-001',
    name: 'TechHub Data Center',
    location: 'Silicon Valley',
    city: 'San Jose',
    country: 'United States',
    coordinates: { lat: 37.3382, lng: -121.8863 },
    tier: 'Tier 3',
    description: 'State-of-the-art data center in the heart of Silicon Valley',
    website: 'https://techhub-dc.com',
    established: '2018',
    operator: 'TechHub Solutions',
    specifications: {
      totalSpace: '150,000 sq ft',
      power: '25 MW',
      cooling: 'N+1 Redundant',
      floors: 4,
      rackCount: 1200,
      powerDensity: '12 kW/rack'
    },
    capacity: {
      used: 65,
      availableRacks: 420,
      status: 'Available',
      lastUpdated: new Date().toISOString()
    },
    connectivity: {
      carriers: ['Verizon', 'AT&T', 'Level 3'],
      bandwidth: '100 Gbps',
      internetExchanges: ['Any2 California', 'CoreSite LA1'],
      fiberProviders: ['Zayo', 'Crown Castle'],
      cloudOnRamps: ['AWS Direct Connect', 'Azure ExpressRoute']
    },
    services: ['Colocation', 'Cloud Hosting', 'Managed Services'],
    security: {
      level: 'High',
      accessControl: 'Biometric + Card Access',
      surveillance: '24/7 CCTV Monitoring',
      compliance: ['SOC 2', 'HIPAA', 'PCI DSS']
    },
    certifications: ['ISO 27001', 'SOC 2 Type II'],
    sustainability: {
      pue: 1.3,
      renewableEnergy: 80,
      carbonNeutral: true,
      greenCertifications: ['LEED Gold']
    },
    contact: {
      phone: '+1-555-0123',
      email: 'sales@techhub-dc.com',
      website: 'https://techhub-dc.com',
      salesTeam: 'sales@techhub-dc.com',
      support: 'support@techhub-dc.com'
    },
    pricing: {
      colocation: '$150/kW/month',
      dedicatedServer: '$200/month',
      cloudHosting: '$0.10/hour',
      bandwidth: '$2/Mbps/month',
      setup: '$500'
    },
    amenities: ['24/7 Support', 'Remote Hands', 'Loading Dock'],
    nearbyServices: ['Restaurants', 'Hotels', 'Airport'],
    reviews: {
      rating: 4.5,
      totalReviews: 128,
      reliability: 4.7,
      support: 4.3,
      value: 4.2,
      recentReviews: ['Excellent uptime', 'Great support team', 'Competitive pricing']
    },
    realTimeData: {
      temperature: 22.5,
      humidity: 45,
      powerUsage: 18.2,
      networkLatency: 2.1,
      uptime: 99.98
    }
  },
  {
    id: 'dc-002',
    name: 'EuroCloud Frankfurt',
    location: 'Frankfurt am Main',
    city: 'Frankfurt',
    country: 'Germany',
    coordinates: { lat: 50.1109, lng: 8.6821 },
    tier: 'Tier 4',
    description: 'Premium Tier 4 data center in Europe\'s financial hub',
    website: 'https://eurocloud-fra.com',
    established: '2020',
    operator: 'EuroCloud GmbH',
    specifications: {
      totalSpace: '200,000 sq ft',
      power: '30 MW',
      cooling: '2N Redundant',
      floors: 6,
      rackCount: 1500,
      powerDensity: '15 kW/rack'
    },
    capacity: {
      used: 45,
      availableRacks: 825,
      status: 'Available',
      lastUpdated: new Date().toISOString()
    },
    connectivity: {
      carriers: ['Deutsche Telekom', 'Vodafone', 'Orange'],
      bandwidth: '200 Gbps',
      internetExchanges: ['DE-CIX Frankfurt', 'AMS-IX'],
      fiberProviders: ['euNetworks', 'Colt'],
      cloudOnRamps: ['AWS Direct Connect', 'Google Cloud Interconnect']
    },
    services: ['Colocation', 'Private Cloud', 'Disaster Recovery'],
    security: {
      level: 'Maximum',
      accessControl: 'Multi-factor Authentication',
      surveillance: 'AI-powered Security System',
      compliance: ['ISO 27001', 'GDPR', 'BSI C5']
    },
    certifications: ['ISO 27001', 'ISO 14001', 'TÜV Certified'],
    sustainability: {
      pue: 1.2,
      renewableEnergy: 100,
      carbonNeutral: true,
      greenCertifications: ['EU Green Building']
    },
    contact: {
      phone: '+49-69-123456',
      email: 'info@eurocloud-fra.com',
      website: 'https://eurocloud-fra.com',
      salesTeam: 'sales@eurocloud-fra.com',
      support: 'support@eurocloud-fra.com'
    },
    pricing: {
      colocation: '€180/kW/month',
      dedicatedServer: '€250/month',
      cloudHosting: '€0.12/hour',
      bandwidth: '€3/Mbps/month',
      setup: '€750'
    },
    amenities: ['24/7 NOC', 'Customer Lounge', 'Meeting Rooms'],
    nearbyServices: ['Financial District', 'Airport', 'Hotels'],
    reviews: {
      rating: 4.8,
      totalReviews: 95,
      reliability: 4.9,
      support: 4.7,
      value: 4.6,
      recentReviews: ['Outstanding reliability', 'Professional service', 'Top-tier facility']
    },
    realTimeData: {
      temperature: 21.8,
      humidity: 42,
      powerUsage: 22.5,
      networkLatency: 1.8,
      uptime: 99.99
    }
  },
  {
    id: 'dc-003',
    name: 'Asia Pacific Data Hub',
    location: 'Jurong East',
    city: 'Singapore',
    country: 'Singapore',
    coordinates: { lat: 1.3521, lng: 103.8198 },
    tier: 'Tier 3',
    description: 'Strategic data center serving the Asia Pacific region',
    website: 'https://apdh-sg.com',
    established: '2019',
    operator: 'APDH Pte Ltd',
    specifications: {
      totalSpace: '120,000 sq ft',
      power: '20 MW',
      cooling: 'N+1 Redundant',
      floors: 5,
      rackCount: 1000,
      powerDensity: '10 kW/rack'
    },
    capacity: {
      used: 70,
      availableRacks: 300,
      status: 'Limited',
      lastUpdated: new Date().toISOString()
    },
    connectivity: {
      carriers: ['Singtel', 'StarHub', 'M1'],
      bandwidth: '150 Gbps',
      internetExchanges: ['SGIX', 'Equinix Singapore'],
      fiberProviders: ['Singtel', 'StarHub'],
      cloudOnRamps: ['AWS Direct Connect', 'Azure ExpressRoute', 'Google Cloud']
    },
    services: ['Colocation', 'Hybrid Cloud', 'Edge Computing'],
    security: {
      level: 'High',
      accessControl: 'Smart Card + Biometric',
      surveillance: '24/7 Security Personnel',
      compliance: ['ISO 27001', 'MTCS SS 584', 'PCI DSS']
    },
    certifications: ['ISO 27001', 'MTCS Tier 3', 'BCA Green Mark'],
    sustainability: {
      pue: 1.35,
      renewableEnergy: 60,
      carbonNeutral: false,
      greenCertifications: ['BCA Green Mark Gold']
    },
    contact: {
      phone: '+65-6123-4567',
      email: 'contact@apdh-sg.com',
      website: 'https://apdh-sg.com',
      salesTeam: 'sales@apdh-sg.com',
      support: 'support@apdh-sg.com'
    },
    pricing: {
      colocation: 'S$200/kW/month',
      dedicatedServer: 'S$280/month',
      cloudHosting: 'S$0.15/hour',
      bandwidth: 'S$4/Mbps/month',
      setup: 'S$800'
    },
    amenities: ['24/7 Support', 'Customer Portal', 'Backup Services'],
    nearbyServices: ['Business Park', 'MRT Station', 'Shopping Mall'],
    reviews: {
      rating: 4.4,
      totalReviews: 76,
      reliability: 4.6,
      support: 4.2,
      value: 4.3,
      recentReviews: ['Good connectivity', 'Reliable service', 'Strategic location']
    },
    realTimeData: {
      temperature: 24.2,
      humidity: 55,
      powerUsage: 16.8,
      networkLatency: 3.2,
      uptime: 99.95
    }
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Check if data centers already exist
    const existingCount = await DataCenter.countDocuments();
    console.log(`Found ${existingCount} existing data centers`);

    if (existingCount === 0) {
      // Insert sample data
      await DataCenter.insertMany(sampleDataCenters);
      console.log(`Successfully inserted ${sampleDataCenters.length} sample data centers`);
    } else {
      console.log('Database already contains data centers. Skipping seed.');
    }

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();