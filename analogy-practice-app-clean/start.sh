#!/bin/bash

echo "🚀 Starting Analogy Practice App Setup..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from: https://nodejs.org/"
    echo "Or on macOS with Homebrew: brew install node"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not available!"
    exit 1
fi

echo "✅ npm found: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "🎉 Setup complete! Starting the application..."
    echo "The app will open at: http://localhost:3000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    npm start
else
    echo "❌ Failed to install dependencies"
    exit 1
fi
