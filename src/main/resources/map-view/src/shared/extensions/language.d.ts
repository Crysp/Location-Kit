type Nullable<T> = T | null;
type Optional<T> = T | undefined;

type Unique<T> = T;
type List<T> = readonly T[];
type Values<T extends {}> = T[keyof T];

type AsyncFn = (...args: any[]) => Promise<any>;

type SuffixString<Tag, Suffix = ''> = Tag extends `${Suffix}${infer A}`
  ? A
  : never;
