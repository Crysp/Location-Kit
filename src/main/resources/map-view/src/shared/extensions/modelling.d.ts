type Fractional = number;
type LocalizedString = string;

// DDD:
type EntityId = Unique<string>;

// UI
type Selector<T> = () => T;
type Provider<T> = () => T;

// Network & API
type Url = string;
