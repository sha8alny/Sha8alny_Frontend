/**
 * Extracts the username of the other participant from a conversation
 * 
 * @param {Object} conversation - The conversation object
 * @param {string} currentUser - Current user's username
 * @returns {string|null} - The other participant's username or null
 */
export function getOtherParticipantUsername(conversation, currentUser) {
  if (!conversation?.participants || !currentUser) return null;
  
  const usernames = Object.keys(conversation.participants || {});
  return usernames.find(username => username !== currentUser) || null;
}

/**
 * Gets the display name for a participant
 * 
 * @param {Object} conversation - The conversation object
 * @param {string} username - The username to get display name for
 * @returns {string} - The display name or username as fallback
 */
export function getParticipantDisplayName(conversation, username) {
  if (!conversation?.participants || !username) return username;
  return conversation.participants[username]?.name || username;
}

/**
 * Gets the profile picture URL for a participant
 * 
 * @param {Object} conversation - The conversation object
 * @param {string} username - The username to get profile picture for
 * @returns {string|null} - The profile picture URL or null
 */
export function getParticipantProfilePicture(conversation, username) {
  if (!conversation?.participants || !username) return null;
  return conversation.participants[username]?.profilePicture || null;
}

/**
 * Checks if a participant is blocked
 * 
 * @param {Object} conversation - The conversation object
 * @param {string} username - The username to check
 * @returns {boolean} - Whether the participant is blocked
 */
export function isParticipantBlocked(conversation, username) {
  if (!conversation?.participants || !username) return false;
  return conversation.participants[username]?.isBlocked || false;
}

/**
 * Gets typing status for a participant
 * 
 * @param {Object} conversation - The conversation object
 * @param {string} username - The username to check
 * @returns {boolean} - Whether the participant is typing
 */
export function isParticipantTyping(conversation, username) {
  if (!conversation?.participantMetadata || !username) return false;
  return conversation.participantMetadata[username]?.typingStatus === true;
}

/**
 * Gets complete participant details by username
 * 
 * @param {Object} conversation - The conversation object
 * @param {string} username - The username to get details for
 * @returns {Object} - Complete participant details with username
 */
export function getParticipantDetails(conversation, username) {
  if (!conversation?.participants || !username) {
    return { username };
  }
  
  return {
    ...conversation.participants[username],
    username,
    isTyping: isParticipantTyping(conversation, username),
    isBlocked: isParticipantBlocked(conversation, username)
  };
}
