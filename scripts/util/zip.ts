import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export function zipDirectory(sourceDir: string, zipPath: string): void {
  const absoluteSourceDir = path.resolve(sourceDir);
  const absoluteZipPath = path.resolve(zipPath);

  fs.mkdirSync(path.dirname(absoluteZipPath), { recursive: true });
  fs.rmSync(absoluteZipPath, { force: true });

  execFileSync('zip', ['-r', absoluteZipPath, '.'], {
    cwd: absoluteSourceDir,
    stdio: 'inherit',
  });
}

export function unzipArchive(zipPath: string, destDir: string): void {
  fs.mkdirSync(destDir, { recursive: true });

  execFileSync(
    'unzip',
    ['-q', path.resolve(zipPath), '-d', path.resolve(destDir)],
    {
      stdio: 'inherit',
    }
  );
}
