#!/usr/bin/env bash
set -euo pipefail

if command -v google-chrome >/dev/null 2>&1; then
  google-chrome --version
  exit 0
fi

if ! command -v apt-get >/dev/null 2>&1; then
  echo "This helper expects a Debian/Ubuntu-based Codespace." >&2
  exit 1
fi

arch="$(dpkg --print-architecture)"
if [[ "$arch" != "amd64" ]]; then
  echo "Chrome stable .deb is prepared for amd64 Codespaces; detected: $arch" >&2
  exit 1
fi

sudo apt-get update
sudo apt-get install -y --no-install-recommends ca-certificates curl
curl -fsSL https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -o /tmp/relay-chrome.deb
sudo apt-get install -y /tmp/relay-chrome.deb
rm -f /tmp/relay-chrome.deb

google-chrome --version
