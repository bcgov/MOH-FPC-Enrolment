// @angular/localize is not installed; provide a minimal $localize stub for tests
(global as any).$localize = (strings: TemplateStringsArray, ...values: unknown[]) =>
  strings.reduce((acc, str, i) => acc + str + (i < values.length ? String(values[i]) : ''), '');

import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
setupZoneTestEnv();

// jsdom does not implement crypto.randomUUID; delegate to Node.js built-in
if (!crypto.randomUUID) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const nodeCrypto = require('crypto') as typeof import('crypto');
  Object.defineProperty(crypto, 'randomUUID', {
    value: () => nodeCrypto.randomUUID(),
    configurable: true,
  });
}
