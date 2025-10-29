
import { useLocalStorage } from './useLocalStorage';
import { Layout } from '../types';
import { useCallback } from 'react';

const layouts: Layout[] = ['dated-grid', 'grid', 'list'];

export const useLayout = () => {
  const [layout, setLayout] = useLocalStorage<Layout>('layout', 'dated-grid');

  const cycleLayout = useCallback(() => {
    const currentIndex = layouts.indexOf(layout);
    const nextIndex = (currentIndex + 1) % layouts.length;
    setLayout(layouts[nextIndex]);
  }, [layout, setLayout]);

  return { layout, cycleLayout };
};
