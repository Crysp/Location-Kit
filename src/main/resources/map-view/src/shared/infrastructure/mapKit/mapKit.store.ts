import { createStore, useStore } from 'zustand';
import { MKFeatureAnchor, MKState } from './types.ts';

export const store = createStore<MKState>(() => ({
  selectedFeature: null,
}));

export const saveSelectedFeature = (selectedFeature: MKFeatureAnchor) => {
  store.setState({ selectedFeature });
};

export const unselectedFeature = () => {
  store.setState({ selectedFeature: null });
};

export const useFeaturePopup = () =>
  useStore(store, (state) => state.selectedFeature);
