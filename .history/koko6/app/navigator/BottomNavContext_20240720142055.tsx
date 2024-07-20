import React from 'react';
import { DraggableBottomNavRef } from '../navigator/DraggableBottmNav';

export const BottomNavContext = React.createContext<React.RefObject<DraggableBottomNavRef> | null>(null);

export const useBottomNav = () => {
  const context = React.useContext(BottomNavContext);
  if (!context) {
    throw new Error('useBottomNav must be used within a BottomNavProvider');
  }
  return context;
};