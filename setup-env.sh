#!/bin/bash

echo "🔧 NS Challenge Environment Setup"
echo "================================"
echo

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found"
    echo "Creating .env.local file..."
    cp .env.local.example .env.local 2>/dev/null || touch .env.local
fi

echo "📋 Current environment variables:"
echo "NEXT_PUBLIC_SUPABASE_URL=$(grep NEXT_PUBLIC_SUPABASE_URL .env.local | cut -d'=' -f2)"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=$(grep NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local | cut -d'=' -f2- | cut -c1-20)..."
echo "WHISPER_API=$(grep WHISPER_API .env.local | cut -d'=' -f2 | cut -c1-8)..."
echo

# Prompt for LemonFox API key if not set
if ! grep -q "WHISPER_API=" .env.local || grep -q "YOUR_LEMONFOX_API_KEY_HERE" .env.local; then
    echo "🔑 Please enter your LemonFox API key:"
    read -p "API Key: " LEMONFOX_KEY
    
    # Update .env.local
    sed -i.bak "s/WHISPER_API=.*/WHISPER_API=$LEMONFOX_KEY/" .env.local
    sed -i.bak "s/NEXT_PUBLIC_WHISPER_API=.*/NEXT_PUBLIC_WHISPER_API=$LEMONFOX_KEY/" .env.local
    
    echo "✅ Updated .env.local with your API key"
fi

echo
echo "🚀 Setup complete!"
echo "Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Visit http://localhost:3000/test to verify setup"
echo "3. Add the same environment variables to Vercel for production"
echo

echo "📖 Vercel Environment Variables:"
echo "- NEXT_PUBLIC_SUPABASE_URL: https://gnvasxgnxnimvrmfjzvr.supabase.co"
echo "- NEXT_PUBLIC_SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdudmFzeGdueG5pbXZybWZqenZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MzEwODEsImV4cCI6MjA2ODQwNzA4MX0.FeUsdd2lyyWtyPEwvFV43dTCC_yqijJNSELbw6j798M"
echo "- WHISPER_API: [YOUR_LEMONFOX_API_KEY]"