import { forwardRef } from 'react';
import { Sheet, type SheetProps } from '../Sheet';

export interface DrawerProps extends Omit<SheetProps, 'side'> {
  /** `end` (default) or `start`: the side the panel slides in from. */
  side?: 'start' | 'end';
}

/** A side panel over a dimmed scene, for navigation or filters on a wide screen: a Sheet from the start
 *  or end edge, with the same focus trap, Esc and scrim. */
export const Drawer = forwardRef<HTMLElement, DrawerProps>(function Drawer({ side = 'end', ...rest }, ref) {
  return <Sheet ref={ref} side={side} {...rest} />;
});
