import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const scheduledTasks = functions.pubsub.schedule('every 24 hours').onRun(async (context: functions.EventContext) => {
    // Assessment reminders, status updates
});
