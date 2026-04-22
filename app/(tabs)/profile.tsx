import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import ProductCard from '@/components/ProductCard';
import { Product, fetchProductDetail } from '@/lib/api';
import { getFavorites, removeFavorite } from '@/lib/storage';

export default function ProfileScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Reload favorites every time the tab gains focus
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favIds = await getFavorites();
      if (favIds.length === 0) {
        setProducts([]);
        return;
      }
      const results = await Promise.allSettled(
        favIds.map(id => fetchProductDetail(id))
      );
      const loaded = results
        .filter((r): r is PromiseFulfilledResult<Product | null> => r.status === 'fulfilled' && r.value !== null)
        .map(r => r.value!);
      setProducts(loaded);
    } catch (err) {
      console.error('loadFavorites error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (productId: string) => {
    await removeFavorite(productId);
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator size="large" color="#5D4037" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface">
      {/* Header */}
      <View className="px-4 pt-4 pb-2">
        <Text className="text-headline-md text-text font-headline">My Favorites</Text>
        {products.length > 0 && (
          <Text className="text-body-sm text-text-secondary mt-1">
            {products.length} saved {products.length === 1 ? 'toy' : 'toys'}
          </Text>
        )}
      </View>

      {/* Favorites Grid */}
      <FlatList
        data={products}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'flex-start', paddingHorizontal: 16, gap: 12 }}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 80 }}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => router.push(`/detail/${item.id}`)}
            isFavorited={true}
            onFavoriteToggle={() => handleToggleFavorite(item.id)}
          />
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20 px-8">
            <Text className="text-5xl mb-4">🤍</Text>
            <Text className="text-headline-sm text-text text-center mb-2">
              No favorites yet
            </Text>
            <Text className="text-body-md text-text-secondary text-center">
              Save toys you love by tapping ♡
            </Text>
          </View>
        }
      />
    </View>
  );
}
