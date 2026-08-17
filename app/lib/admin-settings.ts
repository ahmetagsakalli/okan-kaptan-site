import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { readPrivateBlobText, writePrivateBlobText } from "./blob-storage";

const scrypt = promisify(scryptCallback);
const adminSettingsPath = path.join(process.cwd(), "data", "admin-settings.json");
const adminSettingsBlobPath = "cms/admin-settings.json";
const passwordKeyLength = 64;

type AdminSettings = {
  passwordHash?: string;
  passwordSalt?: string;
  sessionVersion?: string;
  updatedAt?: string;
};

function isAdminSettings(value: unknown): value is AdminSettings {
  if (!value || typeof value !== "object") {
    return false;
  }

  const settings = value as AdminSettings;

  return (
    (settings.passwordHash === undefined || typeof settings.passwordHash === "string") &&
    (settings.passwordSalt === undefined || typeof settings.passwordSalt === "string") &&
    (settings.sessionVersion === undefined || typeof settings.sessionVersion === "string") &&
    (settings.updatedAt === undefined || typeof settings.updatedAt === "string")
  );
}

async function readAdminSettings() {
  const blobSettings = await readPrivateBlobText(adminSettingsBlobPath);

  if (blobSettings) {
    const parsed = JSON.parse(blobSettings) as unknown;

    return isAdminSettings(parsed) ? parsed : null;
  }

  try {
    const raw = await readFile(adminSettingsPath, "utf8");
    const parsed = JSON.parse(raw) as unknown;

    return isAdminSettings(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

async function hashPassword(password: string, salt: string) {
  return (await scrypt(password, salt, passwordKeyLength)) as Buffer;
}

function safeBufferCompare(left: Buffer, right: Buffer) {
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function verifyStoredPassword(password: string) {
  const settings = await readAdminSettings();

  if (!settings?.passwordHash || !settings.passwordSalt) {
    return null;
  }

  const storedHash = Buffer.from(settings.passwordHash, "base64url");
  const passwordHash = await hashPassword(password, settings.passwordSalt);

  return safeBufferCompare(passwordHash, storedHash);
}

export async function getAdminSessionVersion() {
  const settings = await readAdminSettings();

  if (!settings?.passwordHash || !settings.passwordSalt) {
    return "env-password";
  }

  return settings.sessionVersion ?? `stored-password:${settings.updatedAt ?? "legacy"}`;
}

export async function saveAdminPassword(password: string) {
  const passwordSalt = randomBytes(16).toString("base64url");
  const passwordHash = (await hashPassword(password, passwordSalt)).toString("base64url");
  const settings: AdminSettings = {
    passwordHash,
    passwordSalt,
    sessionVersion: randomBytes(24).toString("base64url"),
    updatedAt: new Date().toISOString(),
  };
  const serialized = `${JSON.stringify(settings, null, 2)}\n`;

  if (await writePrivateBlobText(adminSettingsBlobPath, serialized)) {
    return settings;
  }

  await mkdir(path.dirname(adminSettingsPath), { recursive: true });
  await writeFile(adminSettingsPath, serialized, "utf8");

  return settings;
}
