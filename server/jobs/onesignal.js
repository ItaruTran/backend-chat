import { createNotification } from '#connector/onesignal.js';

/**
 * @param {import('bull').Job} job
 */
export default async (job) => {
  const { notification } = job.data

  if (notification) {
    console.log(
      'onesignal',
      await createNotification(notification),
    );

    return 'ok'
  }

  return 'unknow'
}
