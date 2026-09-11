import { getCollection } from "./lib/db.mjs";
const projects = await getCollection("projects");
const allProjects = await projects.find({}).toArray();
console.log("=== PROJECTS AND THEIR SAVED TOKEN ADDRESS ===");
for (const p of allProjects) {
  console.log(`  ${p.name}: tokenAddress = ${p.config?.tokenAddress || "(none set)"}`);
}
process.exit(0);
