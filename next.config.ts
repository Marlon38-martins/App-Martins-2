
import type {NextConfig} from 'next';
import path from 'path'; // For next-pwa

// Configuration for next-pwa
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development
  // You can add more PWA options here, like runtimeCaching
});

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      // Add your Firebase Storage hostname here if you plan to use it for images
      // Example:
      // {
      //   protocol: 'https',
      //   hostname: 'firebasestorage.googleapis.com',
      //   port: '',
      //   pathname: '/v0/b/YOUR_PROJECT_ID.appspot.com/**', // Replace YOUR_PROJECT_ID
      // },
    ],
  },
  // Environment variables:
  // Create a .env.local file in your project root for API keys.
  // Example:
  // NEXT_PUBLIC_FIREBASE_API_KEY="your_firebase_api_key"
  // NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_google_maps_api_key"
  // NEXT_PUBLIC_OPENWEATHER_API_KEY="your_openweather_api_key"
  //
  // These NEXT_PUBLIC_ prefixed variables will be available in your client-side code.
  // Server-side only variables can be defined without the NEXT_PUBLIC_ prefix.
};

export default withPWA(nextConfig);
    
