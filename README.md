# Ranch Website Private API Test

This repository contains the admin panel for the Ranch Staff Management API.

## Admin Panel

The admin panel is built with Vue.js 3 and provides a comprehensive interface for managing staff members through the Ranch API.

### Quick Start

```bash
cd admin-panel
npm install
cp .env.example .env
# Edit .env with your OAuth2 credentials
npm run dev
```

### Features

- 🔐 **OAuth2 Authentication**: Secure login with PKCE flow
- 👥 **Staff Management**: Full CRUD operations
- 📱 **Responsive Design**: Works on all devices
- 🔄 **Auto Token Refresh**: Seamless authentication
- 🎨 **Modern UI**: Clean and intuitive interface

### API Endpoint

The admin panel connects to: `https://ranch.backend.thejoma.uz/api/staff/v1`

### Documentation

For detailed information about setup, configuration, and usage, see the [Admin Panel README](admin-panel/README.md).

## Project Structure

```
ranch_website_private_api_test/
├── admin-panel/          # Vue.js admin panel application
│   ├── src/
│   │   ├── router/      # Vue Router configuration
│   │   ├── services/    # API and auth services
│   │   └── views/       # Page components
│   ├── .env.example     # Environment configuration template
│   └── README.md        # Detailed admin panel documentation
└── README.md            # This file
```

## Requirements

- Node.js 16 or higher
- npm or yarn
- OAuth2 credentials from Ranch backend

## Technologies Used

- **Vue.js 3**: Progressive JavaScript framework
- **Vue Router 4**: Official router for Vue.js
- **Axios**: HTTP client for API requests
- **Vite**: Next generation frontend tooling
- **OAuth2 with PKCE**: Secure authentication flow

## License

This project is private and proprietary.