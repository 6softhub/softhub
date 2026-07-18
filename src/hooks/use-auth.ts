// UI-only stub — no auth backend wired.
export function useAuth() {
  return { session: null, user: null, loading: false, signOut: async () => {} };
}
