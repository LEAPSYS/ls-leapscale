#!/bin/bash

set -e  # Exit on error

echo "Starting setup..."

# -----------------------------
# 1. Install Git (if not installed)
# -----------------------------
if ! command -v git &> /dev/null
then
    echo "Installing Git..."
    sudo apt update
    sudo apt install -y git
else
    echo "Git already installed"
fi

# -----------------------------
# 2. Install NVM
# -----------------------------
if [ ! -d "$HOME/.nvm" ]; then
    echo "Installing NVM..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
else
    echo "NVM already installed"
fi

# Load NVM
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

# -----------------------------
# 3. Install Node LTS
# -----------------------------
echo "Installing Node LTS..."
nvm install --lts
nvm use --lts

# -----------------------------
# 4. Clone Repository
# -----------------------------
REPO_URL="https://github.com/LEAPSYS/ls-leapscale.git"
PROJECT_DIR="ls-leapscale"

if [ ! -d "$PROJECT_DIR" ]; then
    echo "Cloning repository..."
    git clone "$REPO_URL"
else
    echo "App already exists, pulling latest..."
    cd "$PROJECT_DIR"
    git pull
    cd ..
fi

cd "$PROJECT_DIR"

# -----------------------------
# 5. Install dependencies
# -----------------------------
if [ -f "package.json" ]; then
    echo "Installing npm dependencies..."
    npm install
else
    echo "No package.json found, skipping npm install"
fi

# -----------------------------
# 6. Run build
# -----------------------------
if npm run | grep -q "build"; then
    echo "🏗️ Running build..."
    npm run build:linux
else
    echo "No build script found in package.json"
fi

echo "Setup complete!"