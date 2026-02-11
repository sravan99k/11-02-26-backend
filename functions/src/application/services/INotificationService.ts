export interface INotificationService {
    sendEmail(to: string, subject: string, body: string): Promise<void>;
    sendPush(userId: string, title: string, body: string): Promise<void>;
}
