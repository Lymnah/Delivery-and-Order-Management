import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'

// Plugin to transform figma:asset/ imports to relative imports during build
// This allows figma:asset/ to work in Figma Make Preview (dev mode)
// while still building correctly with Vite
function figmaAssetPlugin(): Plugin {
  return {
    name: 'figma-asset-resolver',
    enforce: 'pre',
    resolveId(id) {
      // Transform figma:asset/ imports to relative paths during build
      if (id.startsWith('figma:asset/')) {
        const assetName = id.replace('figma:asset/', '')
        // Return the resolved path to the asset
        return path.resolve(__dirname, './src/assets', assetName)
      }
      return null
    },
  }
}

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    figmaAssetPlugin(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
})
