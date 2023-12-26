import { player } from "@prisma/client/edge";
import { create } from "zustand";

interface PlayerForApp extends player {
  isPlaying: boolean;
}

interface PlayerForAppState {
  players: PlayerForApp[];
  addPlayer: (player: player) => void;
  removePlayer: (player: player) => void;
  togglePlayer: (player_id: number) => void;
  updatePlayer: (player: player) => void;
  updatePlayers: (players: player[]) => void;
  addPlayers: (player: player[]) => void;
}

export const usePlayerForApp = create<PlayerForAppState>((set) => ({
  players: [],
  addPlayers(rawPlayerApi: player[]) {
    set((state) => {
      const updatedPlayers = state.players.map((player) => {
        const newPlayer = rawPlayerApi.find((p) => p.id === player.id);
        return newPlayer
          ? { ...newPlayer, isPlaying: player.isPlaying }
          : player;
      });

      const newPlayers = rawPlayerApi.filter(
        (p) => !state.players.find((player) => player.id === p.id)
      );

      return {
        players: [
          ...updatedPlayers,
          ...newPlayers.map((player) => ({ ...player, isPlaying: false })),
        ],
      };
    });
  },
  addPlayer: (player) =>
    set((state) => ({
      players: [...state.players, { ...player, isPlaying: false }],
    })),
  // update all player values besides isPlaying
  updatePlayer: (player) =>
    set((state) => ({
      players: state.players.map((p) =>
        p.id === player.id ? { ...p, ...player } : p
      ),
    })),

  // do it for a whole group of players at once
  updatePlayers: (players) =>
    set((state) => ({
      players: state.players.map((p) =>
        players.find((player) => player.id === p.id)
          ? { ...p, ...players.find((player) => player.id === p.id) }
          : p
      ),
    })),

  removePlayer: (player) =>
    set((state) => ({
      players: state.players.filter((p) => p.id !== player.id),
    })),

  togglePlayer: (player_id) =>
    set((state) => ({
      players: state.players.map((p) =>
        p.id === player_id ? { ...p, isPlaying: !p.isPlaying } : p
      ),
    })),
}));
