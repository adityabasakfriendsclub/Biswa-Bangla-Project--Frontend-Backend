exports.generateAgoraToken = (channelName, uid) => {
  // Mock token for development
  return `mock-agora-token-${channelName}-${uid}-${Date.now()}`;
};
