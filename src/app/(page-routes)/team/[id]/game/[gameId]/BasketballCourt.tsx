"use client";
import React, { useState, useRef, useEffect, MouseEvent } from "react";
import courtBackground from "./Design.png"; // Replace with the actual path to your image
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { set, z } from "zod";
import { usePlayerForApp } from "@/src/store/PlayerForApp";
import { shot } from "@prisma/client";
import { trpc } from "@/src/app/_trpc/client";

interface Shot {
  xPoint: number;
  yPoint: number;
  made: boolean;
  playerid: number;
  gameid: number;
}

interface BasketballCourtProps {
  toggle: () => void;
  setCords: (x: number, y: number) => void;
  gameId: string;
  teamId: number;
}

const BasketballCourt: React.FC<BasketballCourtProps> = (
  props: BasketballCourtProps
) => {
  const { toggle, setCords, teamId, gameId } = props;

  const players = usePlayerForApp((state) => state.players);

  const { data, isLoading, isError } =
    trpc.GameRouter.grabPlayersShotsFromGame.useQuery(
      {
        teamId: teamId.toString(),
        gameId: gameId.toString(),
      },
      {
        queryKey: ["shots"],
      }
    );

  const [shots, setShots] = useState<Shot[]>([]);
  const [cursor, setCursor] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // TODO - display shots for players that are playing
    if (!data) return;

    const activeShots = data.filter((shots) => {
      const player = players.find((player) => player.id === shots.playerId);
      return player && player.isPlaying;
    });

    setShots(activeShots);
  }, [data, players]);

  useEffect(() => {
    const drawBasketballCourt = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      // Set background image
      const background = new Image();
      // COURT BACKGROUND IMAGE
      //routetate this image

      background.src = courtBackground.src;
      context.drawImage(background, 0, 0, canvas.width, canvas.height);

      // Draw recorded shots
      shots.forEach((shot, index) => {
        context.fillStyle = shot.made ? "#FF4500" : "#696969";
        context.beginPath();
        context.arc(shot.xPoint, shot.yPoint, 5, 0, 2 * Math.PI);
        context.fill();
      });

      // Draw cursor
      context.fillStyle = "blue";
      context.beginPath();
      context.arc(cursor.x, cursor.y, 5, 0, 2 * Math.PI);
      context.fill();
    };

    drawBasketballCourt();
  }, [shots, cursor]);

  const recordShot = (made: boolean) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = cursor.x;
    const y = cursor.y;

    // const newShot: Shot = { x, y, made };
    // setShots([...shots, newShot]);

    setCords(x, y);
    toggle();
  };

  const updateCursor = (event: MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setCursor({ x, y });
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div>
        <canvas
          ref={canvasRef}
          width={500}
          height={300}
          onClick={() => {
            recordShot(true);
          }} // Record made shot on click
          onMouseMove={updateCursor}
        />
      </div>
      <button onClick={() => recordShot(false)}>Missed Shot</button>
      <div>
        <h3>Shot Log</h3>
        <ul>
          {shots.map((shot, index) => (
            <li key={index}>{`Shot ${index + 1}: (${shot.xPoint}, ${
              shot.yPoint
            }) - ${shot.made ? "Made" : "Missed"}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BasketballCourt;
