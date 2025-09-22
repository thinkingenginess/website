import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      clubName, 
      name, 
      role, 
      email, 
      phone,
      state, 
      city,
      interestedProduct,
      preferredDate,
      preferredTime
    } = body;

    const data = await resend.emails.send({
      from: 'Drishti Website <onboarding@resend.dev>',
      to: ['sales@techatdrishti.com'], // Replace with your email
      subject: 'New Contact Form Submission - Drishti Technologies',
            html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission - Drishti Technologies</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.5;
              color: #333;
              margin: 0;
              padding: 20px;
              background-color: #f5f5f5;
            }
            
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: #fff;
              border: 1px solid #ddd;
              border-radius: 8px;
            }
            
            .header {
              background: #232f3e;
              color: #fff;
              padding: 24px;
              border-radius: 8px 8px 0 0;
            }
            
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 600;
            }
            
            .header p {
              margin: 8px 0 0 0;
              font-size: 14px;
              color: #ccc;
            }
            
            .content {
              padding: 24px;
            }
            
            .section {
              margin-bottom: 32px;
            }
            
            .section-title {
              font-size: 18px;
              font-weight: 600;
              margin: 0 0 16px 0;
              color: #232f3e;
            }
            
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 16px;
              margin-bottom: 20px;
            }
            
            .info-item {
              background: #f8f9fa;
              padding: 16px;
              border: 1px solid #e9ecef;
              border-radius: 4px;
            }
            
            .info-label {
              font-size: 12px;
              font-weight: 600;
              color: #666;
              text-transform: uppercase;
              margin-bottom: 4px;
            }
            
            .info-value {
              font-size: 14px;
              font-weight: 500;
              color: #333;
              margin: 0;
            }
            
            .product-card {
              background: #232f3e;
              color: #fff;
              padding: 20px;
              border-radius: 4px;
              margin-top: 16px;
            }
            
            .product-name {
              font-size: 16px;
              font-weight: 600;
              margin: 0 0 8px 0;
            }
            
            .product-description {
              font-size: 14px;
              color: #ccc;
              margin: 0;
            }
            
            .meeting-card {
              background: #0066c0;
              color: #fff;
              padding: 20px;
              border-radius: 4px;
              text-align: center;
            }
            
            .meeting-date {
              font-size: 18px;
              font-weight: 600;
              margin: 0 0 8px 0;
            }
            
            .meeting-time {
              font-size: 16px;
              margin: 0 0 12px 0;
            }
            
            .meeting-details {
              font-size: 14px;
              color: #cce7ff;
              margin: 0;
            }
            
            .alert {
              background: #fff3cd;
              border: 1px solid #ffeaa7;
              color: #856404;
              padding: 16px;
              border-radius: 4px;
              text-align: center;
            }
            
            .actions {
              background: #f8f9fa;
              border: 1px solid #e9ecef;
              border-radius: 4px;
              padding: 20px;
            }
            
            .actions ul {
              margin: 0;
              padding-left: 20px;
            }
            
            .actions li {
              margin-bottom: 8px;
              color: #333;
            }
            
            .footer {
              background: #f8f9fa;
              padding: 20px 24px;
              border-top: 1px solid #e9ecef;
              border-radius: 0 0 8px 8px;
              text-align: center;
            }
            
            .footer p {
              margin: 0;
              font-size: 12px;
              color: #666;
            }
            
            @media (max-width: 600px) {
              body { padding: 10px; }
              .info-grid { grid-template-columns: 1fr; }
              .header, .content, .footer { padding: 16px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header -->
            <div class="header">
              <h1>New Contact Submission</h1>
              <p>Drishti Technologies</p>
            </div>

            <!-- Content -->
            <div class="content">
              <!-- Contact Information -->
              <div class="section">
                <h2 class="section-title">Contact Information</h2>
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Club Name</div>
                    <p class="info-value">${clubName}</p>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Name</div>
                    <p class="info-value">${name}</p>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Role</div>
                    <p class="info-value">${role.charAt(0).toUpperCase() + role.slice(1)}</p>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Email</div>
                    <p class="info-value">${email}</p>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Phone</div>
                    <p class="info-value">${phone}</p>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Location</div>
                    <p class="info-value">${city}, ${state}</p>
                  </div>
                </div>
                
                <div class="product-card">
                  <p class="product-name">
                    ${interestedProduct === 'vision-plus' ? 'Vision Plus' : 'Vision Pro'}
                  </p>
                  <p class="product-description">
                    ${interestedProduct === 'vision-plus' 
                      ? 'Real-Time Foul Detection' 
                      : 'Complete Match Analytics'}
                  </p>
                </div>
              </div>

              <!-- Meeting Request -->
              <div class="section">
                <h2 class="section-title">Meeting Request</h2>
                ${preferredDate && preferredTime ? `
                  <div class="meeting-card">
                    <p class="meeting-date">
                      ${new Date(preferredDate).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p class="meeting-time">
                      ${(() => {
                        const [hours, minutes] = preferredTime.split(':');
                        const hour24 = parseInt(hours);
                        const hour12 = hour24 > 12 ? hour24 - 12 : hour24 === 0 ? 12 : hour24;
                        const ampm = hour24 >= 12 ? 'PM' : 'AM';
                        return `${hour12}:${minutes} ${ampm}`;
                      })()}
                    </p>
                    <p class="meeting-details">30 minutes • Google Meet • Asia/Kolkata</p>
                  </div>
                ` : `
                  <div class="alert">
                    <strong>No specific meeting time requested</strong><br>
                    Contact required to schedule consultation
                  </div>
                `}
              </div>

              <!-- Next Steps -->
              <div class="section">
                <h2 class="section-title">Next Steps</h2>
                <div class="actions">
                  <ul>
                    <li>${preferredDate && preferredTime ? 'Send calendar invitation' : 'Contact to schedule meeting'}</li>
                    <li>Prepare ${interestedProduct === 'vision-plus' ? 'Vision Plus' : 'Vision Pro'} demonstration</li>
                    <li>Follow up within 24 hours</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p>Received ${new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
} 