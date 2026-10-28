import { forwardRef, useLayoutEffect, useRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import * as RT from '@radix-ui/react-tabs';
import { cx } from '../../cx';
import styles from './Tabs.module.css';

// Behaviour (roving tabindex, Arrow/Home/End, aria-controls wiring) is Radix's, per the stack rule —
// never hand-rolled. This file only adds the Pane look.

export const TabsRoot = RT.Root;

// The chosen tab's sheet is one element that slides between tabs, so its place is measured here and
// handed to CSS. It follows the chosen tab whenever Radix changes it and whenever the list resizes.
export const TabsList = forwardRef<ElementRef<typeof RT.List>, ComponentPropsWithoutRef<typeof RT.List>>(function TabsList({ className, ...rest }, ref) {
  const inner = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    const el = inner.current;
    if (!el) return;
    const place = () => {
      const a = el.querySelector<HTMLElement>('[role="tab"][data-state="active"]');
      if (!a) return;
      const rtl = getComputedStyle(el).direction === 'rtl';
      const x = rtl ? a.offsetLeft + a.offsetWidth - el.clientWidth : a.offsetLeft;
      el.style.setProperty('--pane-tx', `${x}px`);
      el.style.setProperty('--pane-tw', `${a.offsetWidth}px`);
      el.dataset.placed = '';
    };
    place();
    // the first placement must not animate in from the start of the track
    const raf = requestAnimationFrame(() => { el.dataset.ready = ''; });
    const mo = new MutationObserver(place);
    mo.observe(el, { subtree: true, attributes: true, attributeFilter: ['data-state'] });
    const ro = new ResizeObserver(place);
    ro.observe(el);
    return () => { cancelAnimationFrame(raf); mo.disconnect(); ro.disconnect(); };
  }, []);
  const setRef = (node: HTMLDivElement | null) => {
    inner.current = node;
    if (typeof ref === 'function') ref(node); else if (ref) ref.current = node;
  };
  return <RT.List ref={setRef} data-component="Tabs" className={cx(styles.list, className)} {...rest} />;
});

export const TabsTrigger = forwardRef<ElementRef<typeof RT.Trigger>, ComponentPropsWithoutRef<typeof RT.Trigger>>(function TabsTrigger({ className, ...rest }, ref) {
  return <RT.Trigger ref={ref} className={cx(styles.trigger, className)} {...rest} />;
});

export const TabsContent = forwardRef<ElementRef<typeof RT.Content>, ComponentPropsWithoutRef<typeof RT.Content>>(function TabsContent({ className, ...rest }, ref) {
  return <RT.Content ref={ref} className={cx(styles.content, className)} {...rest} />;
});

export const Tabs = { Root: TabsRoot, List: TabsList, Trigger: TabsTrigger, Content: TabsContent };
