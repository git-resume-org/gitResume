import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 transition duration-300 ease-in-out transform"
);

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      "relative z-10 flex max-w-max flex-1 items-center justify-center",
      className
    )}
    {...props}
  >
    <NavigationMenuPrimitive.List className="group text-greenGR font-grotesk flex flex-1 list-none items-center justify-center space-x-1">
      {/* About Us */}
      <NavigationMenuPrimitive.Item>
        <NavigationMenuPrimitive.Trigger
          className={cn(navigationMenuTriggerStyle(), "group")}
        >
          About Us
          {/* <ChevronDown
            className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
            aria-hidden="true"
          /> */}
        </NavigationMenuPrimitive.Trigger>
        <NavigationMenuPrimitive.Content
          className={cn(
            "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto max-h-[120px]"
          )}
        >
          {/* <nav aria-label="Main" className="p-4 bg-greyGR">
            <ul className='m-0 grid list-none gap-x-[10px] p-[22px] sm:w-[300px] h-auto sm:grid-flow-col sm:grid-rows-3'>
              <li className="text-blueGR">Learn more about the developers for this application!</li>
            </ul>
          </nav> */}
          <nav aria-label="Main" className="p-1 bg-greyGR">
            <ul className='m-0 grid list-none gap-x-[10px] p-[22px] sm:w-[300px] h-auto sm:grid-flow-col sm:grid-rows-4'>
              <li className="text-blueGR ">Learn more about the developers</li>
              <li className="grid grid-cols-4 gap-x-[1px]">
                <a href="https://github.com/elena-netepenko" target="_blank" rel="noopener noreferrer"><img src="https://ca.slack-edge.com/T05DE2VJ8TH-U05QMKLE7C7-3d3874d7ea3b-512" className="rounded-full h-10" /></a>
                <a href="https://github.com/JoshBajarias" target="_blank" rel="noopener noreferrer"><img src="https://ca.slack-edge.com/T05DE2VJ8TH-U05QBHT7PV1-dbe9e104ea92-512" className="rounded-full h-10" /></a>
                <a href="https://github.com/keithgibson" target="_blank" rel="noopener noreferrer"><img src="https://ca.slack-edge.com/T05DE2VJ8TH-U05SANWSWUV-6cd7e6a17692-512" className="rounded-full h-10" /></a>
                <a href="https://github.com/NinaSkyttis" target="_blank" rel="noopener noreferrer"><img src="https://ca.slack-edge.com/T05DE2VJ8TH-U05PCG75EHY-44194f3df529-512" className="rounded-full h-10" /></a>
              </li>
            </ul>
          </nav>
        </NavigationMenuPrimitive.Content>
      </NavigationMenuPrimitive.Item>

      <NavigationMenuPrimitive.Item>
        <NavigationMenuPrimitive.Trigger
          className={cn(navigationMenuTriggerStyle(), "group")}
        >
          Application
          {/* <ChevronDown
            className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
            aria-hidden="true"
          /> */}
        </NavigationMenuPrimitive.Trigger>
        <NavigationMenuPrimitive.Content
          className={cn(
            "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto max-h-[120px]"
          )}
        >
          <nav aria-label="Main" className="p-4 bg-greyGR">
            <ul className='m-0 grid list-none gap-x-[10px] p-[22px] sm:w-[300px] sm:grid-flow-col sm:grid-rows-3'>
              <li className="text-blueGR">Dive deeper into the functionality of this application!</li>
            </ul>
          </nav>
        </NavigationMenuPrimitive.Content>
      </NavigationMenuPrimitive.Item>

      <NavigationMenuPrimitive.Item>
        <NavigationMenuPrimitive.Trigger
          className={cn(navigationMenuTriggerStyle(), "group")}
        >
          Pricing
          {/* <ChevronDown
            className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
            aria-hidden="true"
          /> */}
        </NavigationMenuPrimitive.Trigger>
        <NavigationMenuPrimitive.Content
          className={cn(
            "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto max-h-[120px]"
          )}
        >
          <nav aria-label="Main" className="p-4 bg-greyGR">
            <ul className='m-0 grid list-none gap-x-[10px] p-[22px] sm:w-[300px] sm:grid-flow-col sm:grid-rows-3'>
              <li className="text-blueGR">View our standard pricing for this application!</li>
            </ul>
          </nav>
        </NavigationMenuPrimitive.Content>
      </NavigationMenuPrimitive.Item>

    </NavigationMenuPrimitive.List>

    <NavigationMenuPrimitive.Indicator
      className={cn(
        "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in"
      )}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
    </NavigationMenuPrimitive.Indicator>
    <div className="absolute left-0 top-full flex justify-center">
      <NavigationMenuPrimitive.Viewport
        className={cn(
          "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)] border-none transition-opacity duration-300 ease-in-out transform scale-95 opacity-0 data-[state=open]:opacity-100 data-[state=open]:scale-100"
        )}
      />
    </div>
  </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

export { NavigationMenu };
