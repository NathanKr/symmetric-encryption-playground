import { test, expect } from "vitest";
import {
  KEY_LENGTH,
  bufferToString,
  decodeAndDecryptObject,
  encryptAndEncodeObject,
  generateKey,
  isNotTooLongURL,
  isSafeForURL,
  stringToBuffer,
} from "../src/symetric-crypto-utils";

interface IMyObject {
  type: string;
  dtStart: number; // ms from 1970
  dtEnd: number; // ms from 1970
  dtCreated: number; // ms from 1970
}

test("converts a key from buffer to string and back", () => {
  // Generate a key
  const originalKey = generateKey();

  // Convert the key to a string
  const keyString = bufferToString(originalKey);

  console.log(keyString);

  // Convert the string back to a buffer
  const convertedKey = stringToBuffer(keyString);

  // Expect the converted key to be the same as the original key
  expect(convertedKey.equals(originalKey)).toBe(true);
});

test("generate a key of the correct length", () => {
  const key = generateKey();
  console.log(key);

  // Adjust the length based on your key size (256 bits for AES-256)
  expect(key.length).toBe(KEY_LENGTH);
});

test("encryptAndEncodeObject should encrypt and encode the object", () => {
  // Arrange
  const secretKey = generateKey();
  const myObject: IMyObject = {
    type: "example",
    dtStart: Date.now(),
    dtCreated: Date.now(),
    dtEnd: Date.now(),
  };

  // Act
  const encodedQueryString = encryptAndEncodeObject(myObject, secretKey);

  // Assert
  // Ensure that the encodedQueryString is a string
  expect(typeof encodedQueryString).toBe("string");
  // Ensure that the length of the encodedQueryString is greater than 0
  expect(encodedQueryString.length).toBeGreaterThan(0);

  // Simulate receiving from the URL and decoding
  const decodedObject = decodeAndDecryptObject(
    encodedQueryString,
    secretKey
  ) as IMyObject;

  // Further assertions based on your specific needs
  expect(decodedObject).toBeInstanceOf(Object);
  expect(decodedObject.type).toBe(myObject.type);
  expect(decodedObject.dtCreated).toBe(myObject.dtCreated);
  expect(decodedObject.dtEnd).toBe(myObject.dtEnd);
  expect(decodedObject.dtStart).toBe(myObject.dtStart);
});

test("Encrypt, encode, decode, and decrypt object from URL", () => {
  // Arrange
  const secretKey = generateKey();
  const originalObject: IMyObject = {
    type: "example",
    dtStart: Date.now(),
    dtCreated: Date.now(),
    dtEnd: Date.now(),
  };

  // Act
  const encodedData = encryptAndEncodeObject(originalObject, secretKey);

  // Simulate passing through a URL
  const simulatedURL = `https://example.com/somepath?data=${encodeURIComponent(
    encodedData
  )}`;

  // Simulate receiving from the URL and decoding
  const receivedEncodedData = decodeURIComponent(simulatedURL.split("=")[1]);
  const decodedObject = decodeAndDecryptObject(
    receivedEncodedData,
    secretKey
  ) as IMyObject;

  // Assert
  // You might want to enhance the assertions based on your specific needs
  expect(decodedObject).toBeInstanceOf(Object);
  expect(decodedObject.type).toBe(originalObject.type);
  expect(decodedObject.dtCreated).toBe(originalObject.dtCreated);
  expect(decodedObject.dtEnd).toBe(originalObject.dtEnd);
  expect(decodedObject.dtStart).toBe(originalObject.dtStart);
});

test("Encrypt, encode, decode, and verify safe URL characters and URL not long", () => {
  // Arrange
  const secretKey = generateKey();
  const originalObject: IMyObject = {
    type: "example",
    dtStart: Date.now(),
    dtCreated: Date.now(),
    dtEnd: Date.now(),
  };

  const start = new Date();
  // Act
  const encodedData = encryptAndEncodeObject(originalObject, secretKey);

  // Simulate receiving from the URL and decoding
  const decodedObject = decodeAndDecryptObject(
    encodedData,
    secretKey
  ) as IMyObject;

  const end = new Date();

  expect(end.getTime()-start.getTime()).toBeLessThan(10);


  // Assert
  // Check that the encoded data consists only of safe URL characters
  expect(isSafeForURL(encodedData)).toBe(true);
  expect(isNotTooLongURL(encodedData)).toBe(true);

  // Further assertions based on your specific needs
  expect(decodedObject).toBeInstanceOf(Object);
  expect(decodedObject.type).toBe(originalObject.type);
  expect(decodedObject.dtCreated).toBe(originalObject.dtCreated);
  expect(decodedObject.dtEnd).toBe(originalObject.dtEnd);
  expect(decodedObject.dtStart).toBe(originalObject.dtStart);
});
