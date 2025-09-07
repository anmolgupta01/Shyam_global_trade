const generateCustomerEmailTemplate = (contact) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thank You - Shyam International</title>
          <style>
              body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .content { background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .header { color: #333; margin-bottom: 20px; text-align: center; }
              .section { margin-bottom: 20px; }
              .greeting { color: #555; line-height: 1.6; margin-bottom: 20px; }
              .summary { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
              .summary h3 { color: #333; margin-top: 0; }
              .summary p { margin: 5px 0; }
              .message-preview { background-color: white; padding: 15px; border-radius: 3px; line-height: 1.6; margin: 15px 0 5px 0; }
              .contact-info { text-align: center; margin: 30px 0; padding: 20px; background-color: #007bff; border-radius: 5px; }
              .contact-info p { color: white; margin: 0; font-weight: bold; }
              .signature { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; }
              .signature p { color: #666; font-size: 14px; margin: 5px 0; }
              .disclaimer { color: #888; font-size: 12px; margin-top: 15px; }
              .logo { text-align: center; margin-bottom: 20px; }
              .logo h1 { color: #007bff; margin: 0; font-size: 24px; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="content">
                  <div class="logo">
                      <h1>🏢 Shyam International</h1>
                  </div>
                  
                  <h2 class="header">Thank You for Contacting Us!</h2>
                  
                  <div class="section">
                      <p class="greeting">Dear ${contact.name},</p>
                      
                      <p class="greeting">
                          Thank you for reaching out to Shyam International! We have received your message and our team will review it shortly.
                      </p>
                      
                      <div class="summary">
                          <h3>Your Message Summary:</h3>
                          <p><strong>Name:</strong> ${contact.name}</p>
                          <p><strong>Email:</strong> ${contact.email}</p>
                          <p><strong>Phone:</strong> ${contact.phone}</p>
                          ${contact.company ? `<p><strong>Company:</strong> ${contact.company}</p>` : ''}
                          <p style="margin: 15px 0 5px 0;"><strong>Your Message:</strong></p>
                          <div class="message-preview">${contact.message}</div>
                      </div>
                      
                      <p class="greeting">
                          We typically respond to inquiries within 24-48 hours during business days. If your matter is urgent, please feel free to call us directly.
                      </p>
                      
                      <div class="contact-info">
                          <p>
                              📧 Email: info@shyaminternational.com<br>
                              📞 Phone: +91-XXXXXXXXXX<br>
                              🌐 Website: www.shyaminternational.com
                          </p>
                      </div>
                      
                      <p class="greeting">
                          We appreciate your interest in our services and look forward to assisting you.
                      </p>
                  </div>
                  
                  <div class="signature">
                      <p>Best regards,<br>
                      <strong>Shyam International Team</strong></p>
                      <p class="disclaimer">
                          This is an automated confirmation email. Please do not reply directly to this email.
                      </p>
                  </div>
              </div>
          </div>
      </body>
      </html>
    `;
  };
  
  module.exports = { generateCustomerEmailTemplate };