import { Injectable, Logger } from '@nestjs/common';
import { google,gmail_v1 } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GmailService {
  private readonly logger = new Logger(GmailService.name);
  private readonly tokenPath = path.resolve('tokens.json');

  private oAuth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
  );

  constructor() {
    this.loadTokens();
  }

  private loadTokens() {
    if (fs.existsSync(this.tokenPath)) {
      const tokens = JSON.parse(fs.readFileSync(this.tokenPath, 'utf8'));
      this.oAuth2Client.setCredentials(tokens);
    }
  }

  async getAuthUrl() {
    return this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send']
    });
  }

  async setTokensFromCode(code: string) {
    const { tokens } = await this.oAuth2Client.getToken(code);
    this.oAuth2Client.setCredentials(tokens);
    fs.writeFileSync(this.tokenPath, JSON.stringify(tokens));
  }

  /**
   * Fetch messages and return only necessary data
   */
async listSimplifiedMessages(labelId: string) {
  const gmail = google.gmail({ version: 'v1', auth: this.oAuth2Client });
  
  const res = await gmail.users.messages.list({
    userId: 'me',
    labelIds: [labelId],
    maxResults: 20
  });

  if (!res.data.messages) return [];

  const messages = await Promise.all(
    res.data.messages.map(async (msg) => {
      const { data }: { data: gmail_v1.Schema$Message } = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id || ''
      });
      return this.extractMetadata(data);
    })
  );

  return messages.filter(Boolean);
}
  /**
   * Get single message with body
   */
  async getSimplifiedMessage(id: string) {
    const gmail = google.gmail({ version: 'v1', auth: this.oAuth2Client });
    const res = await gmail.users.messages.get({ userId: 'me', id });
    return this.extractMetadata(res.data, true);
  }

  /**
   * Extract only relevant fields from Gmail API
   */
  private extractMetadata(message: any, includeBody = false) {
    if (!message?.payload) return null;

    const headers = message.payload.headers || [];
    const getHeader = (name: string) => headers.find((h) => h.name === name)?.value || '';

    let bodyText = '';
    if (includeBody) {
      try {
        if (message.payload.parts) {
          const textPart = message.payload.parts.find((p) => p.mimeType === 'text/plain');
          if (textPart?.body?.data) {
            bodyText = Buffer.from(textPart.body.data, 'base64').toString('utf8');
          }
        } else if (message.payload.body?.data) {
          bodyText = Buffer.from(message.payload.body.data, 'base64').toString('utf8');
        }
      } catch {
        bodyText = message.snippet || '';
      }
    }

    return {
      id: message.id,
      threadId: message.threadId,
      from: getHeader('From'),
      to: getHeader('To'),
      subject: getHeader('Subject') || '(no subject)',
      date: new Date(parseInt(message.internalDate || Date.now())),
      snippet: message.snippet || '',
      labels: message.labelIds || [],
      isUnread: message.labelIds?.includes('UNREAD') || false,
      isImportant: message.labelIds?.includes('IMPORTANT') || false,
      body: includeBody ? bodyText : undefined
    };
  }

  async sendEmailRaw(to: string, subject: string, message: string) {
    const gmail = google.gmail({ version: 'v1', auth: this.oAuth2Client });
    const email = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/plain; charset="UTF-8"',
      '',
      message
    ].join('\n');

    const encodedMessage = Buffer.from(email)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: encodedMessage }
    });
  }
}
