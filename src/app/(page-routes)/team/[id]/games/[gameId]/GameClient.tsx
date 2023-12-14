"use client";
import React, { ReactNode, useState } from "react";
import BasketballCourt from "./BasketballCourt";
import { useQuery } from "@tanstack/react-query";
import Modal from "./Model";

function GameClient() {
  // useQuery({ queryKey: ["players"], queryFn: () => {} });
  // is open state
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="flex justify-center items-center">
      <BasketballCourt toggle={toggle} />
      <Modal open={isOpen} toggle={toggle} />
    </div>
  );
}

export default GameClient;
