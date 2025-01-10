import { createStore } from 'zustand';

const store = createStore<{ features: any[] }>(() => ({
  features: [],
}));

export const saveFeatures = (features: any[]) => {
  store.setState({ features });
};
