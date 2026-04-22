// Icon组件测试页面
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Icon } from '@/components/Icon';

export default function IconTestScreen() {
  const iconCategories = [
    {
      title: '成就图标',
      icons: [
        'achievements/bronze',
        'achievements/diamond',
        'achievements/gold',
        'achievements/silver',
      ] as const,
    },
    {
      title: '操作图标',
      icons: [
        'actions/add',
        'actions/delete',
        'actions/edit',
        'actions/save',
        'actions/share',
      ] as const,
    },
    {
      title: '内容图标',
      icons: [
        'content/age',
        'content/ai',
        'content/price',
        'content/safety',
        'content/toy',
      ] as const,
    },
    {
      title: '状态图标',
      icons: [
        'status/error',
        'status/info',
        'status/loading',
        'status/success',
        'status/warning',
      ] as const,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Icon 组件测试</Text>
      
      {/* 尺寸测试 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>尺寸测试</Text>
        <View style={styles.row}>
          <View style={styles.iconItem}>
            <Icon name="content/toy" size={16} />
            <Text style={styles.label}>16px</Text>
          </View>
          <View style={styles.iconItem}>
            <Icon name="content/toy" size={24} />
            <Text style={styles.label}>24px</Text>
          </View>
          <View style={styles.iconItem}>
            <Icon name="content/toy" size={32} />
            <Text style={styles.label}>32px</Text>
          </View>
        </View>
      </View>

      {/* 颜色测试 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>颜色测试</Text>
        <View style={styles.row}>
          <View style={styles.iconItem}>
            <Icon name="status/success" color="#6B8E23" />
            <Text style={styles.label}>绿色</Text>
          </View>
          <View style={styles.iconItem}>
            <Icon name="status/error" color="#CD5C5C" />
            <Text style={styles.label}>红色</Text>
          </View>
          <View style={styles.iconItem}>
            <Icon name="content/ai" color="#5D4037" />
            <Text style={styles.label}>棕色</Text>
          </View>
          <View style={styles.iconItem}>
            <Icon name="achievements/gold" color="#FFD700" />
            <Text style={styles.label}>金色</Text>
          </View>
        </View>
      </View>

      {/* 图标分类 */}
      {iconCategories.map((category) => (
        <View key={category.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{category.title}</Text>
          <View style={styles.iconGrid}>
            {category.icons.map((iconName) => (
              <View key={iconName} style={styles.iconItem}>
                <Icon name={iconName} size={24} />
                <Text style={styles.iconName}>{iconName.split('/')[1]}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFAF0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#5D4037',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#5D4037',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  iconItem: {
    alignItems: 'center',
    gap: 4,
    minWidth: 60,
  },
  label: {
    fontSize: 12,
    color: '#5D4037',
    opacity: 0.7,
  },
  iconName: {
    fontSize: 10,
    color: '#5D4037',
    opacity: 0.6,
    textAlign: 'center',
  },
});