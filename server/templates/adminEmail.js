const generateAdminEmailTemplate = (contact) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            🔔 New Contact Form Submission
          </h2>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #555; margin-bottom: 15px;">Contact Details:</h3>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
              <p style="margin: 5px 0;"><strong>Name:</strong> ${contact.name}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${contact.email}" style="color: #007bff;">${contact.email}</a></p>
              <p style="margin: 5px 0;"><strong>Phone:</strong> <a href="tel:${contact.phone}" style="color: #007bff;">${contact.phone}</a></p>
              ${contact.company ? `<p style="margin: 5px 0;"><strong>Company:</strong> ${contact.company}</p>` : ''}
            </div>
            
            <div style="background-color: #e9ecef; padding: 15px; border-radius: 5px;">
              <h4 style="color: #555; margin-top: 0;">Message:</h4>
              <p style="line-height: 1.6; color: #666; margin-bottom: 0;">${contact.message}</p>
            </div>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 15px; color: #888; font-size: 12px;">
            <p><strong>Submitted:</strong> ${new Date(contact.createdAt).toLocaleString()}</p>
            <p><strong>IP Address:</strong> ${contact.ipAddress || 'Not available'}</p>
            <p><strong>User Agent:</strong> ${contact.userAgent || 'Not available'}</p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">
              This email was automatically generated from your website contact form.
            </p>
          </div>
        </div>
      </div>
    `;
  };

  module.exports = { generateAdminEmailTemplate };