require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const csv = require("csvtojson");
const Building = require("./models/Building");

async function run() {
  await mongoose.connect(process.env.MONGO_SRV);

  const rows = await csv().fromFile("./buildings.csv");

  const docs = rows.map((r) => ({
    name: r.name,
    direction: r.direction,
    number: Number(r.number),
    questions: {
      q1: r.q1 === "TRUE",
      q2: r.q2 === "TRUE",
      q3: r.q3 === "TRUE",
      q4: r.q4 === "TRUE",
      q5: r.q5 === "TRUE",
    },
  }));

  await Building.insertMany(docs);
  console.log("Imported", docs.length, "buildings");
  process.exit();
}

run();
