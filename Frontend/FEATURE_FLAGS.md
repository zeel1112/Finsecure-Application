# Feature Flags Guide

This document explains how to manage feature flags in the application.

## What are Feature Flags?

Feature flags allow you to enable or disable features at runtime without modifying code. This is useful for:
- Keeping code in version control while disabling features
- Testing features in development without affecting production
- Gradually rolling out features
- Quickly disabling features if issues arise

## Current Feature Flags

### AI Assistant (`VITE_ENABLE_AI_ASSISTANT`)

Controls the Perplexity Pro AI Assistant feature.

**Status:** Disabled by default

**To Enable:**
```bash
# In Frontend/.env
VITE_ENABLE_AI_ASSISTANT=true
VITE_PERPLEXITY_API_KEY=your_api_key_here
```

**To Disable:**
```bash
# In Frontend/.env - either remove the line or set to false
VITE_ENABLE_AI_ASSISTANT=false
# OR simply don't include it (defaults to disabled)
```

**What it controls:**
- AI Assistant navigation item in sidebar
- `/ai-assistant` route
- All Perplexity API calls

**Files affected:**
- `src/config/features.ts` - Feature flag configuration
- `src/App.tsx` - Route registration
- `src/components/layout/Sidebar.tsx` - Navigation menu
- `src/services/perplexityService.ts` - API service

## How It Works

1. **Feature Flag Check**: The `isAIAssistantEnabled()` function in `src/config/features.ts` checks the environment variable
2. **Conditional Loading**: Routes and navigation items are only included if the feature is enabled
3. **API Protection**: The service layer also checks the flag before making API calls

## Adding New Feature Flags

To add a new feature flag:

1. **Add to `src/config/features.ts`:**
```typescript
export const isNewFeatureEnabled = (): boolean => {
  const enabled = import.meta.env.VITE_ENABLE_NEW_FEATURE;
  return enabled?.toLowerCase() === 'true';
};
```

2. **Use in components/routes:**
```typescript
import { isNewFeatureEnabled } from './config/features';

// In your component
{isNewFeatureEnabled() && <NewFeatureComponent />}
```

3. **Document in this file**

## Best Practices

- ✅ Always default features to `false` (disabled)
- ✅ Keep feature flag logic in `src/config/features.ts`
- ✅ Document new flags in this file
- ✅ Remove feature flags after features are stable (optional)
- ❌ Don't commit `.env` files with real API keys
- ❌ Don't use feature flags for security (they're client-side)

## Environment Variables

All feature flags use the `VITE_` prefix so Vite can expose them to the client.

**Important:** After changing `.env` files, you must restart the development server for changes to take effect.
