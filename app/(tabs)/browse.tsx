import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import ProductCard from '@/components/ProductCard';
import { fetchProducts, Product, AgeFilter } from '@/lib/api';
import { useSlot } from '@/lib/contexts/SlotContext';

const AGE_FILTERS: { label: string; value: AgeFilter }[] = [
  { label: 'All', value: 'all' },
  { label: '0-1', value: '0-1' },
  { label: '1-3', value: '1-3' },
  { label: '3-5', value: '3-5' },
  { label: '5-8', value: '5-8' },
  { label: '8+', value: '8+' },
];

export default function BrowseScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [activeFilter, setActiveFilter] = useState<AgeFilter>('all');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { slotCount, addProduct, isProductInSlot } = useSlot();

  const loadProducts = useCallback(async (filter: AgeFilter, currentOffset: number, append: boolean) => {
    try {
      setError(null);
      const data = await fetchProducts(filter, currentOffset, 20);

      if (data.length < 20) setHasMore(false);
      if (append) {
        setProducts(prev => [...prev, ...data]);
      } else {
        setProducts(data);
      }
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error('Load products error:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setOffset(0);
    setHasMore(true);
    loadProducts(activeFilter, 0, false);
  }, [activeFilter, loadProducts]);

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const newOffset = offset + 20;
    setOffset(newOffset);
    loadProducts(activeFilter, newOffset, true);
  };

  const handleFilterChange = (filter: AgeFilter) => {
    if (filter === activeFilter) return;
    setActiveFilter(filter);
    setProducts([]);
  };

  const handleAddToSlot = async (productId: string) => {
    // Check if already in slot
    if (isProductInSlot(productId)) {
      Alert.alert('Already in Slot', 'This toy is already in your slot.', [{ text: 'OK' }]);
      return;
    }
    
    // Check if slots full
    if (slotCount >= 4) {
      Alert.alert(
        'Slots Full',
        'You have 4 toys in your slots. Remove one first.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Go to Slots', onPress: () => router.push('/(tabs)/slot') },
        ]
      );
      return;
    }
    
    // Attempt to add
    const success = await addProduct(productId);
    if (success) {
      // Show success feedback (optional haptic)
      // For now, just console.log
      console.log(`Product ${productId} added to slot`);
    } else {
      // Fallback error
      Alert.alert('Error', 'Could not add toy to slot. Please try again.', [{ text: 'OK' }]);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator size="large" color="#A16207" />
        <Text className="mt-4 text-body-md text-text-secondary">Loading toys...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-surface px-8">
        <Text className="text-4xl mb-4">😵</Text>
        <Text className="text-headline-sm text-text mb-2">{error}</Text>
        <Pressable
          onPress={() => loadProducts(activeFilter, 0, false)}
          className="bg-primary rounded-button px-6 py-3 mt-4"
        >
          <Text className="text-white font-label">Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface">
      {/* Age Stage Filter + Slot Indicator */}
      <View className="h-11 px-4 flex-row items-center gap-2">
        {/* Slot Indicator */}
        <View className="bg-accent rounded-full px-2 py-1">
          <Text className="text-xs text-white font-label">
            Slots: {slotCount}/4
          </Text>
        </View>
        {AGE_FILTERS.map(f => (
          <Pressable
            key={f.value}
            onPress={() => handleFilterChange(f.value)}
            className={`rounded-full px-4 py-2 ${
              activeFilter === f.value ? 'bg-primary' : 'bg-surface-dark'
            }`}
          >
            <Text
              className={`text-label font-label ${
                activeFilter === f.value ? 'text-white' : 'text-text-secondary'
              }`}
            >
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Product Grid */}
      <FlatList
        data={products}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'flex-start', paddingHorizontal: 16, gap: 12 }}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 80 }}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => router.push(`/detail/${item.id}`)}
            showAddToSlot={slotCount < 4 && !isProductInSlot(item.id)}
            onAddToSlot={handleAddToSlot}
          />
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-4xl mb-4">🔍</Text>
            <Text className="text-headline-sm text-text-secondary">
              No toys found for this age
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
    </View>
  );
}
