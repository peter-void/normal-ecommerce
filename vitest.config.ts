import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    // Use jsdom environment to simulate a browser
    environment: 'jsdom',
    
    // Setup file to run before all tests
    setupFiles: ['./src/test/setup.ts'],
    
    // Include test files
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    
    // Exclude common directories
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
    ],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.config.{js,ts}',
        '**/generated/**',
      ],
    },
    
    // Globals - allows you to use describe, it, expect without importing
    globals: true,
  },
  
  resolve: {
    // Match your tsconfig.json path aliases
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
