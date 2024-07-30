export const config = {
  config: {
    showBanner: true,
    ip: true,
    logFilePath: "./logs/example.log",
    customLogFormat:
      "🦊 {now} {level} {duration} {method} {pathname} {status} {message} {ip} {epoch}",
    logFilter: {
      level: ["ERROR", "WARNING", "INFO"],
      status: [500, 404, 200],
      method: ["GET", "POST", "PUT", "DELETE"],
    },
  },
};
