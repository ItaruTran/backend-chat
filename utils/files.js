import { rename, mkdir, rm, copyFile } from 'fs/promises';
import { dirname } from 'path';

export async function moveFile(oldPath, newPath) {
  const parent = dirname(newPath)
  await mkdir(parent, { recursive: true, mode: 0o755 })

  try {
    await rename(oldPath, newPath)
  } catch (error) {
    if (error.code === 'EXDEV') {
      await copyFile(oldPath, newPath)
      await rm(oldPath)
    } else
      throw error
  }
}

const imageExt = ['.png', '.jpg', '.jpeg', '.gif', '.webp']
export function isImageFile(ext) {
  return imageExt.includes(ext)
}

const videoExt = ['.mp4', '.mkv', '.webm', '.mov']
export function isVideoFile(ext) { return videoExt.includes(ext); }

const allowedExt = [
  '.docs', 'docsx', '.txt', '.log',
  '.xls', '.xlsx', '.csv',
  '.ppt', '.pptx',
  '.zip', '.rar',
  '.mp3',
  // ...videoExt,
  ...imageExt,
]
export function isAllowedFile(ext) { return allowedExt.includes(ext); }

export function deleteFolder(folder) {
  return rm(folder, { recursive: true, force: true, })
}