import { expect, test, afterEach, beforeEach } from "bun:test";
import fs from "fs";
import path from "path";
import os from "os";
import { writeYamlAtomic } from "./yaml-storage";

let tmpDir: string;
let targetPath: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "yaml-storage-"));
  targetPath = path.join(tmpDir, "campaign.yml");
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test("writes new file when target does not exist", () => {
  writeYamlAtomic(targetPath, "hello: world\n");
  expect(fs.readFileSync(targetPath, "utf8")).toBe("hello: world\n");
  expect(fs.existsSync(targetPath + ".bak")).toBe(false);
  expect(fs.existsSync(targetPath + ".tmp")).toBe(false);
});

test("creates .bak of previous content before overwriting", () => {
  fs.writeFileSync(targetPath, "original: true\n");
  writeYamlAtomic(targetPath, "updated: true\n");

  expect(fs.readFileSync(targetPath, "utf8")).toBe("updated: true\n");
  expect(fs.readFileSync(targetPath + ".bak", "utf8")).toBe("original: true\n");
  expect(fs.existsSync(targetPath + ".tmp")).toBe(false);
});

test("leaves original file intact and cleans up tmp when backup step fails", () => {
  fs.writeFileSync(targetPath, "original: true\n");
  // Pre-create a directory at the .bak path so copyFileSync throws (EISDIR)
  // forcing the catch block to run AFTER .tmp has been written.
  fs.mkdirSync(targetPath + ".bak");

  expect(() => writeYamlAtomic(targetPath, "updated: true\n")).toThrow();

  // Original target untouched, tmp cleaned up by the catch block,
  // and the bak-path directory is still there.
  expect(fs.readFileSync(targetPath, "utf8")).toBe("original: true\n");
  expect(fs.existsSync(targetPath + ".tmp")).toBe(false);
  expect(fs.statSync(targetPath + ".bak").isDirectory()).toBe(true);
});
