import {
  Canister,
  query,
  text,
  update,
  Void,
  Record,
  nat64,
  Opt,
  StableBTreeMap,
  Vec,
  ic,
} from "azle";
import {
  DirectMessage,
  DirectMessageRecord,
  User,
  UserRecord,
  UserPayload,
  UserPayloadRecord,
  UserEmail,
  CharId,
} from "./types";
import { v4 as uuidv4 } from "uuid";

let users = StableBTreeMap<UserEmail, User>(text, UserRecord, 0);
let chats = StableBTreeMap<CharId, Vec<DirectMessage>>(text, Vec(DirectMessageRecord), 0);
let userChats = StableBTreeMap<UserEmail, Vec<CharId>>(text, Vec(text), 0);

export default Canister({
  ///USERS CRUD
  // Create a new user

  addUser: update([UserPayloadRecord], UserRecord, (payload) => {
    let user: User = {
      id: uuidv4(),
      userName: payload.userName,
      email: payload.email,
      profilePicture: payload.profilePicture,
      status: payload.status,
      lastSeen: payload.lastSeen,
      dateJoined: ic.time(),
    };
    users.insert(user.email, user);
    return user;
  }),

  // Get a user by email
  getUser: query([text], Opt(UserRecord), (email) => {
    return users.get(email);
  }),

  // Get all users
  getAllUsers: query([], Vec(UserRecord), () => {
    return users.values();
  }),

  // Delete a user by id
  deleteUser: update([text], Void, (email) => {
    users.delete(email);
  }),

  // Update a user
  updateUser: update([UserRecord], Void, (user) => {
    users.set(user.email, user);
  }),

  /// CHATS CRUD
  // Create a new direct message
  sendDirectMessage: update([DirectMessageRecord], Void, (message) => {
    //  check if chat exists
    let chat = chats.get(message.chatId);
    if (chat) {
      console.log("chat exists", chat);
      chat.push(message);
      chats.set(message.chatId, chat);
    } else {
      console.log("chat does not exists");
      chats.set(message.chatId, [message]);
      userChats.get(message.sender)?.push(message.chatId);
      userChats.get(message.receiver)?.push(message.chatId);
    }
  }),

  getChatMessages: query([text], Vec(DirectMessageRecord), (chatId) => {
    return chats.get(chatId);
  }),

  getUserChats: query([text], Vec(text), (email) => {
    return userChats.get(email);
  }),

  // Delete a chat
  deleteChat: update([text], Void, (chatId) => {
    // delete the chat from chats
    chats.delete(chatId);
    // delete the chat from userChats
    userChats.values().forEach((chatIds: Vec<CharId>) => {
      let index = chatIds.indexOf(chatId);
      if (index !== -1) {
        chatIds.splice(index, 1);
      }
    });
  }),

  // Delete a direct message
  deleteDirectMessage: update([text], Void, (messageId) => {
    chats.values().forEach((messages: Vec<DirectMessage>) => {
      let index = messages.findIndex((message) => message.messageId === messageId);
      if (index !== -1) {
        messages.splice(index, 1);
      }
    });
  }),

  // Update a direct message
  updateDirectMessage: update([DirectMessageRecord], Void, (message) => {
    chats.values().forEach((messages: Vec<DirectMessage>) => {
      let index = messages.findIndex((m) => m.messageId === message.messageId);
      if (index !== -1) {
        messages[index] = message;
      }
    });
  }),
});
