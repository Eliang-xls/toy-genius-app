import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AgeFilter } from '@/lib/api';
import {
  getSlotAge,
  setSlotAge as storageSetSlotAge,
  getSlotProducts,
  addProductToSlot as storageAddProduct,
  removeProductFromSlot as storageRemoveProduct,
  getSlotCount,
  isProductInSlot as storageIsProductInSlot,
} from '@/lib/storage';

interface SlotContextType {
  slotProducts: string[]; // 4 entries, '' for empty
  slotAge: AgeFilter;
  slotCount: number; // computed
  addProduct: (productId: string) => Promise<boolean>;
  removeProduct: (productId: string) => Promise<void>;
  setSlotAge: (age: AgeFilter) => Promise<void>;
  isProductInSlot: (productId: string) => boolean;
  refreshSlots: () => Promise<void>;
}

const SlotContext = createContext<SlotContextType | undefined>(undefined);

export function SlotProvider({ children }: { children: React.ReactNode }) {
  const [slotProducts, setSlotProducts] = useState<string[]>(['', '', '', '']);
  const [slotAge, setSlotAgeState] = useState<AgeFilter>('0-1');
  const [slotCount, setSlotCount] = useState(0);

  const refreshSlots = useCallback(async () => {
    try {
      const [products, age, count] = await Promise.all([
        getSlotProducts(),
        getSlotAge(),
        getSlotCount(),
      ]);
      setSlotProducts(products);
      setSlotAgeState(age);
      setSlotCount(count);
    } catch (err) {
      console.error('SlotContext refreshSlots error:', err);
    }
  }, []);

  // Load initial state
  useEffect(() => {
    refreshSlots();
  }, [refreshSlots]);

  const addProduct = useCallback(async (productId: string): Promise<boolean> => {
    try {
      const success = await storageAddProduct(productId);
      if (success) {
        await refreshSlots();
      }
      return success;
    } catch (err) {
      console.error('SlotContext addProduct error:', err);
      return false;
    }
  }, [refreshSlots]);

  const removeProduct = useCallback(async (productId: string): Promise<void> => {
    try {
      await storageRemoveProduct(productId);
      await refreshSlots();
    } catch (err) {
      console.error('SlotContext removeProduct error:', err);
    }
  }, [refreshSlots]);

  const setSlotAge = useCallback(async (age: AgeFilter): Promise<void> => {
    try {
      await storageSetSlotAge(age);
      setSlotAgeState(age);
    } catch (err) {
      console.error('SlotContext setSlotAge error:', err);
    }
  }, []);

  const isProductInSlot = useCallback((productId: string): boolean => {
    return slotProducts.includes(productId);
  }, [slotProducts]);

  const value: SlotContextType = {
    slotProducts,
    slotAge,
    slotCount,
    addProduct,
    removeProduct,
    setSlotAge,
    isProductInSlot,
    refreshSlots,
  };

  return (
    <SlotContext.Provider value={value}>
      {children}
    </SlotContext.Provider>
  );
}

export function useSlot(): SlotContextType {
  const context = useContext(SlotContext);
  if (context === undefined) {
    throw new Error('useSlot must be used within a SlotProvider');
  }
  return context;
}