import React, { useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import { FlashList } from '@shopify/flash-list';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Product, getProductImageUrl } from '@/lib/api';
import { Haptics } from '@/lib/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Brand colors
const BRAND_COLOR = '#5D4037';
const BRAND_COLOR_LIGHT = '#5D403715';

// Spring configs for animations
const SPRING_CONFIG = {
  damping: 15,
  stiffness: 300,
  mass: 0.8,
};

const PRESS_SPRING = {
  damping: 12,
  stiffness: 400,
};

interface DiscoverGridProps {
  products: Product[];
  columns?: number;
  spacing?: number;
  onProductPress: (productId: string) => void;
  onProductLongPress: (productId: string) => void;
  selectedProductId?: string | null;
  onRefresh?: () => void;
  refreshing?: boolean;
  ListEmptyComponent?: React.ReactElement;
}

interface GridItemProps {
  product: Product;
  itemWidth: number;
  spacing: number;
  onPress: (productId: string) => void;
  onLongPress: (productId: string) => void;
  isSelected: boolean;
}

/**
 * Individual grid item with Reanimated-powered press animations
 * 
 * Features:
 * - Spring-based scale animation (UI thread)
 * - Long press detection with haptics
 * - Selected state with gold border + glow
 * - Press in/out animations
 */
function GridItem({ product, itemWidth, spacing, onPress, onLongPress, isSelected }: GridItemProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const imageUrl = getProductImageUrl(product.id);
  const score = parseFloat(product.base_score);
  const price = product.scraped_price;

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const selectedStyle = useAnimatedStyle(() => ({
    borderWidth: isSelected ? 2 : 0,
    borderColor: BRAND_COLOR,
    shadowOpacity: isSelected ? 0.2 : 0.08,
    shadowRadius: isSelected ? 12 : 8,
  }));

  // Gesture handlers
  const handlePressIn = () => {
    scale.value = withSpring(0.95, PRESS_SPRING);
    Haptics.light();
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, SPRING_CONFIG);
  };

  const handlePress = () => {
    Haptics.medium();
    onPress(product.id);
  };

  const handleLongPress = () => {
    // Scale down more for long press
    scale.value = withSpring(0.92, SPRING_CONFIG);
    opacity.value = withTiming(0.8, { duration: 100 });
    Haptics.heavy();
    onLongPress(product.id);
    
    // Reset after short delay
    setTimeout(() => {
      scale.value = withSpring(1, SPRING_CONFIG);
      opacity.value = withTiming(1, { duration: 200 });
    }, 300);
  };

  // Combined gesture
  const longPressGesture = Gesture.LongPress()
    .minDuration(500)
    .onBegin(() => {
      runOnJS(handleLongPress)();
    });

  const tapGesture = Gesture.Tap()
    .onTouchesDown(() => {
      runOnJS(handlePressIn)();
    })
    .onTouchesUp(() => {
      runOnJS(handlePressOut)();
      runOnJS(handlePress)();
    });

  const composedGesture = Gesture.Race(longPressGesture, tapGesture);

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[
          styles.gridItem,
          {
            width: itemWidth,
            marginBottom: spacing,
          },
          animatedStyle,
          selectedStyle,
          isSelected && styles.gridItemSelected,
        ]}
      >
        {/* Image Area */}
        <View style={[styles.imageContainer, { height: itemWidth * 0.9 }]}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderEmoji}>🧸</Text>
            </View>
          )}

          {/* AI Score Badge - top left */}
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreLabel}>AI</Text>
            <Text style={styles.scoreValue}>{score.toFixed(1)}</Text>
          </View>

          {/* Selected glow effect */}
          {isSelected && (
            <View style={styles.selectedOverlay} />
          )}
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name_display}
          </Text>
          {price && <Text style={styles.price}>${price}</Text>}
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

/**
 * DiscoverGrid - Premium m×n grid with Soul-style interactions
 * 
 * Upgrades:
 * - Reanimated 4 for 60fps animations
 * - Gesture handler for press/long-press
 * - Haptic feedback integration
 * - Long-press triggers product preview
 */
export default function DiscoverGrid({
  products,
  columns = 3,
  spacing = 12,
  onProductPress,
  onProductLongPress,
  selectedProductId = null,
  onRefresh,
  refreshing = false,
  ListEmptyComponent,
}: DiscoverGridProps) {
  const itemWidth = (SCREEN_WIDTH - spacing * (columns + 1)) / columns;

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <View style={{ marginLeft: spacing }}>
        <GridItem
          product={item}
          itemWidth={itemWidth}
          spacing={0}
          onPress={onProductPress}
          onLongPress={onProductLongPress}
          isSelected={selectedProductId === item.id}
        />
      </View>
    ),
    [itemWidth, spacing, onProductPress, onProductLongPress, selectedProductId]
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlashList
        data={products}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={columns}
        contentContainerStyle={[styles.listContent, { padding: spacing }]}
        showsVerticalScrollIndicator={false}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListEmptyComponent={ListEmptyComponent}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  gridItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  gridItemSelected: {
    shadowColor: BRAND_COLOR,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  imageContainer: {
    backgroundColor: '#F5F5F4',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: {
    fontSize: 48,
  },
  scoreBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  scoreLabel: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '500',
  },
  scoreValue: {
    fontSize: 9,
    color: BRAND_COLOR,
    fontWeight: '600',
    marginLeft: 2,
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 3,
    borderColor: BRAND_COLOR,
    borderRadius: 0,
  },
  infoContainer: {
    padding: 8,
  },
  productName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1C1917',
    lineHeight: 14,
  },
  price: {
    fontSize: 12,
    fontWeight: '700',
    color: BRAND_COLOR,
    marginTop: 4,
  },
});
