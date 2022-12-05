import { readdir, lstat } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';

/**
 * @param {string} parentPath
 * @param {RegExp} ext
 * @param {(data: {parentPath: string; file: string; filename: string}) => Promise<any>} callback
 */
export async function findAllFiles(parentPath, ext, callback) {
  const files = await readdir(parentPath);

  for (let i = 0; i < files.length; i++) {
    const filename = join(parentPath, files[i]);
    const stat = await lstat(filename);

    if (stat.isDirectory()) {
      await findAllFiles(filename, ext, callback); //recurse
    }

    else if (ext.test(files[i])) await callback({
      parentPath,
      filename: files[i],
      file: fileURLToPath(new URL(`../${filename}`, import.meta.url))
    });
  }
}
