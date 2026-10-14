import fs from "node:fs";
import path from "node:path";
import { AgentEngine } from "./engine.js";

const objectivePath = path.join(process.cwd(), "agent-core", "objectives.example.json");
const objective = JSON.parse(fs.readFileSync(objectivePath, "utf8"));

const engine = new AgentEngine({ role: "auditor" });
const result = engine.run(objective);

console.log("=== Agent Infrastructure Demo ===");
console.log(`Objective: ${result.objective.title}`);
console.log(`Subgoals: ${result.plan.subgoals.length}`);
console.log(`Reflection: ${result.reflection.passed ? "PASS" : "REVIEW"}`);
console.log(`Critique confidence: ${result.critique.confidence}`);
console.log("\nPerformance summary:");
console.log(JSON.stringify(result.performance, null, 2));
console.log("\nTransparency events:");
console.log(JSON.stringify(result.transparency, null, 2));
