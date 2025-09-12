import webbrowser
import http.server
import socketserver
import urllib.parse
import requests
import json
from datetime import datetime

# Configuration
CLIENT_ID = 'YOUR_CLIENT_ID'
CLIENT_SECRET = 'YOUR_CLIENT_SECRET'
REDIRECT_URI = 'http://localhost:8080/callback'
PORT = 8080

class OAuthHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        if '/callback' in self.path:
            # Parse authorization code
            query = urllib.parse.urlparse(self.path).query
            params = urllib.parse.parse_qs(query)
            
            if 'code' in params:
                code = params['code'][0]
                tokens = self.exchange_code_for_tokens(code)
                user_info = self.get_user_info(tokens['access_token'])
                
                # Display results
                self.send_response(200)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                
                html = f"""
                <h1>✅ OAuth Success!</h1>
                <h2>User Info:</h2>
                <pre>{json.dumps(user_info, indent=2)}</pre>
                <h2>Tokens:</h2>
                <pre>{json.dumps(tokens, indent=2)}</pre>
                """
                self.wfile.write(html.encode())
                
                # Save to file
                data = {
                    'user': user_info,
                    'tokens': tokens,
                    'timestamp': datetime.now().isoformat()
                }
                
                with open('oauth_data.json', 'w') as f:
                    json.dump(data, f, indent=2)
                
                print("✅ OAuth data saved to oauth_data.json")
                
    def exchange_code_for_tokens(self, code):
        response = requests.post('https://oauth2.googleapis.com/token', data={
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'code': code,
            'grant_type': 'authorization_code',
            'redirect_uri': REDIRECT_URI
        })
        return response.json()
    
    def get_user_info(self, access_token):
        response = requests.get('https://www.googleapis.com/oauth2/v2/userinfo', 
                              headers={'Authorization': f'Bearer {access_token}'})
        return response.json()

def start_oauth_flow():
    # Start local server
    with socketserver.TCPServer(("", PORT), OAuthHandler) as httpd:
        print(f"🚀 Starting server on port {PORT}")
        
        # Open OAuth URL
        auth_url = f"""https://accounts.google.com/o/oauth2/v2/auth?
            client_id={CLIENT_ID}&
            redirect_uri={REDIRECT_URI}&
            response_type=code&
            scope=openid email profile https://www.googleapis.com/auth/spreadsheets&
            access_type=offline&
            prompt=consent""".replace('\n', '').replace(' ', '')
        
        print(f"🔗 Opening OAuth URL: {auth_url}")
        webbrowser.open(auth_url)
        
        print("⏳ Waiting for OAuth callback...")
        httpd.handle_request()  # Handle one request then exit

if __name__ == '__main__':
    start_oauth_flow()