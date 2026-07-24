import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

// Copy the uploaded QRIS image into the public folder automatically
try {
  const sourcePath = 'C:\\Users\\OKTAVIA DAWAYANTI\\.gemini\\antigravity\\brain\\e7474e7f-e99e-49c8-bdba-598defade859\\.user_uploaded\\media__1784881325695.jpg';
  const destPath = path.resolve('public/qris.jpg');
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log('Successfully copied QRIS image to public/qris.jpg');
  }
} catch (err) {
  console.error('Error copying QRIS image:', err);
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
