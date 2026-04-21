import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/api';

interface Achievement {
  id: string;
  name: string;
  tier: number;
  label: string | null;
  category: string | null;
  eval_mode: string | null;
  condition: string | null;
  thematic_hint: string | null;
  difficulty_label: string | null;
  educational_message: string | null;
}

const TIER_CONFIG: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  'bronze': { label: 'Bronze', icon: '🥉', color: '#CD7F32', bg: 'bg-amber-50' },
  'silver': { label: 'Silver', icon: '🥈', color: '#94A3B8', bg: 'bg-gray-50' },
  'gold': { label: 'Gold', icon: '🥇', color: '#A16207', bg: 'bg-amber-50' },
  'diamond': { label: 'Diamond', icon: '💎', color: '#312E81', bg: 'bg-indigo-50' },
};

const TIER_ORDER = ['bronze', 'silver', 'gold', 'diamond'];

// Map numeric tier (1-4) to string key
function tierToKey(tier: number | string): string {
  const map: Record<string, string> = { '1': 'bronze', '2': 'silver', '3': 'gold', '4': 'diamond' };
  return map[String(tier)] || 'bronze';
}

// V1 精选 24 成就 (DA 按 Day4 挑选策略: 覆盖度 + 渐进引导 + 全8维+4类category)
// Bronze 6 / Silver 7 / Gold 6 / Diamond 5
const V1_ACHIEVEMENT_IDS = [
  // Bronze (6) — 入门级，单维度基础目标
  'T1_01', // Safe Haven (Safety)
  'T1_02', // Little Thinker (Cognition)
  'T1_03', // Sense Explorer (Sensory)
  'T1_04', // Mover & Shaker (Motor)
  'T1_05', // People Person (Social)
  'T1_11', // Explorer (budget + variety)
  // Silver (7) — 进阶级，扩展维度 + 跨维度入门
  'T2_01', // Safety Shield (Safety 进阶)
  'T2_04', // Active Champion (Motor 进阶)
  'T2_06', // Green Thumb (Nature 代表)
  'T2_07', // Story Weaver (Expression 代表)
  'T2_09', // Budget Master (预算管理)
  'T2_15', // Category Mix (品类多样性)
  'T2_19', // STEAM Starter (跨维度入门)
  // Gold (6) — 高级目标，单维度高分 + 组合
  'T3_01', // Super Safety (Safety 高级)
  'T3_02', // Genius Mind (Cognition 高级)
  'T3_04', // Motion Pro (Motor 高级)
  'T3_07', // Creative Elite (Expression 高级)
  'T3_09', // Triple Threat (多维度挑战)
  'T3_H01', // Safety + Cognition (首个跨维度组合)
  // Diamond (5) — 终极目标，展示远景
  'T4_01', // Legendary (6+维度传奇)
  'T4_08', // Perfect Eight (全8维满分)
  'T4_17', // Master Builder (终极建造者)
  'T4_19', // Value King (预算+全能王者)
  'T4_R01', // Dimension Dominator (排名成就)
];

