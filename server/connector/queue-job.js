import Queue from 'bull';
import {redisClient} from './redis.js';

const subscriber = redisClient.duplicate();
const bclient = redisClient.duplicate();

/** @type {Queue.QueueOptions} */
const opts = {
  defaultJobOptions: {
    removeOnComplete: 60,
    removeOnFail: false,
  },
  createClient: function (type) {
    switch (type) {
      case 'client':
        return redisClient;
      case 'subscriber':
        return subscriber;
      default:
        return bclient;
    }
  },
}

export const queueJob = new Queue('default', opts);
export const scheduledJob = new Queue('scheduled', opts);

export const jobName = {
  handleFile: 'handleFile',
  onesignal: 'onesignal',
  chatNotifications: 'chat-notifications',
  deleteOldMessage: 'delete-old-message',
};

export const scheduledTasks = [
  ['autoCreatePartition', '0 17 28 1/1 *', '#sv/jobs/scheduler.js'],
  // ['updateMessageTime', '*/2 * * * * *', '#sv/jobs/scheduler.js'],
];

export async function attachHandler() {
  queueJob.process('onesignal', 30, (await import('#sv/jobs/onesignal.js')).default)
  queueJob.process('chat-notifications', 350, (await import('#sv/jobs/chat-notifications.js')).default)
  queueJob.process('handleFile', 50, (await import('#sv/jobs/handle-upload-file.js')).default)
  queueJob.process(jobName.deleteOldMessage, 50, (await import('#sv/jobs/delete-old-message.js')).default)

  for (const task of scheduledTasks) {
    scheduledJob.process(task[0], (await import(task[2])).default)
  }
}

export const backgroundJobs = [
  queueJob,
  scheduledJob,
];
