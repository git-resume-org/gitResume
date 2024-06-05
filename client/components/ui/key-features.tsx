// // "use client";
// // import Image from "./Image";
// // import React from "react";
// // import { WobbleCard } from "../ui/wobble-card";

// // export function WobbleCardDemo() {
// //   return (
// //     <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
// //       <WobbleCard
// //         containerClassName="col-span-1 lg:col-span-2 h-full bg-greyGR min-h-[500px] lg:min-h-[300px]"
// //         className=""
// //       >
// //         <div className="max-w-xs">
// //           <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-blueGR">
// //             Automated parsing of git commit history for any of your repos.
// //           </h2>
// //           <p className="mt-4 text-left  text-base/6 text-blueGR">
// //             With over 100,000 mothly active bot users, Gippity AI is the most
// //             popular AI platform for developers.
// //           </p>
// //         </div>
// //         <Image
// //           src="/linear.webp"
// //           width={500}
// //           height={500}
// //           alt="linear demo image"
// //           className="absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl"
// //         />
// //       </WobbleCard>
// //       <WobbleCard containerClassName="col-span-1 min-h-[300px]">
// //         <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-blueGR">
// //           Automated generation of resume bullet points from that parsed data.
// //         </h2>
// //         <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-blueGR">
// //           If someone yells “stop!”, goes limp, or taps out, the fight is over.
// //         </p>
// //       </WobbleCard>
// //       <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-greyGR min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
// //         <div className="max-w-xs">
// //           <h2 className="max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-blueGR">
// //             Done within seconds.
// //           </h2>
// //           <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-blueGR">
// //             With over 100,000 mothly active bot users, Gippity AI is the most
// //             popular AI platform for developers.
// //           </p>
// //         </div>
// //         <Image
// //           src="/linear.webp"
// //           width={500}
// //           height={500}
// //           alt="linear demo image"
// //           className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
// //         />
// //       </WobbleCard>
// //     </div>
// //   );
// // }
// "use client";
// import Image from "./Image";
// import React from "react";
// import { WobbleCard } from "../ui/wobble-card";

// export function WobbleCardOne() {
//   return (
//     <div className="flex justify-center max-w-3xl mx-auto w-full">
//       <WobbleCard
//         containerClassName="col-span-1 lg:col-span-2 h-full bg-greyGR min-h-[300px] lg:min-h-[250px]"
//         className=""
//       >
//         <div className="max-w-lg">
//           <h2 className="text-left text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-blueGR">
//             Automated parsing of git commit history for any of your repos.
//           </h2>
//           <p className="mt-16 text-left text-base/6 text-greenGR">
//             Click to learn more
//           </p>
//         </div>
//         <Image
//           src="/linear.webp"
//           width={500}
//           height={500}
//           alt="linear demo image"
//           className="absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl"
//         />
//       </WobbleCard>
//     </div>
//   );
// }

"use client";
import Image from "./Image";
import React from "react";
import { WobbleCard } from "../ui/wobble-card";

const WobbleCardOne = () => (
  <WobbleCard containerClassName="bg-greyGR min-h-[300px] w-full">
    <div className="max-w-md">
      <h2 className="text-left text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-blueGR">
        Automated parsing of git commit history for any of your repos.
      </h2>
      <p className="mt-36 text-left text-base/6 text-greenGR">
        Click here to learn more!
      </p>
    </div>
  </WobbleCard>
);

const WobbleCardTwo = () => (
  <WobbleCard containerClassName="bg-greyGR min-h-[300px] w-full">
    <div className="max-w-md">
      <h2 className="text-left text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-blueGR">
        Automated generation of resume bullet points from that parsed data.
      </h2>
      <p className="mt-24 text-left text-base/6 text-greenGR">
        Click here to learn more!
      </p>
    </div>
  </WobbleCard>
);

const WobbleCardThree = () => (
  <WobbleCard containerClassName="bg-greyGR min-h-[300px] w-full">
    <div className="max-w-md">
      <h2 className="text-left text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-blueGR">
        Done within seconds.
      </h2>
      <p className="mt-40 text-left text-base/6 text-greenGR">
        Click here to learn more!
      </p>
    </div>
  </WobbleCard>
);

export function WobbleCardDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mx-auto w-full px-4 md:px-0">
      <WobbleCardOne />
      <WobbleCardTwo />
      <WobbleCardThree />
      <div className="flex justify-center items-center">
        <img src="../../assets/images/media.png" alt="Media" className="w-full max-w-xl rounded-4xl" />
      </div>
    </div>
  );
}

export default WobbleCardDemo;

