import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  Modal,
  FlatList,
  ActivityIndicator,
  Alert,
  ScrollView,
  SafeAreaView,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchProducts, Product, AgeFilter, getProductImageUrl } from '@/lib/api';
import { Icon } from '@/components/Icon';

// ─── Constants ───────────────────────────────────────────────────────────────

const STORAGE_KEY_AGE = '@toygenius:slot_age';
const STORAGE_KEY_PRODUCTS = '@toygenius:slot_products';
const SLOT_COUNT = 4;

const AGE_OPTIONS: { label: string; value: AgeFilter }[] = [
  { label: '0-1', value: '0-1' },
  { label: '1-3', value: '1-3' },
  { label: '3-5', value: '3-5' },
  { label: '5-8', value: '5-8' },
  { label: '8+', value: '8+' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Parse the 8 dimension scores from a product */
function get8DScores(p: Product): number[] {
  return [
    parseFloat(p.d_safety),
    parseFloat(p.d_education),
    parseFloat(p.d_sensory),
    parseFloat(p.d_motor),
    parseFloat(p.d_language),
    parseFloat(p.d_creativity),
    parseFloat(p.d_science),
    parseFloat(p.d_emotions),
  ];
}

/** Standard deviation of an array of numbers */
function stddev(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

/** Compute the combo score components from filled products */
function computeComboScore(products: (Product | null)[]): {
  balance: number;
  diversity: number;
  safety: number;
  combo: number;
} {
  const filled = products.filter((p): p is Product => p !== null);
  if (filled.length === 0) {
    return { balance: 0, diversity: 0, safety: 0, combo: 0 };
  }

  // Balance: 1 - stddev(avg_8d_scores_per_product) / 1.0
  // We compute stddev across the per-product average 8D scores
  const perProductAvg = filled.map(p => {
    const scores = get8DScores(p);
    return scores.reduce((s, v) => s + v, 0) / scores.length;
  });
  const balance = Math.max(0, 1 - stddev(perProductAvg) / 1.0);

  // Diversity: unique categories / 4
  const allCategories = new Set<string>();
  filled.forEach(p => p.product_category.forEach(c => allCategories.add(c)));
  const diversity = allCategories.size / SLOT_COUNT;

  // Safety: avg(d_safety) / 5.0
  const avgSafety =
    filled.reduce((s, p) => s + parseFloat(p.d_safety), 0) / filled.length;
  const safety = Math.min(1, avgSafety / 5.0);

  // Weighted combo
  const combo = balance * 0.3 + diversity * 0.3 + safety * 0.4;

  return {
    balance: Math.round(balance * 100),
    diversity: Math.round(diversity * 100),
    safety: Math.round(safety * 100),
    combo: Math.round(combo * 100),
  };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Single empty or filled slot box */
function SlotBox({
  product,
  index,
  onPress,
  onLongPress,
}: {
  product: Product | null;
  index: number;
  onPress: () => void;
  onLongPress?: () => void;
}) {
  const imageUrl = product ? getProductImageUrl(product.id) : null;
  const score = product ? parseFloat(product.base_score) : 0;
  
  // Pulse animation for empty slots
  const scale = React.useRef(new Animated.Value(1)).current;
  
  React.useEffect(() => {
    if (!product) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [product, scale]);

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className="flex-1 items-center"
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }]}
    >
      <View
        className="w-full aspect-square rounded-card overflow-hidden items-center justify-center"
        style={{
          backgroundColor: product ? '#FFFFFF' : '#F5F5F4',
          borderWidth: product ? 0 : 2,
          borderColor: product ? 'transparent' : '#D1D5DB',
          borderStyle: 'dashed',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: product ? 0.15 : 0,
          shadowRadius: 2,
          elevation: product ? 2 : 0,
        }}
      >
        {product && imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-full"
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            resizeMode="cover"
          />
        ) : product ? (
          <View className="w-full h-full items-center justify-center bg-surface-alt">
            <Text className="text-3xl">🧸</Text>
          </View>
        ) : (
          // Empty slot placeholder
          <Animated.View 
            className="items-center justify-center"
            style={{ transform: [{ scale }] }}
          >
            <View className="w-10 h-10 rounded-full bg-accent items-center justify-center mb-1">
              <Icon name="slot_add" size="sm" accessibilityLabel="Add toy to slot" />
            </View>
            <Text className="text-label text-text-muted font-body">Add Toy</Text>
          </Animated.View>
        )}

        {/* Score badge for filled slots */}
        {product && (
          <View
            className="absolute top-1.5 right-1.5 bg-white/90 rounded-full px-1.5 py-0.5 flex-row items-center"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.15,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <Text className="text-[10px] text-text-muted font-body">AI</Text>
            <Text className="text-[10px] text-accent font-body ml-0.5">
              {score.toFixed(1)}
            </Text>
          </View>
        )}
      </View>

      {/* Product name below slot */}
      {product ? (
        <Text
          className="text-label text-text font-body mt-1.5 text-center"
          numberOfLines={2}
        >
          {product.name_display}
        </Text>
      ) : (
        <Text className="text-label text-transparent mt-1.5">-</Text>
      )}
    </Pressable>
  );
}

