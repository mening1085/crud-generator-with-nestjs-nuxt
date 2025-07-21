import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const SCHEMA_DIR = path.join(__dirname, "../tools/schemas");

// GET /schemas - รายชื่อ schema
app.get("/schemas", (req, res) => {
  fs.readdir(SCHEMA_DIR, (err, files) => {
    if (err) return res.status(500).json({ error: err.message });
    const schemas = files
      .filter((f) => f.endsWith(".schema.js"))
      .map((f) => f.replace(".schema.js", ""));
    res.json(schemas);
  });
});

// GET /schemas/:name - ดาวน์โหลด schema
app.get("/schemas/:name", (req, res) => {
  const filePath = path.join(SCHEMA_DIR, `${req.params.name}.schema.js`);
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(404).send("Not found");
    res.type("application/javascript").send(data);
  });
});

// POST /schemas - สร้าง schema ใหม่
app.post("/schemas", (req, res) => {
  const { name, fields } = req.body;
  if (!name || !fields)
    return res.status(400).json({ error: "name and fields required" });
  const filePath = path.join(SCHEMA_DIR, `${name}.schema.js`);
  const content = `module.exports = {\n  name: '${name}',\n  fields: ${JSON.stringify(fields, null, 2)}\n};\n`;
  fs.writeFile(filePath, content, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// DELETE /schemas/:name - ลบไฟล์ schema จริง
app.delete("/schemas/:name", (req, res) => {
  const filePath = path.join(SCHEMA_DIR, `${req.params.name}.schema.js`);
  fs.unlink(filePath, (err) => {
    if (err) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  });
});

// POST /generate - generate CRUD
app.post("/generate", (req, res) => {
  const { projectName, schemaName } = req.body;
  if (!projectName || !schemaName)
    return res
      .status(400)
      .json({ error: "projectName and schemaName required" });
  const plopfilePath = path.resolve(__dirname, "../plopfile.js");
  const cwd = path.resolve(__dirname, "..");
  console.log("[API] Plopfile path:", plopfilePath, "CWD:", cwd);
  const cmd = `npx plop --plopfile "${plopfilePath}" --cwd "${cwd}" crud-from-schema --projectName ${projectName} --schemaFile ${schemaName}`;
  console.log("[API] CMD:", cmd);
  exec(cmd, { cwd }, (err, stdout, stderr) => {
    console.log("[API] plop stdout:\n", stdout);
    console.log("[API] plop stderr:\n", stderr);
    if (err) return res.status(500).json({ error: stderr || err.message });
    res.json({ success: true, output: stdout });
  });
});

// POST /delete - ลบ CRUD
app.post("/delete", (req, res) => {
  const { projectName, entityName } = req.body;
  if (!projectName || !entityName)
    return res
      .status(400)
      .json({ error: "projectName and entityName required" });
  const plopfilePath = path.resolve(__dirname, "../plopfile.js");
  const cwd = path.resolve(__dirname, "..");
  console.log("[API] Plopfile path:", plopfilePath, "CWD:", cwd);
  const cmd = `npx plop --plopfile "${plopfilePath}" --cwd "${cwd}" delete-crud --projectName ${projectName} --entityName ${entityName}`;
  console.log("[API] CMD:", cmd);
  exec(cmd, { cwd }, (err, stdout, stderr) => {
    console.log("[API] plop stdout:\n", stdout);
    console.log("[API] plop stderr:\n", stderr);
    if (err) return res.status(500).json({ error: stderr || err.message });
    res.json({ success: true, output: stdout });
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend API running on port ${PORT}`);
});
