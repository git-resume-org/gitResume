"use client";
import Image from "./Image";
import React from "react";
import { WobbleCard } from "../ui/wobble-card";

const WobbleCardOne = () => (
      // changed the background color of each button to transparent
  <WobbleCard containerClassName="bg-greyGR w-full">
    {/* <div className="max-w-md"> */}
    <div className="flex items-center justify-center h-20">
    <h2 className="text-center text-base md:text-xl lg:text-2xl tracking-[-0.015em] text-greenGR font-grotesk">
    Git commit history
      </h2><span className="mx-1"> <h2 className="text-center text-base md:text-xl lg:text-2xl tracking-[-0.015em] text-greenGR font-grotesk underline">auto-parsed
      </h2></span>
      {/* <p className="mt-10 text-left text-base/6 text-greenGR">
        Click here to learn more!
      </p> */}
    </div>
  </WobbleCard>
);

const WobbleCardTwo = () => (
  <WobbleCard containerClassName="bg-greyGR w-full">
    {/* <div className="max-w-md"> */}
    <div className="flex items-center justify-center h-20">
    <h2 className="text-center text-base md:text-xl lg:text-2xl tracking-[-0.015em] text-greenGR font-grotesk">
    Resume bullet points
      </h2><span className="mx-1"> <h2 className="text-center text-base md:text-xl lg:text-2xl tracking-[-0.015em] text-greenGR font-grotesk underline"> auto-generated
      </h2></span>
      {/* <p className="mt-10 text-center text-base/6 text-greenGR">
        Click here to learn more!
      </p> */}
    </div>
  </WobbleCard>
);

const WobbleCardThree = () => (
  <WobbleCard containerClassName="bg-greyGR w-full">
    {/* <div className="max-w-md"> */}
    <div className="flex items-center justify-center h-20">
      <h2 className="text-center text-base md:text-xl lg:text-2xl tracking-[-0.015em] text-greenGR font-grotesk">
        Done in
      </h2><span className="mx-1"> <h2 className="text-center text-base md:text-xl lg:text-2xl tracking-[-0.015em] text-greenGR font-grotesk underline">seconds
      </h2></span>
      {/* <p className="mt-28 text-left text-base/6 text-greenGR">
        Click here to learn more!
      </p> */}
    </div>
  </WobbleCard>
);

export function WobbleCardDemo() {
  return (
    <div className="flex flex-col gap-10 w-full">
      <div className="w-full flex justify-start">
        <div className="w-2/3 max-w-2xl">
          <WobbleCardOne />
        </div>
      </div>
      <div className="w-full flex justify-center">
        <div className="w-2/3 max-w-2xl">
          <WobbleCardTwo />
        </div>
      </div>
      <div className="w-full flex justify-end">
        <div className="w-2/3 max-w-2xl">
          <WobbleCardThree />
        </div>
      </div>
    </div>
  );
}

export default WobbleCardDemo;
