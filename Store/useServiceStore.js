import { create } from "zustand";

const useServiceStore = create((set) => ({
	selectedServiceId: null,
	setSelectedServiceId: (id) => set({ selectedServiceId: id }),
	clearSelectedService: () => set({ selectedServiceId: null }),
}));

export default useServiceStore;
