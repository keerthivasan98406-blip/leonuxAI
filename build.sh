#!/bin/bash

echo "Installing dependencies..."
npm install

echo "Building the project..."
npm run build

echo "Build complete! Output in dist/ folder"
ls -la dist/
