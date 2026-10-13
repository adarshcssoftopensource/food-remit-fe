/**
 * Enterprise Application Logger
 * Suppresses debug logs in production to prevent console noise and leaks,
 * while formatting development logs with timestamps and severity badges.
 */
type LogLevel = "debug" | "info" | "warn" | "error";

const isDev = process.env.NODE_ENV !== "production";

function formatPrefix(level: LogLevel, tag?: string): string {
  const time = new Date().toLocaleTimeString();
  return `[${time}] [${level.toUpperCase()}]${tag ? ` [${tag}]` : ""}:`;
}

export const logger = {
  debug: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.debug(
        `%c${formatPrefix("debug")}`,
        "color: #94a3b8; font-weight: bold;",
        message,
        ...args,
      );
    }
  },

  info: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.info(
        `%c${formatPrefix("info")}`,
        "color: #38bdf8; font-weight: bold;",
        message,
        ...args,
      );
    }
  },

  warn: (message: string, ...args: unknown[]) => {
    console.warn(
      `%c${formatPrefix("warn")}`,
      "color: #f59e0b; font-weight: bold;",
      message,
      ...args,
    );
  },

  error: (message: string, ...args: unknown[]) => {
    console.error(
      `%c${formatPrefix("error")}`,
      "color: #ef4444; font-weight: bold;",
      message,
      ...args,
    );
  },

  withTag: (tag: string) => ({
    debug: (msg: string, ...args: unknown[]) => logger.debug(`[${tag}] ${msg}`, ...args),
    info: (msg: string, ...args: unknown[]) => logger.info(`[${tag}] ${msg}`, ...args),
    warn: (msg: string, ...args: unknown[]) => logger.warn(`[${tag}] ${msg}`, ...args),
    error: (msg: string, ...args: unknown[]) => logger.error(`[${tag}] ${msg}`, ...args),
  }),
};
