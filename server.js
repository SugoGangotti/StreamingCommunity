import express from "express";
import { promises as fs } from "fs";
import path from "path";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 8080;
const CONFIG_DIR = path.join(process.cwd(), "src", "config");

// Section to filename mapping (matches config-manager.ts)
const CONFIG_FILES = {
  "frontend-general": "frontend-general-config.json",
  "backend-general": "backend-general-config.json",
  storage: "storage-config.json",
  downloader: "downloader-config.json",
  conversion: "conversion-config.json",
  external_services: "external_services-config.json",
  network: "network-config.json",
  hooks: "hooks-config.json",
  site_login: "site_login-config.json",
  apis: "apis-config.json",
};

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

// API endpoint to get all configs (backward compatibility)
app.get("/api/config", async (req, res) => {
  try {
    const allConfigs = {};

    for (const [section, filename] of Object.entries(CONFIG_FILES)) {
      const filePath = path.join(CONFIG_DIR, filename);
      try {
        const configData = await fs.readFile(filePath, "utf8");
        allConfigs[section] = JSON.parse(configData);
      } catch (error) {
        console.log(`No existing ${section} config found, using empty object`);
        allConfigs[section] = {};
      }
    }

    res.json(allConfigs);
  } catch (error) {
    console.error("Error reading configs:", error);
    res.status(500).json({ success: false, message: "Failed to read configs" });
  }
});

// API endpoint to update all configs (backward compatibility)
app.post("/api/config", async (req, res) => {
  try {
    const configData = req.body;

    for (const [section, data] of Object.entries(configData)) {
      if (CONFIG_FILES[section]) {
        const filePath = path.join(CONFIG_DIR, CONFIG_FILES[section]);

        // Read existing config
        let existingConfig = {};
        try {
          const existingData = await fs.readFile(filePath, "utf8");
          existingConfig = JSON.parse(existingData);
        } catch (error) {
          console.log(`No existing ${section} config found, creating new one`);
        }

        // Deep merge with existing config
        const updatedConfig = deepMerge(existingConfig, data);

        // Write to section config file
        await fs.writeFile(
          filePath,
          JSON.stringify(updatedConfig, null, 2),
          "utf8",
        );
      }
    }

    console.log("All configs updated successfully");
    res.json({ success: true, message: "Configs updated successfully" });
  } catch (error) {
    console.error("Error updating configs:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update configs" });
  }
});

// API endpoint to get specific section config
app.get("/api/config/:section", async (req, res) => {
  try {
    const { section } = req.params;

    if (!CONFIG_FILES[section]) {
      return res.status(400).json({
        success: false,
        message: `Invalid section: ${section}`,
      });
    }

    const filePath = path.join(CONFIG_DIR, CONFIG_FILES[section]);
    const configData = await fs.readFile(filePath, "utf8");
    res.json(JSON.parse(configData));
  } catch (error) {
    console.error(`Error reading ${req.params.section} config:`, error);
    res.status(500).json({
      success: false,
      message: `Failed to read ${req.params.section} config`,
    });
  }
});

// API endpoint to update specific section config
app.post("/api/config/:section", async (req, res) => {
  try {
    const { section } = req.params;
    const configData = req.body;

    if (!CONFIG_FILES[section]) {
      return res.status(400).json({
        success: false,
        message: `Invalid section: ${section}`,
      });
    }

    const filePath = path.join(CONFIG_DIR, CONFIG_FILES[section]);

    // Read existing config
    let existingConfig = {};
    try {
      const existingData = await fs.readFile(filePath, "utf8");
      existingConfig = JSON.parse(existingData);
    } catch (error) {
      console.log(`No existing ${section} config found, creating new one`);
    }

    // Deep merge with existing config
    const updatedConfig = deepMerge(existingConfig, configData);

    // Write to section config file
    await fs.writeFile(
      filePath,
      JSON.stringify(updatedConfig, null, 2),
      "utf8",
    );

    console.log(`${section} config updated successfully`);
    res.json({
      success: true,
      message: `${section} config updated successfully`,
    });
  } catch (error) {
    console.error(`Error updating ${req.params.section} config:`, error);
    res.status(500).json({
      success: false,
      message: `Failed to update ${req.params.section} config`,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Config server running on http://localhost:${PORT}`);
});
