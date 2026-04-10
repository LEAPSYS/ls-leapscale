#!/bin/bash

# -----------------------------
# Versions:
# 1.0 - Initial Creation
# -----------------------------

set -e  # Exit on error

echo "Starting setup..."

# -----------------------------
# 1. Install Git (if not installed)
# -----------------------------
if ! command -v git &> /dev/null
then
    echo "Installing Git..."
    sudo apt update
    sudo apt install -y git curl
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
    echo "Running build..."
    npm run build:linux
else
    echo "No build script found in package.json"
    exit 1
fi

# -----------------------------
# 7. Copy dist with version
# -----------------------------
if [ -d "dist" ]; then
    echo "Searching for AppImage..."

    APPIMAGE_FILE=$(find dist -type f -name "*.AppImage" | head -n 1)

    if [ -z "$APPIMAGE_FILE" ]; then
        echo "No AppImage found in dist!"
        exit 1
    fi

    VERSION=$(node -p "require('./package.json').version")
    BASENAME=$(basename "$APPIMAGE_FILE" .AppImage)

    DEST_FILE="../${BASENAME}-v${VERSION}.AppImage"

    echo "Copying AppImage to $DEST_FILE"
    cp "$APPIMAGE_FILE" "$DEST_FILE"
    chmod +x "$DEST_FILE"

else
    echo "dist folder not found!"
    exit 1
fi

cd ..

# -----------------------------
# 8. Delete project directory
# -----------------------------
echo "Cleaning up project directory..."
rm -rf "$PROJECT_DIR"

echo "Done! Output available at: $DEST_DIR"