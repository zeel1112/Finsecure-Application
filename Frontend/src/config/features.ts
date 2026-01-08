/**
 * Feature Flags Configuration
 * 
 * Control which features are enabled/disabled via environment variables.
 * This allows features to be kept in the codebase but disabled at runtime.
 */

/**
 * Check if AI Assistant feature is enabled
 * Set VITE_ENABLE_AI_ASSISTANT=true in .env to enable
 * Default: false (disabled)
 */
export const isAIAssistantEnabled = (): boolean => {
  const enabled = import.meta.env.VITE_ENABLE_AI_ASSISTANT;
  // Only enable if explicitly set to 'true' (case-insensitive)
  return enabled?.toLowerCase() === 'true';
};
