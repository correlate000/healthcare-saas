// Email Service
// Comprehensive email service with multiple providers and templates

import nodemailer from 'nodemailer';
import { db } from '../db/connection';

interface EmailConfig {
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  from: string;
  replyTo?: string;
}

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  template?: string;
  variables?: Record<string, any>;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
  priority?: 'high' | 'normal' | 'low';
  delay?: number; // Delay in milliseconds
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;
  private config: EmailConfig;
  private templates: Map<string, EmailTemplate> = new Map();
  private queue: Array<{ options: SendEmailOptions; resolve: Function; reject: Function }> = [];
  private processing = false;

  constructor() {
    this.config = {
      smtp: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASSWORD || ''
        }
      },
      from: process.env.FROM_EMAIL || 'noreply@healthcare-saas.com',
      replyTo: process.env.REPLY_TO_EMAIL || 'support@healthcare-saas.com'
    };

    this.initializeTransporter();
    this.loadTemplates();
    this.startQueueProcessor();
  }

  private initializeTransporter(): void {
    this.transporter = nodemailer.createTransporter({
      host: this.config.smtp.host,
      port: this.config.smtp.port,
      secure: this.config.smtp.secure,
      auth: this.config.smtp.auth,
      pool: true, // Use connection pooling
      maxConnections: 5,
      maxMessages: 100,
      rateLimit: 14 // messages per second
    });

    // Verify connection
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('Email service connection error:', error);
      } else {
        console.log('Email service connected successfully');
      }
    });
  }

  private loadTemplates(): void {
    // Email verification template
    this.templates.set('email_verification', {
      subject: 'Verify Your Email Address - Healthcare SaaS',
      html: this.getEmailVerificationHtml(),
      text: this.getEmailVerificationText()
    });

    // Password reset template
    this.templates.set('password_reset', {
      subject: 'Reset Your Password - Healthcare SaaS',
      html: this.getPasswordResetHtml(),
      text: this.getPasswordResetText()
    });

    // Welcome email template
    this.templates.set('welcome', {
      subject: 'Welcome to Healthcare SaaS!',
      html: this.getWelcomeHtml(),
      text: this.getWelcomeText()
    });

    // Health alert template
    this.templates.set('health_alert', {
      subject: 'Health Alert - {{alertType}}',
      html: this.getHealthAlertHtml(),
      text: this.getHealthAlertText()
    });

    // Weekly report template
    this.templates.set('weekly_report', {
      subject: 'Your Weekly Health Report',
      html: this.getWeeklyReportHtml(),
      text: this.getWeeklyReportText()
    });
  }

  // Send email verification
  async sendVerificationEmail(email: string, name: string, token: string): Promise<EmailResult> {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
    
    return this.sendEmail({
      to: email,
      template: 'email_verification',
      variables: {
        name,
        verificationUrl,
        token,
        supportEmail: this.config.replyTo
      }
    });
  }

  // Send password reset email
  async sendPasswordResetEmail(email: string, name: string, token: string): Promise<EmailResult> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    
    return this.sendEmail({
      to: email,
      template: 'password_reset',
      variables: {
        name,
        resetUrl,
        token,
        expiryTime: '1 hour',
        supportEmail: this.config.replyTo
      }
    });
  }

  // Send welcome email
  async sendWelcomeEmail(email: string, name: string, companyName?: string): Promise<EmailResult> {
    const dashboardUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`;
    
    return this.sendEmail({
      to: email,
      template: 'welcome',
      variables: {
        name,
        companyName: companyName || 'your organization',
        dashboardUrl,
        supportEmail: this.config.replyTo,
        featuresUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/features`
      }
    });
  }

  // Send health alert
  async sendHealthAlert(email: string, name: string, alertData: {
    type: string;
    severity: string;
    message: string;
    recommendations?: string[];
    urgent?: boolean;
  }): Promise<EmailResult> {
    return this.sendEmail({
      to: email,
      template: 'health_alert',
      variables: {
        name,
        alertType: alertData.type,
        severity: alertData.severity,
        message: alertData.message,
        recommendations: alertData.recommendations || [],
        urgent: alertData.urgent || false,
        dashboardUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`,
        supportEmail: this.config.replyTo
      },
      priority: alertData.urgent ? 'high' : 'normal'
    });
  }

  // Send weekly health report
  async sendWeeklyReport(email: string, name: string, reportData: {
    weekOf: string;
    healthScore: number;
    keyInsights: string[];
    symptomsLogged: number;
    goalsProgress: Array<{ name: string; progress: number }>;
  }): Promise<EmailResult> {
    return this.sendEmail({
      to: email,
      template: 'weekly_report',
      variables: {
        name,
        weekOf: reportData.weekOf,
        healthScore: reportData.healthScore,
        keyInsights: reportData.keyInsights,
        symptomsLogged: reportData.symptomsLogged,
        goalsProgress: reportData.goalsProgress,
        reportUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reports`,
        supportEmail: this.config.replyTo
      }
    });
  }

  // Generic send email method
  async sendEmail(options: SendEmailOptions): Promise<EmailResult> {
    return new Promise((resolve, reject) => {
      this.queue.push({ options, resolve, reject });
      this.processQueue();
    });
  }

  // Send bulk emails (for newsletters, announcements)
  async sendBulkEmail(recipients: string[], templateName: string, variables: Record<string, any>): Promise<{
    successful: number;
    failed: number;
    errors: Array<{ email: string; error: string }>;
  }> {
    const results = {
      successful: 0,
      failed: 0,
      errors: [] as Array<{ email: string; error: string }>
    };

    // Process in batches to avoid overwhelming the email service
    const batchSize = 50;
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      const promises = batch.map(async (email) => {
        try {
          const result = await this.sendEmail({
            to: email,
            template: templateName,
            variables: { ...variables, email }
          });
          
          if (result.success) {
            results.successful++;
          } else {
            results.failed++;
            results.errors.push({ email, error: result.error || 'Unknown error' });
          }
        } catch (error) {
          results.failed++;
          results.errors.push({ email, error: error.message });
        }
      });

      await Promise.all(promises);
      
      // Small delay between batches
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  // Queue processing
  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const { options, resolve, reject } = this.queue.shift()!;
      
      try {
        const result = await this.sendEmailInternal(options);
        resolve(result);
      } catch (error) {
        reject(error);
      }

      // Small delay between emails to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.processing = false;
  }

  private startQueueProcessor(): void {
    setInterval(() => {
      this.processQueue();
    }, 1000);
  }

  private async sendEmailInternal(options: SendEmailOptions): Promise<EmailResult> {
    try {
      let { subject, html, text } = options;

      // Use template if specified
      if (options.template) {
        const template = this.templates.get(options.template);
        if (!template) {
          throw new Error(`Template '${options.template}' not found`);
        }

        subject = this.replaceVariables(template.subject, options.variables || {});
        html = this.replaceVariables(template.html, options.variables || {});
        text = this.replaceVariables(template.text, options.variables || {});
      }

      // Prepare email options
      const mailOptions = {
        from: this.config.from,
        replyTo: this.config.replyTo,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject,
        html,
        text,
        attachments: options.attachments,
        priority: options.priority || 'normal',
        headers: {
          'X-Healthcare-SaaS': 'true',
          'X-Auto-Response-Suppress': 'OOF, DR, RN, NRN, AutoReply'
        }
      };

      // Add delay if specified
      if (options.delay) {
        await new Promise(resolve => setTimeout(resolve, options.delay));
      }

      // Send email
      const info = await this.transporter.sendMail(mailOptions);

      // Log email sent
      await this.logEmail({
        to: mailOptions.to,
        subject,
        template: options.template,
        messageId: info.messageId,
        success: true
      });

      return {
        success: true,
        messageId: info.messageId
      };

    } catch (error) {
      console.error('Email send error:', error);

      // Log failed email
      await this.logEmail({
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject || 'Unknown',
        template: options.template,
        error: error.message,
        success: false
      });

      return {
        success: false,
        error: error.message
      };
    }
  }

  private replaceVariables(template: string, variables: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] !== undefined ? String(variables[key]) : match;
    });
  }

  private async logEmail(data: {
    to: string;
    subject: string;
    template?: string;
    messageId?: string;
    error?: string;
    success: boolean;
  }): Promise<void> {
    try {
      await db.query(`
        INSERT INTO email_logs (
          recipient_email, subject, template_name, 
          message_id, error_message, success, sent_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
      `, [
        data.to, data.subject, data.template,
        data.messageId, data.error, data.success
      ]);
    } catch (error) {
      console.error('Email logging error:', error);
    }
  }

  // Email templates (HTML)
  private getEmailVerificationHtml(): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Healthcare SaaS</h1>
        <h2>Verify Your Email Address</h2>
    </div>
    <div class="content">
        <p>Hello {{name}},</p>
        <p>Thank you for signing up for Healthcare SaaS! To complete your registration, please verify your email address by clicking the button below:</p>
        <p style="text-align: center;">
            <a href="{{verificationUrl}}" class="button">Verify Email Address</a>
        </p>
        <p>If you can't click the button, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">{{verificationUrl}}</p>
        <p>This verification link will expire in 24 hours for security reasons.</p>
        <p>If you didn't create this account, you can safely ignore this email.</p>
        <p>Best regards,<br>The Healthcare SaaS Team</p>
    </div>
    <div class="footer">
        <p>Need help? Contact us at {{supportEmail}}</p>
        <p>© 2024 Healthcare SaaS. All rights reserved.</p>
    </div>
