import fs from "fs";
import path from "path";
import dns from "node:dns";

// Manually load .env.local BEFORE importing db
try {
    const envPath = path.resolve(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
        console.log("Loading .env.local...");
        const envConfig = fs.readFileSync(envPath, "utf-8");
        envConfig.split("\n").forEach((line) => {
            const separatorIndex = line.indexOf("=");
            if (separatorIndex > 0) {
                const key = line.substring(0, separatorIndex).trim();
                let value = line.substring(separatorIndex + 1).trim();
                if (value) {
                    // Remove surrounding quotes if present
                    value = value.replace(/^["']|["']$/g, "");
                    process.env[key] = value;
                }
            }
        });
        console.log("Loaded .env.local");
    } else {
        console.log("No .env.local found");
    }
} catch (e) {
    console.error("Error loading .env.local", e);
}

// Set DNS servers
dns.setServers(["1.1.1.1", "8.8.8.8", "8.8.4.4"]);

async function run() {
    try {
        // Dynamic import to ensure env vars are loaded first
        const { connectDB } = await import("./lib/db");
        console.log("Testing database connection...");
        const conn = await connectDB();
        console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);
        console.log(`Database Name: ${conn.connection.name}`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1);
    }
}

run();
