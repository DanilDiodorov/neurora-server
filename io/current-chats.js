global.currentChats = []

const removeChat = (chat_id) => {
    global.currentChats = global.currentChats.filter((chat) => {
        return chat !== chat_id
    })
}

module.exports = removeChat
