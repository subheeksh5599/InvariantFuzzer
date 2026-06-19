#!/bin/bash

# Solana Invariant Fuzzer - Custom Installer
# Full control over installation paths and options

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
SKILL_NAME="solana-invariant-fuzzer"
SOURCE_DIR="$SCRIPT_DIR"

PERSONAL_SKILLS_DIR="$HOME/.claude/skills"
PROJECT_SKILLS_DIR=".claude/skills"
INSTALL_BASE=""
CORE_SKILL_FOUND=""

print_banner() {
    echo ""
    echo -e "${CYAN}┌─────────────────────────────────────────────────────────────────┐${NC}"
    echo -e "${CYAN}│${NC}                                                                 ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}   ${WHITE}🔍 Solana Invariant Fuzzer${NC}                                   ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}   ${GREEN}AI-Powered Invariant Discovery & Fuzz Orchestration${NC}           ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}                                                                 ${CYAN}│${NC}"
    echo -e "${CYAN}└─────────────────────────────────────────────────────────────────┘${NC}"
    echo ""
}

print_help() {
    echo "Solana Invariant Fuzzer - Custom Installer"
    echo ""
    echo "Usage: ./install-custom.sh [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --project        Install to current project (.claude/skills/)"
    echo "  --path PATH      Install to custom path"
    echo "  -y, --yes        Skip all prompts (use defaults)"
    echo "  -h, --help       Show this help"
    echo ""
    echo "The custom installer lets you:"
    echo "  - Choose install location (personal or project)"
    echo "  - Choose custom install path"
    echo "  - Skip core skill if already installed"
    echo ""
}

find_core_skill() {
    local locations=(
        "$PERSONAL_SKILLS_DIR/solana-dev"
        "$PROJECT_SKILLS_DIR/solana-dev"
        "$HOME/.claude/solana-dev"
    )

    for loc in "${locations[@]}"; do
        if [ -d "$loc" ] && [ -f "$loc/SKILL.md" ]; then
            echo "$loc"
            return 0
        fi
    done
    return 1
}

prompt_install_location() {
    echo ""
    echo -e "${CYAN}┌─────────────────────────────────────────────────────────────┐${NC}"
    echo -e "${CYAN}│${NC}  ${WHITE}Select Installation Location${NC}                               ${CYAN}│${NC}"
    echo -e "${CYAN}└─────────────────────────────────────────────────────────────┘${NC}"
    echo ""
    echo -e "  ${WHITE}[1]${NC} ${GREEN}Personal skills${NC} (~/.claude/skills/)"
    echo -e "      Available to all projects"
    echo ""
    echo -e "  ${WHITE}[2]${NC} ${GREEN}Current project${NC} (./.claude/skills/)"
    echo -e "      Only for this project"
    echo ""
    echo -e "  ${WHITE}[3]${NC} ${YELLOW}Custom path${NC}"
    echo ""

    read -p "Select option [1-3]: " choice
    case $choice in
        1) INSTALL_BASE="$PERSONAL_SKILLS_DIR" ;;
        2) INSTALL_BASE="$PROJECT_SKILLS_DIR" ;;
        3)
            read -p "Enter custom path: " custom_path
            INSTALL_BASE="$custom_path"
            ;;
        *)
            echo -e "${YELLOW}Using default: personal skills${NC}"
            INSTALL_BASE="$PERSONAL_SKILLS_DIR"
            ;;
    esac
}

install_fuzzer_skill() {
    local install_path="$1"

    echo ""
    echo -e "${CYAN}━━━ Installing Solana Invariant Fuzzer ━━━${NC}"

    if [ -d "$install_path" ]; then
        echo -e "${YELLOW}Warning:${NC} '$install_path' already exists"
        read -p "Overwrite? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${YELLOW}Skipping installation${NC}"
            return 1
        fi
        rm -rf "$install_path"
    fi

    mkdir -p "$install_path"

    # Copy skill files
    for dir in skill agents commands rules; do
        if [ -d "$SOURCE_DIR/$dir" ]; then
            mkdir -p "$install_path/$dir"
            cp -r "$SOURCE_DIR/$dir"/* "$install_path/$dir/"
        fi
    done

    echo -e "${GREEN}✓${NC} Installed to: $install_path"

    echo ""
    echo -e "${WHITE}Installed files:${NC}"
    find "$install_path/skill" -name "*.md" -not -name "SKILL.md" | sort | while read -r file; do
        echo -e "  ${BLUE}•${NC} skill/$(basename "$file")"
    done
    echo ""
    echo -e "${WHITE}Agents:${NC}"
    find "$install_path/agents" -name "*.md" | sort | while read -r file; do
        echo -e "  ${BLUE}•${NC} $(basename "$file" .md)"
    done
    echo ""
    echo -e "${WHITE}Commands:${NC}"
    find "$install_path/commands" -name "*.md" | sort | while read -r file; do
        filename=$(basename "$file" .md)
        echo -e "  ${BLUE}•${NC} /$filename"
    done
}

# Parse arguments
SKIP_PROMPTS=false
while [[ $# -gt 0 ]]; do
    case $1 in
        --project)
            INSTALL_BASE="$PROJECT_SKILLS_DIR"
            shift
            ;;
        --path)
            INSTALL_BASE="$2"
            shift 2
            ;;
        -y|--yes)
            SKIP_PROMPTS=true
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

# Verify source
if [ ! -f "$SOURCE_DIR/skill/SKILL.md" ]; then
    echo -e "${RED}Error:${NC} skill/SKILL.md not found"
    exit 1
fi

# Choose location
if [ -z "$INSTALL_BASE" ]; then
    if [ "$SKIP_PROMPTS" = true ]; then
        INSTALL_BASE="$PERSONAL_SKILLS_DIR"
    else
        prompt_install_location
    fi
fi

INSTALL_PATH="$INSTALL_BASE/$SKILL_NAME"

# Check core skill
echo ""
echo -e "${CYAN}Checking for solana-dev-skill...${NC}"
CORE_LOCATION=$(find_core_skill)
if [ -n "$CORE_LOCATION" ]; then
    echo -e "${GREEN}✓${NC} Found at $CORE_LOCATION"
else
    echo -e "${YELLOW}→${NC} Not found. solana-dev-skill is recommended."
    if [ "$SKIP_PROMPTS" = false ]; then
        read -p "Install solana-dev-skill now? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            CORE_PATH="$INSTALL_BASE/solana-dev"
            mkdir -p "$(dirname "$CORE_PATH")"
            temp_dir=$(mktemp -d)
            if git clone --depth 1 --quiet https://github.com/solana-foundation/solana-dev-skill.git "$temp_dir" 2>/dev/null; then
                cp -r "$temp_dir/skill" "$CORE_PATH"
                rm -rf "$temp_dir"
                echo -e "${GREEN}✓${NC} Installed solana-dev-skill to $CORE_PATH"
            else
                rm -rf "$temp_dir"
                echo -e "${RED}✗${NC} Failed. Install manually later."
            fi
        fi
    fi
fi

# Install
install_fuzzer_skill "$INSTALL_PATH"

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║${NC}  ${WHITE}Installation Complete!${NC}                                       ${GREEN}║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${GREEN}✓${NC} $INSTALL_PATH"
echo ""
echo -e "${CYAN}Get started:${NC}"
echo -e "  Run ${WHITE}/fuzz-plan${NC} in Claude Code to analyze your program"
echo ""
echo -e "${YELLOW}Install prerequisites:${NC}"
echo -e "  cargo install trident-cli"
echo -e "  cargo install surfpool-cli"
echo ""
