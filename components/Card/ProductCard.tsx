// ProductCard - Product Display Card
// Design Spec: V0.3 - 12px radius, shadow, image area 140px
// Structure: Image -> Badges (overlay) -> Content area

import React from 'react';
import { Pressable, View, Text, Image } from 'react-native';
import { ScoreBadge } from '../Badge/ScoreBadge';
import { AgeBadge } from '../Badge/AgeBadge';
import { StatusBadge } from '../Badge/StatusBadge';
import { Icon } from '../Icon/Icon';
import type { ProductCardProps } from './Card.types';

export function ProductCard({
  product,
  onPress,
  isFavorited = false,
  onFavoriteToggle,
  showAddToSlot = false,
  onAddToSlot,
  status,
  style,
  testID,
}: ProductCardProps) {
  const handlePress = () => {
    onPress?.(product);
  };

  const handleFavoritePress = () => {
    onFavoriteToggle?.(product.id);
  };

  const handleAddToSlotPress = () => {
    onAddToSlot?.(product.id);
  };

  return (
    <Pressable
      onPress={handlePress}
      testID={testID}
      accessibilityLabel={`${product.name} product card`}
      className={`
        flex-1 mb-3 bg-white rounded-card overflow-hidden
      `}
      style={[
        {
          shadowColor: '#3E2723',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        },
        style,
      ]}
    >
      {/* Image area with overlay badges */}
      <View className="w-full h-[140px] bg-surface-muted relative">
        {product.imageUrl ? (
          <Image
            source={{ uri: product.imageUrl }}
            className="w-full h-full"
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full items-center justify-center">
            <Icon name="content/toy" size={32} />
          </View>
        )}

        {/* Favorite button - top-right */}
        {onFavoriteToggle && (
          <Pressable
            onPress={handleFavoritePress}
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
            <Icon 
              name={isFavorited ? "actions/heart" : "actions/heart-outline"} 
              size={24} 
              color={isFavorited ? "#5D4037" : "#5D4037"} 
            />
          </Pressable>
        )}

        {/* AI Score badge - top-left */}
        {product.score !== undefined && (
          <View className="absolute top-2 left-2">
            <ScoreBadge score={product.score} size="md" />
          </View>
        )}

        {/* Age badge - bottom-right */}
        {product.ageGroup && (
          <View className="absolute bottom-2 right-2">
            <AgeBadge ageGroup={product.ageGroup} size="md" />
          </View>
        )}

        {/* Add-to-Slot button - bottom-left */}
        {showAddToSlot && onAddToSlot && (
          <Pressable
            onPress={handleAddToSlotPress}
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

      {/* Content area */}
      <View className="px-2 pt-2 pb-2">
        {/* Product title - 2 lines max */}
        <Text
          className="text-body-md text-text font-body"
          numberOfLines={2}
        >
          {product.name}
        </Text>

        {/* Description (if provided) */}
        {product.description && (
          <Text
            className="text-body-sm text-text-muted font-body mt-0.5"
            numberOfLines={1}
          >
            {product.description}
          </Text>
        )}

        {/* Price row */}
        <View className="flex-row items-center justify-between mt-1">
          {product.price !== undefined && (
            <Text className="text-body-md text-text-secondary font-body font-semibold">
              {product.currency || '$'}{product.price}
            </Text>
          )}

          {/* Status badge */}
          {status && (
            <StatusBadge
              label={status.label}
              variant={status.variant}
              size="sm"
            />
          )}
        </View>
      </View>
    </Pressable>
  );
}

export default ProductCard;
