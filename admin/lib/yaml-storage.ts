import fs from "fs";

/**
 * Atomically write `content` to `filePath`. If the file already exists, the
 * previous contents are first copied to `<filePath>.bak`. The new content is
 * written to `<filePath>.tmp` and then renamed over `filePath`, which is
 * atomic on POSIX. On any error, the original file is left untouched.
 */
export function writeYamlAtomic(filePath: string, content: string): void {
  const tmpPath = `${filePath}.tmp`;
  const bakPath = `${filePath}.bak`;

  fs.writeFileSync(tmpPath, content, "utf8");

  try {
    if (fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, bakPath);
    }
    fs.renameSync(tmpPath, filePath);
  } catch (err) {
    // Clean up the tmp file if it's still hanging around
    try { fs.unlinkSync(tmpPath); } catch { /* ignore */ }
    throw err;
  }
}
