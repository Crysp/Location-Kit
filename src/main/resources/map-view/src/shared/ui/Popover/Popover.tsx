import React, { useEffect, useImperativeHandle, useRef } from 'react';
import styles from './Popover.module.css';

export type PopoverRef = {
  move: (x: number, y: number) => void;
};
type PopoverProps = {
  visible?: boolean;
  content: string;
};

export const Popover = React.forwardRef<PopoverRef, PopoverProps>(
  ({ visible = false, content }, ref) => {
    const pointRef = useRef<[number, number]>([0, 0]);
    const requestRef = useRef<number>();
    const pointerRef = useRef<HTMLDivElement>(null);

    const movePointer = () => {
      if (pointerRef.current) {
        pointerRef.current.style.transform = `translate(${pointRef.current[0]}px, ${pointRef.current[1]}px)`;
      }
    };

    useImperativeHandle(
      ref,
      () => ({
        move(x, y) {
          pointRef.current = [x, y];
          requestRef.current = requestAnimationFrame(movePointer);
        },
      }),
      [],
    );

    useEffect(
      () => () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
      },
      [],
    );

    return (
      <div
        ref={pointerRef}
        className={[styles.container, !visible && styles.hidden].join(' ')}
      >
        {content}
      </div>
    );
  },
);
