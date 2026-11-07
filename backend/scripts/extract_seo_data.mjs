import mongoose from "mongoose";
import dns from "node:dns";
import fs from "fs";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const uri = "mongodb+srv://kraviona:kraviona@kraviona.c9i8wkl.mongodb.net/kraviona?retryWrites=true&w=majority";

async function extract() {
  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(uri, { dbName: "kraviona" });
  console.log("Connected.");

  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("Collections:", collections.map(c => c.name));

  // Extract all services
  const services = await mongoose.connection.collection("services")
    .find({}, { projection: { title: 1, slug: 1, category: 1, order: 1, seo: 1, description: 1, techStack: 1, features: 1, hero: 1 } })
    .sort({ order: 1 })
    .toArray();

  console.log(`Fetched ${services.length} services.`);

  // Extract all posts / blogs
  const posts = await mongoose.connection.collection("posts")
    .find({}, { projection: { title: 1, slug: 1, category: 1, tags: 1, metaDescription: 1, isPublished: 1, createdAt: 1, views: 1 } })
    .sort({ createdAt: -1 })
    .toArray();

  console.log(`Fetched ${posts.length} blog posts.`);

  // Check if keyworditems collection exists
  let keywords = [];
  if (collections.some(c => c.name === "keyworditems")) {
    keywords = await mongoose.connection.collection("keyworditems").find().toArray();
    console.log(`Fetched ${keywords.length} keywords from keyworditems collection.`);
  }

  // Check if contentplanitems exists
  let contentPlan = [];
  if (collections.some(c => c.name === "contentplanitems")) {
    contentPlan = await mongoose.connection.collection("contentplanitems").find().toArray();
    console.log(`Fetched ${contentPlan.length} items from contentplanitems.`);
  }

  const result = {
    services,
    posts,
    keywords,
    contentPlan
  };

  fs.writeFileSync("scratch/db_seo_dump.json", JSON.stringify(result, null, 2));
  console.log("Saved to scratch/db_seo_dump.json");
  process.exit(0);
}

extract().catch(err => {
  console.error("Extraction error:", err);
  process.exit(1);
});
