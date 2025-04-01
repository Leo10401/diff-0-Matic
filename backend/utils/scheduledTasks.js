import cron from "node-cron";
import { scheduleCleanup } from "../models/videoModel.js";

// Initialize scheduled tasks
export const initScheduledTasks = () => {
    // Clean up old videos and frames daily at midnight
    cron.schedule("0 0 * * *", () => {
        const cleanup = scheduleCleanup();
        cleanup.deleteFolder("uploads/videos");
        cleanup.deleteFolder("uploads/frames");
    });
    
    console.log("✅ Scheduled tasks initialized");
};