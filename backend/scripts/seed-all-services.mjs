import mongoose from "mongoose";
import dns from "node:dns";
import { Service } from "../src/models/services/service.model.js";
import { seedServicesData } from "../src/data/seedServicesData.js";
import config from "../src/config/config.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const mongoUri =
  process.env.MONGO_URI ||
  config.MONGO_URI ||
  "mongodb+srv://kraviona:kraviona@kraviona.c9i8wkl.mongodb.net/kraviona?retryWrites=true&w=majority";

const dbName = process.env.DB_NAME || config.DB_NAME || "kraviona";

async function seedAllServices() {
  console.log("==================================================");
  console.log("🚀 KRAVIONA — ALL SERVICES DATABASE SEED SCRIPT");
  console.log("==================================================");
  console.log(`Connecting to MongoDB (${dbName})...`);

  try {
    await mongoose.connect(mongoUri, { dbName });
    console.log("✅ MongoDB Connected Successfully\n");

    console.log(`Total services to seed: ${seedServicesData.length}`);

    let inserted = 0;
    let updated = 0;

    for (const item of seedServicesData) {
      const existing = await Service.findOne({ slug: item.slug });

      const result = await Service.findOneAndUpdate(
        { slug: item.slug },
        { $set: item },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      if (existing) {
        updated++;
        console.log(`  🔄 [UPDATED] #${item.order.toString().padStart(2, "0")} ${item.slug} (${item.category})`);
      } else {
        inserted++;
        console.log(`  ✨ [INSERTED] #${item.order.toString().padStart(2, "0")} ${item.slug} (${item.category})`);
      }
    }

    const totalInDb = await Service.countDocuments();
    const activeInDb = await Service.countDocuments({ isActive: true });

    console.log("\n==================================================");
    console.log("🎉 SEED COMPLETED SUCCESSFULLY!");
    console.log(`✨ Inserted: ${inserted}`);
    console.log(`🔄 Updated: ${updated}`);
    console.log(`📊 Total in Database: ${totalInDb}`);
    console.log(`🟢 Active Visible Services: ${activeInDb}`);
    console.log("==================================================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Failed:", error);
    process.exit(1);
  }
}

seedAllServices();
