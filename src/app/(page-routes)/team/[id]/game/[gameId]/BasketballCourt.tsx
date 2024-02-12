"use client";
import React, { useEffect, useRef, useState, type MouseEvent } from "react";
import { usePlayerForApp } from "~/store/PlayerForApp";
import { useShotStore } from "~/store/ShotStore";
import { api } from "~/trpc/react";
import courtBackground from "./court.png"; // Replace with the actual path to your image

interface Shot {
  xPoint: number;
  yPoint: number;
  made: boolean;
  playerid: string;
  gameid: string;
}

interface BasketballCourtProps {
  toggle: () => void;
  setCords: (x: number, y: number) => void;
  gameId: string;
  teamId: string;
}

const BasketballCourt: React.FC<BasketballCourtProps> = (
  props: BasketballCourtProps,
) => {
  const { toggle, setCords, teamId, gameId } = props;

  const players = usePlayerForApp((state) => state.players);

  const courtWidth = 549;
  const courtHeight = 320;
  const courtRef = useRef<SVGSVGElement>(null);
  const imageRef = useRef(null);

  const shotsStore = useShotStore((state) => state);

  const { data, isLoading, isError } =
    api.game.grabPlayersShotsFromGame.useQuery({
      teamId: teamId,
      gameId: gameId,
    });

  const [shots, setShots] = useState<Shot[]>([]);
  const [cursor, setCursor] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (!data) return;

    shotsStore.addMultipleShots(data);

    const activeShots = data.filter((shots) => {
      const player = players.find((player) => player.id === shots.playerId);
      return player && player.isPlaying;
    });

    setShots(
      activeShots.map((shot) => ({
        ...shot,
        playerid: shot.playerId,
        gameid: shot.gameId,
      })),
    );
  }, [data, players]);

  const recordShot = (
    event: MouseEvent<SVGSVGElement, globalThis.MouseEvent>,
  ) => {
    if (!courtRef.current) return;

    const svg = event.currentTarget;

    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100; // Scale to 0-100
    const y = ((event.clientY - rect.top) / rect.height) * 100; // Scale to 0-100

    setCords(x, y);
    toggle();
  };
  const updateCursor = (
    event: MouseEvent<SVGSVGElement, globalThis.MouseEvent>,
  ) => {
    const svg = event.currentTarget;

    // Check if the event target is the SVG element itself

    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * courtWidth;
    const y = ((event.clientY - rect.top) / rect.height) * courtHeight;

    setCursor({
      x: x,
      y: y,
    });
  };

  console.log(shots);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${courtWidth} ${courtHeight}`}
          preserveAspectRatio="xMidYMid meet"
          className="h-auto w-full"
          onMouseMove={updateCursor}
          ref={courtRef}
          onClick={recordShot}
        >
          <image
            href={courtBackground.src}
            width="100%"
            height="100%"
            ref={imageRef}
          />
          {shots.map((shot, index) => (
            <circle
              key={index}
              cx={(shot.xPoint / 100) * courtWidth} // Scale xPoint to match courtWidth
              cy={(shot.yPoint / 100) * courtHeight} // Scale yPoint to match courtHeight
              r={5}
              fill={shot.made ? "green" : "red"}
            />
          ))}

          <circle cx={cursor.x} cy={cursor.y} r={5} fill="blue" />
        </svg>
      </div>
    </div>
  );
};

export default BasketballCourt;
