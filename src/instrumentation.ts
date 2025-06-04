/**
 * Entrypoint for global side effects.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    if (process.env.NODE_ENV === "production") {
      await import("~/background");
    }
  }
}
