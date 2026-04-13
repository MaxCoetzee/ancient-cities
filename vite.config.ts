import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "csv-parse/sync";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import type { Settlement } from "./src/settlement";

interface CSV_Settlement {
    name: string;
    wikipediaURL: string;
    latitude: string;
    longitude: string;
    inhabitationStart: string;
    inhabitationEnd?: string;
    maxPopulation?: string;
}

const inputPath = resolve("./src/data/settlements.csv");

function createSettlementsJson() {
  const settlements_CSV: CSV_Settlement[] = parse(readFileSync(inputPath, "utf8"), {
      bom: true,
      columns: true,
      skip_empty_lines: true
  });

  const settlements_JSON: Settlement[] = settlements_CSV.map(({ name, wikipediaURL, latitude, longitude, inhabitationStart, inhabitationEnd, maxPopulation }: CSV_Settlement) => ({
      name, wikipediaURL,
      location: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
      },
      inhabitation: {
          start: parseInt(inhabitationStart),
          end: inhabitationEnd ? parseInt(inhabitationEnd) : undefined
      },
      maxPopulation: maxPopulation ? parseInt(maxPopulation) : undefined
  }));

  return JSON.stringify(settlements_JSON);
}

function settlementsToJson() {
  return {
    name: "settlements-to-json",
    closeBundle() {
      const outputPath = resolve("./dist/settlements.json");
      writeFileSync(outputPath, createSettlementsJson());
    },
    configureServer(server) {
      server.watcher.add(inputPath);

      server.watcher.on("change", (path) => {
        if (path === inputPath) {
          server.ws.send({ type: "full-reload" });
        }
      });

      server.middlewares.use("/settlements.json", (_req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.end(createSettlementsJson());
      });
    }
  };
}

export default defineConfig({
  root: "src",
  plugins: [viteSingleFile(), settlementsToJson()],
  build: {
    outDir: "../dist",
    emptyOutDir: true
  }
});
