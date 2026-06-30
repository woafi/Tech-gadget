export const OAUTH_ERROR_MESSAGES: Record<string, string> = {
    oauth_failed: "Google sign-in failed. Please try again.",
    oauth_denied: "Google sign-in was cancelled.",
    oauth_state_mismatch: "Sign-in session expired. Please try again.",
    oauth_not_configured: "Google sign-in is not configured yet.",
};

export function getOAuthErrorMessage(errorCode: string | null) {
    if (!errorCode) {
        return "";
    }

    return OAUTH_ERROR_MESSAGES[errorCode] ?? "Google sign-in failed. Please try again.";
}
