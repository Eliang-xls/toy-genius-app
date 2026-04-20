import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Product } from '../../lib/api';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

function getAgeBadgeColor(ageMin: number, ageMax: number): string {
  if (ageMax <= 1) return 'bg-age-0-1';
  if (ageMax <= 3) return 'bg-age-1-3';
  if (ageMax <= 5) return 'bg-age-3-5';
  if (ageMax <= 8) return 'bg-age-5-8';
  return 'bg-age-8+';
}

function getAgeBadgeLabel(ageMin: number, ageMax: number): string {
  if (ageMax <= 1) return '0-1yr';
  if (ageMax <= 3) return '1-3yr';
  if (ageMax <= 5) return '3-5yr';
  if (ageMax <= 8) return '5-8yr';
  return '8+yr';
}

export default function ProductCard({ product, onPress }: ProductCardProps) {
  const ageMin = parseFloat(String(product.age_min_yr));
  const ageMax = parseFloat(String(product.age_max_yr));
  const score = parseFloat(product.base_score);
  const price = product.scraped_price;

  return (
    <Pressable
      onPress={onPress}
      className="w-[48%] mb-3 bg-white rounded-card overflow-hidden"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      {/* Image placeholder */}
      <View className="w-full h-[140px] bg-gray-100 items-center justify-center">
        <Text className="text-3xl">🧸</Text>
      </View>

      {/* Product Info */}
      <View className="px-2 pt-2">
        <Text
          className="text-body-md text-text font-body"
          numberOfLines={2}
        >
          {product.name_display}
        </Text>
      </View>

      {/* Score + Price Row */}
      <View className="flex-row justify-between items-center px-2 py-1">
        <View className="bg-primary/10 rounded-full px-2 py-0.5">
          <Text className="text-label text-primary font-label">
            ⭐ {score.toFixed(1)}
          </Text>
        </View>
        {price && (
          <Text className="text-body-md text-text-secondary font-body">
            ${price}
          </Text>
        )}
      </View>

      {/* Age Badge */}
      <View className="mx-2 mb-2">
        <View className={`${getAgeBadgeColor(ageMin, ageMax)} rounded-full px-2 py-0.5 self-start`}>
          <Text className="text-label text-white font-label">
            {getAgeBadgeLabel(ageMin, ageMax)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
