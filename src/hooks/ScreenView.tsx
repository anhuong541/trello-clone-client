import { useState, useEffect } from "react";

export default function useScreenView() {
  const [screenView, setScreenView] = useState(["null", null]);

  useEffect(() => {
    if (!screenView[1]) {
      setScreenView(getScreenView());
    }
  }, [screenView]);

  useEffect(() => {
    function handleResize() {
      setScreenView(getScreenView());
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { screenViewType: screenView[0], screenView: screenView[1] };
}

function getScreenView(): any {
  const width = window.innerWidth;

  if (width <= 320) {
    return ["extraSmallMobile", window.innerWidth]; // Extra Small Mobile
  } else if (width > 320 && width <= 375) {
    return ["superSmallMobile", window.innerWidth]; // Small Mobile
  } else if (width > 375 && width <= 480) {
    return ["smallMobile", window.innerWidth]; // Small Mobile
  } else if (width > 480 && width <= 768) {
    return ["mediumMobile", window.innerWidth]; // Medium Mobile
  } else if (width > 768 && width <= 1024) {
    return ["largeMobile", window.innerWidth]; // Large Mobile
  } else if (width > 1024 && width <= 1200) {
    return ["smallTablet", window.innerWidth]; // Small Tablet
  } else if (width > 1200 && width <= 1440) {
    return ["largeTablet", window.innerWidth]; // Large Tablet
  } else {
    return ["desktop", window.innerWidth]; // Desktop
  }
}
