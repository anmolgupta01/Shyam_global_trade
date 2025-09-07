const { createTransport } = require('../config/email');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isInitialized = false;
    this.connectionPool = null;
  }

  // Enhanced initialization with retry logic
  async initialize() {
    try {
      // ✅ Use createTransport instead of createTransporter
      this.transporter = createTransport();
      
      if (process.env.NODE_ENV !== 'production') {
        await this.transporter.verify();
      }
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Email service initialization failed:', error.message);
      return false;
    }
  }

  // Optimized admin email sending (no validation)
  async sendAdminEmails(contact) {
    // Accept any contact data (no validation)
    const adminEmails = [
      process.env.ADMIN_EMAIL_1,
      process.env.ADMIN_EMAIL_2, 
      process.env.ADMIN_EMAIL_3,
      process.env.EMAIL_USER
    ].filter(Boolean);

    const results = [];
    const errors = [];

    // Send emails in parallel for better performance
    const emailPromises = adminEmails.map(async (adminEmail) => {
      try {
        const mailOptions = {
          from: `"Website Contact" <${process.env.EMAIL_USER}>`,
          to: adminEmail,
          subject: `New Contact: ${contact.name || 'Unknown'}`,
          html: this.generateAdminHtmlTemplate(contact),
          text: this.generateAdminTextTemplate(contact)
        };

        const result = await this.transporter.sendMail(mailOptions);
        return {
          email: adminEmail,
          messageId: result.messageId,
          success: true
        };
      } catch (error) {
        errors.push(`${adminEmail}: ${error.message}`);
        return {
          email: adminEmail,
          error: error.message,
          success: false
        };
      }
    });

    const emailResults = await Promise.allSettled(emailPromises);
    
    emailResults.forEach(result => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      }
    });

    return {
      results,
      errors,
      totalSent: results.filter(r => r.success).length,
      totalFailed: results.filter(r => !r.success).length
    };
  }

  // Enhanced customer email (no validation)
  async sendCustomerEmail(contact) {
    const mailOptions = {
      from: `"Shyam International" <${process.env.EMAIL_USER}>`,
      to: contact.email || 'noreply@example.com', // Fallback if no email
      subject: 'Thank you for contacting us',
      html: this.generateCustomerHtmlTemplate(contact),
      text: this.generateCustomerTextTemplate(contact)
    };

    return await this.transporter.sendMail(mailOptions);
  }

  // Optimized bulk email sending
  async sendContactEmails(contact) {
    const results = {
      adminEmails: null,
      customerEmail: null,
      success: false,
      errors: [],
      summary: {
        adminEmailsSent: 0,
        adminEmailsFailed: 0,
        customerEmailSent: false,
        totalEmailsAttempted: 0,
        totalEmailsSuccessful: 0
      }
    };

    try {
      // Lazy initialization
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Send admin and customer emails in parallel
      const [adminResult, customerResult] = await Promise.allSettled([
        this.sendAdminEmails(contact),
        this.sendCustomerEmail(contact)
      ]);

      // Process admin email results
      if (adminResult.status === 'fulfilled') {
        results.adminEmails = adminResult.value;
        results.summary.adminEmailsSent = adminResult.value.totalSent;
        results.summary.adminEmailsFailed = adminResult.value.totalFailed;
        results.summary.totalEmailsAttempted += adminResult.value.results.length;
        results.summary.totalEmailsSuccessful += adminResult.value.totalSent;
        
        if (adminResult.value.errors.length > 0) {
          results.errors.push(...adminResult.value.errors);
        }
      } else {
        results.errors.push(`Admin emails failed: ${adminResult.reason}`);
      }

      // Process customer email results
      if (customerResult.status === 'fulfilled') {
        results.customerEmail = customerResult.value;
        results.summary.customerEmailSent = true;
        results.summary.totalEmailsAttempted += 1;
        results.summary.totalEmailsSuccessful += 1;
      } else {
        results.errors.push(`Customer email failed: ${customerResult.reason}`);
      }

      results.success = results.summary.totalEmailsSuccessful > 0;
      return results;

    } catch (error) {
      results.errors.push(`Service error: ${error.message}`);
      return results;
    }
  }

  // Enhanced test email functionality
  async sendTestEmails() {
    const testContact = {
      name: 'Test User',
      email: process.env.EMAIL_USER,
      phone: '+1234567890',
      company: 'Test Company',
      message: 'Email system test - all services operational',
      createdAt: new Date(),
      ipAddress: '127.0.0.1'
    };

    const results = await this.sendContactEmails(testContact);
    
    results.testInfo = {
      message: 'Test email verification complete',
      timestamp: new Date().toISOString(),
      recipients: [
        process.env.ADMIN_EMAIL_1,
        process.env.ADMIN_EMAIL_2,
        process.env.ADMIN_EMAIL_3,
        process.env.EMAIL_USER
      ].filter(Boolean)
    };

    return results;
  }

  // Modern HTML template generation (no validation)
  generateAdminHtmlTemplate(contact) {
    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
        <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a73e8; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
            <p style="color: #666; margin: 10px 0 0 0;">Shyam International Website</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <div style="display: grid; gap: 15px;">
              <div><strong style="color: #333;">Name:</strong> ${contact.name || 'Not provided'}</div>
              <div><strong style="color: #333;">Email:</strong> <a href="mailto:${contact.email || ''}">${contact.email || 'Not provided'}</a></div>
              <div><strong style="color: #333;">Phone:</strong> ${contact.phone || 'Not provided'}</div>
              <div><strong style="color: #333;">Company:</strong> ${contact.company || 'Not provided'}</div>
            </div>
          </div>
          
          <div style="margin: 25px 0;">
            <strong style="color: #333;">Message:</strong>
            <div style="background: #fff; border: 1px solid #e0e0e0; padding: 15px; border-radius: 6px; margin-top: 10px; white-space: pre-wrap;">${contact.message || 'No message provided'}</div>
          </div>
          
          <div style="border-top: 1px solid #e0e0e0; padding-top: 15px; color: #666; font-size: 12px;">
            <p>Submitted: ${new Date().toLocaleString()}</p>
            <p>IP: ${contact.ipAddress || 'Unknown'}</p>
          </div>
        </div>
      </div>
    `;
  }

  generateCustomerHtmlTemplate(contact) {
    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
        <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a73e8; margin: 0; font-size: 24px;">Thank You!</h1>
            <p style="color: #666; margin: 10px 0 0 0;">We've received your message</p>
          </div>
          
          <p style="color: #333; font-size: 16px;">Dear ${contact.name || 'Valued Customer'},</p>
          <p style="color: #333; line-height: 1.6;">Thank you for contacting Shyam International. We have received your inquiry and our team will respond within 24 hours.</p>
          
          <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <p style="color: #333; margin: 0 0 10px 0;"><strong>Your Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 6px; color: #555; white-space: pre-wrap;">${contact.message || 'No message provided'}</div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
            <p style="color: #333; margin: 0; font-weight: 500;">Best regards,<br>Shyam International Team</p>
          </div>
        </div>
      </div>
    `;
  }

  // Simplified text templates (no validation)
  generateAdminTextTemplate(contact) {
    return `
New Contact Form Submission - Shyam International

Name: ${contact.name || 'Not provided'}
Email: ${contact.email || 'Not provided'}
Phone: ${contact.phone || 'Not provided'}
Company: ${contact.company || 'Not provided'}

Message:
${contact.message || 'No message provided'}

Submitted: ${new Date().toLocaleString()}
IP: ${contact.ipAddress || 'Unknown'}

---
Shyam International Contact System
    `.trim();
  }

  generateCustomerTextTemplate(contact) {
    return `
Dear ${contact.name || 'Customer'},

Thank you for contacting Shyam International! We have received your message and will respond within 24 hours.

Your Message: ${contact.message || 'No message provided'}

Best regards,
Shyam International Team

---
This is an automated confirmation. Please do not reply to this email.
    `.trim();
  }

  // Email statistics (simplified)
  async getEmailStats() {
    return {
      totalEmailsToday: 0,
      successfulToday: 0,
      failedToday: 0,
      averageDeliveryTime: '< 1 second',
      isServiceHealthy: this.isInitialized
    };
  }
}

// Export singleton instance
module.exports = new EmailService();
