import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/api';

interface Milestone {
  milestone_id: string;
  milestone_name: string;
  tier: number;
  description: string | null;
  free_reachable: boolean;
  toy_count: number;
}

const TIER_LABELS: Record<number, { label: string; icon: string }> = {
  1: { label: 'Foundation', icon: '🌱' },
  2: { label: 'Growth', icon: '🌿' },
  3: { label: 'Mastery', icon: '🌳' },
  4: { label: 'Excellence', icon: '🏆' },
};

export default function MilestonesScreen() {
  const router = useRouter();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMilestones();
  }, []);

  const loadMilestones = async () => {
    try {
      setLoading(true);
      setError(null);

      // Aggregate milestone data from v_milestone_toys
      const { data, error: queryError } = await supabase
        .from('v_milestone_toys')
        .select('milestone_id, milestone_name, tier, description, free_reachable, product_id')
        .order('tier', { ascending: true });

      if (queryError) throw queryError;

      // Aggregate: count toys per milestone
      const agg = new Map<string, Milestone>();
      for (const row of data || []) {
        const key = row.milestone_id;
        if (!agg.has(key)) {
          agg.set(key, {
            milestone_id: row.milestone_id,
            milestone_name: row.milestone_name,
            tier: row.tier,
            description: row.description,
            free_reachable: row.free_reachable,
            toy_count: 0,
          });
        }
        agg.get(key)!.toy_count++;
      }

      setMilestones(Array.from(agg.values()));
    } catch (err) {
      setError('Failed to load milestones.');
      console.error('Milestones error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator size="large" color="#A16207" />
        <Text className="mt-4 text-body-md text-text-secondary">Loading milestones...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-surface px-8">
        <Text className="text-4xl mb-4">😵</Text>
        <Text className="text-headline-sm text-text mb-2">{error}</Text>
        <Pressable
          onPress={loadMilestones}
          className="bg-primary rounded-button px-6 py-3 mt-4"
        >
          <Text className="text-white font-label">Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface">
      {/* Header */}
      <View className="px-4 pt-4 pb-2">
        <Text className="text-headline-lg text-text font-headline">Growth Milestones</Text>
        <Text className="text-body-md text-text-secondary mt-1">
          Track development through play
        </Text>
      </View>

      {/* Milestone List */}
      <FlatList
        data={milestones}
        keyExtractor={item => item.milestone_id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        renderItem={({ item }) => {
          const tierInfo = TIER_LABELS[item.tier] || { label: 'Tier ' + item.tier, icon: '🎯' };
          return (
            <Pressable
              className="bg-white rounded-card p-4 mb-3"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <View className="flex-row items-start justify-between">
                <View className="flex-1 mr-3">
                  <View className="flex-row items-center mb-1">
                    <Text className="text-lg mr-2">{tierInfo.icon}</Text>
                    <Text className="text-headline-sm text-text font-headline flex-1">
                      {item.milestone_name}
                    </Text>
                  </View>
                  {item.description && (
                    <Text className="text-body-md text-text-secondary mb-2" numberOfLines={2}>
                      {item.description}
                    </Text>
                  )}
                  <View className="flex-row items-center gap-3">
                    <View className="bg-surface-dark rounded-full px-2 py-0.5">
                      <Text className="text-label text-text-secondary">
                        {tierInfo.label}
                      </Text>
                    </View>
                    <Text className="text-label text-text-muted">
                      {item.toy_count.toLocaleString()} toys
                    </Text>
                    {item.free_reachable && (
                      <View className="bg-success/10 rounded-full px-2 py-0.5">
                        <Text className="text-label text-success">Free</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-4xl mb-4">🎯</Text>
            <Text className="text-headline-sm text-text-secondary">
              No milestones found
            </Text>
          </View>
        }
      />
    </View>
  );
}
