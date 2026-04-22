import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Product, getProductImageUrl } from '@/lib/api';
import { Haptics } from '@/lib/haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BRAND_COLOR = '#5D4037';
const BRAND_COLOR_LIGHT = '#5D403715';

interface ProductPreviewSheetProps {
  product: Product | null;
  isVisible: boolean;
  onClose: () => void;
  onViewDetails: () => void;
  onFavoriteToggle: () => void;
  isFavorited: boolean;
}

/**
 * ProductPreviewSheet - Soul-style product preview with expo-blur backdrop
 *
 * Features:
 * - @gorhom/bottom-sheet with 3 snap points
 * - expo-blur animated backdrop
 * - Product hero image with gradient overlay
 * - AI score breakdown
 * - Quick actions (Why This Pick, View Details, Favorite)
 */
export default function ProductPreviewSheet({
  product,
  isVisible,
  onClose,
  onViewDetails,
  onFavoriteToggle,
  isFavorited,
}: ProductPreviewSheetProps) {
  const router = useRouter();
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  // Snap points: 35% (peek), 60% (half), 95% (full)
  const snapPoints = useMemo(() => ['35%', '60%', '95%'], []);

  // Animate sheet visibility
  React.useEffect(() => {
    if (isVisible && product) {
      bottomSheetRef.current?.snapToIndex(1); // Snap to 60%
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible, product]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  const handleViewDetails = () => {
    Haptics.medium();
    onViewDetails();
    bottomSheetRef.current?.close();
  };

  const handleFavorite = () => {
    Haptics.success();
    onFavoriteToggle();
  };

  const handleWhyThisPick = () => {
    Haptics.light();
    // Could open a modal explaining the recommendation
  };

  // Custom backdrop with blur
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        style={styles.backdrop}
      />
    ),
    []
  );

  if (!product) return null;

  const imageUrl = getProductImageUrl(product.id);
  const score = parseFloat(product.base_score);
  const price = product.scraped_price;
  const ageMin = parseFloat(String(product.age_min_yr));
  const ageMax = parseFloat(String(product.age_max_yr));
  const ageLabel = ageMin >= ageMax ? `${ageMax}+ yr` : `${ageMin}-${ageMax} yr`;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      enablePanDownToClose
    >
      <BottomSheetScrollView style={styles.content}>
        {/* Product Hero Image */}
        <View style={styles.heroContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <View style={styles.heroPlaceholder}>
              <Text style={styles.heroEmoji}>🧸</Text>
            </View>
          )}
          {/* Gradient overlay */}
          <View style={styles.heroGradient} />
        </View>

        {/* Product Info */}
        <View style={styles.infoSection}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name_display}
          </Text>
          <Text style={styles.brandName}>{product.brand_name}</Text>

          {/* Score + Price Row */}
          <View style={styles.scorePriceRow}>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreLabel}>AI Score</Text>
              <Text style={styles.scoreValue}>{score.toFixed(1)}</Text>
            </View>
            {price && <Text style={styles.price}>${price}</Text>}
          </View>

          {/* Age Badge */}
          <View style={styles.ageBadge}>
            <Text style={styles.ageText}>Ages {ageLabel}</Text>
          </View>

          {/* Categories */}
          {product.product_category && product.product_category.length > 0 && (
            <View style={styles.categoryRow}>
              {product.product_category.slice(0, 3).map((cat, i) => (
                <View key={i} style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{cat}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <Pressable style={styles.whyButton} onPress={handleWhyThisPick}>
            <Text style={styles.whyButtonText}>🤔 Why This Pick?</Text>
          </Pressable>

          <View style={styles.primaryActions}>
            <Pressable
              style={[styles.favoriteButton, isFavorited && styles.favoriteButtonActive]}
              onPress={handleFavorite}
            >
              <Text style={styles.favoriteIcon}>{isFavorited ? '❤️' : '🤍'}</Text>
              <Text style={[styles.favoriteText, isFavorited && styles.favoriteTextActive]}>
                {isFavorited ? 'Saved' : 'Save'}
              </Text>
            </Pressable>

            <Pressable style={styles.detailsButton} onPress={handleViewDetails}>
              <Text style={styles.detailsButtonText}>View Full Details →</Text>
            </Pressable>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleIndicator: {
    backgroundColor: '#D1D5DB',
    width: 40,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    flex: 1,
  },
  // Hero Section
  heroContainer: {
    height: 200,
    backgroundColor: '#F5F5F4',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: {
    fontSize: 80,
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  // Info Section
  infoSection: {
    padding: 20,
  },
  productName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1917',
    fontFamily: 'PlayfairDisplay_700Bold',
    lineHeight: 28,
  },
  brandName: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  scorePriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  scoreBadge: {
    backgroundColor: BRAND_COLOR_LIGHT,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '700',
    color: BRAND_COLOR,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1917',
  },
  ageBadge: {
    backgroundColor: '#F1F5F9',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 12,
  },
  ageText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  categoryBadge: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  categoryText: {
    fontSize: 12,
    color: '#64748B',
  },
  // Action Section
  actionSection: {
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  whyButton: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  whyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  primaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 6,
  },
  favoriteButtonActive: {
    backgroundColor: '#FEE2E2',
  },
  favoriteIcon: {
    fontSize: 18,
  },
  favoriteText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#991B1B',
  },
  favoriteTextActive: {
    color: '#DC2626',
  },
  detailsButton: {
    flex: 1,
    backgroundColor: BRAND_COLOR,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
