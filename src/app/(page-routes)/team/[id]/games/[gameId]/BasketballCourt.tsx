"use client";
import React, { useState, useRef, useEffect, MouseEvent } from "react";
import courtBackground from "./Design.png"; // Replace with the actual path to your image

interface Shot {
  x: number;
  y: number;
  made: boolean;
  playerid: number;
  gameid: number;
}

interface BasketballCourtProps {
  toggle: () => void;
  setCords: (x: number, y: number) => void;
}

const BasketballCourt: React.FC<BasketballCourtProps> = (
  props: BasketballCourtProps
) => {
  const { toggle, setCords } = props;
  const [shots, setShots] = useState<Shot[]>([]);
  const [cursor, setCursor] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
        context.arc(shot.x, shot.y, 5, 0, 2 * Math.PI);
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
            <li key={index}>{`Shot ${index + 1}: (${shot.x}, ${shot.y}) - ${
              shot.made ? "Made" : "Missed"
            }`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BasketballCourt;
