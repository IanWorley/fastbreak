import type { shot } from "@prisma/client";
import { create } from "zustand";

interface ShotStore {
  shots: shot[];
  addShots: (shots: shot) => void;
  removeShot: (shot_id: number) => void;
  updateShot: (shot: shot, user_id: number) => void;
  addMultipleShots: (shots: shot[]) => void;
}

export const useShotStore = create<ShotStore>((set) => ({
  shots: [],
  addShots: (shots: shot) =>
    set((state) => ({
      shots: [...state.shots, shots],
    })),

  // add multiple shots as an array
  addMultipleShots: (shots: shot[]) =>
    set((state) => {
      const newShots = shots.filter(
        (newShot) =>
          !state.shots.some((existingShot) => existingShot.id === newShot.id),
      );
      return {
        shots: [...state.shots, ...newShots],
      };
    }),

  removeShot: (shot_id: number) =>
    set((state) => ({
      shots: state.shots.filter((shot) => shot.id !== shot_id),
    })),

  updateShot: (shot: shot, user_id: number) => {
    set((state) => ({
      shots: state.shots.map((s) => (s.id === shot.id ? shot : s)),
    }));
  },
}));
