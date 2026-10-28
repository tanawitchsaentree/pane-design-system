import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import * as RT from '@radix-ui/react-tabs';
import { cx } from '../../cx';
import styles from './Tabs.module.css';

// Behaviour (roving tabindex, Arrow/Home/End, aria-controls wiring) is Radix's, per the stack rule —
// never hand-rolled. This file only adds the Pane look.

export const TabsRoot = RT.Root;

export const TabsList = forwardRef<ElementRef<typeof RT.List>, ComponentPropsWithoutRef<typeof RT.List>>(function TabsList({ className, ...rest }, ref) {
  return <RT.List ref={ref} data-component="Tabs" className={cx(styles.list, className)} {...rest} />;
});

export const TabsTrigger = forwardRef<ElementRef<typeof RT.Trigger>, ComponentPropsWithoutRef<typeof RT.Trigger>>(function TabsTrigger({ className, ...rest }, ref) {
  return <RT.Trigger ref={ref} className={cx(styles.trigger, className)} {...rest} />;
});

export const TabsContent = forwardRef<ElementRef<typeof RT.Content>, ComponentPropsWithoutRef<typeof RT.Content>>(function TabsContent({ className, ...rest }, ref) {
  return <RT.Content ref={ref} className={cx(styles.content, className)} {...rest} />;
});

export const Tabs = { Root: TabsRoot, List: TabsList, Trigger: TabsTrigger, Content: TabsContent };
