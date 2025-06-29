const fs = require('fs');
const path = require('path');

module.exports = {
  name: "joinNoti",
  version: "2.0.0",
  description: "Professional join notifications with aesthetic design",
  author: "Vern",
  async onEvent({ api, event, prefix }) {
    try {
      const { logMessageType, logMessageData, threadID } = event;

      if (logMessageType === "log:subscribe") {
        const currentUserID = await api.getCurrentUserID();

        if (logMessageData.addedParticipants?.some(i => i.userFbId === currentUserID)) {
          await api.changeNickname(`[ ${prefix} ]: NashBoT`, threadID, currentUserID);

          const welcomeMessage = `
┌────────────────────────┐
│  👾 𝐕𝐄𝐑𝐍 IS ONLINE     │
└────────────────────────┘

✨ Successfully Connected!

🎯 Quick Start:
• ${prefix}help - All commands
• Talk naturally - AI responds
• "download [link]" - Get media
• "send video" - Entertainment

🔥 Smart Features:
• Natural Language Processing
• Auto-reply & Chat Mode  
• Media Downloads
• Real-time Notifications

─────────────────────────
🌟 𝐑𝐞𝐚𝐝𝐲 𝐭𝐨 𝐚𝐬𝐬𝐢𝐬𝐭 24/7!
─────────────────────────`;

          await api.sendMessage(welcomeMessage, threadID);
        } else {
          const { addedParticipants } = logMessageData;
          const threadInfo = await api.getThreadInfo(threadID);
          const currentMembersCount = threadInfo.participantIDs.length;
          const participantsList = addedParticipants.map(i => i.fullName).join(", ");

          const welcomeMessage = `
┌────────────────────────┐
│ 🎉 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐀𝐁𝐎𝐀𝐑𝐃!     │
└────────────────────────┘

👋 Hello ${participantsList}!

🏠 Welcome to: ${threadInfo.name}
👥 Member #${currentMembersCount}
📅 ${new Date().toLocaleDateString()}

🌟 Group Features:
• Smart AI Assistant 24/7
• Entertainment & media
• Helpful community
• Interactive features

💡 Getting Started:
• Introduce yourself
• Try "rules" for guidelines
• Ask the bot anything!
• Type "help" for features

─────────────────────────
🎊 𝐄𝐧𝐣𝐨𝐲 𝐲𝐨𝐮𝐫 𝐬𝐭𝐚𝐲!
─────────────────────────`;

          const welcomeFolder = path.join(__dirname, 'welcome');
          fs.readdir(welcomeFolder, (err, files) => {
            if (err) {
              console.error('Error reading welcome folder:', err);
              api.sendMessage(welcomeMessage, threadID);
              return;
            }

            const videoFiles = files.filter(file => {
              const ext = path.extname(file).toLowerCase();
              return ['.mp4', '.mov', '.avi', '.mkv'].includes(ext);
            });

            if (videoFiles.length > 0) {
              const randomVideo = videoFiles[Math.floor(Math.random() * videoFiles.length)];
              const videoPath = path.join(welcomeFolder, randomVideo);
              const videoStream = fs.createReadStream(videoPath);

              api.sendMessage({ 
                body: welcomeMessage, 
                attachment: videoStream 
              }, threadID);
            } else {
              api.sendMessage(welcomeMessage, threadID);
            }
          });
        }
      }
    } catch (error) {
      console.error('Error in joinNoti event:', error);
      api.sendMessage('⚠️ An error occurred while processing the welcome notification.', event.threadID);
    }
  },
};