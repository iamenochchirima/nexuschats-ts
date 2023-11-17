import {
  Canister,
  query,
  text,
  update,
  Void,
  Record,
  nat64,
  Opt,
  bool,
  Vec,
} from "azle";

export type UserEmail = text;
export type CharId = text;

export const UserRecord = Record({
  id: text,
  userName: text,
  email: text,
  profilePicture: Opt(text),
  status: Opt(text),
  lastSeen: Opt(nat64),
  dateJoined: nat64,
});
export type User = typeof UserRecord;

export const UserPayloadRecord = Record({
  userName: text,
  email: text,
  profilePicture: Opt(text),
  status: Opt(text),
  lastSeen: Opt(nat64),
});

export type UserPayload = typeof UserPayloadRecord;

const MessageBody = Record({
  text: Opt(text),
  image: Opt(text),
  video: Opt(text),
});
type MessageBody = typeof MessageBody;

export const DirectMessageRecord = Record({
  sender: text,
  receiver: text,
  body: MessageBody,
  messageId: text,
  created: nat64,
  edited: bool,
  chatId: text,
});
export type DirectMessage = typeof DirectMessageRecord;

const DirectMessagePayload = {
  sender: text,
  receiver: text,
  body: MessageBody,
  messageId: text,
  created: nat64,
  edited: bool,
};
export type DirectMessagePayload = typeof DirectMessagePayload;

const GroupCreator = Record({
  userName: text,
  profilePicture: Opt(text),
});
type GroupCreator = typeof GroupCreator;

const Group = Record({
  id: text,
  name: text,
  description: Opt(text),
  profilePicture: Opt(text),
  creator: GroupCreator,
  members: Vec(text),
  admins: Vec(text),
  isPrivate: bool,
  created: nat64,
  messages: Opt(text),
  lastMessage: Opt(text),
  lastMessageTime: Opt(nat64),
});
export type Group = typeof Group;

const GroupPayload = Record({
  name: text,
  description: Opt(text),
  profilePicture: Opt(text),
  creator: GroupCreator,
  members: Vec(text),
  admins: Vec(text),
  isPrivate: bool,
  created: nat64,
  messages: Opt(text),
  lastMessage: Opt(text),
  lastMessageTime: Opt(nat64),
});
export type GroupPayload = typeof GroupPayload;

const GroupMessage = Record({
  id: text,
  sender: text,
  body: MessageBody,
  created: nat64,
  edited: bool,
});
export type GroupMessage = typeof GroupMessage;

const GroupMessagePayload = Record({
  sender: text,
  body: MessageBody,
  created: nat64,
  edited: bool,
});
export type GroupMessagePayload = typeof GroupMessagePayload;
