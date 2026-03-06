#!/bin/bash
# ╔══════════════════════════════════════════════════════════════╗
# ║  TARDAI - Termux Setup Script (Android)                     ║
# ║  Run this in Termux to set up TARDAI on your phone          ║
# ╚══════════════════════════════════════════════════════════════╝

set -e

echo ""
echo "  ████████╗ █████╗ ██████╗ ██████╗  █████╗ ██╗"
echo "  ╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██╔══██╗██║"
echo "     ██║   ███████║██████╔╝██║  ██║███████║██║"
echo "     ██║   ██╔══██║██╔══██╗██║  ██║██╔══██║██║"
echo "     ██║   ██║  ██║██║  ██║██████╔╝██║  ██║██║"
echo "     ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝"
echo ""
echo "  Setting up TARDAI for Termux..."
echo ""

# Update packages
echo "  [1/4] Updating packages..."
pkg update -y && pkg upgrade -y

# Install Node.js
echo "  [2/4] Installing Node.js..."
pkg install nodejs -y

# Clone or update repo
echo "  [3/4] Getting TARDAI..."
if [ -d "$HOME/tardai" ]; then
  cd "$HOME/tardai"
  git pull origin main 2>/dev/null || true
else
  git clone https://github.com/mrjkilcoyne-lgtm/Matthew-Kilcoyne.git "$HOME/tardai" 2>/dev/null || {
    echo "  Repo not accessible. Downloading CLI directly..."
    mkdir -p "$HOME/tardai/cli"
    # User should copy the cli/tardai.mjs file manually
    echo "  Please copy cli/tardai.mjs to $HOME/tardai/cli/"
  }
fi

# Create alias
echo "  [4/4] Creating 'tardai' command..."
if ! grep -q "alias tardai" "$HOME/.bashrc" 2>/dev/null; then
  echo 'alias tardai="node $HOME/tardai/cli/tardai.mjs"' >> "$HOME/.bashrc"
fi

echo ""
echo "  ✓ Setup complete!"
echo ""
echo "  To run TARDAI:"
echo "    tardai"
echo ""
echo "  Or with API key:"
echo "    export GEMINI_API_KEY=your-key-here"
echo "    tardai"
echo ""
echo "  (Restart Termux or run: source ~/.bashrc)"
echo ""
