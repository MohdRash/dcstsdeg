const express = require('express');
const router = express.Router();
const EmailConfig = require('../models/EmailConfig');

// Get email configuration
router.get('/', async (req, res) => {
  try {
    let emailConfig = await EmailConfig.findOne({ id: 'email-config' });
    
    if (!emailConfig) {
      // Create default configuration if it doesn't exist
      emailConfig = new EmailConfig({
        id: 'email-config',
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        secure: false,
        email: '',
        password: '',
        fromName: 'Data Center Portal',
        isEnabled: false
      });
      await emailConfig.save();
    }
    
    // Don't send password in response for security
    const configResponse = {
      id: emailConfig.id,
      smtpHost: emailConfig.smtpHost,
      smtpPort: emailConfig.smtpPort,
      secure: emailConfig.secure,
      email: emailConfig.email,
      fromName: emailConfig.fromName,
      isEnabled: emailConfig.isEnabled,
      createdAt: emailConfig.createdAt,
      updatedAt: emailConfig.updatedAt
    };
    
    res.json(configResponse);
  } catch (error) {
    console.error('Error fetching email config:', error);
    res.status(500).json({ error: 'Failed to fetch email configuration' });
  }
});

// Update email configuration
router.put('/', async (req, res) => {
  try {
    const { smtpHost, smtpPort, secure, email, password, fromName, isEnabled } = req.body;
    
    let emailConfig = await EmailConfig.findOne({ id: 'email-config' });
    
    if (!emailConfig) {
      emailConfig = new EmailConfig({ id: 'email-config' });
    }
    
    // Update fields
    if (smtpHost !== undefined) emailConfig.smtpHost = smtpHost;
    if (smtpPort !== undefined) emailConfig.smtpPort = smtpPort;
    if (secure !== undefined) emailConfig.secure = secure;
    if (email !== undefined) emailConfig.email = email;
    if (password !== undefined) emailConfig.password = password;
    if (fromName !== undefined) emailConfig.fromName = fromName;
    if (isEnabled !== undefined) emailConfig.isEnabled = isEnabled;
    
    await emailConfig.save();
    
    // Don't send password in response for security
    const configResponse = {
      id: emailConfig.id,
      smtpHost: emailConfig.smtpHost,
      smtpPort: emailConfig.smtpPort,
      secure: emailConfig.secure,
      email: emailConfig.email,
      fromName: emailConfig.fromName,
      isEnabled: emailConfig.isEnabled,
      createdAt: emailConfig.createdAt,
      updatedAt: emailConfig.updatedAt
    };
    
    res.json(configResponse);
  } catch (error) {
    console.error('Error updating email config:', error);
    res.status(500).json({ error: 'Failed to update email configuration' });
  }
});

// Test email configuration
router.post('/test', async (req, res) => {
  try {
    const { testEmail } = req.body;
    
    if (!testEmail) {
      return res.status(400).json({ error: 'Test email address is required' });
    }
    
    const emailConfig = await EmailConfig.findOne({ id: 'email-config' });
    
    if (!emailConfig || !emailConfig.isEnabled) {
      return res.status(400).json({ error: 'Email configuration is not enabled' });
    }
    
    const nodemailer = require('nodemailer');
    
    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: emailConfig.smtpHost,
      port: emailConfig.smtpPort,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.email,
        pass: emailConfig.password
      }
    });
    
    // Send test email
    const mailOptions = {
      from: `${emailConfig.fromName} <${emailConfig.email}>`,
      to: testEmail,
      subject: 'Test Email from Data Center Portal',
      html: `
        <h2>Email Configuration Test</h2>
        <p>This is a test email to verify that your email configuration is working correctly.</p>
        <p>If you received this email, your Nodemailer setup is functioning properly!</p>
        <hr>
        <p><small>Sent from Data Center Portal</small></p>
      `
    };
    
    await transporter.sendMail(mailOptions);
    
    res.json({ message: 'Test email sent successfully!' });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ error: 'Failed to send test email: ' + error.message });
  }
});

module.exports = router;