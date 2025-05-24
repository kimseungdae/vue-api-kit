import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import fetch, { Headers, Request, Response } from 'node-fetch';

// BroadcastChannel polyfill
class BroadcastChannelPolyfill {
  constructor(channel: string) {
    // 구현 필요 없음 - MSW 테스트용
  }
  postMessage(message: any) {}
  close() {}
  addEventListener(type: string, listener: EventListener) {}
  removeEventListener(type: string, listener: EventListener) {}
}

global.BroadcastChannel = BroadcastChannelPolyfill as any;

// node-fetch polyfill
global.fetch = fetch as unknown as typeof global.fetch;
global.Headers = Headers as unknown as typeof global.Headers;
global.Request = Request as unknown as typeof global.Request;
global.Response = Response as unknown as typeof global.Response;

// Vite 환경 변수 모의 설정
const env = {
  VITE_API_BASE_URL: 'http://localhost:3000',
  // 필요한 다른 환경 변수들을 여기에 추가
};

// import.meta.env 모의 설정
global.import = {
  meta: {
    env
  }
} as ImportMeta & { meta: { env: typeof env } };

// 전역 객체 설정
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder; 