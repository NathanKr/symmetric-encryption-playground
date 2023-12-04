// crypto.ts
import * as crypto from "crypto";
import IMyObject from "./i-my-object";

export const KEY_LENGTH = 32;

// Function to generate a random encryption key
export function generateKey(): Buffer {
  return crypto.randomBytes(KEY_LENGTH);
}

// Function to generate a random initialization vector (IV)
export function generateIV(): Buffer {
  return crypto.randomBytes(KEY_LENGTH / 2);
}

// Function to encrypt and encode the object
export function encryptAndEncodeObject(obj: IMyObject, key: Buffer): string {
  const serializedData = JSON.stringify(obj);

  const iv = generateIV();
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  let encryptedData = cipher.update(serializedData, "utf8", "hex");
  encryptedData += cipher.final("hex");

  const tag = cipher.getAuthTag();

  const encodedData = encodeURIComponent(
    JSON.stringify({
      iv: iv.toString("hex"),
      encryptedData,
      tag: tag.toString("hex"),
    })
  );


  /***
    --- this should not happen because of encodeURIComponent 
    --- but to be on the safe side
   ***/
  if (!isSafeForURL(encodedData)) {
    throw new Error("Decrypted data contains disallowed characters.");
  }

  return encodedData;
}

// Function to decode and decrypt the object
export function decodeAndDecryptObject(
  encodedData: string,
  key: Buffer
): IMyObject {
  const decodedData = decodeURIComponent(encodedData);
  const { iv, encryptedData, tag } = JSON.parse(decodedData);

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(iv, "hex")
  );
  decipher.setAuthTag(Buffer.from(tag, "hex"));

  let decryptedData = decipher.update(encryptedData, "hex", "utf8");
  decryptedData += decipher.final("utf8");

  return JSON.parse(decryptedData);
}

// Function to check if a string contains only allowed URL characters
export function isSafeForURL(data: string): boolean {
  // Define a regex pattern for safe URL characters
  const safeUrlPattern = /^[A-Za-z0-9%-._~:/?#[\]@!$&'()*+,;=]+$/;

  // Test the data against the pattern
  return safeUrlPattern.test(data);
}