import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchProductDetail, Product } from '@/lib/api';

// 8D score radar dimensions
const DIMENSIONS = [
  { key: 'd_safety', label: 'Safety', icon: '🛡️' },
  { key: 'd_education', label: 'Education', icon: '📚' },
  { key: 'd_sensory', label: 'Sensory', icon: '👁️' },
  { key: 'd_motor', label: 'Motor', icon: '🤲' },
  { key: 'd_language', label: 'Language', icon: '🗣️' },
  { key: 'd_creativity', label: 'Creativity', icon: '🎨' },
  { key: 'd_science', label: 'Science', icon: '🔬' },
  { key: 'd_emotions', label: 'Emotions', icon: '❤️' },
];

function getAgeBadgeLabel(ageMin: number, ageMax: number): string {
  if (ageMax <= 1) return '0-1yr';
  if (ageMax <= 3) return '1-3yr';
  if (ageMax <= 5) return '3-5yr';
  if (ageMax <= 8) return '5-8yr';
  return '8+yr';
}

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!id) return;
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProductDetail(id!);
      setProduct(data);
    } catch (err) {
      setError('Failed to load product details.');
      console.error('Detail error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator size="large" color="#A16207" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View className="flex-1 items-center justify-center bg-surface px-8">
        <Text className="text-4xl mb-4">😵</Text>
        <Text className="text-headline-sm text-text mb-2">{error || 'Product not found'}</Text>
        <Pressable onPress={() => router.back()} className="bg-primary rounded-button px-6 py-3 mt-4">
          <Text className="text-white font-label">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const score = parseFloat(product.base_score);
  const ageMin = parseFloat(String(product.age_min_yr));
  const ageMax = parseFloat(String(product.age_max_yr));

  return (
    <View className="flex-1 bg-surface">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Top Bar */}
        <View className="h-14 px-4 flex-row items-center justify-between">
          <Pressable onPress={() => router.back()} className="p-2">
            <Text className="text-xl">←</Text>
          </Pressable>
          <View className="flex-row gap-4">
            <Pressable onPress={() => setIsFavorite(!isFavorite)} className="p-2">
              <Text className="text-xl">{isFavorite ? '❤️' : '🤍'}</Text>
            </Pressable>
            <Pressable className="p-2">
              <Text className="text-xl">📤</Text>
            </Pressable>
          </View>
        </View>

        {/* Hero Image */}
        <View className="w-full h-[280px] bg-gray-100 items-center justify-center">
          <Text className="text-6xl">🧸</Text>
        </View>

        {/* Header Section */}
        <View className="px-4 py-4">
          <Text className="text-headline-md text-text font-headline">
            {product.name_display}
          </Text>
          <Text className="text-body-md text-text-secondary mt-1">
            {product.brand_name} • {getAgeBadgeLabel(ageMin, ageMax)}
          </Text>
          <View className="flex-row items-center justify-between mt-2">
            {product.scraped_price && (
              <Text className="text-headline-sm text-text font-headline">
                ${product.scraped_price}
              </Text>
            )}
            <View className="bg-primary/10 rounded-full px-3 py-1">
              <Text className="text-body-md text-primary font-label">
                ⭐ {score.toFixed(1)}/100
              </Text>
            </View>
          </View>
        </View>

        {/* 8D Score Section */}
        <View className="mx-4 p-4 bg-surface-alt rounded-card">
          <Text className="text-headline-sm text-text font-headline mb-3">
            AI Score Breakdown
          </Text>
          {DIMENSIONS.map(dim => {
            const val = parseFloat((product as any)[dim.key] || '0');
            const pct = Math.min(val / 5 * 100, 100);
            return (
              <View key={dim.key} className="flex-row items-center mb-2">
                <Text className="w-8 text-center">{dim.icon}</Text>
                <Text className="w-20 text-label text-text-secondary">{dim.label}</Text>
                <View className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
                  <View
                    className="h-2 bg-primary rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </View>
                <Text className="w-8 text-label text-text-secondary text-right">
                  {val.toFixed(1)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Safety Concerns */}
        {product.safety_concern && product.safety_concern.length > 0 && (
          <View className="mx-4 mt-4 p-4 bg-warning/10 rounded-card">
            <Text className="text-headline-sm text-text font-headline mb-2">
              ⚠️ Safety Notes
            </Text>
            {product.safety_concern.map((concern, i) => (
              <Text key={i} className="text-body-md text-text-secondary mb-1">
                • {concern}
              </Text>
            ))}
          </View>
        )}

        {/* Categories */}
        {product.product_category && product.product_category.length > 0 && (
          <View className="mx-4 mt-4">
            <Text className="text-headline-sm text-text font-headline mb-2">Categories</Text>
            <View className="flex-row flex-wrap gap-2">
              {product.product_category.map((cat, i) => (
                <View key={i} className="bg-surface-dark rounded-full px-3 py-1">
                  <Text className="text-label text-text-secondary">{cat}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Sticky Buy CTA */}
      <View className="absolute bottom-0 left-0 right-0 bg-white px-4 py-4 border-t border-gray-200">
        <Pressable
          onPress={() => Linking.openURL(`https://www.amazon.com/s?k=${encodeURIComponent(product.name_display)}`)}
          className="bg-primary rounded-button py-4 items-center"
        >
          <Text className="text-white text-body-lg font-headline">
            🛒 Buy on Amazon
          </Text>
        </Pressable>
        {product.scraped_price && (
          <Text className="text-center text-label text-text-muted mt-2">
            Price: ${product.scraped_price}
          </Text>
        )}
      </View>
    </View>
  );
}
