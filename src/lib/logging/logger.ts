import { PropertySource } from "@prisma/client";

interface ScrapingActivity {
    source: PropertySource;
    action: string;
    count: number;
    duration: number;
    errors: number;
}

class Logger {
    private db = {
        scrapingLog: {
            create: (data: any) => {
                console.log('Logging scraping activity:', data);
                return Promise.resolve();
            }
        }
    }
  async logScrapingActivity(activity: ScrapingActivity): Promise<void> {
    await this.db.scrapingLog.create({
      data: {
        source: activity.source,
        action: activity.action,
        propertiesCount: activity.count,
        duration: activity.duration,
        errors: activity.errors,
        timestamp: new Date()
      }
    });
  }

  async logUserActivity(userId: string, action: string, details: any): Promise<void> {
    // User activity tracking for analytics
    console.log(`Logging user activity for user ${userId}:`, { action, details });
  }
}
