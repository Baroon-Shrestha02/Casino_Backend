const nodemailer = require("nodemailer");
const { uploadFiles } = require("../Helper/ImageUploader");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const contactMail = async (req, res) => {
  try {
    const { name, email, phone, course, description } = req.body;
    let fileUrl = null;
    let attachments = [];

    // Handle optional file upload
    if (req.files && req.files.file) {
      const uploaded = await uploadFiles(req.files.file);
      fileUrl = uploaded.url;
      const uploadedFile = req.files.file;

      if (uploadedFile && uploadedFile.tempFilePath) {
        attachments.push({
          filename: uploadedFile.name || "attachment",
          path: uploadedFile.tempFilePath,
          contentType: uploadedFile.mimetype || undefined,
        });
      }
    }

    // Enhanced HTML email template
    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact - Inquiry</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .header p {
          margin: 10px 0 0 0;
          opacity: 0.9;
          font-size: 16px;
        }
        .content {
          padding: 30px;
        }
        .inquiry-details {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 25px;
          margin-bottom: 20px;
        }
        .detail-row {
          display: flex;
          margin-bottom: 15px;
          padding: 12px 0;
          border-bottom: 1px solid #e9ecef;
        }
        .detail-row:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
        .detail-label {
          font-weight: 600;
          color: #495057;
          min-width: 120px;
          margin-right: 15px;
        }
        .detail-value {
          color: #212529;
          flex: 1;
        }
        .description-box {
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 5px;
          padding: 15px;
          margin-top: 5px;
          font-style: italic;
        }
        .timestamp {
          background: #e3f2fd;
          border-left: 4px solid #2196f3;
          padding: 15px;
          margin-top: 20px;
          border-radius: 0 5px 5px 0;
        }
        .timestamp strong {
          color: #1976d2;
        }
        .file-info {
          background: #fff3e0;
          border-left: 4px solid #ff9800;
          padding: 15px;
          margin-top: 15px;
          border-radius: 0 5px 5px 0;
        }
        .footer {
          background: #343a40;
          color: white;
          padding: 20px;
          text-align: center;
          font-size: 14px;
        }
        .logo {
          width: 50px;
          height: 50px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          margin: 0 auto 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: bold;
        }
        @media (max-width: 600px) {
          .detail-row {
            flex-direction: column;
          }
          .detail-label {
            min-width: auto;
            margin-bottom: 5px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>New Contact - Inquiry</h1>
          <p>Casino Training Nepal</p>
        </div>
        
        <div class="content">
          <div class="inquiry-details">
            <div class="detail-row">
              <div class="detail-label">👤 Full Name:</div>
              <div class="detail-value">${name || "Not provided"}</div>
            </div>
            
            <div class="detail-row">
              <div class="detail-label">📧 Email:</div>
              <div class="detail-value">${email || "Not provided"}</div>
            </div>
            
            <div class="detail-row">
              <div class="detail-label">📱 Phone:</div>
              <div class="detail-value">${phone || "Not provided"}</div>
            </div>
            
            <div class="detail-row">
              <div class="detail-label">🎓 Course:</div>
              <div class="detail-value">${course || "Not specified"}</div>
            </div>
            
            <div class="detail-row">
              <div class="detail-label">📝 Message:</div>
              <div class="detail-value">
                ${
                  description
                    ? `<div class="description-box">${description}</div>`
                    : "<em>No additional message provided</em>"
                }
              </div>
            </div>
          </div>
          
          ${
            fileUrl
              ? `<div class="file-info">
              <strong>📎 File Attachment:</strong><br>
              <a href="${fileUrl}" target="_blank" style="color: #ff9800; text-decoration: none;">View Uploaded File</a>
            </div>`
              : ""
          }
          
          <div class="timestamp">
            <strong>🕒 Inquiry Received:</strong> ${new Date().toLocaleString(
              "en-US",
              {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZoneName: "short",
              }
            )}
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Casino Training Nepal</strong></p>
          <p>Professional Gaming & Hospitality Training Institute</p>
          <p>📍 Talchikhel Gate, Satdobato, Lalitpur, Hansol Building 1st floor | 📞 +977 985-1407135 | 🌐 www.casinotrainingnepal.com</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Enhanced plain text version
    const plainTextTemplate = `
╔══════════════════════════════════════════════════════════╗
║                    NEW COURSE INQUIRY                    ║
║                  Casino Training Nepal                   ║
╚══════════════════════════════════════════════════════════╝

📋 INQUIRY DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Full Name:     ${name || "Not provided"}
📧 Email:         ${email || "Not provided"}
📱 Phone:         ${phone || "Not provided"}
🎓 Course:        ${course || "Not specified"}

📝 Message:
${
  description
    ? `┌─────────────────────────────────────────────────────────┐
│ ${description.replace(/\n/g, "\n│ ")}
└─────────────────────────────────────────────────────────┘`
    : "   No additional message provided"
}

${fileUrl ? `📎 File Attachment: ${fileUrl}\n` : ""}

🕒 Inquiry Received: ${new Date().toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    })}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Casino Training Nepal - Professional Gaming & Hospitality Training
📍 Location | 📞 +977-XXXXXXXXX | 🌐 www.casinotrainingnepal.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;

    // Mail options with enhanced template
    // Mail options using Resend
    const mailOptions = {
      from: "Casino Training Nepal <noreply@casinotrainingnepal.com>", // ✅ use your verified domain
      to: "casinotrainingnepal@gmail.com", // ✅ where you want to receive inquiries
      subject: `🎓 New Course Inquiry from ${name || "Interested Student"} - ${
        course || "General Inquiry"
      }`,
      text: plainTextTemplate,
      html: htmlTemplate,
      attachments: attachments.length
        ? attachments.map((file) => ({
            filename: file.filename,
            path: file.path,
          }))
        : undefined,
    };

    await resend.emails.send(mailOptions);

    res.status(200).json({
      success: true,
      message: "Inquiry sent successfully",
      data: {
        name,
        email,
        phone,
        course,
        hasAttachment: !!fileUrl,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error sending inquiry:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send inquiry",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = { contactMail };
