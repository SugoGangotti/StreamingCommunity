import express from "express";
import { promises as fs } from "fs";
import path from "path";
import cors from "cors";

const app = express();
const PORT = 3001;
const CONFIG_PATH = path.join(process.cwd(), "config.json");

// Middleware
app.use(cors());
app.use(express.json());

// Deep merge function for nested objects
function deepMerge(target, source) {
  const result = { ...target };

  for (const key in source) {
    if (
      source[key] !== null &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }

  return result;
}

// API endpoint to update config.json
app.post("/api/config", async (req, res) => {
  try {
    const configData = req.body;

    // Read existing config
    let existingConfig = {};
    try {
      const existingData = await fs.readFile(CONFIG_PATH, "utf8");
      existingConfig = JSON.parse(existingData);
    } catch (error) {
      console.log("No existing config found, creating new one");
    }

    // Deep merge with existing config
    const updatedConfig = deepMerge(existingConfig, configData);

    // Write to config.json
    await fs.writeFile(
      CONFIG_PATH,
      JSON.stringify(updatedConfig, null, 2),
      "utf8"
    );

    console.log("Config updated successfully");
    res.json({ success: true, message: "Config updated successfully" });
  } catch (error) {
    console.error("Error updating config:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update config" });
  }
});

// API endpoint to get current config
app.get("/api/config", async (req, res) => {
  try {
    const configData = await fs.readFile(CONFIG_PATH, "utf8");
    res.json(JSON.parse(configData));
  } catch (error) {
    console.error("Error reading config:", error);
    res.status(500).json({ success: false, message: "Failed to read config" });
  }
});

app.listen(PORT, () => {
  console.log(`Config server running on http://localhost:${PORT}`);
});
