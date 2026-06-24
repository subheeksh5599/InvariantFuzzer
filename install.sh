#!/bin/bash

# Solana CPI Safety - Standard Installer
# Detect and prevent CPI vulnerabilities for Solana
# Installs with recommended defaults. For custom options, use ./install-custom.sh

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$SCRIPT_DIR"

SKILLS_DIR="$HOME/.claude/skills"
FUZZER_SKILL_PATH="$SKILLS_DIR/solana-invariant-fuzzer"
CORE_SKILL_PATH="$SKILLS_DIR/solana-dev"

print_banner() {
    echo ""
    echo -e "${CYAN}┌─────────────────────────────────────────────────────────────────┐${NC}"
    echo -e "${CYAN}│${NC}                                                                 ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}   ${WHITE}🔍 Solana Invariant Fuzzer${NC}                                   ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}   ${GREEN}AI-Powered Invariant Discovery & Fuzz Orchestration${NC}           ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}                                                                 ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}   Find bugs before they find you.                                ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}                                                                 ${CYAN}│${NC}"
    echo -e "${CYAN}└─────────────────────────────────────────────────────────────────┘${NC}"
    echo ""
}

print_help() {
    echo "Solana Invariant Fuzzer - Standard Installer"
    echo ""
    echo "Usage: ./install.sh [OPTIONS]"
    echo ""
    echo "Installs with recommended defaults:"
    echo "  - Location: ~/.claude/skills/"
    echo "  - Installs solana-invariant-fuzzer skill"
    echo "  - Detects existing solana-dev-skill"
    echo ""
    echo "Options:"
    echo "  -y, --yes      Skip confirmation prompt"
    echo "  -h, --help     Show this help"
    echo ""
    echo "For custom installation options, use: ./install-custom.sh"
    echo ""
}

SKIP_CONFIRM=false
while [[ $# -gt 0 ]]; do
    case $1 in
        -y|--yes)
            SKIP_CONFIRM=true
            shift
            ;;
        -h|--help)
            print_help
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

print_banner

echo -e "${WHITE}Standard Installation${NC}"
echo ""
echo -e "This will install:"
echo -e "  ${BLUE}•${NC} solana-invariant-fuzzer → ${CYAN}$FUZZER_SKILL_PATH${NC}"
echo -e ""
echo -e "${YELLOW}Requires:${NC}"
echo -e "  ${BLUE}•${NC} solana-dev-skill (auto-detected or installed)"
echo -e "  ${BLUE}•${NC} Trident CLI (install separately: cargo install trident-cli)"
echo ""

if [ "$SKIP_CONFIRM" = false ]; then
    read -p "Proceed with installation? [Y/n] " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Nn]$ ]]; then
        echo -e "${YELLOW}Installation cancelled${NC}"
        echo -e "For custom options, run: ${CYAN}./install-custom.sh${NC}"
        exit 0
    fi
fi

echo ""

mkdir -p "$SKILLS_DIR"

# Check for core skill
echo -e "${CYAN}[1/2]${NC} Checking for solana-dev-skill..."

if [ -d "$CORE_SKILL_PATH" ] && [ -f "$CORE_SKILL_PATH/SKILL.md" ]; then
    echo -e "  ${GREEN}✓${NC} Found at $CORE_SKILL_PATH"
else
    echo -e "  ${YELLOW}→${NC} Not found. Installing..."
    temp_dir=$(mktemp -d)
    if git clone --depth 1 --quiet https://github.com/solana-foundation/solana-dev-skill.git "$temp_dir" 2>/dev/null; then
        cp -r "$temp_dir/skill" "$CORE_SKILL_PATH"
        rm -rf "$temp_dir"
        echo -e "  ${GREEN}✓${NC} Installed solana-dev-skill"
    else
        rm -rf "$temp_dir"
        echo -e "  ${RED}✗${NC} Failed to clone. Install manually: https://github.com/solana-foundation/solana-dev-skill"
    fi
fi

# Install fuzzer skill
echo -e "${CYAN}[2/2]${NC} Installing solana-invariant-fuzzer..."

if [ -d "$FUZZER_SKILL_PATH" ]; then
    rm -rf "$FUZZER_SKILL_PATH"
fi

mkdir -p "$FUZZER_SKILL_PATH"

# Copy skill files
for dir in skill agents commands rules; do
    if [ -d "$SOURCE_DIR/$dir" ]; then
        mkdir -p "$FUZZER_SKILL_PATH/$dir"
        cp -r "$SOURCE_DIR/$dir"/* "$FUZZER_SKILL_PATH/$dir/"
    fi
done

echo -e "  ${GREEN}✓${NC} Installed to $FUZZER_SKILL_PATH"

# Done
echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║${NC}  ${WHITE}Installation Complete!${NC}                                       ${GREEN}║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${WHITE}Installed:${NC}"
echo -e "  ${GREEN}✓${NC} solana-invariant-fuzzer  ${CYAN}$FUZZER_SKILL_PATH${NC}"
echo ""
echo -e "${CYAN}Try asking Claude:${NC}"
echo -e "  ${BLUE}•${NC} \"/fuzz-plan --target programs/vault --depth deep\""
echo -e "  ${BLUE}•${NC} \"Find invariants in my Anchor lending program\""
echo -e "  ${BLUE}•${NC} \"What maturity level is my AMM program?\""
echo ""
echo -e "${YELLOW}Prerequisites to install:${NC}"
echo -e "  ${BLUE}•${NC} cargo install trident-cli"
echo -e "  ${BLUE}•${NC} cargo install surfpool-cli"
echo ""
