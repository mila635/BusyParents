// import { GoogleApis } from 'googleapis';
// import { JWT } from 'google-auth-library';

// // The private key from the environment variable might contain escaped newlines.
// // We need to replace them with actual newline characters for the JWT client.
// const privateKey ="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDLe5+/g/dXM0R/\nOUOLqL1Er2RjzSYIdKkVKDeXBl2h5hdDzpFJbq5AfkiamrPU2j7H0mf0CXTnZRvo\nBZrdwmoX81XXWp/hDtVAOGVZFQKdDJt4EoL2+EttWeTRnUjij9Uo0OtigpCc1bgr\n3YZmyrOfiKWGcRfjZ7LPG9naofpGeagxUpvSLwLThzXCTD8lBjpMGR6SWfQtrT/l\nZdj9H1H27OEkXpbLl8U9f9Z/o0qLP/orofBMWGkoGhgyhSQAPZokYW4KH+eaxHYu\nzuQClrb3L/vEUI4I50yxV5KEpdoFak//ebyIYgxA8hkt0YYWDreLjRM9Wxk6dFH6\nR+oFtpnTAgMBAAECggEAHtWV6ISL14fqSkkYJjKks6LMWJ8+sytSb+VPPzB0wdLH\nFbxYocMG3rkEMYFd3NRRjSAiJoXEVEgrCWbIB/Cs+QIjsOWHsqf3wqqJGQ2o/rlp\nWbGcbOZFL8XeebEW2VYoW+4ErUHRviJYrTT9Z9gxjew8APpkP054dw/mXE4NSd5i\nBMTTW+Eu+Rc9yTvMYIIKL/VAh6p+O5B+PrulPUVlZUQdRj3u0Jhh8B2DQ5ECvqk9\n2NgPwtfhHlM3VreuOfU+AM1tfjUKQS9KXq1h1fAagXS1l1w+XuPWzPnB7smm50ys\nOHc1Deloz6F3pA/weDRSW1jlj4Q9KaVv19/boEJCuQKBgQD9XAlb3Qj9AS8eUr05\nTzLadF+h/n6DNQACtxOhL9tIQwy5mLlkD1ttROobNkje5zfKJJihRfmzhr7ZHapo\n8kgjh2xr3fsqPPwnLEVluTyiRSviB/gZdNT8iaIJMixMVWrn5nuvICirSblN5mqC\n6TSyM55XRQRroifCaKarwdND7QKBgQDNmoRAiEZM6PIeEwBGZqKPF/OhAPlsbtl6\njV3ylyRDK5Mq9vqf5BVNXQ4uiY8NBMbT3pFFdrgbrfqdJYg+MiOOHxKYB1Gom/8F\nT9NVa5y7IO7BV3SIz4KIOgxvm4o9XWqT3WihZRE5WBaAo2oXj9F5U58BdOBq4n+C\n05pmMS0cvwKBgQCEMsXfXRIXkcqYM+vwP1b1jctop3Yz2C/NOuHPNT1iEzpMjVgO\n0cSO22qcEFMtm9AMddP+Mpj8B88FUulcIS9q+nqkPguUGoYnmn4LegAdW6JuKmJW\nRhPsQZR+3+MlYVyK7ESVOF6AIdPCxfvFmxGX+j8goi6QSugcFKcC7/vgcQKBgQC4\nxPO1SsJiu7VacZj9q57LGatINafxWmz3RbP4HvvnoXFQW0RADKlYLRhhmh2EhZZp\nMMs8scQim+ds8h3ORyDMx//dwDYSYJ5+F47EZUEkqiPmfMGtcU7NPd2PLyi8nQb6\ney9cW4dvEUqnsDPXmNeXQR7UIETNyV7uI1vOGsN/4QKBgCZxDJxbEhXd4O4/W+nV\nZTA9zYEygrHkMiWmaeYmlp1yEchxsYZV1lSyTMtAJiOkouh0gTCrb+nOWAey9t3v\n69Mr9CZg9Fj7p0NhdyXBouPo/heoWRNyBNWA3TSoLpTp5ccyZEcqzahjPRZCJTc4\nfysBDdLD4uyjc3frtQpwZ+kp\n-----END PRIVATE KEY-----\n"    //"28aaa7dfe9ed1e12d0fb7140e5945d70a648beb3" //process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');

// if (!privateKey) {
//   throw new Error('GOOGLE_SHEETS_PRIVATE_KEY is not configured correctly in .env.local');
// }

// const auth = new JWT({
//   email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
//   key: privateKey,
//   scopes: ['https://www.googleapis.com/auth/spreadsheets'],
// });

