import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({ 
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - main libraries
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          
          // UI libraries
          'vendor-mui': ['@mui/material', '@mui/icons-material'],
          'vendor-emotion': ['@emotion/react', '@emotion/styled'],
          
          // Data fetching and state management
          'vendor-query': ['@tanstack/react-query'],
          'vendor-zustand': ['zustand'],
          
          // Charts
          'vendor-charts': ['recharts'],
          
          // Firebase - SDK
          'vendor-firebase': [
            'firebase/app',
            'firebase/auth',
            'firebase/firestore',
            'firebase/storage'
          ],
          
          // Utilities
          'vendor-utils': ['lodash', 'crypto-js', 'classnames'],
          
          // RxJS for ViewModels
          'vendor-rxjs': ['rxjs'],
        },
      },
    },
    // Build optimizations
    chunkSizeWarningLimit: 1000,
    sourcemap: false, // Disable in production for better performance
  },
  // Development optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'zustand',
    ],
  },
})