import { readFile, writeFile } from 'fs/promises';

import sharp from 'sharp';

import { isImageFile } from '#utils/files.js';

/**
 * @param {import('bull').Job} job
 */
export default async (job) => {
  const { file, ext } = job.data

  if (isImageFile(ext)) {
    console.log(`Compress file ${file}`);

    const data = await readFile(file)

    if (['.jpg', '.jpeg'].includes(ext)) {
      const buff = await sharp(data).jpeg({
        quality: 30,
        mozjpeg: true,
      }).withMetadata().toBuffer()
      await writeFile(file, buff)
    } else if (ext === '.png') {
      const buff = await sharp(data).png({ quality: 30 }).withMetadata().toBuffer()
      await writeFile(file, buff)
    } else if (ext === '.webp') {
      const buff = await sharp(data).webp({ quality: 30 }).withMetadata().toBuffer()
      await writeFile(file, buff)
    }
  }

  return 'ok'
}