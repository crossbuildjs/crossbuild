import { Component, GeneratedMessage, ReceivedInteraction } from "crossbuild"

export const todayIsSunday = async (
	interaction: ReceivedInteraction,
	component: Component
): Promise<GeneratedMessage | null> => {
	// check if today is sunday
	const today = new Date()
	if (today.getDay() !== 0) {
		return {
			content: `Today is not Sunday, ${interaction.user?.displayName}, so you can't use this ${component.type}!`
		}
	}
	return null
}
