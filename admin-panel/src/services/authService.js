import axios from 'axios';

class AuthService {
  constructor() {
    this.clientId = import.meta.env.VITE_OAUTH_CLIENT_ID;
    this.redirectUri = import.meta.env.VITE_OAUTH_REDIRECT_URI;
    this.authorizeUrl = import.meta.env.VITE_OAUTH_AUTHORIZE_URL;
    this.tokenUrl = import.meta.env.VITE_OAUTH_TOKEN_URL;
    this.scope = import.meta.env.VITE_OAUTH_SCOPE;
  }

  // Generate a random string for PKCE code verifier
  generateCodeVerifier() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return this.base64UrlEncode(array);
  }

  // Generate code challenge from verifier
  async generateCodeChallenge(verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return this.base64UrlEncode(new Uint8Array(hash));
  }

  // Base64 URL encode
  base64UrlEncode(array) {
    return btoa(String.fromCharCode.apply(null, array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  // Generate random state
  generateState() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return this.base64UrlEncode(array);
  }

  // Start OAuth2 authorization flow
  async initiateLogin() {
    const state = this.generateState();
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    // Store state and code verifier in session storage
    sessionStorage.setItem('oauth_state', state);
    sessionStorage.setItem('code_verifier', codeVerifier);

    // Build authorization URL
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.scope,
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    });

    // Redirect to authorization endpoint
    window.location.href = `${this.authorizeUrl}?${params.toString()}`;
  }

  // Handle OAuth2 callback
  async handleCallback(code, state) {
    // Verify state
    const savedState = sessionStorage.getItem('oauth_state');
    if (state !== savedState) {
      throw new Error('Invalid state parameter');
    }

    const codeVerifier = sessionStorage.getItem('code_verifier');

    try {
      // Exchange authorization code for access token
      const response = await axios.post(this.tokenUrl, {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.redirectUri,
        client_id: this.clientId,
        code_verifier: codeVerifier
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const { access_token, refresh_token, expires_in } = response.data;

      // Store tokens
      localStorage.setItem('access_token', access_token);
      if (refresh_token) {
        localStorage.setItem('refresh_token', refresh_token);
      }
      if (expires_in) {
        const expiresAt = Date.now() + expires_in * 1000;
        localStorage.setItem('token_expires_at', expiresAt.toString());
      }

      // Clean up session storage
      sessionStorage.removeItem('oauth_state');
      sessionStorage.removeItem('code_verifier');

      return access_token;
    } catch (error) {
      console.error('Token exchange failed:', error);
      throw error;
    }
  }

  // Get stored access token
  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getAccessToken();
    if (!token) return false;

    const expiresAt = localStorage.getItem('token_expires_at');
    if (expiresAt && Date.now() >= parseInt(expiresAt)) {
      this.logout();
      return false;
    }

    return true;
  }

  // Logout user
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expires_at');
  }

  // Refresh access token
  async refreshAccessToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(this.tokenUrl, {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: this.clientId
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const { access_token, expires_in } = response.data;
      localStorage.setItem('access_token', access_token);
      
      if (expires_in) {
        const expiresAt = Date.now() + expires_in * 1000;
        localStorage.setItem('token_expires_at', expiresAt.toString());
      }

      return access_token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.logout();
      throw error;
    }
  }
}

export default new AuthService();
