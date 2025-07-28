import 'react-i18next';

import en from './locales/en.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'en';
    resources: {
      en: typeof en & {
        claim: {
          claimDetails: {
            claimHistory: {
              statuses: {
                titles: Record<string, string>;
                descriptions: Record<string, string>;
              };
            };
          };
        };
      };
    };
  }
}
