// src/services/emails/emailTemplates/accountConfirmationTemplate.ts - PowerUp Themed

interface AccountConfirmationTemplateData {
  userName: string;
  confirmationUrl: string;
}

export const accountConfirmationTemplate = (data: AccountConfirmationTemplateData): string => {
  const { userName, confirmationUrl } = data;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm Your PowerUp Account</title>
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
            background: linear-gradient(90deg, #8b5cf6, #3b82f6);
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
        .verification-badge {
            display: inline-block;
            background: linear-gradient(135deg, #f59e0b, #d97706);
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
        .verification-section {
            background: linear-gradient(135deg, #422006, #451a03);
            border: 2px solid #f59e0b;
            padding: 32px;
            border-radius: 16px;
            margin: 32px 0;
            text-align: center;
            position: relative;
        }
        .verification-section::before {
            content: '⚡';
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
        .verification-text {
            color: #fbbf24;
            font-weight: 700;
            margin-bottom: 20px;
            font-size: 18px;
        }
        .verification-subtitle {
            color: #fcd34d;
            margin-bottom: 28px;
            font-size: 16px;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
            color: white !important;
            text-decoration: none !important;
            padding: 16px 32px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 16px;
            margin: 20px 0;
            box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4);
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
        }
        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 35px rgba(139, 92, 246, 0.6);
            background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%);
        }
        .expiry-warning {
            color: #f87171;
            font-size: 14px;
            font-weight: 600;
            margin-top: 16px;
        }
        .urgent-notice {
            background: linear-gradient(135deg, #450a0a, #7f1d1d);
            border: 1px solid #dc2626;
            border-radius: 12px;
            padding: 20px;
            margin: 24px 0;
        }
        .urgent-title {
            color: #fca5a5;
            font-weight: 700;
            margin-bottom: 12px;
            font-size: 16px;
        }
        .urgent-text {
            color: #fecaca;
            font-size: 14px;
            margin: 0;
        }
        .security-info {
            background: linear-gradient(135deg, #0c4a6e, #075985);
            padding: 20px;
            border-radius: 12px;
            border-left: 4px solid #0ea5e9;
            margin: 24px 0;
        }
        .features {
            margin: 32px 0;
        }
        .features h3 {
            color: #f1f5f9;
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 20px;
        }
        .feature-item {
            display: flex;
            align-items: flex-start;
            margin: 16px 0;
            padding: 12px;
            background: rgba(139, 92, 246, 0.1);
            border-radius: 8px;
            border-left: 3px solid #8b5cf6;
        }
        .feature-icon {
            width: 24px;
            height: 24px;
            background: linear-gradient(135deg, #8b5cf6, #3b82f6);
            border-radius: 6px;
            margin-right: 16px;
            flex-shrink: 0;
            margin-top: 2px;
        }
        .feature-content {
            color: #cbd5e1;
            font-size: 14px;
        }
        .feature-content strong {
            color: #f1f5f9;
            font-weight: 600;
        }
        .footer {
            text-align: center;
            margin-top: 48px;
            padding-top: 24px;
            border-top: 1px solid #475569;
            color: #94a3b8;
            font-size: 14px;
        }
        .backup-section {
            background: #0f172a;
            padding: 20px;
            border-radius: 12px;
            margin: 24px 0;
            border: 1px solid #334155;
        }
        .backup-title {
            color: #f1f5f9;
            font-weight: 600;
            margin-bottom: 12px;
        }
        .backup-link {
            word-break: break-all;
            background: #1e293b;
            padding: 12px;
            border-radius: 8px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 12px;
            color: #8b5cf6;
            border: 1px solid #475569;
            margin-top: 8px;
        }
        .support-info {
            color: #64748b;
            font-size: 13px;
            margin-top: 20px;
        }
        .brand-footer {
            color: #475569;
            font-size: 12px;
            margin-top: 32px;
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
            <div class="verification-badge">📧 Email Verification Required</div>
        </div>

        <h1>Almost There, ${userName}!</h1>

        <div class="content">
            <p>Thank you for creating your PowerUp account! To get started and access all features, we need you to verify your email address.</p>
        </div>

        <div class="verification-section">
            <div class="verification-text">One Quick Step Required</div>
            <p class="verification-subtitle">
                Click the button below to verify your email and activate your account
            </p>
            <a href="${confirmationUrl}" class="cta-button" style="color: white !important; text-decoration: none !important;">
                ✅ Confirm My Email Address
            </a>
            <div class="expiry-warning">⏰ This link expires in 24 hours</div>
        </div>

        <div class="urgent-notice">
            <div class="urgent-title">🚨 Important: Account Not Active Yet</div>
            <p class="urgent-text">
                Your account has been created but is not active until you verify your email. You won't be able to log in until verification is complete.
            </p>
        </div>

        <div class="features">
            <h3>Once verified, you'll be able to:</h3>
            
            <div class="feature-item">
                <div class="feature-icon"></div>
                <div class="feature-content">
                    <strong>Find Competitions:</strong> Discover powerlifting meets near you and register with ease
                </div>
            </div>
            
            <div class="feature-item">
                <div class="feature-icon"></div>
                <div class="feature-content">
                    <strong>Track Training:</strong> Log your workouts and communicate with your coach
                </div>
            </div>
            
            <div class="feature-item">
                <div class="feature-icon"></div>
                <div class="feature-content">
                    <strong>Connect:</strong> Follow coaches, teams, and brands in the powerlifting community
                </div>
            </div>
            
            <div class="feature-item">
                <div class="feature-icon"></div>
                <div class="feature-content">
                    <strong>Competition Mode:</strong> Get real-time updates during meets
                </div>
            </div>
            
            <div class="feature-item">
                <div class="feature-icon"></div>
                <div class="feature-content">
                    <strong>Achievements:</strong> Unlock badges like the 1000lb Club and track your progress
                </div>
            </div>
        </div>

        <div class="security-info">
            <p style="margin: 0; font-size: 14px; color: #bae6fd;">
                <strong>🔒 Security Note:</strong> This verification helps protect your account and ensures we can send you important updates about competitions and training.
            </p>
        </div>

        <div class="backup-section">
            <div class="backup-title">Trouble with the button? Copy and paste this link:</div>
            <div class="backup-link">${confirmationUrl}</div>
        </div>

        <div class="footer">
            <p style="font-weight: 600; color: #f1f5f9; margin-bottom: 16px;">
                <strong>Didn't create this account?</strong> You can safely ignore this email. The account will remain inactive without verification.
            </p>
            
            <div class="support-info">
                Need help? Reply to this email or visit our support center.
            </div>
            
            <div class="brand-footer">
                You received this email because an account was created with this email address at PowerUp.
                <br>PowerUp, Tampa, FL
            </div>
        </div>
    </div>
</body>
</html>
`;
};