export default function MilestonesScreen() {
  const router = useRouter();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [grouped, setGrouped] = useState<Record<string, Achievement[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    bronze: true,
  });
  const [expandedMessages, setExpandedMessages] = useState<Record<string, boolean>>({});
  const [clueModalId, setClueModalId] = useState<string | null>(null);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from('growth_milestones')
        .select('id, name, tier, label, category, eval_mode, condition, thematic_hint, difficulty_label, educational_message')
        .in('id', V1_ACHIEVEMENT_IDS)
        .order('tier', { ascending: true });

      if (queryError) throw queryError;

      setAchievements(data || []);

      // Group by tier
      const groups: Record<string, Achievement[]> = {};
      for (const tier of TIER_ORDER) {
        groups[tier] = [];
      }
      for (const a of data || []) {
        const tierKey = tierToKey(a.tier);
        if (!groups[tierKey]) groups[tierKey] = [];
        groups[tierKey].push(a);
      }
      setGrouped(groups);
    } catch (err) {
      setError('Failed to load achievements.');
      console.error('Achievements error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (tier: string) => {
    setExpandedSections(prev => ({ ...prev, [tier]: !prev[tier] }));
  };

  const toggleMessage = (id: string) => {
    setExpandedMessages(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const openClue = (id: string) => {
    setClueModalId(id);
  };

  const closeClue = () => {
    setClueModalId(null);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator size="large" color="#A16207" />
        <Text className="mt-4 text-body-md text-text-secondary">Loading achievements...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-surface px-8">
        <Text className="text-4xl mb-4">😵</Text>
        <Text className="text-headline-sm text-text mb-2">{error}</Text>
        <Pressable
          onPress={loadAchievements}
          className="bg-primary rounded-button px-6 py-3 mt-4"
        >
          <Text className="text-white font-label">Retry</Text>
        </Pressable>
      </View>
    );
  }

  const tiersToShow = activeFilter === 'all'
    ? TIER_ORDER
    : TIER_ORDER.filter(t => t === activeFilter);

  const totalCount = achievements.length;

  return (
    <View className="flex-1 bg-surface">
      {/* Header */}
      <View className="px-4 pt-4 pb-2">
        <Text className="text-headline-lg text-text font-headline">🏆 Achievements</Text>
        <Text className="text-body-md text-text-secondary mt-1">
          Every milestone tells a story
        </Text>
      </View>

      {/* Progress Bar */}
      <View className="px-4 py-3">
        <View className="bg-surface-alt rounded-card p-3">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-label text-text-secondary font-label">
              {totalCount} Achievements
            </Text>
            <Text className="text-xs text-text-muted font-label">V2.5 unlocks</Text>
          </View>
          <View className="w-full h-2 bg-gray-200 rounded-full">
            <View className="h-2 bg-gray-300 rounded-full" style={{ width: '0%' }} />
          </View>
          <Text className="text-xs text-text-muted mt-1 text-center">
            🔒 All locked — coming in V2.5
          </Text>
        </View>
      </View>

      {/* Filter Tab */}
      <View className="h-10 px-4 flex-row items-center gap-2">
        {[
          { key: 'all', label: 'All' },
          ...TIER_ORDER.map(t => ({ key: t, label: TIER_CONFIG[t]?.label || t })),
        ].map(f => (
          <Pressable
            key={f.key}
            onPress={() => setActiveFilter(f.key)}
            className={`rounded-full px-3 py-1.5 ${
              activeFilter === f.key ? 'bg-primary' : 'bg-surface-dark'
            }`}
          >
            <Text
              className={`text-xs font-label ${
                activeFilter === f.key ? 'text-white' : 'text-text-secondary'
              }`}
            >
              {f.key === 'all' ? 'All' : TIER_CONFIG[f.key]?.icon + ' ' + f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Achievement List */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80, paddingTop: 8 }}>
        {tiersToShow.map(tier => {
          const items = grouped[tier] || [];
          if (items.length === 0) return null;
          const config = TIER_CONFIG[tier];
          const isExpanded = expandedSections[tier];

          return (
            <View key={tier} className="mb-4">
              {/* Tier Section Header */}
              <Pressable
                onPress={() => toggleSection(tier)}
                className="flex-row items-center justify-between py-2"
              >
                <View className="flex-row items-center">
                  <Text className="text-lg mr-2">{config?.icon}</Text>
                  <Text className="text-headline-sm text-text font-headline">
                    {config?.label?.toUpperCase()}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className="text-label text-text-muted">
                    {items.length}
                  </Text>
                  <Text className="text-sm text-text-muted">{isExpanded ? '▼' : '▶'}</Text>
                </View>
              </Pressable>

              {/* Tier Cards */}
              {isExpanded && items.map((item, idx) => {
                const msgExpanded = expandedMessages[item.id];
                return (
                  <View
                    key={item.id}
                    className="bg-white rounded-card mb-3 overflow-hidden"
                    style={{
                      borderLeftWidth: 4,
                      borderLeftColor: config?.color || '#9CA3AF',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.08,
                      shadowRadius: 2,
                      elevation: 1,
                    }}
                  >
                    <View className="p-3">
                      {/* Lock + Name + Thematic Hint */}
                      <View className="flex-row items-start mb-2">
                        <Text className="text-base mr-2 mt-0.5">🔒</Text>
                        <View className="flex-1">
                          <Text className="text-headline-sm text-text font-headline" numberOfLines={1}>
                            {item.name}
                          </Text>
                          {item.thematic_hint && (
                            <Text className="text-body-sm text-text-muted mt-1" numberOfLines={2}>
                              {item.thematic_hint}
                            </Text>
                          )}
                        </View>
                      </View>

                      {/* Tags Row */}
                      <View className="flex-row items-center gap-2 mt-1 flex-wrap">
                        {item.category && (
                          <View className="bg-surface-dark rounded-full px-2 py-0.5">
                            <Text className="text-xs text-text-secondary font-label">
                              {item.category}
                            </Text>
                          </View>
                        )}
                        {item.eval_mode && (
                          <View className="bg-primary/10 rounded-full px-2 py-0.5">
                            <Text className="text-xs text-primary font-label">
                              {item.eval_mode === 'ROW' ? 'Row Check' : 'Global Check'}
                            </Text>
                          </View>
                        )}
                        <Pressable
                          onPress={() => openClue(item.id)}
                          className="ml-auto p-1"
                        >
                          <Text className="text-sm text-text-muted">ℹ️</Text>
                        </Pressable>
                      </View>

                      {/* Educational Message (expandable) */}
                      {msgExpanded && item.educational_message && (
                        <View className="mt-2 p-3 bg-surface-alt rounded-card">
                          <Text className="text-xs text-primary font-label mb-1">
                            📚 Did You Know?
                          </Text>
                          <Text className="text-body-sm text-text-secondary">
                            {item.educational_message}
                          </Text>
                        </View>
                      )}

                      {/* Locked bottom bar */}
                      <View className="mt-2 pt-2 border-t border-gray-100">
                        <Text className="text-xs text-text-muted text-center font-label">
                          🔒 Requires V2.5 to evaluate
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
