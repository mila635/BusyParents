import { google } from 'googleapis';

// Google Sheets API configuration
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Initialize Google Sheets API client
function getGoogleSheetsClient() {
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  if (!privateKey || !clientEmail || !spreadsheetId) {
    console.log('Google Sheets environment variables not configured');
    return null;
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: SCOPES
  });

  return google.sheets({ version: 'v4', auth });
}

// Log user activity to Google Sheets
export async function logToGoogleSheets(data: {
  timestamp: string;
  userEmail: string;
  action: string;
  service: string;
  status: string;
  details?: string;
  errorMessage?: string;
}) {
  try {
    const sheets = getGoogleSheetsClient();
    if (!sheets) {
      console.log('Google Sheets client not available - skipping logging');
      return { success: false, error: 'Google Sheets not configured' };
    }
    
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;

    // Prepare row data
    const rowData = [
      data.timestamp,
      data.userEmail,
      data.action,
      data.service,
      data.status,
      data.details || '',
      data.errorMessage || ''
    ];

    // Append data to the sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A:G', // Assuming your headers are in columns A-G
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowData]
      }
    });

    console.log('✅ Logged to Google Sheets:', data.action);
    return { success: true, response };
  } catch (error) {
    console.error('❌ Failed to log to Google Sheets:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Test Google Sheets connection
export async function testGoogleSheetsConnection() {
  try {
    const sheets = getGoogleSheetsClient();
    if (!sheets) {
      return { 
        success: false, 
        error: 'Google Sheets not configured - missing environment variables' 
      };
    }
    
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;

    // Try to read the first row (headers) to test connection
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'A1:G1'
    });

    return { 
      success: true, 
      message: 'Google Sheets connection successful',
      headers: response.data.values?.[0] || []
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
