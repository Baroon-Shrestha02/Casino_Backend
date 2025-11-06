const nodemailer = require("nodemailer");
const { uploadFiles } = require("../Helper/ImageUploader");

const sendMail = async (req, res) => {
  try {
    const { name, email, phone, course } = req.body;
    let fileUrl = null;
    let attachments = [];

    // Handle file upload
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

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // or 587 if using secure: false
      secure: true, // true for port 465, false for 587
      auth: {
        user: "casinotrainingnepal@gmail.com",
        pass: "jfsnijmixdupizcg", // use App Password
      },
    });

    // Enhanced HTML email template
    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Course Inquiry</title>
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
        .quick-actions {
          background: #f0f8ff;
          border-radius: 8px;
          padding: 20px;
          margin-top: 20px;
          text-align: center;
        }
        .action-button {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
          margin: 0 10px;
          font-weight: 500;
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
          <h1>New Resume(CV) Received</h1>
          <p>Casino Training Nepal</p>
        </div>
        
        <div class="content">
          <div class="inquiry-details">
            <div class="detail-row">
              <div class="detail-label">👤 Full Name:</div>
              <div class="detail-value"><strong>${
                name || "Not provided"
              }</strong></div>
            </div>
            
            <div class="detail-row">
              <div class="detail-label">📧 Email:</div>
              <div class="detail-value">
                <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">
                  ${email || "Not provided"}
                </a>
              </div>
            </div>
            
            <div class="detail-row">
              <div class="detail-label">📱 Phone:</div>
              <div class="detail-value">
                <a href="tel:${phone}" style="color: #667eea; text-decoration: none;">
                  ${phone || "Not provided"}
                </a>
              </div>
            </div>
            
            <div class="detail-row">
              <div class="detail-label">🎓 Course:</div>
              <div class="detail-value"><strong style="color: #764ba2;">${
                course || "Not specified"
              }</strong></div>
            </div>
          </div>
          
          ${
            fileUrl
              ? `<div class="file-info">
              <strong>📎 File Attachment:</strong><br>
              <a href="${fileUrl}" target="_blank" style="color: #ff9800; text-decoration: none; font-weight: 500;">
                View Uploaded Document
              </a>
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

📋 STUDENT DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Full Name:     ${name || "Not provided"}
📧 Email:         ${email || "Not provided"}
📱 Phone:         ${phone || "Not provided"}
🎓 Course:        ${course || "Not specified"}

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

📞 QUICK ACTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Reply to student: ${email}
• Call student: ${phone}
• Course Interest: ${course}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Casino Training Nepal - Professional Gaming & Hospitality Training
📍 Kathmandu, Nepal | 📞 +977-XXXX-XXXXX | 🌐 www.casinotrainingnepal.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;

    // Enhanced mail options
    const mailOptions = {
      from: "casinotrainingnepal@gmail.com",
      to: "casinotrainingnepal@gmail.com",
      subject: `🎓 New Course Inquiry: ${name || "Student"} - ${
        course || "General Interest"
      }`,
      text: plainTextTemplate,
      html: htmlTemplate,
      attachments,
      // Add reply-to for easy response
      replyTo: email || "casinotrainingnepal@gmail.com",
      // Email headers for better organization
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        "X-Category": "Course Inquiry",
      },
    };

    await transporter.sendMail(mailOptions);

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
        inquiryId: `INQ-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)
          .toUpperCase()}`,
      },
    });
  } catch (error) {
    console.error("Error sending inquiry:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send inquiry",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
      timestamp: new Date().toISOString(),
    });
  }
};

module.exports = { sendMail };
