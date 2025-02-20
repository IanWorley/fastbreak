"use client";

import { useParams } from "next/navigation";
import type { MouseEvent } from "react";
import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";

import { useShotsForGame } from "~/hooks/ShotHooks";
import { usePlayerForApp } from "~/store/PlayerForApp"; // Replace with the actual path to your image

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

  quarter: number;
}

const BasketballCourt: React.FC<BasketballCourtProps> = (
  props: BasketballCourtProps,
) => {
  const { toggle, setCords, quarter } = props;

  const players = usePlayerForApp((state) => state.players);

  const courtWidth = 549;
  const courtHeight = 320;
  const courtRef = useRef<SVGSVGElement>(null);
  const imageRef = useRef(null);

  const [prevQuarter, setPrevQuarter] = useState(quarter);

  const prams = useParams<{ id: string; gameId: string }>();
  const teamId = z.string().cuid2().parse(prams.id);
  const gameId = z.string().cuid2().parse(prams.gameId);

  const fetchShots = useShotsForGame(gameId, teamId, quarter);

  const [shots, setShots] = useState<Shot[]>([]);
  const [cursor, setCursor] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (prevQuarter !== quarter) {
      setPrevQuarter(quarter);
    }
  }, [prevQuarter, quarter]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!fetchShots) return;
    const activeShots = fetchShots.filter((shots) => {
      const player = players.find(
        (player) => player.id === shots.player_Id && shots.game_Id === gameId,
      );
      // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
      return player && player.isPlaying;
    });

    if (activeShots.length === 0 && prevQuarter == quarter) return;

    setShots(
      activeShots.map((shot) => ({
        ...shot,
        playerid: shot.player_Id,
        gameid: shot.game_Id,
      })),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchShots, players]);

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

  // console.log(shots);

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
          <image href="/court.png" width="100%" height="100%" ref={imageRef} />
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
