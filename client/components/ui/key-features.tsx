"use client";
import Image from "./Image";
import React from "react";
import { WobbleCard } from "../ui/wobble-card";

const WobbleCardOne = () => (
  <WobbleCard containerClassName="bg-greyGR w-full h-56">
    <div className="max-w-md m-4">
      <h2 className="text-left text-base md:text-xl lg:text-3xl tracking-[-0.015em] text-blueGR font-grotesk" >
        Automated parsing of git commit history for any of your repos.
      </h2>
      {/* <p className="mt-10 text-left text-base/6 text-greenGR">
        Click here to learn more!
      </p> */}
    </div>
  </WobbleCard>
);

const WobbleCardTwo = () => (
  <WobbleCard containerClassName="bg-greyGR w-full h-56">
    <div className="max-w-md m-4">
      <h2 className="text-left text-base md:text-xl lg:text-3xl tracking-[-0.015em] text-blueGR font-grotesk">
        Automated generation of resume bullet points from that parsed data.
      </h2>
      {/* <p className="mt-10 text-left text-base/6 text-greenGR">
        Click here to learn more!
      </p> */}
    </div>
  </WobbleCard>
);

const WobbleCardThree = () => (
  <WobbleCard containerClassName="bg-greyGR w-full h-56">
    <div className="max-w-md m-4">
      <h2 className="text-left text-base md:text-xl lg:text-3xl tracking-[-0.015em] text-blueGR font-grotesk">
        Done within seconds.
      </h2>
      {/* <p className="mt-28 text-left text-base/6 text-greenGR">
        Click here to learn more!
      </p> */}
    </div>
  </WobbleCard>
);

export function WobbleCardDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-7xl mx-auto w-full px-4 md:px-0">
      <WobbleCardOne />
      <WobbleCardTwo />
      <WobbleCardThree />
      <div className="flex justify-center items-center">
        <img src="../../assets/images/media.png" alt="Media" className="w-full max-w-md rounded-4xl" />
      </div>
    </div>
  );
}

export default WobbleCardDemo;
