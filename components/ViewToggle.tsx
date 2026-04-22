import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export type ViewMode = 'tinder' | 'feed' | 'grid';

interface ViewToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export default function ViewToggle({ mode, onChange }: ViewToggleProps) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.option, mode === 'tinder' && styles.activeOption]}
        onPress={() => onChange('tinder')}
      >
        <Text style={[styles.icon, mode === 'tinder' && styles.activeIcon]}>💝</Text>
        <Text style={[styles.label, mode === 'tinder' && styles.activeLabel]}>
          Daily Picks
        </Text>
      </Pressable>

      <Pressable
        style={[styles.option, mode === 'feed' && styles.activeOption]}
        onPress={() => onChange('feed')}
      >
        <Text style={[styles.icon, mode === 'feed' && styles.activeIcon]}>☰</Text>
        <Text style={[styles.label, mode === 'feed' && styles.activeLabel]}>
          Browse All
        </Text>
      </Pressable>

      <Pressable
        style={[styles.option, mode === 'grid' && styles.activeOption]}
        onPress={() => onChange('grid')}
      >
        <Text style={[styles.icon, mode === 'grid' && styles.activeIcon]}>⊞</Text>
        <Text style={[styles.label, mode === 'grid' && styles.activeLabel]}>
          Grid
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F5F5DC',     // surface.muted
    borderRadius: 12,
    padding: 3,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 6,
  },
  activeOption: {
    backgroundColor: '#FFFFFF',     // surface.card
    shadowColor: '#3E2723',         // primary.dark
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    fontSize: 16,
  },
  activeIcon: {
    // No change needed, emoji renders fine
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8D6E63',               // text.muted
    fontFamily: 'Inter',
  },
  activeLabel: {
    color: '#3E2723',               // text.DEFAULT
    fontWeight: '600',
  },
});