</body>
</html>`;
  }

  private getEmailVerificationText(): string {
    return `
Hello {{name}},

Thank you for signing up for Healthcare SaaS! To complete your registration, please verify your email address by visiting this link:

{{verificationUrl}}

This verification link will expire in 24 hours for security reasons.

If you didn't create this account, you can safely ignore this email.

Best regards,
The Healthcare SaaS Team

Need help? Contact us at {{supportEmail}}
© 2024 Healthcare SaaS. All rights reserved.`;
  }

  private getPasswordResetHtml(): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #ff6b6b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Healthcare SaaS</h1>
        <h2>Password Reset Request</h2>
    </div>
    <div class="content">
        <p>Hello {{name}},</p>
        <p>We received a request to reset your password for your Healthcare SaaS account. Click the button below to create a new password:</p>
        <p style="text-align: center;">
            <a href="{{resetUrl}}" class="button">Reset Password</a>
        </p>
        <p>If you can't click the button, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">{{resetUrl}}</p>
        <div class="warning">
            <strong>Important:</strong> This password reset link will expire in {{expiryTime}}. If you don't reset your password within this time, you'll need to request a new reset link.
        </div>
        <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
        <p>For security reasons, please don't share this email with anyone.</p>
        <p>Best regards,<br>The Healthcare SaaS Team</p>
    </div>
    <div class="footer">
        <p>Need help? Contact us at {{supportEmail}}</p>
        <p>© 2024 Healthcare SaaS. All rights reserved.</p>
    </div>
</body>
</html>`;
  }

  private getPasswordResetText(): string {
    return `
Hello {{name}},

We received a request to reset your password for your Healthcare SaaS account. Click the link below to create a new password:

{{resetUrl}}

This password reset link will expire in {{expiryTime}}. If you don't reset your password within this time, you'll need to request a new reset link.

If you didn't request this password reset, please ignore this email. Your password will remain unchanged.

For security reasons, please don't share this email with anyone.

Best regards,
The Healthcare SaaS Team

Need help? Contact us at {{supportEmail}}
© 2024 Healthcare SaaS. All rights reserved.`;
  }

  private getWelcomeHtml(): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Healthcare SaaS</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4ecdc4 0%, #2ecc71 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #4ecdc4; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .features { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .feature { margin: 15px 0; padding: 10px; border-left: 4px solid #4ecdc4; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏥 Healthcare SaaS</h1>
        <h2>Welcome Aboard!</h2>
    </div>
    <div class="content">
        <p>Hello {{name}},</p>
        <p>Welcome to Healthcare SaaS! We're excited to have {{companyName}} join our platform for comprehensive health data management and AI-powered insights.</p>
        
        <div class="features">
            <h3>🚀 Get Started:</h3>
            <div class="feature">
                <strong>📊 Set up your health profile</strong> - Add your basic health information and goals
            </div>
            <div class="feature">
                <strong>📝 Log your first symptoms</strong> - Start tracking your health data
            </div>
            <div class="feature">
                <strong>🤖 Get AI insights</strong> - Receive personalized health recommendations
            </div>
            <div class="feature">
                <strong>📈 View your dashboard</strong> - Monitor your health trends and progress
            </div>
        </div>

        <p style="text-align: center;">
            <a href="{{dashboardUrl}}" class="button">Go to Dashboard</a>
        </p>

        <p>Our platform helps you:</p>
        <ul>
            <li>Track symptoms and health metrics securely</li>
            <li>Get AI-powered health insights and risk assessments</li>
            <li>Monitor health trends and patterns</li>
            <li>Generate comprehensive health reports</li>
            <li>Maintain complete privacy and data security</li>
        </ul>

        <p>If you have any questions or need assistance getting started, don't hesitate to reach out to our support team.</p>

        <p>Here's to your health journey!</p>
        <p>Best regards,<br>The Healthcare SaaS Team</p>
    </div>
    <div class="footer">
        <p>Need help? Contact us at {{supportEmail}} | <a href="{{featuresUrl}}">Learn about features</a></p>
        <p>© 2024 Healthcare SaaS. All rights reserved.</p>
    </div>
