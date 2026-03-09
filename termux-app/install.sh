#!/data/data/com.termux/files/usr/bin/bash
# ============================================================
# MATTHEW KILCOYNE — The Confluation Engine
# Termux Installation Script for Google Pixel 10XL
# ============================================================
# This script installs and configures the native interview app
# with offline multilingual support via a local grammar model.
#
# Usage: bash install.sh
# ============================================================

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

APP_DIR="$HOME/matthew-kilcoyne"
MODEL_DIR="$APP_DIR/models"
MODEL_URL="https://huggingface.co/Mozilla/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/TinyLlama-1.1B-Chat-v1.0.Q4_K_M.gguf"
MODEL_FILE="tinyllama-1.1b-chat.Q4_K_M.gguf"

banner() {
  echo ""
  echo -e "${CYAN}╔══════════════════════════════════════════════════════════╗${NC}"
  echo -e "${CYAN}║${NC}  ${BOLD}MATTHEW KILCOYNE${NC}                                      ${CYAN}║${NC}"
  echo -e "${CYAN}║${NC}  ${DIM}The Confluation Engine — Native Interview${NC}               ${CYAN}║${NC}"
  echo -e "${CYAN}║${NC}  ${DIM}Offline • Multilingual • On-Device AI${NC}                   ${CYAN}║${NC}"
  echo -e "${CYAN}╚══════════════════════════════════════════════════════════╝${NC}"
  echo ""
}

step() {
  echo -e "${GREEN}▸${NC} ${BOLD}$1${NC}"
}

warn() {
  echo -e "${YELLOW}⚠${NC} $1"
}

fail() {
  echo -e "${RED}✗${NC} $1"
  exit 1
}

done_msg() {
  echo -e "${GREEN}✓${NC} $1"
}

banner

# ── Step 1: System packages ──────────────────────────────────
step "Installing system dependencies..."
pkg update -y 2>/dev/null
pkg install -y nodejs cmake clang python3 wget 2>/dev/null
done_msg "System packages ready"

# ── Step 2: App directory ────────────────────────────────────
step "Setting up app directory..."
if [ -d "$APP_DIR" ]; then
  warn "Existing installation found — updating..."
fi
mkdir -p "$APP_DIR" "$MODEL_DIR"

# Copy app files (assumes install.sh is run from the termux-app directory)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cp "$SCRIPT_DIR/package.json" "$APP_DIR/"
cp "$SCRIPT_DIR/server.js" "$APP_DIR/"
cp -r "$SCRIPT_DIR/public" "$APP_DIR/"
cp -r "$SCRIPT_DIR/lib" "$APP_DIR/"
done_msg "App files installed"

# ── Step 3: Node dependencies ────────────────────────────────
step "Installing Node.js dependencies..."
cd "$APP_DIR"
npm install --production 2>&1 | tail -1
done_msg "Dependencies installed"

# ── Step 4: Download model ───────────────────────────────────
if [ ! -f "$MODEL_DIR/$MODEL_FILE" ]; then
  step "Downloading local grammar model (TinyLlama 1.1B Q4)..."
  echo -e "  ${DIM}This is a one-time ~700MB download.${NC}"
  echo -e "  ${DIM}After this, the app works fully offline.${NC}"
  echo ""
  wget -q --show-progress -O "$MODEL_DIR/$MODEL_FILE" "$MODEL_URL" || {
    warn "Download failed. You can retry later with: npm run setup-model"
    warn "The app will still work — just without AI-powered translations."
  }
  if [ -f "$MODEL_DIR/$MODEL_FILE" ]; then
    done_msg "Model downloaded successfully"
  fi
else
  done_msg "Model already present"
fi

# ── Step 5: Create launcher ─────────────────────────────────
step "Creating launcher command..."
LAUNCHER="$PREFIX/bin/matthew-kilcoyne"
cat > "$LAUNCHER" << 'LAUNCHER_SCRIPT'
#!/data/data/com.termux/files/usr/bin/bash
cd "$HOME/matthew-kilcoyne"
echo ""
echo -e "\033[0;36m  MATTHEW KILCOYNE\033[0m — The Confluation Engine"
echo -e "\033[2m  Starting on http://localhost:3000\033[0m"
echo ""
node server.js
LAUNCHER_SCRIPT
chmod +x "$LAUNCHER"
done_msg "Launcher installed: matthew-kilcoyne"

# ── Step 6: Create Termux shortcut ──────────────────────────
step "Creating Termux widget shortcut..."
SHORTCUT_DIR="$HOME/.shortcuts"
mkdir -p "$SHORTCUT_DIR"
cat > "$SHORTCUT_DIR/Matthew Kilcoyne" << 'SHORTCUT'
#!/data/data/com.termux/files/usr/bin/bash
matthew-kilcoyne
SHORTCUT
chmod +x "$SHORTCUT_DIR/Matthew Kilcoyne"
done_msg "Widget shortcut created"

# ── Done ─────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD}  Installation complete!${NC}"
echo ""
echo -e "  ${BOLD}Launch:${NC}  matthew-kilcoyne"
echo -e "  ${BOLD}   URL:${NC}  http://localhost:3000"
echo -e "  ${BOLD}  Stop:${NC}  Ctrl+C"
echo ""
echo -e "  ${DIM}Tap the link or open Chrome to start your interview.${NC}"
echo -e "  ${DIM}Works offline in any human language.${NC}"
echo -e "${CYAN}══════════════════════════════════════════════════════════${NC}"
echo ""
