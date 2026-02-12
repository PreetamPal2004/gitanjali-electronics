
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Dynamically import dns to ensure it's available only in Node.js environment
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const dns = await import("node:dns");
    dns.setServers(["1.1.1.1", "8.8.8.8", "8.8.4.4"]);
    console.log("✅ DNS servers set to Google/Cloudflare in instrumentation");
  }
}