</body>
</html>`;
  }

  private getWelcomeText(): string {
    return `
Hello {{name}},

Welcome to Healthcare SaaS! We're excited to have {{companyName}} join our platform for comprehensive health data management and AI-powered insights.

Get Started:
- Set up your health profile - Add your basic health information and goals
- Log your first symptoms - Start tracking your health data  
- Get AI insights - Receive personalized health recommendations
- View your dashboard - Monitor your health trends and progress

Visit your dashboard: {{dashboardUrl}}

Our platform helps you:
- Track symptoms and health metrics securely
- Get AI-powered health insights and risk assessments
- Monitor health trends and patterns
- Generate comprehensive health reports
- Maintain complete privacy and data security

If you have any questions or need assistance getting started, don't hesitate to reach out to our support team.

Here's to your health journey!

Best regards,
The Healthcare SaaS Team

Need help? Contact us at {{supportEmail}}
Learn about features: {{featuresUrl}}
© 2024 Healthcare SaaS. All rights reserved.`;
  }

  private getHealthAlertHtml(): string {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Health Alert</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff9a56 0%, #ff6b6b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .alert { background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .urgent { background: #f8d7da; border: 1px solid #f5c6cb; }
        .button { display: inline-block; background: #ff6b6b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .recommendations { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚨 Health Alert</h1>
        <h2>{{alertType}}</h2>
    </div>
    <div class="content">
        <p>Hello {{name}},</p>
        <div class="alert {{#if urgent}}urgent{{/if}}">
            <strong>Severity: {{severity}}</strong><br>
            {{message}}
        </div>
        
        {{#if recommendations}}
        <div class="recommendations">
            <h3>💡 Recommendations:</h3>
            <ul>
                {{#each recommendations}}
                <li>{{this}}</li>
                {{/each}}
            </ul>
        </div>
        {{/if}}

        <p style="text-align: center;">
            <a href="{{dashboardUrl}}" class="button">View Dashboard</a>
        </p>

        <p><strong>Important:</strong> This alert is based on your recent health data. If you have concerns about your health, please consult with a healthcare professional.</p>
        
        <p>Best regards,<br>The Healthcare SaaS Team</p>
    </div>
    <div class="footer">
        <p>Need help? Contact us at {{supportEmail}}</p>
        <p>© 2024 Healthcare SaaS. All rights reserved.</p>
    </div>
</body>
</html>`;
  }

  private getHealthAlertText(): string {
    return `
Hello {{name}},

Health Alert: {{alertType}}
Severity: {{severity}}

{{message}}

{{#if recommendations}}
Recommendations:
{{#each recommendations}}
- {{this}}
{{/each}}
{{/if}}

View your dashboard: {{dashboardUrl}}

Important: This alert is based on your recent health data. If you have concerns about your health, please consult with a healthcare professional.

Best regards,
The Healthcare SaaS Team

Need help? Contact us at {{supportEmail}}
© 2024 Healthcare SaaS. All rights reserved.`;
  }

  private getWeeklyReportHtml(): string {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weekly Health Report</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .score { background: white; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; }
        .score-number { font-size: 48px; font-weight: bold; color: #667eea; }
        .insights { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .goals { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .goal { margin: 10px 0; padding: 10px; background: #f8f9fa; border-radius: 5px; }
        .progress-bar { background: #e9ecef; height: 10px; border-radius: 5px; margin: 5px 0; }
        .progress-fill { background: #667eea; height: 100%; border-radius: 5px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Healthcare SaaS</h1>
        <h2>Your Weekly Health Report</h2>
        <p>Week of {{weekOf}}</p>
    </div>
    <div class="content">
        <p>Hello {{name}},</p>
        
        <div class="score">
            <h3>Overall Health Score</h3>
            <div class="score-number">{{healthScore}}</div>
            <p>out of 100</p>
        </div>

        <div class="insights">
            <h3>🔍 Key Insights:</h3>
            <ul>
                {{#each keyInsights}}
                <li>{{this}}</li>
                {{/each}}
            </ul>
        </div>

        <p><strong>This week you logged {{symptomsLogged}} symptoms</strong> - Great job staying on top of your health tracking!</p>

        {{#if goalsProgress}}
        <div class="goals">
            <h3>🎯 Goals Progress:</h3>
            {{#each goalsProgress}}
            <div class="goal">
                <strong>{{name}}</strong>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: {{progress}}%"></div>
                </div>
                {{progress}}% complete
            </div>
            {{/each}}
        </div>
        {{/if}}

        <p style="text-align: center;">
            <a href="{{reportUrl}}" class="button">View Full Report</a>
        </p>

        <p>Keep up the great work! Consistent health tracking helps us provide you with better insights and recommendations.</p>
        
        <p>Best regards,<br>The Healthcare SaaS Team</p>
    </div>
    <div class="footer">
        <p>Need help? Contact us at {{supportEmail}}</p>
        <p>© 2024 Healthcare SaaS. All rights reserved.</p>
    </div>
</body>
</html>`;
  }

  private getWeeklyReportText(): string {
    return `
Hello {{name}},

Your Weekly Health Report - Week of {{weekOf}}

Overall Health Score: {{healthScore}} out of 100

Key Insights:
{{#each keyInsights}}
- {{this}}
{{/each}}

This week you logged {{symptomsLogged}} symptoms - Great job staying on top of your health tracking!

{{#if goalsProgress}}
Goals Progress:
{{#each goalsProgress}}
- {{name}}: {{progress}}% complete
{{/each}}
{{/if}}

View your full report: {{reportUrl}}

Keep up the great work! Consistent health tracking helps us provide you with better insights and recommendations.

Best regards,
The Healthcare SaaS Team

Need help? Contact us at {{supportEmail}}
© 2024 Healthcare SaaS. All rights reserved.`;
  }

  // Cleanup on service shutdown
  destroy(): void {
    if (this.transporter) {
      this.transporter.close();
    }
  }
}

export const emailService = new EmailService();
export { EmailService, type EmailResult, type SendEmailOptions };