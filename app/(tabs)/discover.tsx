import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
  Animated,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase, Product, getProductImageUrl } from '@/lib/api';
import ViewToggle, { ViewMode } from '@/components/ViewToggle';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const GRID_COLUMNS = 2;
const GRID_ITEM_SPACING = 12;

// Daily Discover — Tinder + Feed Hybrid (R5-08)
export default function DiscoverScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState<string[]>([]);
  const [passed, setPassed] = useState<string[]>([]);
  const [imageError, setImageError] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('tinder');
  const [feedPage, setFeedPage] = useState(0);
  const [feedLoading, setFeedLoading] = useState(false);

  const translateX = useRef(new Animated.Value(0)).current;
  const rotate = translateX.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    setImageError(false);
  }, [currentIndex]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mv_product_browse')
        .select('*')
        .gte('base_score', '70')
        .order('base_score', { ascending: false })
        .limit(50);

      if (error) throw error;
      const shuffled = (data || []).sort(() => Math.random() - 0.5);
      setProducts(shuffled);
    } catch (err) {
      console.error('Load products error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = useCallback(
    (direction: 'left' | 'right') => {
      const product = products[currentIndex];
      if (!product) return;

      Animated.timing(translateX, {
        toValue: direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        if (direction === 'right') {
          setLiked(prev => [...prev, product.id]);
        } else {
          setPassed(prev => [...prev, product.id]);
        }
        setCurrentIndex(prev => prev + 1);
        translateX.setValue(0);
      });
    },
    [currentIndex, products]
  );

  const currentProduct = products[currentIndex];

  // Feed Item Component for Grid View
  const FeedItem = useCallback(({ item }: { item: Product }) => {
    const imageUrl = getProductImageUrl(item.id);
    const score = parseFloat(item.base_score);
    const isFav = liked.includes(item.id);

    return (
      <Pressable
        style={styles.feedItem}
        onPress={() => router.push(`/detail/${item.id}`)}
      >
        <View style={styles.feedImageContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.feedImage} resizeMode="cover" />
          ) : (
            <Text style={styles.feedEmoji}>🧸</Text>
          )}
          {isFav && (
            <View style={styles.feedFavBadge}>
              <Text>❤️</Text>
            </View>
          )}
        </View>
        <View style={styles.feedInfo}>
          <Text style={styles.feedName} numberOfLines={2}>{item.name_display}</Text>
          <Text style={styles.feedBrand} numberOfLines={1}>{item.brand_name}</Text>
          <View style={styles.feedScoreRow}>
            <Text style={styles.feedScore}>⭐ {score.toFixed(0)}</Text>
            {item.scraped_price && (
              <Text style={styles.feedPrice}>${item.scraped_price}</Text>
            )}
          </View>
        </View>
      </Pressable>
    );
  }, [liked]);

  // Feed View Component
  const FeedView = useCallback(() => {
    const feedProducts = products.slice(0, 30); // Show top 30 in feed

    return (
      <FlatList
        data={feedProducts}
        renderItem={({ item }) => <FeedItem item={item} />}
        keyExtractor={(item) => item.id}
        numColumns={GRID_COLUMNS}
        contentContainerStyle={styles.feedContainer}
        columnWrapperStyle={styles.feedRow}
        showsVerticalScrollIndicator={false}
        onRefresh={loadProducts}
        refreshing={feedLoading}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        }
      />
    );
  }, [products, FeedItem, feedLoading, loadProducts]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#A16207" />
        <Text style={styles.loadingText}>Curating your daily picks...</Text>
      </View>
    );
  }

  // Main render with ViewToggle
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <Text style={styles.headerSub}>
          {viewMode === 'tinder' ? 'Daily curated picks' : `Browse top ${products.length} toys`}
        </Text>
      </View>

      {/* View Toggle */}
      <ViewToggle mode={viewMode} onChange={setViewMode} />

      {/* Content */}
      {viewMode === 'tinder' ? (
        // Tinder Mode
        !currentProduct ? (
          <View style={styles.center}>
            <Text style={styles.emoji}>🎉</Text>
            <Text style={styles.doneTitle}>All caught up!</Text>
            <Text style={styles.doneSub}>
              You liked {liked.length} toys today
            </Text>
            <Pressable style={styles.refreshBtn} onPress={() => { setCurrentIndex(0); loadProducts(); }}>
              <Text style={styles.refreshText}>Refresh Picks</Text>
            </Pressable>
          </View>
        ) : (
          <TinderCard product={currentProduct} />
        )
      ) : (
        // Feed Mode
        <FeedView />
      )}
    </View>
  );
}

