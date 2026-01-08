# AI Assistant Feature Flag - Quick Reference

## Current Status

✅ **AI Assistant code is safely stored in GitHub**  
❌ **Feature is DISABLED by default** (won't appear in UI or affect runtime)  
✅ **Can be re-enabled easily** with one environment variable

## How to Disable (Current State)

The feature is **already disabled** by default. No action needed.

The AI Assistant will:
- ❌ NOT appear in the navigation sidebar
- ❌ NOT be accessible via `/ai-assistant` route
- ❌ NOT make any API calls
- ✅ Code remains in the repository

## How to Enable

1. **Create or edit `.env` file** in the `Frontend` directory:
   ```
   VITE_ENABLE_AI_ASSISTANT=true
   VITE_PERPLEXITY_API_KEY=your_perplexity_api_key_here
   ```

2. **Restart your development server:**
   ```bash
   npm run dev
   ```

3. **The AI Assistant will now:**
   - ✅ Appear in the navigation sidebar
   - ✅ Be accessible at `/ai-assistant`
   - ✅ Make API calls to Perplexity

## Files Modified for Feature Flag

The following files were updated to support the feature flag:

- `src/config/features.ts` - New file with feature flag logic
- `src/App.tsx` - Conditionally renders AI Assistant route
- `src/components/layout/Sidebar.tsx` - Conditionally shows navigation item
- `src/services/perplexityService.ts` - Checks flag before API calls

## Code Location

All AI Assistant code remains in:
- `src/pages/ai-assistant/AIAssistantPage.tsx`
- `src/services/perplexityService.ts`
- Related components and utilities

**None of this code is deleted** - it's just gated behind the feature flag.

## Verification

**To verify feature is disabled:**
- Check navigation sidebar - "AI Assistant" should NOT appear
- Try visiting `/ai-assistant` - should show 404 or redirect
- Check browser console - no Perplexity API calls should be made

**To verify feature is enabled:**
- Check navigation sidebar - "AI Assistant" should appear
- Visit `/ai-assistant` - should load the AI Assistant page
- Check browser console - API calls should work (if API key is configured)

## Notes

- Feature flag is checked at runtime (not build time)
- Code is still bundled but not accessible when disabled
- Environment variable must be `true` (case-insensitive) to enable
- Default behavior is disabled (safe for production)
