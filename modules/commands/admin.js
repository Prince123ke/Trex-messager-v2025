const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "admin",
        aliases: ["a", "adm"],
        credits: "Hassan",
        description: "Manages bot administrators (list, add, remove).",
        usage: "admin list OR admin add <user ID> OR admin remove <user ID>",
        commandCategory: "Admin",
        hasPermssion: 1,
        usePrefix: true,
        cooldown: 5
    },

    run: async function({ api, event, args, global }) {
        const { threadID, messageID, senderID } = event;
        const ncs pro_UID = "61572065567071"; // ✅ Replace with your real UID

        const subCommand = args[0]?.toLowerCase();

        const isValidFacebookID = (idString) => {
            return idString && /^\d+$/.test(idString) && idString.length >= 10;
        };

        switch (subCommand) {
            case "list":
                await global.utils.humanDelay();
                if (global.config.ADMINBOT.length === 0) {
                    return api.sendMessage("There are no registered administrators.", threadID, messageID);
                }

                let message = "🤖 Bot Administrators:\n";
                global.config.ADMINBOT.forEach((adminID, index) => {
                    message += `${index + 1}. ${adminID}\n`;
                });
                return api.sendMessage(message, threadID, messageID);

            case "add":
                if (senderID !== HASSAN_UID) {
                    return api.sendMessage("🚫 Only Hassan can add new admins.", threadID, messageID);
                }

                if (args.length < 2) {
                    return api.sendMessage("Please provide a user ID to add.", threadID, messageID);
                }

                const newAdminID = args[1].trim();
                if (!isValidFacebookID(newAdminID)) {
                    return api.sendMessage("❌ Invalid User ID format.", threadID, messageID);
                }

                if (global.config.ADMINBOT.includes(newAdminID)) {
                    return api.sendMessage(`✅ User ${newAdminID} is already an admin.`, threadID, messageID);
                }

                global.config.ADMINBOT.push(newAdminID);
                global.adminMode.adminUserIDs.push(newAdminID);

                await global.utils.humanDelay();
                return api.sendMessage(
                    `✅ Added ${newAdminID} as admin.\nNote: This change is temporary. Update your bot's config for permanence.`,
                    threadID,
                    messageID
                );

            case "remove":
            case "del":
                if (senderID !== HASSAN_UID) {
                    return api.sendMessage("🚫 Only Hassan can remove admins.", threadID, messageID);
                }

                if (args.length < 2) {
                    return api.sendMessage("Please provide a user ID to remove.", threadID, messageID);
                }

                const removeAdminID = args[1].trim();
                if (!isValidFacebookID(removeAdminID)) {
                    return api.sendMessage("❌ Invalid User ID format.", threadID, messageID);
                }

                if (removeAdminID === senderID) {
                    return api.sendMessage("❌ You can't remove yourself.", threadID, messageID);
                }

                if (!global.config.ADMINBOT.includes(removeAdminID)) {
                    return api.sendMessage(`❌ ${removeAdminID} isn't an admin.`, threadID, messageID);
                }

                global.config.ADMINBOT = global.config.ADMINBOT.filter(id => id !== removeAdminID);
                global.adminMode.adminUserIDs = global.adminMode.adminUserIDs.filter(id => id !== removeAdminID);

                await global.utils.humanDelay();
                return api.sendMessage(
                    `✅ Removed ${removeAdminID} from admins.\nNote: This change is temporary. Update your config for permanence.`,
                    threadID,
                    messageID
                );

            default:
                await global.utils.humanDelay();
                return api.sendMessage(
                    "📌 Usage:\n" +
                    "• admin list - Show admins\n" +
                    "• admin add <ID> - Add admin\n" +
                    "• admin remove <ID> - Remove admin",
                    threadID,
                    messageID
                );
        }
    }
};
