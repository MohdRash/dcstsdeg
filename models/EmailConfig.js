const mongoose = require('mongoose');

const emailConfigSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, default: 'email-config' },
  smtpHost: { type: String, required: true, default: 'smtp.gmail.com' },
  smtpPort: { type: Number, required: true, default: 587 },
  secure: { type: Boolean, default: false }, // true for 465, false for other ports
  email: { type: String, required: true }, // SMTP authentication email
  password: { type: String, required: true }, // App password for Gmail
  senderEmail: { type: String }, // Custom sender email (optional, defaults to email if not set)
  fromName: { type: String, default: 'Data Center Portal' },
  isEnabled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
emailConfigSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('EmailConfig', emailConfigSchema);