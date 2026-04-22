import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Icon } from '@/components/Icon';

export default function IconTestScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Icon System Test Page</Text>
      
      {/* Slot Icons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Slot Icons</Text>
        
        <View style={styles.iconRow}>
          <Icon name="slot_add" size="sm" accessibilityLabel="Add icon small" />
          <Text style={styles.iconLabel}>slot_add (sm)</Text>
        </View>
        
        <View style={styles.iconRow}>
          <Icon name="slot_add" size="md" accessibilityLabel="Add icon medium" />
          <Text style={styles.iconLabel}>slot_add (md)</Text>
        </View>
        
        <View style={styles.iconRow}>
          <Icon name="slot_add" size="lg" accessibilityLabel="Add icon large" />
          <Text style={styles.iconLabel}>slot_add (lg)</Text>
        </View>
        
        <View style={styles.iconRow}>
          <Icon name="slot_remove" size="md" color="#FF5252" accessibilityLabel="Remove icon" />
          <Text style={styles.iconLabel}>slot_remove (red)</Text>
        </View>
        
        <View style={styles.iconRow}>
          <Icon name="slot_lock_filled" size="lg" accessibilityLabel="Lock filled icon" />
          <Text style={styles.iconLabel}>slot_lock_filled</Text>
        </View>
        
        <View style={styles.iconRow}>
          <Icon name="slot_lock_outline" size="lg" accessibilityLabel="Lock outline icon" />
          <Text style={styles.iconLabel}>slot_lock_outline</Text>
        </View>
      </View>
      
      {/* Achievement Icons */}
      <View style={[styles.section, { marginTop: 32 }]}>
        <Text style={styles.sectionTitle}>Achievement Icons</Text>
        
        <View style={styles.iconRow}>
          <Icon name="achievement_bronze" size="lg" accessibilityLabel="Bronze badge" />
          <Text style={styles.iconLabel}>bronze</Text>
        </View>
        
        <View style={styles.iconRow}>
          <Icon name="achievement_silver" size="lg" accessibilityLabel="Silver badge" />
          <Text style={styles.iconLabel}>silver</Text>
        </View>
        
        <View style={styles.iconRow}>
          <Icon name="achievement_gold" size="lg" accessibilityLabel="Gold badge" />
          <Text style={styles.iconLabel}>gold</Text>
        </View>
      </View>
      
      {/* Interactive Examples */}
      <View style={[styles.section, { marginTop: 32 }]}>
        <Text style={styles.sectionTitle}>Interactive Demo</Text>
        
        <View style={styles.demoRow}>
          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Product Card Example</Text>
            <Text style={styles.demoText}>The slot_add icon appears as an overlay on product cards</Text>
          </View>
        </View>
        
        <View style={styles.demoRow}>
          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Tier Progression</Text>
            <Text style={styles.demoText}>Achieve bronze → silver → gold to unlock badges</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Generated Day 25 • Testing Icon Integration</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F4',
  },
  content: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5D4037',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5D4037',
    marginBottom: 16,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F4',
  },
  iconLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  demoRow: {
    marginBottom: 12,
  },
  demoBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5D4037',
    marginBottom: 4,
  },
  demoText: {
    fontSize: 12,
    color: '#6B7280',
  },
  footer: {
    marginTop: 32,
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
