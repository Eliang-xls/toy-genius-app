import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

// Skeleton placeholder for product cards
export function ProductCardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder} />
      <View style={styles.textBlock}>
        <View style={styles.titleLine} />
        <View style={styles.subLine} />
        <View style={styles.badgeLine} />
      </View>
    </View>
  );
}

// Skeleton for detail screen
export function DetailSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.heroPlaceholder} />
      <View style={styles.detailBlock}>
        <View style={styles.detailTitle} />
        <View style={styles.detailSub} />
        <View style={styles.detailScore} />
      </View>
      {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
        <View key={i} style={styles.scoreRow}>
          <View style={styles.scoreDot} />
          <View style={styles.scoreLabel} />
          <View style={styles.scoreBar} />
        </View>
      ))}
    </View>
  );
}

// Grid skeleton for browse screen (2 rows)
export function BrowseGridSkeleton() {
  return (
    <View style={styles.grid}>
      {[1, 2, 3, 4].map(i => (
        <ProductCardSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    width: '100%',
    height: CARD_WIDTH * 0.8,
    backgroundColor: '#F1F5F9',
  },
  textBlock: {
    padding: 12,
    gap: 8,
  },
  titleLine: {
    height: 14,
    backgroundColor: '#E8ECF0',
    borderRadius: 4,
    width: '80%',
  },
  subLine: {
    height: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    width: '60%',
  },
  badgeLine: {
    height: 20,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    width: '40%',
    marginTop: 4,
  },
  container: {
    flex: 1,
    backgroundColor: '#FAFAF9',
  },
  heroPlaceholder: {
    width: '100%',
    height: 280,
    backgroundColor: '#F1F5F9',
  },
  detailBlock: {
    padding: 16,
    gap: 10,
  },
  detailTitle: {
    height: 22,
    backgroundColor: '#E8ECF0',
    borderRadius: 4,
    width: '70%',
  },
  detailSub: {
    height: 14,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    width: '50%',
  },
  detailScore: {
    height: 28,
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    width: '30%',
    marginTop: 4,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  scoreDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  scoreLabel: {
    width: 60,
    height: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
  },
  scoreBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E8ECF0',
    borderRadius: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
});
