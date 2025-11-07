#!/usr/bin/env node
/**
 * Simple Express server for serving SPA with proper fallback routing
 * Used in DigitalOcean App Platform deployment
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const DIST_DIR = path.join(__dirname, 'dist');

// Disable caching for development
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

// Serve static files from dist directory
app.use(
  express.static(DIST_DIR, {
    maxAge: 0,
    etag: false,
  })
);

// SPA fallback - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`SPA server running on port ${PORT}`);
  console.log(`Serving files from: ${DIST_DIR}`);
});
