const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const EmailConfig = require('../models/EmailConfig');

// Send contact form email
router.post('/send', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        error: 'All fields are required: name, email, subject, message' 
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Get email configuration
    const emailConfig = await EmailConfig.findOne({ id: 'email-config' });
    
    if (!emailConfig || !emailConfig.isEnabled) {
      return res.status(400).json({ 
        error: 'Email service is not configured or disabled. Please contact administrator.' 
      });
    }
    
    if (!emailConfig.email || !emailConfig.password) {
      return res.status(400).json({ 
        error: 'Email credentials are not configured. Please contact administrator.' 
      });
    }
    
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
    
    // Determine the sender email to use
    const senderEmail = emailConfig.senderEmail || emailConfig.email;
    
    // Email content for admin
    const adminMailOptions = {
      from: `${emailConfig.fromName} <${senderEmail}>`,
      to: emailConfig.email, // Send to configured admin email
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px;">
            <h3 style="color: #007bff; margin-top: 0;">Message</h3>
            <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #e9ecef; border-radius: 5px;">
            <p style="margin: 0; font-size: 12px; color: #6c757d;">
              This email was sent from the Data Center Portal contact form.
              <br>Received on: ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `
    };
    
    // Auto-reply email for user
    const userReplyOptions = {
      from: `${emailConfig.fromName} <${senderEmail}>`,
      to: email,
      subject: `Thank you for contacting us - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            Thank You for Your Message
          </h2>
          
          <p>Dear ${name},</p>
          
          <p>Thank you for contacting us through our Data Center Portal. We have received your message and will get back to you as soon as possible.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">Your Message Summary</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Submitted on:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <p>If you have any urgent matters, please don't hesitate to contact us directly.</p>
          
          <p>Best regards,<br>
          <strong>Data Center Portal Team</strong></p>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #e9ecef; border-radius: 5px;">
            <p style="margin: 0; font-size: 12px; color: #6c757d;">
              This is an automated response. Please do not reply to this email.
            </p>
          </div>
        </div>
      `
    };
    
    // Send both emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userReplyOptions)
    ]);
    
    res.json({ 
      message: 'Your message has been sent successfully! We will get back to you soon.',
      success: true 
    });
    
  } catch (error) {
    console.error('Error sending contact form email:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to send message. Please try again later.';
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please contact administrator.';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Email server connection failed. Please contact administrator.';
    } else if (error.responseCode === 535) {
      errorMessage = 'Email authentication failed. Please check email credentials.';
    }
    
    res.status(500).json({ 
      error: errorMessage,
      success: false 
    });
  }
});

module.exports = router;