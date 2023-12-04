import { test, expect } from "vitest";
import {
  KEY_LENGTH,
  decodeAndDecryptObject,
  encryptAndEncodeObject,
  generateKey,
  isSafeForURL,
} from "../src/symetric-crypto-utils";
import IMyObject from "../src/i-my-object";

test("generate a key of the correct length", () => {
  const key = generateKey();
  // Adjust the length based on your key size (256 bits for AES-256)
  expect(key.length).toBe(KEY_LENGTH);
});

test("encryptAndEncodeObject should encrypt and encode the object", () => {
  // Arrange
  const secretKey = generateKey();
  const myObject: IMyObject = { type: "example", msfrom1970: Date.now() };

  // Act
  const encodedQueryString = encryptAndEncodeObject(myObject, secretKey);

  // Assert
  // Ensure that the encodedQueryString is a string
  expect(typeof encodedQueryString).toBe("string");
  // Ensure that the length of the encodedQueryString is greater than 0
  expect(encodedQueryString.length).toBeGreaterThan(0);

  // Simulate receiving from the URL and decoding
  const decodedObject = decodeAndDecryptObject(encodedQueryString, secretKey);

  // Further assertions based on your specific needs
  expect(decodedObject).toBeInstanceOf(Object);
  expect(decodedObject.type).toBe(myObject.type);
  expect(decodedObject.msfrom1970).toBe(myObject.msfrom1970);
});

test("Encrypt, encode, decode, and decrypt object from URL", () => {
  // Arrange
  const secretKey = generateKey();
  const originalObject = { type: "example", msfrom1970: Date.now() };

  // Act
  const encodedData = encryptAndEncodeObject(originalObject, secretKey);

  // Simulate passing through a URL
  const simulatedURL = `https://example.com/somepath?data=${encodeURIComponent(
    encodedData
  )}`;

  // Simulate receiving from the URL and decoding
  const receivedEncodedData = decodeURIComponent(simulatedURL.split("=")[1]);
  const decodedObject = decodeAndDecryptObject(receivedEncodedData, secretKey);

  // Assert
  // You might want to enhance the assertions based on your specific needs
  expect(decodedObject).toBeInstanceOf(Object);
  expect(decodedObject.type).toBe(originalObject.type);
  expect(decodedObject.msfrom1970).toBe(originalObject.msfrom1970);
});

test("Encrypt, encode, decode, and verify safe URL characters", () => {
  // Arrange
  const secretKey = generateKey();
  const originalObject = { type: "example", msfrom1970: Date.now() };

  // Act
  const encodedData = encryptAndEncodeObject(originalObject, secretKey);

  // Assert
  // Check that the encoded data consists only of safe URL characters
  expect(isSafeForURL(encodedData)).toBe(true);

  // Simulate receiving from the URL and decoding
  const decodedObject = decodeAndDecryptObject(encodedData, secretKey);

  // Further assertions based on your specific needs
  expect(decodedObject).toBeInstanceOf(Object);
  expect(decodedObject.type).toBe(originalObject.type);
  expect(decodedObject.msfrom1970).toBe(originalObject.msfrom1970);
});
