// ContentCard - Article/Tip Content Card
// Design Spec: V0.3 - 12px radius, 16px padding, header/content/footer structure
// Full width, margin between cards: 16px

import React from 'react';
import { Pressable, View, Text } from 'react-native';
import type { ContentCardProps } from './Card.types';

export function ContentCard({
  title,
  subtitle,
  content,
  icon,
  action,
  timestamp,
  onPress,
  style,
  testID,
}: ContentCardProps) {
  const CardContainer = onPress ? Pressable : View;
  const containerProps = onPress
    ? {
        onPress,
        accessibilityLabel: title,
        accessibilityRole: 'button' as const,
      }
    : {};

  return (
    <CardContainer
      {...containerProps}
      testID={testID}
      className={`
        bg-white rounded-card
        mb-4
      `}
      style={[
        {
          shadowColor: '#3E2723',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        },
        style,
      ]}
    >
      <View className="p-4">
        {/* Header section */}
        <View className="flex-row items-start mb-3">
          {/* Optional icon */}
          {icon && (
            <View className="w-6 h-6 rounded-full bg-accent items-center justify-center mr-3">
              {icon}
            </View>
          )}

          {/* Title and subtitle */}
          <View className="flex-1">
            <Text className="text-headline-sm text-text font-headline">
              {title}
            </Text>
            {subtitle && (
              <Text className="text-body-md text-text-secondary font-body mt-0.5">
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        {/* Content section */}
        {content && (
          <Text className="text-body-lg text-text font-body mb-3">
            {content}
          </Text>
        )}

        {/* Footer section */}
        {(action || timestamp) && (
          <View className="flex-row items-center justify-between mt-1 pt-3 border-t border-surface-muted">
            {/* Action button */}
            {action && (
              <Pressable
                onPress={action.onPress}
                className="flex-row items-center"
                hitSlop={8}
              >
                <Text className="text-accent text-label font-body font-medium">
                  {action.label}
                </Text>
                <Text className="text-accent text-label ml-1">→</Text>
              </Pressable>
            )}

            {/* Timestamp */}
            {timestamp && (
              <Text className="text-caption text-text-muted font-body">
                {timestamp}
              </Text>
            )}
          </View>
        )}
      </View>
    </CardContainer>
  );
}

export default ContentCard;
