import path from 'path';

export const __rootDir = require.main ? path.join(path.dirname(require.main.filename), '..'): path.join(__dirname, '..', '..');

export const __backendDir = path.join(__rootDir, 'src', 'backend');

export const __imagesDir = path.join(__backendDir, 'images');