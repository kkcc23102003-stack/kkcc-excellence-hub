/**
 * A deployed server function can reject before its handler runs (for example,
 * when the hosting origin is temporarily unavailable). Route loaders use this
 * boundary so that a content outage renders an empty state instead of a blank
 * application.
 */
export async function safeServerCall<T>(call: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await call();
  } catch (error) {
    console.error("[server-call] request failed", error);
    return fallback;
  }
}
