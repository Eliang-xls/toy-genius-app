// Icon组件使用示例
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from './Icon';

export const IconExamples: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* 基础用法 */}
      <Icon name="actions/add" />
      
      {/* 指定尺寸 */}
      <Icon name="content/toy" size={16} />
      <Icon name="content/toy" size={24} />
      <Icon name="content/toy" size={32} />
      
      {/* 指定颜色 */}
      <Icon name="status/success" color="#6B8E23" />
      <Icon name="status/error" color="#CD5C5C" />
      <Icon name="content/ai" color="#5D4037" />
      
      {/* 成就图标 */}
      <Icon name="achievements/gold" size={32} />
      <Icon name="achievements/silver" size={32} />
      <Icon name="achievements/bronze" size={32} />
      <Icon name="achievements/diamond" size={32} />
      
      {/* 操作图标 */}
      <Icon name="actions/edit" size={24} />
      <Icon name="actions/delete" size={24} />
      <Icon name="actions/save" size={24} />
      <Icon name="actions/share" size={24} />
      
      {/* 内容图标 */}
      <Icon name="content/age" size={24} />
      <Icon name="content/price" size={24} />
      <Icon name="content/safety" size={24} />
      
      {/* 状态图标 */}
      <Icon name="status/info" size={24} />
      <Icon name="status/warning" size={24} />
      <Icon name="status/loading" size={24} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    padding: 16,
  },
});