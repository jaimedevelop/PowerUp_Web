// src/services/emails/emailService.ts
import { accountConfirmationTemplate } from './emailTemplates/accountConfirmationTemplate';
import { meetRegistrationTemplate } from './emailTemplates/meetRegistrationTemplate.ts';

interface MailgunConfig {
  apiKey: string;
  domain: string;
  apiUrl: string;
}

interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface AccountConfirmationData {
  userEmail: string;
  userName: string;
  confirmationUrl?: string;
}

interface MeetRegistrationData {
  userEmail: string;
  userName: string;
  meetName: string;
  meetDate: string;
  meetLocation: string;
  registrationId: string;
  weightClass: string;
  division: string;
  registrationFee: number;
}

class EmailService {
  private config: MailgunConfig;

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_MAILGUN_API_KEY || '',
      domain: import.meta.env.VITE_MAILGUN_DOMAIN || '',
      apiUrl: `https://api.mailgun.net/v3/${import.meta.env.VITE_MAILGUN_DOMAIN}/messages`
    };

    if (!this.config.apiKey || !this.config.domain) {
      console.warn('Mailgun configuration is incomplete. Please check your environment variables.');
    }
  }

  private async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append('from', `PowerUp <noreply@${this.config.domain}>`);
      formData.append('to', emailData.to);
      formData.append('subject', emailData.subject);
      formData.append('html', emailData.html);
      
      if (emailData.text) {
        formData.append('text', emailData.text);
      }

      const response = await fetch(this.config.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`api:${this.config.apiKey}`)}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Mailgun API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Email sent successfully:', result);
      return true;

    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  async sendAccountConfirmation(data: AccountConfirmationData): Promise<boolean> {
    const emailHtml = accountConfirmationTemplate({
      userName: data.userName,
      confirmationUrl: data.confirmationUrl
    });

    const emailData: EmailData = {
      to: data.userEmail,
      subject: 'Welcome to PowerUp - Confirm Your Account!',
      html: emailHtml,
      text: `Welcome to PowerUp, ${data.userName}! Thank you for creating your account. ${data.confirmationUrl ? `Please confirm your account by visiting: ${data.confirmationUrl}` : 'Your account is now active.'}`
    };

    return this.sendEmail(emailData);
  }

  async sendMeetRegistrationConfirmation(data: MeetRegistrationData): Promise<boolean> {
    const emailHtml = meetRegistrationTemplate({
      userName: data.userName,
      meetName: data.meetName,
      meetDate: data.meetDate,
      meetLocation: data.meetLocation,
      registrationId: data.registrationId,
      weightClass: data.weightClass,
      division: data.division,
      registrationFee: data.registrationFee
    });

    const emailData: EmailData = {
      to: data.userEmail,
      subject: `Registration Confirmed - ${data.meetName}`,
      html: emailHtml,
      text: `Hi ${data.userName}, your registration for ${data.meetName} on ${data.meetDate} has been confirmed! Registration ID: ${data.registrationId}. Weight Class: ${data.weightClass}, Division: ${data.division}.`
    };

    return this.sendEmail(emailData);
  }

  // Generic method for custom emails
  async sendCustomEmail(
    to: string, 
    subject: string, 
    htmlContent: string, 
    textContent?: string
  ): Promise<boolean> {
    const emailData: EmailData = {
      to,
      subject,
      html: htmlContent,
      text: textContent
    };

    return this.sendEmail(emailData);
  }

  // Test method to verify Mailgun connection
  async testConnection(): Promise<boolean> {
    try {
      const testEmail: EmailData = {
        to: 'test@example.com',
        subject: 'PowerUp Test Email',
        html: '<h1>Test Email</h1><p>This is a test email from PowerUp.</p>',
        text: 'This is a test email from PowerUp.'
      };

      // Note: This will attempt to send but may fail if the email doesn't exist
      // It's mainly to test if the API connection works
      return await this.sendEmail(testEmail);
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();
export default emailService;