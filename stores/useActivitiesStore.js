import { create } from 'zustand';

const useActivitiesStore = create((set) => ({
    activities: [],
    setActivities: (activities) => set({ activities }),
}));

export default useActivitiesStore;
