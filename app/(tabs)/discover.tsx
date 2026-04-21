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
} from 'react-native';
import { supabase, Product, getProductImageUrl } from '@/lib/api';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

// Daily Discover — Tinder-style Like/Pass (方案 D)
export default function DiscoverScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState<string[]>([]);
  const [passed, setPassed] = useState<string[]>([]);
  const [imageError, setImageError] = useState(false);

  const translateX = useRef(new Animated.Value(0)).current;
  const rotate = translateX.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    loadDailyPicks();
  }, []);

  useEffect(() => {
    setImageError(false);
  }, [currentIndex]);

  const loadDailyPicks = async () => {
    try {
      setLoading(true);
      // Fetch random high-scored products for daily picks
      const { data, error } = await supabase
        .from('mv_product_browse')
        .select('*')
        .gte('base_score', '70')
        .order('base_score', { ascending: false })
        .limit(20);

      if (error) throw error;
      // Shuffle for variety
      const shuffled = (data || []).sort(() => Math.random() - 0.5);
      setProducts(shuffled.slice(0, 10));
    } catch (err) {
      console.error('Load daily picks error:', err);
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#A16207" />
        <Text style={styles.loadingText}>Curating your daily picks...</Text>
      </View>
    );
  }

  if (!currentProduct) {
    return (
      <View style={styles.center}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.doneTitle}>All caught up!</Text>
        <Text style={styles.doneSub}>
          You liked {liked.length} toys today
        </Text>
        <Pressable style={styles.refreshBtn} onPress={() => { setCurrentIndex(0); loadDailyPicks(); }}>
          <Text style={styles.refreshText}>Refresh Picks</Text>
        </Pressable>
      </View>
    );
  }

  const imageUrl = getProductImageUrl(currentProduct.id);
  const score = parseFloat(currentProduct.base_score);
  const ageMin = parseFloat(String(currentProduct.age_min_yr));
  const ageMax = parseFloat(String(currentProduct.age_max_yr));
  const ageLabel = ageMin >= ageMax ? `${ageMax}+yr` : `${ageMin}-${ageMax}yr`;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daily Discover</Text>
        <Text style={styles.headerSub}>
          {currentIndex + 1} / {products.length}
        </Text>
      </View>

      {/* Card */}
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ translateX }, { rotate }],
          },
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
          <Text style={styles.productName}>{currentProduct.name_display}</Text>
          <Text style={styles.brandName}>
            {currentProduct.brand_name} • {ageLabel}
          </Text>

          {/* Score Badge */}
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>⭐ {score.toFixed(1)}/100</Text>
          </View>

          {/* Price */}
          {currentProduct.scraped_price && (
            <Text style={styles.price}>${currentProduct.scraped_price}</Text>
          )}

          {/* Categories */}
          {currentProduct.product_category && (
            <View style={styles.tagRow}>
              {currentProduct.product_category.slice(0, 3).map((cat, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{cat}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Swipe Indicators */}
        <View style={[styles.indicator, styles.likeIndicator, { opacity: 0 }]}>
          <Text style={styles.indicatorText}>LIKE ❤️</Text>
        </View>
        <View style={[styles.indicator, styles.passIndicator, { opacity: 0 }]}>
          <Text style={styles.indicatorText}>PASS 👋</Text>
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

      {/* Progress */}
      <Text style={styles.whyText}>Why this pick? Tap card for details →</Text>
    </View>
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
    borderColor: '#FCA5A5',
  },
  likeBtn: {
    backgroundColor: '#FEE2E2',
    borderWidth: 2,
    borderColor: '#FCA5A5',
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
});
