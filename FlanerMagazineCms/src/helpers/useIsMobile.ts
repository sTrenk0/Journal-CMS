import { useWindowWidth } from "./useWindowWidth";

// Custom hook to determine if the device is mobile
export const useIsMobile = (breakpoint: number = 768): boolean => {
  const width = useWindowWidth();
  return width <= breakpoint;
};