// Tinder Card Component (extracted from original)
function TinderCard({ product }: { product: Product }) {
  const [imageError, setImageError] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  
  // Animation setup
  const rotate = translateX.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    translateX.setValue(0);
  }, [product.id]);

  const handleSwipe = (direction: 'left' | 'right') => {
    Animated.timing(translateX, {
      toValue: direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Animation complete - parent handles state
      translateX.setValue(0);
    });
  };

  const imageUrl = getProductImageUrl(product.id);
  const score = parseFloat(product.base_score);
  const ageMin = parseFloat(String(product.age_min_yr));
  const ageMax = parseFloat(String(product.age_max_yr));
  const ageLabel = ageMin >= ageMax ? `${ageMax}+yr` : `${ageMin}-${ageMax}yr`;

  return (
    <>
      <Animated.View
        style={[
          styles.card,
          { transform: [{ translateX }, { rotate }] },
        ]}
      >
        {/* Product Hero */}
        <View style={styles.heroArea}>
          {imageUrl && !imageError ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.heroImage}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <Text style={styles.heroEmoji}>🧸</Text>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.infoArea}>
          <Text style={styles.productName}>{product.name_display}</Text>
          <Text style={styles.brandName}>
            {product.brand_name} • {ageLabel}
          </Text>

          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>⭐ {score.toFixed(1)}/100</Text>
          </View>

          {product.scraped_price && (
            <Text style={styles.price}>${product.scraped_price}</Text>
          )}

          {product.product_category && (
            <View style={styles.tagRow}>
              {product.product_category.slice(0, 3).map((cat, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{cat}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Animated.View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Pressable
          style={[styles.actionBtn, styles.passBtn]}
          onPress={() => handleSwipe('left')}
        >
          <Text style={styles.actionEmoji}>👋</Text>
          <Text style={styles.actionLabel}>Pass</Text>
        </Pressable>

        <Pressable
          style={[styles.actionBtn, styles.likeBtn]}
          onPress={() => handleSwipe('right')}
        >
          <Text style={styles.actionEmoji}>❤️</Text>
          <Text style={styles.actionLabel}>Like</Text>
        </Pressable>
      </View>

      <Text style={styles.whyText}>Why this pick? Tap card for details →</Text>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF9',
    paddingTop: 60,
  },
  center: {
    flex: 1,
    backgroundColor: '#FAFAF9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Inter',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  doneTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1917',
    fontFamily: 'PlayfairDisplay_700Bold',
    marginBottom: 8,
  },
  doneSub: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
  },
  refreshBtn: {
    backgroundColor: '#A16207',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  refreshText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1917',
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  headerSub: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  card: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    minHeight: 420,
  },
  heroArea: {
    height: 220,
    backgroundColor: '#F5F5F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: {
    fontSize: 80,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  infoArea: {
    padding: 20,
  },
  productName: {
    fontSize: 20,
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
  scoreBadge: {
    backgroundColor: '#A1620715',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    marginTop: 12,
  },
  scoreText: {
    fontSize: 14,
    color: '#A16207',
    fontWeight: '600',
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1917',
    marginTop: 12,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
  },
  tagText: {
    fontSize: 12,
    color: '#64748B',
  },
  indicator: {
    position: 'absolute',
    top: 40,
    padding: 12,
    borderWidth: 3,
    borderRadius: 8,
  },
  likeIndicator: {
    right: 20,
    borderColor: '#059669',
    transform: [{ rotate: '15deg' }],
  },
  passIndicator: {
    left: 20,
    borderColor: '#DC2626',
    transform: [{ rotate: '-15deg' }],
  },
  indicatorText: {
    fontSize: 24,
    fontWeight: '800',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginTop: 32,
  },
  actionBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  passBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#94A3B8',
  },
  likeBtn: {
    backgroundColor: '#FEE2E2',
    borderWidth: 2,
    borderColor: '#F87171',
  },
  actionEmoji: {
    fontSize: 28,
  },
  actionLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  whyText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 24,
  },
  // Feed View Styles
  feedContainer: {
    paddingHorizontal: GRID_ITEM_SPACING,
    paddingBottom: 20,
  },
  feedRow: {
    justifyContent: 'space-between',
  },
  feedItem: {
    width: (SCREEN_WIDTH - GRID_ITEM_SPACING * 3) / GRID_COLUMNS,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: GRID_ITEM_SPACING,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  feedImageContainer: {
    height: 140,
    backgroundColor: '#F5F5F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedImage: {
    width: '100%',
    height: '100%',
  },
  feedEmoji: {
    fontSize: 48,
  },
  feedFavBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
  },
  feedInfo: {
    padding: 12,
  },
  feedName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1917',
    lineHeight: 18,
  },
  feedBrand: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
  },
  feedScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  feedScore: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A16207',
  },
  feedPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1917',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 40,
  },
});
