import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers(["1.1.1.1", "8.8.8.8", "8.8.4.4"]);

const MONGODB_URI = "mongodb+srv://gitanjaliuser1963:QnQft0CqXQLmHxqa@cluster0.wbzpppu.mongodb.net/auth-db?appName=Cluster0";

async function testConnection() {
  try {
    console.log("Connecting...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected Successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Connection Failed:");
    console.error(err);
    process.exit(1);
  }
}

testConnection();
