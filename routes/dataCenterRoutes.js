const express = require('express');
const router = express.Router();
const DataCenter = require('../models/DataCenter');

// Get all data centers
router.get('/', async (req, res) => {
  try {
    const dataCenters = await DataCenter.find();
    res.json(dataCenters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single data center
router.get('/:id', async (req, res) => {
  try {
    const dataCenter = await DataCenter.findOne({ id: req.params.id });
    if (!dataCenter) {
      return res.status(404).json({ message: 'Data center not found' });
    }
    res.json(dataCenter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new data center
router.post('/', async (req, res) => {
  try {
    // Check for ID conflicts
    const existingDataCenter = await DataCenter.findOne({ id: req.body.id });
    if (existingDataCenter) {
      return res.status(400).json({ message: 'Data center ID already exists' });
    }

    const dataCenter = new DataCenter(req.body);
    const newDataCenter = await dataCenter.save();
    res.status(201).json(newDataCenter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a data center
router.patch('/:id', async (req, res) => {
  try {
    const dataCenter = await DataCenter.findOne({ id: req.params.id });
    if (!dataCenter) {
      return res.status(404).json({ message: 'Data center not found' });
    }

    // Handle array fields specially to prevent complete overwrite
    const arrayFields = ['services', 'certifications', 'amenities', 'nearbyServices'];
    arrayFields.forEach(field => {
      if (req.body[field]) {
        dataCenter[field] = [...new Set([...dataCenter[field], ...req.body[field]])];
        delete req.body[field];
      }
    });

    // Update seismic activity data
    if (req.body.realTimeData?.seismicActivity) {
      dataCenter.realTimeData.seismicActivity = {
        ...dataCenter.realTimeData.seismicActivity,
        ...req.body.realTimeData.seismicActivity
      };
      delete req.body.realTimeData.seismicActivity;
    }

    // Update disaster warnings
    if (req.body.disasterWarning?.activeWarnings) {
      // Add new warnings while keeping existing ones that are still relevant
      const existingWarnings = dataCenter.disasterWarning.activeWarnings || [];
      const newWarnings = req.body.disasterWarning.activeWarnings;
      
      dataCenter.disasterWarning.activeWarnings = [
        ...existingWarnings.filter(warning => {
          const warningTime = new Date(warning.timestamp);
          const hoursSinceWarning = (Date.now() - warningTime) / (1000 * 60 * 60);
          return hoursSinceWarning < 24; // Keep warnings less than 24 hours old
        }),
        ...newWarnings
      ];
      delete req.body.disasterWarning.activeWarnings;
    }

    // Update other disaster warning fields
    ['safetyMeasures', 'evacuationRoutes', 'backupSystems'].forEach(field => {
      if (req.body.disasterWarning?.[field]) {
        dataCenter.disasterWarning[field] = req.body.disasterWarning[field];
        delete req.body.disasterWarning[field];
      }
    });

    // Update remaining fields
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'object' && req.body[key] !== null) {
        dataCenter[key] = { ...dataCenter[key], ...req.body[key] };
      } else {
        dataCenter[key] = req.body[key];
      }
    });

    const updatedDataCenter = await dataCenter.save();
    res.json(updatedDataCenter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a data center
router.delete('/:id', async (req, res) => {
  try {
    const result = await DataCenter.deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Data center not found' });
    }
    res.json({ message: 'Data center deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get seismic activity for a data center
router.get('/:id/seismic', async (req, res) => {
  try {
    const dataCenter = await DataCenter.findOne({ id: req.params.id });
    if (!dataCenter) {
      return res.status(404).json({ message: 'Data center not found' });
    }
    res.json(dataCenter.realTimeData.seismicActivity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get active disaster warnings for a data center
router.get('/:id/warnings', async (req, res) => {
  try {
    const dataCenter = await DataCenter.findOne({ id: req.params.id });
    if (!dataCenter) {
      return res.status(404).json({ message: 'Data center not found' });
    }
    res.json(dataCenter.disasterWarning.activeWarnings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;