import '@testing-library/jest-dom';

// Polyfills for react-router v7 in Jest (jsdom)
import { TextEncoder, TextDecoder } from 'util';
if (!global.TextEncoder) {
  // @ts-ignore
  global.TextEncoder = TextEncoder;
}
if (!global.TextDecoder) {
  // @ts-ignore
  global.TextDecoder = TextDecoder;
}



