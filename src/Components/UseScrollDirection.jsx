import { useRef } from 'react';

export default function useScrollDirection(callback) {
  const scrollOffset = useRef(0);

  return ({ nativeEvent }) => {
    const currentOffset = nativeEvent.contentOffset.y;
    console.log("cv",currentOffset)
    const direction = currentOffset > 10 ? 'down' : 'up';
    scrollOffset.current = currentOffset;

    callback(direction);
  };
}
