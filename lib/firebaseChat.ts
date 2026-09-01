import { db } from "@/lib/firebaseAdmin";

export type ChatMessage = {
  id: string;
  conversationId: string;
  sender: "customer" | "admin";
  message: string;
  createdAt: string;
  read: boolean;
};

export type ChatConversation = {
  id: string;
  name: string;
  email: string;
  status: "open" | "closed";
  createdAt: string;
  updatedAt: string;
};

export async function addChatMessage(data: {
  conversationId: string;
  sender: "customer" | "admin";
  message: string;
}) {
  const messageRef = await db
    .collection("chatMessages")
    .add({
      conversationId: data.conversationId,
      sender: data.sender,
      message: data.message,
      createdAt: new Date().toISOString(),
      read: data.sender === "admin",
    });

  return messageRef.id;
}

export async function getChatMessages(
  conversationId: string
) {
  const snapshot = await db
    .collection("chatMessages")
    .where(
      "conversationId",
      "==",
      conversationId
    )
    .get();

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .sort(
      (a: any, b: any) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
    );
}

export async function getChatConversations() {
  const snapshot = await db
    .collection("chatConversations")
    .get();

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .sort(
      (a: any, b: any) =>
        new Date(b.updatedAt).getTime() -
        new Date(a.updatedAt).getTime()
    );
}