import React, { createContext, useContext, useRef, ReactNode } from 'react';
import { DraggableBottomNavRef } from '../navigator/DraggableBottmNav';

const BottomNavContext = createContext<React.RefObject<DraggableBottomNavRef> | null>(null);

export const useBottomNav = () => {
  const context = useContext(BottomNavContext);
  if (!context) {
    throw new Error('useBottomNav must be used within a BottomNavProvider');
  }
  return context;
};

interface BottomNavProviderProps {
  children: ReactNode;
}

export const BottomNavProvider: React.FC<BottomNavProviderProps> = ({ children }) => {
  const bottomNavRef = useRef<DraggableBottomNavRef>(null);

  return (
    <BottomNavContext.Provider value={bottomNavRef}>
      {children}
    </BottomNavContext.Provider>
  );
};