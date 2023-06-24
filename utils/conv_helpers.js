export function getConversationindex(conversations, id) {
  let indx = null;
  conversations.forEach((conv, index) => {
    if (conv.id == id) {
      indx = index;
    }
  });
  return indx;
}
