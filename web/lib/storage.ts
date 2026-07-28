import fs from "fs";
import path from "path";

const STORAGE_ROOT = process.env.STORAGE_PATH || "/storage";

export function isStorageAvailable(): boolean {
  try {
    return fs.existsSync(STORAGE_ROOT) && fs.statSync(STORAGE_ROOT).isDirectory();
  } catch {
    return false;
  }
}

export function getStorageDir(...subdirs: string[]): string {
  const base = isStorageAvailable() ? STORAGE_ROOT : path.join(process.cwd(), "public");
  const target = path.join(base, ...subdirs);
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }
  return target;
}

export function getStorageFilePath(relativePath: string): string | null {
  if (isStorageAvailable()) {
    const p = path.join(STORAGE_ROOT, relativePath);
    if (fs.existsSync(p) && fs.statSync(p).isFile()) {
      return p;
    }
  }
  // Fallback to public directory
  const publicPath = path.join(process.cwd(), "public", relativePath);
  if (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
    return publicPath;
  }
  return null;
}

export function initPersistentStorage(): void {
  // Skip during build phase to avoid file locks and build delays
  if (process.env.NEXT_PHASE === "phase-production-build" || process.env.NEXT_PHASE === "phase-export") {
    return;
  }
  if (!isStorageAvailable()) return;

  const narrationStorage = path.join(STORAGE_ROOT, "narration");
  if (!fs.existsSync(narrationStorage)) {
    try {
      fs.mkdirSync(narrationStorage, { recursive: true });
    } catch {
      // Ignore if concurrent creation
    }
  }

  // Sync initial narration files from public/narration if persistent storage narration is empty
  const publicNarration = path.join(process.cwd(), "public", "narration");
  if (fs.existsSync(publicNarration)) {
    try {
      const files = fs.readdirSync(publicNarration);
      for (const file of files) {
        const dest = path.join(narrationStorage, file);
        if (!fs.existsSync(dest)) {
          try {
            fs.copyFileSync(path.join(publicNarration, file), dest);
          } catch {
            // Silence non-critical lock warnings
          }
        }
      }
    } catch {
      // Ignore directory read errors during initialization
    }
  }
}
