export enum GuildedPermission {
	/*
	 * Allows you to update the server's settings
	 */
	CanUpdateServer = "CanUpdateServer",
	/*
	 * Allows you to update lower-ranked roles
	 */
	CanManageRoles = "CanManageRoles",
	/*
	 * Allows you to directly invite members to the server
	 */
	CanInviteMembers = "CanInviteMembers",
	/*
	 * Allows you to kick or ban members from the server
	 */
	CanKickMembers = "CanKickMembers",
	/*
	 * Allows you to create new groups and edit or delete existing ones
	 */
	CanManageGroups = "CanManageGroups",
	/*
	 * Allows you to create new channels and edit or delete existing ones
	 */
	CanManageChannels = "CanManageChannels",
	/*
	 * Allows you to create new webhooks and edit or delete existing ones
	 */
	CanManageWebhooks = "CanManageWebhooks",
	/*
	 * Allows you to use @everyone and @here mentions
	 */
	CanMentionEveryone = "CanMentionEveryone",
	/*
	 * Allows you to access the moderator view to see all private replies
	 */
	CanModerateChannels = "CanModerateChannels",
	/*
	 * This role is exempt from any slowmode restrictions
	 */
	CanBypassSlowMode = "CanBypassSlowMode",
	/*
	 * Allows you to view server and game applications
	 */
	CanReadApplications = "CanReadApplications",
	/*
	 * Allows you to approve server and game applications
	 */
	CanApproveApplications = "CanApproveApplications",
	/*
	 * Allows you to edit the server and game applications, and toggle accepting applications
	 */
	CanEditApplicationForm = "CanEditApplicationForm",
	/*
	 * Allows you to indicate interest in a player instead of an upvote
	 */
	CanIndicateLfmInterest = "CanIndicateLfmInterest",
	/*
	 * Allows you to modify the Find Player status for the server listing card
	 */
	CanModifyLfmStatus = "CanModifyLfmStatus",
	/*
	 * Allows you to view announcements
	 */
	CanReadAnnouncements = "CanReadAnnouncements",
	/*
	 * Allows you to create and remove announcements
	 */
	CanCreateAnnouncements = "CanCreateAnnouncements",
	/*
	 * Allows you to delete announcements by other members or pin any announcement
	 */
	CanManageAnnouncements = "CanManageAnnouncements",
	/*
	 * Allows you to read chat messages
	 */
	CanReadChats = "CanReadChats",
	/*
	 * Allows you to send chat messages
	 */
	CanCreateChats = "CanCreateChats",
	/*
	 * Allows you to upload images and videos to chat messages
	 */
	CanUploadChatMedia = "CanUploadChatMedia",
	/*
	 * Allows you to create threads in the channel
	 */
	CanCreateThreads = "CanCreateThreads",
	/*
	 * Allows you to reply to threads in the channel
	 */
	CanCreateThreadMessages = "CanCreateThreadMessages",
	/*
	 * Allows members to send private messages and privately reply to messages
	 */
	CanCreatePrivateMessages = "CanCreatePrivateMessages",
	/*
	 * Allows you to delete chat messages by other members or pin any message
	 */
	CanManageChats = "CanManageChats",
	/*
	 * Allow you to archive and restore threads
	 */
	CanManageThreads = "CanManageThreads",
	/*
	 * Allows you to view events
	 */
	CanReadEvents = "CanReadEvents",
	/*
	 * Allows you to create events
	 */
	CanCreateEvents = "CanCreateEvents",
	/*
	 * Allows you to update events created by others and move them to other channels
	 */
	CanEditEvents = "CanEditEvents",
	/*
	 * Allows you to remove events created by others
	 */
	CanDeleteEvents = "CanDeleteEvents",
	/*
	 * Allows you to edit the RSVP status for members in an event
	 */
	CanEditEventRsvps = "CanEditEventRsvps",
	/*
	 * Allows you to read forums
	 */
	CanReadForums = "CanReadForums",
	/*
	 * Allows you to create forum topics
	 */
	CanCreateTopics = "CanCreateTopics",
	/*
	 * Allows you to create topic replies
	 */
	CanCreateTopicReplies = "CanCreateTopicReplies",
	/*
	 * Allows you to remove topics and replies created by others, or move them to other channels
	 */
	CanDeleteTopics = "CanDeleteTopics",
	/*
	 * Allows you to sticky a topic
	 */
	CanStickyTopics = "CanStickyTopics",
	/*
	 * Allows you to lock a topic
	 */
	CanLockTopics = "CanLockTopics",
	/*
	 * Allows you to view docs
	 */
	CanReadDocs = "CanReadDocs",
	/*
	 * Allows you to create docs
	 */
	CanCreateDocs = "CanCreateDocs",
	/*
	 * Allows you to update docs created by others and move them to other channels
	 */
	CanEditDocs = "CanEditDocs",
	/*
	 * Allows you to remove docs created by others
	 */
	CanDeleteDocs = "CanDeleteDocs",
	/*
	 * Allows you to see media
	 */
	CanReadMedia = "CanReadMedia",
	/*
	 * Allows you to create media
	 */
	CanAddMedia = "CanAddMedia",
	/*
	 * Allows you to edit media created by others and move media items to other channels
	 */
	CanEditMedia = "CanEditMedia",
	/*
	 * Allows you to remove media created by others
	 */
	CanDeleteMedia = "CanDeleteMedia",
	/*
	 * Allows you to listen to voice chat
	 */
	CanListenVoice = "CanListenVoice",
	/*
	 * Allows you to talk in voice chat
	 */
	CanAddVoice = "CanAddVoice",
	/*
	 * Allows you to create, rename, and delete voice rooms
	 */
	CanManageVoiceGroups = "CanManageVoiceGroups",
	/*
	 * Allows you to move members to other voice rooms
	 */
	CanAssignVoiceGroup = "CanAssignVoiceGroup",
	/*
	 * Allows you to broadcast your voice to voice rooms lower in the hierarchy when speaking in voice chat
	 */
	CanBroadcastVoice = "CanBroadcastVoice",
	/*
	 * Allows you to direct your voice to specific users
	 */
	CanDirectVoice = "CanDirectVoice",
	/*
	 * Allows you to prioritize your voice when speaking in voice chat
	 */
	CanPrioritizeVoice = "CanPrioritizeVoice",
	/*
	 * Allows you to use voice activity input mode for voice chats
	 */
	CanUseVoiceActivity = "CanUseVoiceActivity",
	/*
	 * Allows you to mute members in voice chat
	 */
	CanMuteMembers = "CanMuteMembers",
	/*
	 * Allows you to deafen members in voice chat
	 */
	CanDeafenMembers = "CanDeafenMembers",
	/*
	 * Allows you to send chat messages in the voice channel
	 */
	CanSendVoiceMessages = "CanSendVoiceMessages",
	/*
	 * Allows you to create matchmaking scrims
	 */
	CanCreateScrims = "CanCreateScrims",
	/*
	 * Allows you to use the server to create and manage tournaments
	 */
	CanManageTournaments = "CanManageTournaments",
	/*
	 * Allows you to register the server for tournaments
	 */
	CanRegisterForTournaments = "CanRegisterForTournaments",
	/*
	 * Allows the creation and management of server emoji
	 */
	CanManageEmotes = "CanManageEmotes",
	/*
	 * Members with this permission can change their own nickname.
	 */
	CanChangeNickname = "CanChangeNickname",
	/*
	 * Members with this permission can change the nicknames of other members.
	 */
	CanManageNicknames = "CanManageNicknames",
	/*
	 * Allows you to view all form responses
	 */
	CanViewFormResponses = "CanViewFormResponses",
	/*
	 * Allows you to view all poll results
	 */
	CanViewPollResponses = "CanViewPollResponses",
	/*
	 * Allows you to view list items
	 */
	CanReadListItems = "CanReadListItems",
	/*
	 * Allows you to create list items
	 */
	CanCreateListItems = "CanCreateListItems",
	/*
	 * Allows you to update list item messages created by others and move list items to other channels
	 */
	CanUpdateListItems = "CanUpdateListItems",
	/*
	 * Allows you to remove list items created by others
	 */
	CanDeleteListItems = "CanDeleteListItems",
	/*
	 * Allows you to complete list items created by others
	 */
	CanCompleteListItems = "CanCompleteListItems",
	/*
	 * Allows you to reorder list items
	 */
	CanReorderListItems = "CanReorderListItems",
	/*
	 * Allows you to view tournament brackets.
	 */
	CanViewBracket = "CanViewBracket",
	/*
	 * Allows you to report match scores on behalf of your server
	 */
	CanReportScores = "CanReportScores",
	/*
	 * Allows you to view server member's schedules
	 */
	CanReadSchedules = "CanReadSchedules",
	/*
	 * Allows you to let your server know your available schedule
	 */
	CanCreateSchedule = "CanCreateSchedule",
	/*
	 * Allows you to remove availabilities created by others
	 */
	CanDeleteSchedule = "CanDeleteSchedule",
	/*
	 * Allows you to create and edit bots for automated workflows. Note: This permission will allow its members to assign flows or implement actions for bots that may exceed their own permissions. Exercise caution when granting this permission.
	 */
	CanManageBots = "CanManageBots",
	/*
	 * Allows you to manage XP on server members
	 */
	CanManageServerXp = "CanManageServerXp",
	/*
	 * Allows you to view streams
	 */
	CanReadStreams = "CanReadStreams",
	/*
	 * Allows you to listen to voice chat in the stream channel
	 */
	CanJoinStreamVoice = "CanJoinStreamVoice",
	/*
	 * Allows you to add a stream and also talk in the stream channel
	 */
	CanCreateStreams = "CanCreateStreams",
	/*
	 * Allows you to to send messages in the stream channel
	 */
	CanSendStreamMessages = "CanSendStreamMessages",
	/*
	 * Allows you to talk in the stream channel
	 */
	CanAddStreamVoice = "CanAddStreamVoice",
	/*
	 * Allows you to use voice activity input mode for talking in stream channels
	 */
	CanUseVoiceActivityInStream = "CanUseVoiceActivityInStream"
}

export type GuildedPermissionString = keyof typeof GuildedPermission
