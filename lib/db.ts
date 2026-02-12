import mongoose from "mongoose";
import dns from "node:dns";

// Force DNS servers to Google/Cloudflare
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {
  console.error("Failed to set DNS servers:", e);
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

type Cached = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongoose: Cached | undefined;
}

let cached: Cached = global.mongoose ?? { conn: null, promise: null };
if (!global.mongoose) global.mongoose = cached;

async function resolveSRV(hostname: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    dns.resolveSrv(hostname, (err, addresses) => {
      if (err) return reject(err);
      resolve(addresses.map((a) => `${a.name}:${a.port}`));
    });
  });
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log("Attempting to connect to MongoDB...");

    // Try standard connection first
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("✅ MongoDB Connected Successfully!");
        return mongoose;
      })
      .catch(async (err) => {
        console.error("❌ Standard Connection Failed, trying manual SRV resolution...", err.code);

        // If SRV failure, try manual resolution
        if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
          try {
            const url = new URL(MONGODB_URI);
            if (url.protocol === "mongodb+srv:") {
              // Extract hostname from mongodb+srv://user:pass@HOSTNAME/db...
              const hostname = url.hostname;
              console.log(`Resolving SRV for: _mongodb._tcp.${hostname}`);

              const resolvedHosts = await resolveSRV(`_mongodb._tcp.${hostname}`);
              console.log("Resolved Hosts:", resolvedHosts);

              if (resolvedHosts.length > 0) {
                // Construct new URI: mongodb://user:pass@host1:port,host2:port/db?ssl=true&replicaSet=...
                url.protocol = "mongodb:";
                url.hostname = ""; // Hostnames are in the path now
                url.host = resolvedHosts.join(",");
                // Ensure required options for Atlas standard connection
                url.searchParams.set("ssl", "true");
                url.searchParams.set("authSource", "admin");

                const newUri = url.toString();
                console.log("Connecting with resolved URI (hidden credentials)...");

                return mongoose.connect(newUri, opts);
              }
            }
          } catch (manualErr) {
            console.error("Manual SRV resolution failed:", manualErr);
          }
        }
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
