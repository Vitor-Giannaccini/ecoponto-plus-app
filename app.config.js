// app.config.js

import 'dotenv/config';

export default {
  "expo": {
    "name": "Ecoponto+",
    "slug": "ecoponto-plus",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "extra": {
      "eas": {
        "projectId": "a7aa8e0b-4134-409e-8b43-081ea1cb5174"
      }
    },
    "splash": {
      "image": "./assets/icon-foreground.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "package": "com.vitorgt.ecopontoplus.ios"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/icon-foreground.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.vitorgt.ecopontoplus",
      "edgeToEdgeEnabled": true,
      "permissions": [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION"
      ],
      "config": {
        "googleMaps": {
          "apiKey": process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
        }
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
  }
}