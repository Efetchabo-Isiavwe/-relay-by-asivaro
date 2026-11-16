#!/usr/bin/env bash
set -euo pipefail

if ! command -v google-chrome >/dev/null 2>&1; then
  echo "Chrome is not installed. Run: bash scripts/install-chrome-codespace.sh" >&2
  exit 1
fi

if [[ -z "${DISPLAY:-}" ]]; then
  echo "DISPLAY is not set. Start/rebuild the Codespace so desktop-lite can start the desktop session." >&2
  exit 1
fi

mkdir -p "$HOME/.config/relay-chrome-profile"
nohup google-chrome \
  --no-first-run \
  --no-default-browser-check \
  --user-data-dir="$HOME/.config/relay-chrome-profile" \
  about:blank \
  >/tmp/relay-chrome.log 2>&1 &

echo "Chrome launched in the remote desktop. Open the private forwarded port 6080, connect with the desktop password configured in .devcontainer/devcontainer.json, then open chrome://on-device-internals."