// const sheets = new GoogleApis().sheets({
//   version: 'v4',
//   auth,
// });





// export const googleSheetsClient = sheets;

import { GoogleApis } from 'googleapis';
import { JWT } from 'google-auth-library';

// WARNING: Hardcoding sensitive credentials is not a secure practice.
// This is for demonstration and debugging purposes only.
// In a production environment, always use environment variables.

// The private key from the environment variable might contain escaped newlines.
// We need to replace them with actual newline characters for the JWT client.
const privateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDLe5+/g/dXM0R/\nOUOLqL1Er2RjzSYIdKkVKDeXBl2h5hdDzpFJbq5AfkiamrPU2j7H0mf0CXTnZRvo\nBZrdwmoX81XXWp/hDtVAOGVZFQKdDJt4EoL2+EttWeTRnUjij9Uo0OtigpCc1bgr\n3YZmyrOfiKWGcRfjZ7LPG9naofpGeagxUpvSLwLThzXCTD8lBjpMGR6SWfQtrT/l\nZdj9H1H27OEkXpbLl8U9f9Z/o0qLP/orofBMWGkoGhgyhSQAPZokYW4KH+eaxHYu\nzuQClrb3L/vEUI4I50yxV5KEpdoFak//ebyIYgxA8hkt0YYWDreLjRM9Wxk6dFH6\nR+oFtpnTAgMBAAECggEAHtWV6ISL14fqSkkYJjKks6LMWJ8+sytSb+VPPzB0wdLH\nFbxYocMG3rkEMYFd3NRRjSAiJoXEVEgrCWbIB/Cs+QIjsOWHsqf3wqqJGQ2o/rlp\nWbGcbOZFL8XeebEW2VYoW+4ErUHRviJYrTT9Z9gxjew8APpkP054dw/mXE4NSd5i\nBMTTW+Eu+Rc9yTvMYIIKL/VAh6p+O5B+PrulPUVlZUQdRj3u0Jhh8B2DQ5ECvqk9\n2NgPwtfhHlM3VreuOfU+AM1tfjUKQS9KXq1h1fAagXS1l1w+XuPWzPnB7smm50ys\nOHc1Deloz6F3pA/weDRSW1jlj4Q9KaVv19/boEJCuQKBgQD9XAlb3Qj9AS8eUr05\nTzLadF+h/n6DNQACtxOhL9tIQwy5mLlkD1ttROobNkje5zfKJJihRfmzhr7ZHapo\n8kgjh2xr3fsqPPwnLEVluTyiRSviB/gZdNT8iaIJMixMVWrn5nuvICirSblN5mqC\n6TSyM55XRQRroifCaKarwdND7QKBgQDNmoRAiEZM6PIeEwBGZqKPF/OhAPlsbtl6\njV3ylyRDK5Mq9vqf5BVNXQ4uiY8NBMbT3pFFdrgbrfqdJYg+MiOOHxKYB1Gom/8F\nT9NVa5y7IO7BV3SIz4KIOgxvm4o9XWqT3WihZRE5WBaAo2oXj9F5U58BdOBq4n+C\n05pmMS0cvwKBgQCEMsXfXRIXkcqYM+vwP1b1jctop3Yz2C/NOuHPNT1iEzpMjVgO\n0cSO22qcEFMtm9AMddP+Mpj8B88FUulcIS9q+nqkPguUGoYnmn4LegAdW6JuKmJW\nRhPsQZR+3+MlYVyK7ESVOF6AIdPCxfvFmxGX+j8goi6QSugcFKcC7/vgcQKBgQC4\nxPO1SsJiu7VacZj9q57LGatINafxWmz3RbP4HvvnoXFQW0RADKlYLRhhmh2EhZZp\nMMs8scQim+ds8h3ORyDMx//dwDYSYJ5+F47EZUEkqiPmfMGtcU7NPd2PLyi8nQb6\ney9cW4dvEUqnsDPXmNeXQR7UIETNyV7uI1vOGsN/4QKBgCZxDJxbEhXd4O4/W+nV\nZTA9zYEygrHkMiWmaeYmlp1yEchxsYZV1lSyTMtAJiOkouh0gTCrb+nOWAey9t3v\n69Mr9CZg9Fj7p0NhdyXBouPo/heoWRNyBNWA3TSoLpTp5ccyZEcqzahjPRZCJTc4\nfysBDdLD4uyjc3frtQpwZ+kp\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n');

const clientEmail = "busy-parents-sheets-service@mytestoauth-470505.iam.gserviceaccount.com";

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
