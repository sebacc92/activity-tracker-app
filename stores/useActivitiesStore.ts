import { create } from 'zustand';

interface Activity {
    id: number;
    name: string;
    start_date: string;
    distance: number;
    moving_time: number;
    total_elevation_gain: number;
}

interface ActivitiesState {
    activities: Activity[];
    setActivities: (activities: Activity[]) => void;
}

const useActivitiesStore = create<ActivitiesState>((set) => ({
    activities: [],
    setActivities: (activities) => set({ activities }),
}));

export default useActivitiesStore;
