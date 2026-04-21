import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Product, getProductImageUrl } from '@/lib/api';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  isFavorited?: boolean;
  onFavoriteToggle?: () => void;
  showAddToSlot?: boolean;
  onAddToSlot?: (productId: string) => void;
}

function getAgeBadgeColor(_ageMin: number, ageMax: number): string {
  if (ageMax <= 1) return 'bg-age-0-1';
  if (ageMax <= 3) return 'bg-age-1-3';
  if (ageMax <= 5) return 'bg-age-3-5';
  if (ageMax <= 8) return 'bg-age-5-8';
  return 'bg-age-8+';
}

function getAgeBadgeLabel(ageMin: number, ageMax: number): string {
  if (ageMax <= 1) return '0-1yr';
  if (ageMax <= 3) return '1-3yr';
  if (ageMax <= 5) return ageMin >= ageMax ? '5yr' : '3-5yr';
  if (ageMax <= 8) return ageMin >= ageMax ? '6-8yr' : '5-8yr';
  return ageMin >= ageMax ? `${ageMin}+yr` : '8+yr';
}

export default function ProductCard({ product, onPress, isFavorited = false, onFavoriteToggle, showAddToSlot = false, onAddToSlot }: ProductCardProps) {
  const ageMin = parseFloat(String(product.age_min_yr));
  const ageMax = parseFloat(String(product.age_max_yr));
  const score = parseFloat(product.base_score);
  const price = product.scraped_price;
  const imageUrl = getProductImageUrl(product.id);

  return (
    <Pressable
      onPress={onPress}
      className="flex-1 mb-3 bg-white rounded-card overflow-hidden"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      {/* Image area with overlay badges — F1 + F6 */}
      <View className="w-full h-[140px] bg-gray-100 relative">
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-full"
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full items-center justify-center">
            <Text className="text-3xl">🧸</Text>
          </View>
        )}

        {/* Favorite button — overlay top-right */}
        {onFavoriteToggle && (
          <Pressable
            onPress={onFavoriteToggle}
            hitSlop={8}
            className="absolute top-2 right-2 z-10 bg-white/90 rounded-full p-1.5"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.15,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <Text className="text-base">{isFavorited ? '❤️' : '🤍'}</Text>
          </Pressable>
        )}

        {/* AI Score badge — overlay top-left — F5 */}
        <View
          className="absolute top-2 left-2 bg-white/90 rounded-full px-2 py-1 flex-row items-center"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.15,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <Text className="text-xs text-text-muted font-label">AI</Text>
          <Text className="text-xs text-primary font-label ml-0.5">
            {score.toFixed(1)}
          </Text>
        </View>

        {/* Age badge — overlay bottom-right */}
        <View
          className={`absolute bottom-2 right-2 rounded-full px-2 py-1 ${getAgeBadgeColor(ageMin, ageMax)}`}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.15,
            shadowRadius: 1,
            elevation: 2,
          }}
        >
          <Text className="text-xs text-white font-label">
            {getAgeBadgeLabel(ageMin, ageMax)}
          </Text>
        </View>

        {/* Add-to-Slot overlay — overlay bottom-left */}
        {showAddToSlot && onAddToSlot && (
          <Pressable
            onPress={() => onAddToSlot(product.id)}
            hitSlop={8}
            className="absolute bottom-2 left-2 z-10 bg-accent rounded-full w-6 h-6 items-center justify-center"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.15,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <Text className="text-white text-xs font-bold">+</Text>
          </Pressable>
        )}
      </View>

      {/* Product info below image */}
      <View className="px-2 pt-2 pb-2">
        <Text
          className="text-body-md text-text font-body"
          numberOfLines={2}
        >
          {product.name_display}
        </Text>
        {price && (
          <Text className="text-body-sm text-text-secondary font-body mt-0.5">
            ${price}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
