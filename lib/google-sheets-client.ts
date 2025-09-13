import { GoogleApis } from 'googleapis';
import { JWT } from 'google-auth-library';

// The private key from the environment variable might contain escaped newlines.
// We need to replace them with actual newline characters for the JWT client.
const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;

let googleSheetsClient: any = null;

if (!privateKey || !clientEmail) {
  console.warn('Google Sheets credentials not configured. Sheets logging will be disabled.');
  googleSheetsClient = null;
} else {
  const auth = new JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  googleSheetsClient = new GoogleApis().sheets({
    version: 'v4',
    auth,
  });
}

export { googleSheetsClient };
