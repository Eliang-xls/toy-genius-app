import AsyncStorage from '@react-native-async-storage/async-storage';
import { AgeFilter } from './api';

const FAVORITES_KEY = '@toygenius:favorites';
const SLOT_AGE_KEY = '@toygenius:slot_age';
const SLOT_PRODUCTS_KEY = '@toygenius:slot_products';
const SLOT_COUNT = 4;

/**
 * Get all favorited product IDs from storage.
 */
export async function getFavorites(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch (err) {
    console.error('getFavorites error:', err);
    return [];
  }
}

/**
 * Add a product ID to favorites. No-op if already present.
 */
export async function addFavorite(id: string): Promise<void> {
  try {
    const favs = await getFavorites();
    if (favs.includes(id)) return;
    favs.push(id);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  } catch (err) {
    console.error('addFavorite error:', err);
  }
}

/**
 * Remove a product ID from favorites.
 */
export async function removeFavorite(id: string): Promise<void> {
  try {
    const favs = await getFavorites();
    const next = favs.filter(fid => fid !== id);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  } catch (err) {
    console.error('removeFavorite error:', err);
  }
}

/**
 * Check whether a product ID is currently favorited.
 */
export async function isFavorite(id: string): Promise<boolean> {
  try {
    const favs = await getFavorites();
    return favs.includes(id);
  } catch (err) {
    console.error('isFavorite error:', err);
    return false;
  }
}

// ─── Slot Functions ───────────────────────────────────────────────────────────

/**
 * Get current slot age filter.
 */
export async function getSlotAge(): Promise<AgeFilter> {
  try {
    const raw = await AsyncStorage.getItem(SLOT_AGE_KEY);
    if (!raw) return '0-1'; // default
    return raw as AgeFilter;
  } catch (err) {
    console.error('getSlotAge error:', err);
    return '0-1';
  }
}

/**
 * Set slot age filter.
 */
export async function setSlotAge(age: AgeFilter): Promise<void> {
  try {
    await AsyncStorage.setItem(SLOT_AGE_KEY, age);
  } catch (err) {
    console.error('setSlotAge error:', err);
  }
}

/**
 * Get current slot products (4 entries, empty string for empty slots).
 */
export async function getSlotProducts(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(SLOT_PRODUCTS_KEY);
    if (!raw) return ['', '', '', ''];
    const parsed = JSON.parse(raw) as string[];
    // Ensure length is 4
    while (parsed.length < SLOT_COUNT) parsed.push('');
    return parsed.slice(0, SLOT_COUNT);
  } catch (err) {
    console.error('getSlotProducts error:', err);
    return ['', '', '', ''];
  }
}

/**
 * Set slot products (internal use).
 */
async function setSlotProducts(products: string[]): Promise<void> {
  try {
    // Ensure exactly 4 entries
    const normalized = products.slice(0, SLOT_COUNT);
    while (normalized.length < SLOT_COUNT) normalized.push('');
    await AsyncStorage.setItem(SLOT_PRODUCTS_KEY, JSON.stringify(normalized));
  } catch (err) {
    console.error('setSlotProducts error:', err);
  }
}

/**
 * Add a product to the first empty slot.
 * Returns true if successful, false if product already in slot or slots full.
 */
export async function addProductToSlot(productId: string): Promise<boolean> {
  try {
    const slots = await getSlotProducts();
    // Check if already in slot
    if (slots.includes(productId)) return false;
    // Find first empty slot
    const emptyIndex = slots.findIndex(s => s === '');
    if (emptyIndex === -1) return false; // slots full
    slots[emptyIndex] = productId;
    await setSlotProducts(slots);
    return true;
  } catch (err) {
    console.error('addProductToSlot error:', err);
    return false;
  }
}

/**
 * Remove a product from slot (sets slot to empty string).
 */
export async function removeProductFromSlot(productId: string): Promise<void> {
  try {
    const slots = await getSlotProducts();
    const index = slots.indexOf(productId);
    if (index !== -1) {
      slots[index] = '';
      await setSlotProducts(slots);
    }
  } catch (err) {
    console.error('removeProductFromSlot error:', err);
  }
}

/**
 * Check if a product is already in any slot.
 */
export async function isProductInSlot(productId: string): Promise<boolean> {
  try {
    const slots = await getSlotProducts();
    return slots.includes(productId);
  } catch (err) {
    console.error('isProductInSlot error:', err);
    return false;
  }
}

/**
 * Get count of filled slots.
 */
export async function getSlotCount(): Promise<number> {
  try {
    const slots = await getSlotProducts();
    return slots.filter(s => s !== '').length;
  } catch (err) {
    console.error('getSlotCount error:', err);
    return 0;
  }
}