/** Age range chip */
function AgeChip({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full px-4 py-2 ${
        isActive ? 'bg-primary' : 'bg-surface-dark'
      }`}
    >
      <Text
        className={`text-body-md font-body ${
          isActive ? 'text-white' : 'text-text-secondary'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/** Combo score card */
function ComboScoreCard({
  balance,
  diversity,
  safety,
  combo,
  filledCount,
}: {
  balance: number;
  diversity: number;
  safety: number;
  combo: number;
  filledCount: number;
}) {
  if (filledCount === 0) return null;

  return (
    <View
      className="mx-4 mt-4 p-4 bg-white rounded-card"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-headline-sm text-text font-headline">Combo Score</Text>
        <View className="flex-row items-baseline">
          <Text className="text-headline-lg text-accent font-headline">{combo}</Text>
          <Text className="text-body-md text-text-secondary font-body">/100</Text>
        </View>
      </View>

      {/* Score bar */}
      <View className="h-2.5 bg-surface-dark rounded-full overflow-hidden mb-3">
        <View
          className="h-full rounded-full"
          style={{
            width: `${combo}%`,
            backgroundColor: combo >= 70 ? '#059669' : combo >= 40 ? '#D97706' : '#DC2626',
          }}
        />
      </View>

      {/* Sub-scores */}
      <View className="flex-row justify-between">
        <View className="items-center flex-1">
          <Text className="text-label text-text-muted font-body">⚖️ Balance</Text>
          <Text 
            className="text-body-md font-body mt-0.5"
            style={{ color: balance >= 70 ? '#059669' : balance >= 40 ? '#D97706' : '#DC2626' }}
          >
            {balance}%
          </Text>
        </View>
        <View className="items-center flex-1 border-x border-surface-dark">
          <Text className="text-label text-text-muted font-body">🎨 Diversity</Text>
          <Text 
            className="text-body-md font-body mt-0.5"
            style={{ color: diversity >= 70 ? '#059669' : diversity >= 40 ? '#D97706' : '#DC2626' }}
          >
            {diversity}%
          </Text>
        </View>
        <View className="items-center flex-1">
          <Text className="text-label text-text-muted font-body">🛡️ Safety</Text>
          <Text 
            className="text-body-md font-body mt-0.5"
            style={{ color: safety >= 70 ? '#059669' : safety >= 40 ? '#D97706' : '#DC2626' }}
          >
            {safety}%
          </Text>
        </View>
      </View>
    </View>
  );
}

/** Product picker modal */
function ProductPickerModal({
  visible,
  ageFilter,
  onClose,
  onSelect,
  existingIds,
}: {
  visible: boolean;
  ageFilter: AgeFilter;
  onClose: () => void;
  onSelect: (product: Product) => void;
  existingIds: Set<string>;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadProducts = useCallback(
    async (currentOffset: number, append: boolean) => {
      try {
        const data = await fetchProducts(ageFilter, currentOffset, 20);
        if (data.length < 20) setHasMore(false);
        if (append) {
          setProducts(prev => [...prev, ...data]);
        } else {
          setProducts(data);
        }
      } catch (err) {
        console.error('Picker load error:', err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [ageFilter]
  );

  useEffect(() => {
    if (visible) {
      setLoading(true);
      setOffset(0);
      setHasMore(true);
      loadProducts(0, false);
    }
  }, [visible, loadProducts]);

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const newOffset = offset + 20;
    setOffset(newOffset);
    loadProducts(newOffset, true);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView className="flex-1 bg-surface">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-surface-dark">
          <Text className="text-headline-sm text-text font-headline">Select a Toy</Text>
          <Pressable onPress={onClose} className="px-3 py-1">
            <Text className="text-body-md text-accent font-body">Cancel</Text>
          </Pressable>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#5D4037" />
            <Text className="mt-4 text-body-md text-text-secondary">
              Loading toys...
            </Text>
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: 'flex-start',
              paddingHorizontal: 16,
              gap: 12,
            }}
            contentContainerStyle={{ paddingTop: 12, paddingBottom: 32 }}
            renderItem={({ item }) => {
              const isSelected = existingIds.has(item.id);
              const imageUrl = getProductImageUrl(item.id);
              const score = parseFloat(item.base_score);

              return (
                <Pressable
                  onPress={() => !isSelected && onSelect(item)}
                  disabled={isSelected}
                  className="flex-1 mb-3 bg-white rounded-card overflow-hidden"
                  style={{
                    opacity: isSelected ? 0.4 : 1,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                >
                  <View className="w-full h-[120px] bg-gray-100 relative">
                    {imageUrl ? (
                      <Image
                        source={{ uri: imageUrl }}
                        className="w-full h-full"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                        }}
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="w-full h-full items-center justify-center">
                        <Text className="text-3xl">🧸</Text>
                      </View>
                    )}
                    <View className="absolute top-1.5 left-1.5 bg-white/90 rounded-full px-1.5 py-0.5 flex-row items-center">
                      <Text className="text-[10px] text-text-muted font-body">AI</Text>
                      <Text className="text-[10px] text-accent font-body ml-0.5">
                        {score.toFixed(1)}
                      </Text>
                    </View>
                    {isSelected && (
                      <View className="absolute inset-0 items-center justify-center bg-black/30">
                        <Text className="text-white text-label font-body">In Slot</Text>
                      </View>
                    )}
                  </View>
                  <View className="px-2 py-2">
                    <Text className="text-body-sm text-text font-body" numberOfLines={2}>
                      {item.name_display}
                    </Text>
                  </View>
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-20">
                <Text className="text-4xl mb-4">🔍</Text>
                <Text className="text-headline-sm text-text-secondary">
                  No toys found for this age range
                </Text>
              </View>
            }
            ListFooterComponent={
              hasMore ? (
                <Pressable
                  onPress={handleLoadMore}
                  className="bg-surface-alt rounded-button px-6 py-3 self-center my-4"
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <ActivityIndicator size="small" color="#6B7280" />
                  ) : (
                    <Text className="text-body-md text-text-secondary">Load More</Text>
                  )}
                </Pressable>
              ) : products.length > 0 ? (
                <Text className="text-center text-label text-text-muted py-4">
                  You've seen all {products.length} toys!
                </Text>
              ) : null
            }
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function SlotScreen() {
  const [ageFilter, setAgeFilter] = useState<AgeFilter>('3-5');
  const [slots, setSlots] = useState<(Product | null)[]>(Array(SLOT_COUNT).fill(null));
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Persistence ──────────────────────────────────────────────────────────

  /** Load saved state from AsyncStorage */
  useEffect(() => {
    (async () => {
      try {
        const [savedAge, savedProductsJson] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY_AGE),
          AsyncStorage.getItem(STORAGE_KEY_PRODUCTS),
        ]);

        if (savedAge) setAgeFilter(savedAge as AgeFilter);

        if (savedProductsJson) {
          const savedIds: string[] = JSON.parse(savedProductsJson);
          // We need to fetch product details for each saved ID
          // For now, we store full product objects in memory but only IDs in storage
          // Re-hydrate by fetching from the API
          if (savedIds.some(id => id !== '')) {
            try {
              const allProducts = await fetchProducts('all', 0, 200);
              const productMap = new Map(allProducts.map(p => [p.id, p]));
              const hydrated = savedIds.map(id =>
                id ? productMap.get(id) || null : null
              );
              setSlots(hydrated);
            } catch {
              // If re-hydration fails, keep empty slots
              console.warn('Failed to re-hydrate slot products');
            }
          }
        }
      } catch (err) {
        console.error('Failed to load slot state:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /** Save state to AsyncStorage on every change */
  const saveState = useCallback(
    async (newAge: AgeFilter, newSlots: (Product | null)[]) => {
      try {
        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEY_AGE, newAge),
          AsyncStorage.setItem(
            STORAGE_KEY_PRODUCTS,
            JSON.stringify(newSlots.map(p => p?.id || ''))
          ),
        ]);
      } catch (err) {
        console.error('Failed to save slot state:', err);
      }
    },
    []
  );

  // ── Actions ──────────────────────────────────────────────────────────────

  const handleAgeChange = useCallback(
    (newAge: AgeFilter) => {
      setAgeFilter(newAge);
      saveState(newAge, slots);
    },
    [slots, saveState]
  );

  const handleSlotPress = useCallback(
    (index: number) => {
      if (slots[index]) {
        // Filled slot — show remove confirmation
        const product = slots[index]!;
        Alert.alert(
          'Remove Toy',
          `Remove "${product.name_display}" from this slot?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Remove',
              style: 'destructive',
              onPress: () => {
                const newSlots = [...slots];
                newSlots[index] = null;
                setSlots(newSlots);
                saveState(ageFilter, newSlots);
              },
            },
          ]
        );
      } else {
        // Empty slot — open picker
        setActiveSlotIndex(index);
        setPickerOpen(true);
      }
    },
    [slots, ageFilter, saveState]
  );

  const handleProductSelect = useCallback(
    (product: Product) => {
      if (activeSlotIndex === null) return;
      const newSlots = [...slots];
      newSlots[activeSlotIndex] = product;
      setSlots(newSlots);
      saveState(ageFilter, newSlots);
      setPickerOpen(false);
      setActiveSlotIndex(null);
    },
    [activeSlotIndex, slots, ageFilter, saveState]
  );

  const handleClearAll = useCallback(() => {
    Alert.alert('Clear All Slots', 'Remove all toys from your slots?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear All',
        style: 'destructive',
        onPress: () => {
          const emptySlots = Array(SLOT_COUNT).fill(null);
          setSlots(emptySlots);
          saveState(ageFilter, emptySlots);
        },
      },
    ]);
  }, [ageFilter, saveState]);

  // ── Computed ─────────────────────────────────────────────────────────────

  const scores = useMemo(() => computeComboScore(slots), [slots]);
  const filledCount = useMemo(
    () => slots.filter(p => p !== null).length,
    [slots]
  );
  const existingProductIds = useMemo(
    () => new Set(slots.filter((p): p is Product => p !== null).map(p => p.id)),
    [slots]
  );

  // ── Render ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator size="large" color="#5D4037" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <View className="px-4 pt-4 pb-2 flex-row items-center justify-between">
          <View>
            <Text className="text-headline-md text-text font-headline">
              Slot Planner
            </Text>
            <Text className="text-body-sm text-text-secondary font-body mt-0.5">
              Build the perfect toy combo
            </Text>
          </View>
          {filledCount > 0 && (
            <Pressable onPress={handleClearAll} className="px-3 py-1.5">
              <Text className="text-body-sm text-danger font-body">Clear All</Text>
            </Pressable>
          )}
        </View>

        {/* Age Range Selector */}
        <View className="mt-2 mb-4">
          <Text className="text-label text-text-muted font-body px-4 mb-2">
            AGE RANGE
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          >
            {AGE_OPTIONS.map(opt => (
              <AgeChip
                key={opt.value}
                label={opt.label}
                isActive={ageFilter === opt.value}
                onPress={() => handleAgeChange(opt.value)}
              />
            ))}
          </ScrollView>
        </View>

        {/* 4 Slot Boxes */}
        <View className="px-4">
          <View className="flex-row gap-3">
            {slots.map((product, index) => (
              <SlotBox
                key={index}
                product={product}
                index={index}
                onPress={() => handleSlotPress(index)}
              />
            ))}
          </View>

          {/* Slot count indicator */}
          <View className="flex-row items-center justify-center mt-3">
            {Array.from({ length: SLOT_COUNT }).map((_, i) => (
              <View
                key={i}
                className={`w-2 h-2 rounded-full mx-1 ${
                  i < filledCount ? 'bg-accent' : 'bg-surface-dark'
                }`}
              />
            ))}
            <Text className="text-label text-text-muted font-body ml-2">
              {filledCount}/{SLOT_COUNT} filled
            </Text>
          </View>
        </View>

        {/* Combo Score Card */}
        <ComboScoreCard
          balance={scores.balance}
          diversity={scores.diversity}
          safety={scores.safety}
          combo={scores.combo}
          filledCount={filledCount}
        />

        {/* Empty state prompt */}
        {filledCount === 0 && (
          <View className="items-center mt-8 px-8">
            <Text className="text-4xl mb-3">🧩</Text>
            <Text className="text-headline-sm text-text text-center font-headline mb-1">
              Start Building Your Combo
            </Text>
            <Text className="text-body-md text-text-secondary text-center font-body mb-4">
              Tap any empty slot to add toys. We'll calculate how well they work
              together based on balance, diversity, and safety.
            </Text>
            <Pressable
              onPress={() => { setActiveSlotIndex(0); setPickerOpen(true); }}
              className="bg-primary rounded-button px-6 py-3"
            >
              <Text className="text-white font-label">Add your first toy</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* Product Picker Modal */}
      <ProductPickerModal
        visible={pickerOpen}
        ageFilter={ageFilter}
        onClose={() => {
          setPickerOpen(false);
          setActiveSlotIndex(null);
        }}
        onSelect={handleProductSelect}
        existingIds={existingProductIds}
      />
    </SafeAreaView>
  );
}
