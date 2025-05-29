import { useRef, useState } from "react";

export const useDragToScroll = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null); // Ref for the scrollable div
  const [isDragging, setIsDragging] = useState<boolean>(false); // Track dragging state
  const [startX, setStartX] = useState<number>(0); // Initial mouse X position
  const [scrollLeft, setScrollLeft] = useState<number>(0); // Initial scroll position
  const [isScrolling, setIsScrolling] = useState<boolean>(false); // Track scrolling state

  // Handle mouse down (start dragging)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsScrolling(true); // User is scrolling
    setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0));
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
  };

  // Handle mouse move (while dragging)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollContainerRef.current.offsetLeft || 0);
    const walk = (x - startX) * 2; // Adjust scroll speed
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Handle mouse up (stop dragging)
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsScrolling(false); // User stopped scrolling
  };

  // Handle mouse leave (stop dragging if mouse leaves the div)
  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsScrolling(false); // User stopped scrolling
  };

  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setIsScrolling(true); // User is scrolling
    setStartX(e.touches[0].pageX - (scrollContainerRef.current?.offsetLeft || 0));
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
  };

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.touches[0].pageX - (scrollContainerRef.current.offsetLeft || 0);
    const walk = (x - startX) * 2; // Adjust scroll speed
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Handle touch end
  const handleTouchEnd = () => {
    setIsDragging(false);
    setIsScrolling(false); // User stopped scrolling
  };

  return {
    scrollContainerRef,
    isDragging,
    isScrolling, // Expose isScrolling state
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};