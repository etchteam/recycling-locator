#!/usr/bin/env zsh

mkdir -p .dev/ssl

echo "\n👷 Setting up HTTPS development environment…\n"

# Check and add hosts entry if needed
if ! grep -q "rl.localhost" /etc/hosts; then
  echo "➕ Adding rl.localhost to /etc/hosts…\n"
  echo "127.0.0.1 rl.localhost" | sudo tee -a /etc/hosts
else
  echo "🥳 rl.localhost already in /etc/hosts\n"
fi

echo "🤝 Installing local CA and generating certificate…\n"
mkcert -install
mkcert -cert-file .dev/ssl/rl.localhost.pem -key-file .dev/ssl/rl.localhost-key.pem rl.localhost

echo "🔓 Granting Caddy permission to bind to ports 80/443…\n"
sudo setcap 'cap_net_bind_service=+ep' $(which caddy)

echo "🧠 Increasing UDP buffer size…\n"
sudo sysctl -w net.core.rmem_max=7500000
sudo sysctl -w net.core.wmem_max=7500000

echo "🧱 Installing dependencies…\n"
npm install

echo "\n☁️  Starting Caddy reverse proxy…\n"
caddy start --config Caddyfile --adapter caddyfile --watch

echo "✅ Development environment ready!"
echo "   Node.js: $(node --version)\n"

# Background process to detect when the locator is ready
(
  echo "👀 Waiting for the Locator to start…\n"
  while ! curl -s http://localhost:3020 > /dev/null 2>&1; do
    sleep 0.5
  done
  echo "\n🚀 The Locator is ready!"
  echo "   Running at: https://rl.localhost"
  echo "   Press Ctrl+C to stop the server and type exit to close the nix shell.\n"
  echo ""
) &

npx run-p start:css start:vite

