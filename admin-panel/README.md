# Ranch Admin Panel

A Vue.js-based admin panel for the Ranch Staff Management API with OAuth2 authentication.

## Features

- **OAuth2 Authentication**: Secure login using OAuth2 with PKCE flow
- **Staff Management**: Full CRUD operations for staff members
- **Responsive Design**: Modern and clean UI that works on all devices
- **API Integration**: Connected to `https://ranch.backend.thejoma.uz/api/staff/v1`

## Prerequisites

- Node.js 16+ and npm
- OAuth2 credentials from the Ranch backend

## Installation

1. Clone the repository:
```bash
cd admin-panel
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` file with your OAuth2 credentials:
```env
VITE_API_BASE_URL=https://ranch.backend.thejoma.uz/api/staff/v1
VITE_OAUTH_CLIENT_ID=your_client_id
VITE_OAUTH_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_OAUTH_AUTHORIZE_URL=https://ranch.backend.thejoma.uz/oauth/authorize
VITE_OAUTH_TOKEN_URL=https://ranch.backend.thejoma.uz/oauth/token
VITE_OAUTH_SCOPE=read write
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
admin-panel/
├── src/
│   ├── router/          # Vue Router configuration
│   ├── services/        # API and authentication services
│   ├── views/           # Vue components for pages
│   ├── App.vue          # Root component
│   └── main.js          # Application entry point
├── public/              # Static assets
├── .env                 # Environment variables
└── package.json         # Project dependencies
```

## Available Routes

- `/login` - Login page with OAuth2
- `/auth/callback` - OAuth2 callback handler
- `/` - Dashboard
- `/staff` - Staff list
- `/staff/create` - Create new staff member
- `/staff/:id` - View staff details
- `/staff/:id/edit` - Edit staff member

## Authentication Flow

1. User clicks "Sign in with OAuth2" on the login page
2. Application redirects to OAuth2 authorization server
3. User authenticates and authorizes the application
4. OAuth2 server redirects back with authorization code
5. Application exchanges code for access token
6. Access token is stored and used for API requests
7. Token is automatically refreshed when expired

## API Service

The `apiService.js` provides methods for interacting with the Ranch API:

- `getStaffList(params)` - Get all staff members
- `getStaff(id)` - Get single staff member
- `createStaff(data)` - Create new staff member
- `updateStaff(id, data)` - Update staff member
- `deleteStaff(id)` - Delete staff member
- `getCurrentUser()` - Get current user profile

## Security Features

- OAuth2 with PKCE (Proof Key for Code Exchange)
- Secure token storage
- Automatic token refresh
- Protected routes with navigation guards
- HTTPS-only in production

## Customization

### Styling

The application uses scoped CSS in each component. Global styles are defined in `App.vue`.

### API Endpoints

To modify API endpoints, edit `src/services/apiService.js`.

### OAuth2 Configuration

To change OAuth2 settings, edit the `.env` file or modify `src/services/authService.js`.

## Troubleshooting

### OAuth2 Issues

- Ensure your client ID is correct
- Verify redirect URI matches exactly (including protocol and port)
- Check that the OAuth2 server is accessible
- Review browser console for error messages

### API Connection Issues

- Verify the API base URL is correct
- Check CORS settings on the backend
- Ensure you're using a valid access token
- Check network tab for failed requests

## License

This project is private and proprietary.
