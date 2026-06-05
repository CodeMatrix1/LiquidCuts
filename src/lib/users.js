import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { hashPassword } from "@/lib/password";

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export function sanitizeUser(user) {
  if (!user) return null;

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function getUsersCollection() {
  const db = await getDb();
  const users = db.collection("users");
  await users.createIndex({ email: 1 }, { unique: true });
  return users;
}

export async function findUserByEmail(email) {
  const users = await getUsersCollection();
  return users.findOne({ email: normalizeEmail(email) });
}

export async function findUserById(id) {
  if (!ObjectId.isValid(id)) return null;

  const users = await getUsersCollection();
  return users.findOne({ _id: new ObjectId(id) });
}

export async function createUser({ name, email, password }) {
  const users = await getUsersCollection();
  const now = new Date();
  const user = {
    name: name.trim(),
    email: normalizeEmail(email),
    passwordHash: hashPassword(password),
    role: "user",
    createdAt: now,
    updatedAt: now,
  };

  const result = await users.insertOne(user);
  return {
    ...user,
    _id: result.insertedId,
  };
}
