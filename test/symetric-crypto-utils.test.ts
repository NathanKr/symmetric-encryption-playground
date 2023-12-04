import { test, expect } from "vitest";
import {
  KEY_LENGTH,
  decodeAndDecryptObject,
  encryptAndEncodeObject,
  generateKey,
  isNotTooLongURL,
  isSafeForURL,
} from "../src/symetric-crypto-utils";

interface IMyObject {
  type: string;
  dtStart: number; // ms from 1970
  dtEnd: number; // ms from 1970
  dtCreated: number; // ms from 1970
}

test("generate a key of the correct length", () => {
  const key = generateKey();
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

  // Act
  const encodedData = encryptAndEncodeObject(originalObject, secretKey);

  // Assert
  // Check that the encoded data consists only of safe URL characters
  expect(isSafeForURL(encodedData)).toBe(true);
  expect(isNotTooLongURL(encodedData)).toBe(true);

  // Simulate receiving from the URL and decoding
  const decodedObject = decodeAndDecryptObject(
    encodedData,
    secretKey
  ) as IMyObject;

  // Further assertions based on your specific needs
  expect(decodedObject).toBeInstanceOf(Object);
  expect(decodedObject.type).toBe(originalObject.type);
  expect(decodedObject.dtCreated).toBe(originalObject.dtCreated);
  expect(decodedObject.dtEnd).toBe(originalObject.dtEnd);
  expect(decodedObject.dtStart).toBe(originalObject.dtStart);
});
