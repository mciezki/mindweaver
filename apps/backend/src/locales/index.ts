import enMessages from './messages/en.json';
import plMessages from './messages/pl.json';

type MessagesStructure = typeof enMessages;

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...Array<0>];

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never;

type Paths<T, D extends number = 5> = [D] extends [never]
  ? never
  : T extends object
    ? {
        [K in keyof T]-?: K extends string | number
          ? Paths<T[K], Prev[D]> | Join<K, Paths<T[K], Prev[D]>>
          : never;
      }[keyof T]
    : '';

export type MessageKey = Paths<MessagesStructure>;

type Langauges = 'en' | 'pl';

const allLanguages = {
  pl: plMessages,
  en: enMessages,
};

const defaultLanguage = 'en';

export const getMessage = (
  path: MessageKey,
  lang: Langauges = defaultLanguage,
): string => {
  const keys = path.split('.');

  let current: any = allLanguages[lang];

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return `MESSAGE_NOT_FOUND: ${path}`;
    }
  }

  if (typeof current === 'string') {
    return current;
  }

  return `MESSAGE_NOT_A_STRING: ${path}`;
};
