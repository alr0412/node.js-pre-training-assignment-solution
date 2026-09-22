const { MongoClient } = require("mongodb");

const url = "mongodb://mongodb:27017";
const client = new MongoClient(url);

async function main() {
  console.log("Started connecting to MongoDB...");
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB");

    const adminDb = client.db("admin").admin();
    const dbs = await adminDb.listDatabases();

    console.log("Available dbs: ");
    dbs.databases.forEach((db) => {
      console.log(`- ${db.name}`);
    });
  } catch (error) {
    console.error("Failed to connect: ", error.message);
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}

main();
