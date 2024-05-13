import {
  RenderComponentProps,
  useMasonry,
  usePositioner,
  useResizeObserver,
} from "masonic";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  items: any[];
  render: React.ComponentType<RenderComponentProps<any>>;
};

const Masonry = ({ items, render }: Props) => {
  const containerRef = useRef(null);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setWidth(width);
      setHeight(height);
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.unobserve(container);
    };
  }, []);

  const positioner = usePositioner({
    width,
    columnWidth: 296,
    columnGutter: 16,
  });

  const resizeObserver = useResizeObserver(positioner);

  return (
    <div ref={containerRef}>
      {useMasonry({
        positioner,
        resizeObserver,
        items,
        height,
        scrollTop: scrollY,
        overscanBy: 6,
        render,
      })}
    </div>
  );
};

export default Masonry;
