#!/bin/bash

# Simple UAT Build Script
# This builds everything in one go without modifying the demo folder

set -e

echo "🚀 Building UAT instance..."

# Clean
rm -rf uat-dist

# Build main widget
echo "📦 Building widget..."
npm ci
npm run build

# Create UAT distribution
mkdir -p uat-dist

# Create a standalone HTML file that loads the widget directly
cat > uat-dist/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recycling Locator - UAT Preview</title>
  <link rel="stylesheet" href="/recycling-locator.css">
  <style>
    body {
      font-family: -apple-system, system-ui, sans-serif;
      margin: 0;
      padding: 0;
    }

    .uat-header {
      padding: 2rem;
      text-align: center;
    }

    .uat-header h1 {
      margin: 0 0 0.5rem 0;
    }

    .controls {
      max-width: 500px;
      margin: 2rem auto;
      padding: 0 1rem;
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .control-group {
      flex: 1;
      min-width: 200px;
    }

    .control-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }

    .control-group select,
    .control-group button {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
    }

    .widget-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
  </style>
</head>

<body>
  <div class="uat-header">
    <h1>Recycling Locator Widget</h1>
    <p>UAT PREVIEW</p>
  </div>

  <div class="controls">
    <div class="control-group">
      <label for="theme">Theme Preset</label>
      <select id="theme">
        <option value="green">Green (Default)</option>
        <option value="red">Red</option>
        <option value="blue">Blue</option>
        <option value="orange">Orange</option>
        <option value="purple">Purple</option>
        <option value="brown">Brown</option>
        <option value="navy">Navy</option>
        <option value="black">Black</option>
      </select>
    </div>

    <div class="control-group">
      <label for="locale">Language</label>
      <select id="locale">
        <option value="">English</option>
        <option value="cy">Welsh (Cymraeg)</option>
      </select>
    </div>
  </div>

  <div class="widget-container">
    <recycling-locator public-path="/"></recycling-locator>
  </div>

  <script type="module" src="/index.js"></script>
  <script>
    // Wait for widget to be defined
    customElements.whenDefined('recycling-locator').then(() => {
      const widget = document.querySelector('recycling-locator');

      // Theme selector
      document.getElementById('theme').addEventListener('change', (e) => {
        widget.setAttribute('theme', e.target.value);
      });

      // Language selector
      document.getElementById('locale').addEventListener('change', (e) => {
        if (e.target.value) {
          widget.setAttribute('locale', e.target.value);
        } else {
          widget.removeAttribute('locale');
        }
      });
    });
  </script>
</body>
</html>
EOF

# Copy built assets
echo "📁 Copying assets..."
cp -r dist/* uat-dist/

# Create a simple static.json for Digital Ocean
cat > uat-dist/static.json << 'EOF'
{
  "headers": {
    "/**": {
      "Cache-Control": "no-cache, no-store, must-revalidate"
    },
    "/*.js": {
      "Content-Type": "application/javascript"
    },
    "/*.css": {
      "Content-Type": "text/css"
    }
  }
}
EOF

echo "✅ UAT build complete!"
