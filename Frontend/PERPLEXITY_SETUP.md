# Perplexity Pro API Setup

This application uses Perplexity Pro API for AI-powered financial assistance.

## Feature Flag System

The AI Assistant feature is controlled by a feature flag. This allows you to:
- ✅ Keep all AI Assistant code in GitHub
- ❌ Disable the feature at runtime without affecting the app
- ✅ Re-enable it later by simply changing an environment variable

### Enabling/Disabling the AI Assistant

**To Enable:**
Add to your `.env` file:
```
VITE_ENABLE_AI_ASSISTANT=true
```

**To Disable:**
Either:
- Remove `VITE_ENABLE_AI_ASSISTANT` from `.env`, OR
- Set `VITE_ENABLE_AI_ASSISTANT=false` in `.env`

**Default:** Disabled (feature won't appear in navigation or routes)

## Setup Instructions

1. **Enable the Feature Flag**
   - Add `VITE_ENABLE_AI_ASSISTANT=true` to your `.env` file

2. **Get your Perplexity API Key**
   - Visit https://www.perplexity.ai/settings/api
   - Sign up or log in to your Perplexity account
   - Generate a new API key (Pro subscription required)

3. **Configure Environment Variables**
   - Create a `.env` file in the `Frontend` directory (if it doesn't exist)
   - Add the following lines:
     ```
     VITE_ENABLE_AI_ASSISTANT=true
     VITE_PERPLEXITY_API_KEY=your_actual_api_key_here
     ```
   - Replace `your_actual_api_key_here` with your actual Perplexity API key

4. **Restart Development Server**
   - Stop your current development server (if running)
   - Start it again with `npm run dev`
   - The environment variables will be loaded automatically

## Usage

Once configured, you can access the AI Assistant from the sidebar navigation. The assistant can help with:
- Financial questions and advice
- Budget recommendations
- Investment insights
- Tax strategies
- And more!

## Model Information

The application uses the `sonar-pro` model, which is Perplexity's flagship model with:
- 200k token context window
- Best performance for complex reasoning tasks
- Ideal for financial analysis and advice

Other available models (if you want to change):
- `sonar`: Base model (128k context, cost-effective)
- `sonar-reasoning-pro`: Advanced reasoning (128k context)
- `sonar-reasoning`: Fast reasoning (128k context)
- `sonar-deep-research`: Expert research (128k context)

## Troubleshooting

### Common Issues

1. **"Perplexity API key is not configured"**
   - Make sure your `.env` file exists in the `Frontend` directory (not the root)
   - Verify the file contains: `VITE_PERPLEXITY_API_KEY=your_key_here`
   - **Important**: After creating/updating the `.env` file, you MUST restart your development server
   - Check that there are no spaces around the `=` sign
   - Make sure the file is named exactly `.env` (not `.env.txt` or `.env.local`)

2. **"Invalid Perplexity API key"**
   - Verify your API key is correct (copy-paste it again)
   - Ensure your Perplexity Pro subscription is active
   - Check that you're using a Pro API key (not a free tier key)
   - Try generating a new API key from https://www.perplexity.ai/settings/api

3. **"Rate limit exceeded"**
   - You've hit the API rate limit
   - Wait a few moments and try again
   - Check your Perplexity Pro subscription limits

4. **"Failed to connect to Perplexity API"**
   - Check your internet connection
   - Verify the API endpoint is accessible
   - Check browser console for CORS errors (if any)

5. **Component not loading or showing errors**
   - Open browser Developer Tools (F12)
   - Check the Console tab for error messages
   - Check the Network tab to see if API requests are being made
   - Verify the route `/ai-assistant` is accessible

### Debug Steps

1. **Verify Environment Variable is Loaded**
   - Open browser console (F12)
   - Type: `console.log(import.meta.env.VITE_PERPLEXITY_API_KEY)`
   - If it shows `undefined`, the environment variable is not loaded (restart dev server)

2. **Check API Request**
   - Open Network tab in Developer Tools
   - Try sending a message in the AI Assistant
   - Look for requests to `api.perplexity.ai`
   - Check the request headers and response

3. **Test API Key Manually**
   - Use a tool like Postman or curl to test your API key:
   ```bash
   curl https://api.perplexity.ai/chat/completions \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"model":"llama-3.1-sonar-large-128k-online","messages":[{"role":"user","content":"Hello"}]}'
   ```

## Security Note

Never commit your `.env` file to version control. The `.env` file should already be in `.gitignore`.
