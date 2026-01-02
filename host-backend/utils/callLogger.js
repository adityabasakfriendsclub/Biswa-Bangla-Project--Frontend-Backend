// FILE: backend/utils/callLogger.js
// ✅ Call logging and analytics utility

const fs = require("fs");
const path = require("path");

class CallLogger {
  constructor() {
    this.logDir = path.join(__dirname, "..", "logs");
    this.ensureLogDirectory();
  }

  /**
   * Ensure logs directory exists
   */
  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
      console.log("✅ Logs directory created");
    }
  }

  /**
   * Log call initiation
   */
  logCallInitiated(callData) {
    const log = {
      timestamp: new Date().toISOString(),
      event: "CALL_INITIATED",
      callId: callData._id,
      userId: callData.userId,
      hostId: callData.hostId,
      channelName: callData.channelName,
    };

    this.writeLog("calls.log", log);
    console.log(`📞 [CALL INITIATED] ${callData._id}`);
  }

  /**
   * Log call accepted
   */
  logCallAccepted(callData) {
    const log = {
      timestamp: new Date().toISOString(),
      event: "CALL_ACCEPTED",
      callId: callData._id,
      hostId: callData.hostId,
      callStartedAt: callData.callStartedAt,
    };

    this.writeLog("calls.log", log);
    console.log(`✅ [CALL ACCEPTED] ${callData._id}`);
  }

  /**
   * Log call rejected
   */
  logCallRejected(callData, reason) {
    const log = {
      timestamp: new Date().toISOString(),
      event: "CALL_REJECTED",
      callId: callData._id,
      hostId: callData.hostId,
      reason: reason,
    };

    this.writeLog("calls.log", log);
    console.log(`❌ [CALL REJECTED] ${callData._id} - ${reason}`);
  }

  /**
   * Log call ended
   */
  logCallEnded(callData) {
    const log = {
      timestamp: new Date().toISOString(),
      event: "CALL_ENDED",
      callId: callData._id,
      duration: callData.totalDuration,
      pointsEarned: callData.pointsEarned,
      amountEarned: callData.amountEarned,
      endedBy: callData.endedBy,
    };

    this.writeLog("calls.log", log);
    console.log(`🔴 [CALL ENDED] ${callData._id} - ${callData.totalDuration}s`);
  }

  /**
   * Log earnings update
   */
  logEarningsUpdate(hostId, pointsEarned, amountEarned) {
    const log = {
      timestamp: new Date().toISOString(),
      event: "EARNINGS_UPDATE",
      hostId: hostId,
      pointsEarned: pointsEarned,
      amountEarned: amountEarned,
    };

    this.writeLog("earnings.log", log);
    console.log(
      `💰 [EARNINGS] Host ${hostId} earned ${pointsEarned} points (₹${amountEarned})`
    );
  }

  /**
   * Log error
   */
  logError(context, error) {
    const log = {
      timestamp: new Date().toISOString(),
      event: "ERROR",
      context: context,
      error: error.message,
      stack: error.stack,
    };

    this.writeLog("errors.log", log);
    console.error(`❌ [ERROR] ${context}: ${error.message}`);
  }

  /**
   * Write log to file
   */
  writeLog(filename, logData) {
    try {
      const logFile = path.join(this.logDir, filename);
      const logLine = JSON.stringify(logData) + "\n";

      fs.appendFileSync(logFile, logLine);
    } catch (error) {
      console.error("Failed to write log:", error);
    }
  }

  /**
   * Get daily call stats
   */
  async getDailyStats(date = new Date()) {
    // This would read from logs or database
    // Implement based on your needs
    return {
      totalCalls: 0,
      completedCalls: 0,
      totalDuration: 0,
      totalEarnings: 0,
    };
  }

  /**
   * Clean old logs (keep last 30 days)
   */
  cleanOldLogs(daysToKeep = 30) {
    try {
      const files = fs.readdirSync(this.logDir);
      const now = Date.now();
      const maxAge = daysToKeep * 24 * 60 * 60 * 1000;

      files.forEach((file) => {
        const filePath = path.join(this.logDir, file);
        const stats = fs.statSync(filePath);

        if (now - stats.mtime.getTime() > maxAge) {
          fs.unlinkSync(filePath);
          console.log(`🗑️ Deleted old log: ${file}`);
        }
      });
    } catch (error) {
      console.error("Failed to clean old logs:", error);
    }
  }
}

// Export singleton instance
module.exports = new CallLogger();
