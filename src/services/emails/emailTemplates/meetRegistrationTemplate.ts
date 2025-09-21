// src/services/emails/emailTemplates/meetRegistrationTemplate.ts - PowerUp Themed

interface MeetRegistrationTemplateData {
  userName: string;
  meetName: string;
  meetDate: string;
  meetLocation: string;
  registrationId: string;
  weightClass: string;
  division: string;
  registrationFee: number;
}

export const meetRegistrationTemplate = (data: MeetRegistrationTemplateData): string => {
  const { userName, meetName, meetDate, meetLocation, registrationId, weightClass, division, registrationFee } = data;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Confirmed - ${meetName}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #e2e8f0;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            min-height: 100vh;
        }
        .container {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
            border: 1px solid #475569;
            position: relative;
            overflow: hidden;
        }
        .container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #10b981, #059669);
        }
        .header {
            text-align: center;
            margin-bottom: 32px;
        }
        .logo {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
        }
        .logo-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #8b5cf6, #3b82f6);
            border-radius: 8px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            font-size: 18px;
        }
        .logo-text {
            font-size: 28px;
            font-weight: 800;
            background: linear-gradient(135deg, #8b5cf6, #3b82f6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .success-badge {
            display: inline-block;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 8px 20px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 24px;
        }
        h1 {
            color: #f1f5f9;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 16px;
            text-align: center;
        }
        .content {
            margin-bottom: 32px;
            color: #cbd5e1;
        }
        .meet-card {
            background: linear-gradient(135deg, #8b5cf6, #3b82f6);
            color: white;
            padding: 32px;
            border-radius: 16px;
            margin: 24px 0;
            text-align: center;
            box-shadow: 0 20px 40px rgba(139, 92, 246, 0.3);
            position: relative;
            overflow: hidden;
        }
        .meet-card::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: shimmer 3s infinite;
        }
        @keyframes shimmer {
            0% { transform: rotate(0deg) scale(1); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: rotate(45deg) scale(1.2); opacity: 0; }
        }
        .meet-name {
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 12px;
            position: relative;
            z-index: 1;
        }
        .meet-date {
            font-size: 18px;
            opacity: 0.9;
            margin-bottom: 8px;
            position: relative;
            z-index: 1;
        }
        .meet-location {
            font-size: 16px;
            opacity: 0.8;
            position: relative;
            z-index: 1;
        }
        .registration-id {
            background: linear-gradient(135deg, #451a03, #78350f);
            border: 2px solid #f59e0b;
            border-radius: 12px;
            padding: 20px;
            margin: 24px 0;
            text-align: center;
            position: relative;
        }
        .registration-id::before {
            content: '🎫';
            position: absolute;
            top: -15px;
            left: 50%;
            transform: translateX(-50%);
            background: #f59e0b;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
        }
        .registration-id-label {
            color: #fbbf24;
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
        }
        .registration-id-value {
            color: #fcd34d;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 20px;
            font-weight: 800;
            background: rgba(251, 191, 36, 0.1);
            padding: 8px 16px;
            border-radius: 8px;
            display: inline-block;
        }
        .registration-details {
            background: linear-gradient(135deg, #0f172a, #1e293b);
            border: 1px solid #475569;
            border-radius: 12px;
            padding: 24px;
            margin: 24px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #334155;
        }
        .detail-row:last-child {
            border-bottom: none;
            font-weight: bold;
            padding-top: 16px;
            background: rgba(139, 92, 246, 0.1);
            border-radius: 8px;
            padding: 16px;
            margin-top: 8px;
        }
        .detail-label {
            color: #94a3b8;
            font-weight: 500;
        }
        .detail-value {
            color: #f1f5f9;
            font-weight: 600;
        }
        .important-info {
            background: linear-gradient(135deg, #450a0a, #7f1d1d);
            border: 1px solid #dc2626;
            border-radius: 12px;
            padding: 20px;
            margin: 24px 0;
        }
        .info-title {
            color: #fca5a5;
            font-weight: 700;
            margin-bottom: 12px;
            font-size: 16px;
        }
        .checklist {
            margin: 32px 0;
        }
        .checklist h3 {
            color: #f1f5f9;
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 20px;
        }
        .checklist-item {
            display: flex;
            align-items: flex-start;
            margin: 16px 0;
            padding: 16px;
            background: rgba(139, 92, 246, 0.1);
            border-radius: 12px;
            border-left: 4px solid #8b5cf6;
        }
        .checkbox {
            width: 24px;
            height: 24px;
            border: 2px solid #8b5cf6;
            border-radius: 6px;
            margin-right: 16px;
            flex-shrink: 0;
            margin-top: 2px;
            background: rgba(139, 92, 246, 0.2);
        }
        .checklist-content {
            color: #cbd5e1;
            font-size: 14px;
        }
        .checklist-content strong {
            color: #f1f5f9;
            font-weight: 600;
        }
        .cta-section {
            background: linear-gradient(135deg, #0c4a6e, #075985);
            padding: 24px;
            border-radius: 12px;
            margin: 32px 0;
            text-align: center;
            border: 1px solid #0ea5e9;
        }
        .cta-section h3 {
            color: #bae6fd;
            margin-bottom: 12px;
            font-size: 18px;
        }
        .cta-section p {
            color: #7dd3fc;
            margin-bottom: 20px;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #8b5cf6, #3b82f6);
            color: white !important;
            text-decoration: none !important;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            margin: 8px;
            box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
            transition: all 0.3s ease;
        }
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 30px rgba(139, 92, 246, 0.4);
        }
        .competition-mode {
            background: linear-gradient(135deg, #065f46, #047857);
            border: 1px solid #10b981;
            border-radius: 12px;
            padding: 24px;
            margin: 24px 0;
        }
        .competition-mode-title {
            color: #6ee7b7;
            font-weight: 700;
            margin-bottom: 12px;
            font-size: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .competition-mode ul {
            margin: 12px 0;
            padding-left: 24px;
            color: #a7f3d0;
        }
        .competition-mode li {
            margin: 8px 0;
            font-size: 14px;
        }
        .footer {
            text-align: center;
            margin-top: 48px;
            padding-top: 24px;
            border-top: 1px solid #475569;
            color: #94a3b8;
            font-size: 14px;
        }
        .support-info {
            color: #64748b;
            font-size: 13px;
            margin: 16px 0;
        }
        .brand-footer {
            color: #475569;
            font-size: 12px;
            margin-top: 24px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <div class="logo-icon">PU</div>
                <div class="logo-text">PowerUp</div>
            </div>
            <div class="success-badge">✅ Registration Confirmed!</div>
        </div>

        <h1>You're In, ${userName}!</h1>

        <div class="content">
            <p>Congratulations! Your registration for the following powerlifting meet has been successfully confirmed:</p>
        </div>

        <div class="meet-card">
            <div class="meet-name">${meetName}</div>
            <div class="meet-date">📅 ${meetDate}</div>
            <div class="meet-location">📍 ${meetLocation}</div>
        </div>

        <div class="registration-id">
            <div class="registration-id-label">Registration ID</div>
            <div class="registration-id-value">${registrationId}</div>
        </div>

        <div class="registration-details">
            <div class="detail-row">
                <span class="detail-label">Weight Class:</span>
                <span class="detail-value">${weightClass}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Division:</span>
                <span class="detail-value">${division}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Registration Fee:</span>
                <span class="detail-value">$${registrationFee.toFixed(2)}</span>
            </div>
        </div>

        <div class="important-info">
            <div class="info-title">🚨 Important: Save This Email!</div>
            <p style="color: #fecaca; font-size: 14px; margin: 0;">
                Keep this confirmation email as proof of registration. You may need to present your Registration ID at the meet.
            </p>
        </div>

        <div class="checklist">
            <h3>Pre-Meet Checklist:</h3>
            
            <div class="checklist-item">
                <div class="checkbox"></div>
                <div class="checklist-content">
                    <strong>Confirm Your Openers:</strong> Plan your opening attempts for squat, bench, and deadlift
                </div>
            </div>
            
            <div class="checklist-item">
                <div class="checkbox"></div>
                <div class="checklist-content">
                    <strong>Check Weigh-In Times:</strong> Make sure you know when and where weigh-ins occur
                </div>
            </div>
            
            <div class="checklist-item">
                <div class="checkbox"></div>
                <div class="checklist-content">
                    <strong>Prepare Your Gear:</strong> Ensure all equipment meets federation requirements
                </div>
            </div>
            
            <div class="checklist-item">
                <div class="checkbox"></div>
                <div class="checklist-content">
                    <strong>Review Meet Rules:</strong> Familiarize yourself with the competition format
                </div>
            </div>
            
            <div class="checklist-item">
                <div class="checkbox"></div>
                <div class="checklist-content">
                    <strong>Plan Your Day:</strong> Know the venue location, parking, and meet schedule
                </div>
            </div>
        </div>

        <div class="cta-section">
            <h3>Stay Connected</h3>
            <p>Get real-time updates on meet day with PowerUp's Competition Mode!</p>
            <a href="#" class="cta-button" style="color: white !important; text-decoration: none !important;">Download PowerUp App</a>
            <a href="#" class="cta-button" style="color: white !important; text-decoration: none !important;">View Meet Details</a>
        </div>

        <div class="competition-mode">
            <div class="competition-mode-title">📱 Competition Mode</div>
            <p style="color: #a7f3d0; margin-bottom: 12px;">On meet day, activate Competition Mode in the PowerUp app to receive:</p>
            <ul>
                <li>Real-time flight updates and announcements</li>
                <li>Attempt tracking and personal records</li>
                <li>Live standings and results</li>
                <li>Emergency notifications and schedule changes</li>
            </ul>
        </div>

        <div class="footer">
            <div class="support-info">
                Questions about the meet? Contact the meet director or reply to this email.<br>
                Need technical support? Visit our help center or email support@liftwithpowerup.com
            </div>
            
            <div class="brand-footer">
                This confirmation was sent because you registered for ${meetName} through PowerUp.
                <br>PowerUp, Tampa, FL
            </div>
        </div>
    </div>
</body>
</html>
`;
};