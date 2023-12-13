"use client";

import React, { ReactNode } from "react";
import BasketballCourt from "./BasketballCourt";
import { useQuery } from "@tanstack/react-query";

function GameClient() {
  useQuery({ queryKey: ["players"], queryFn: () => {} });

  return (
    <div className="flex justify-center items-center">
      <BasketballCourt />
    </div>
  );
}

export default GameClient;
