<template>
  <button
      class="vk-button shadow-sm inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
      :class="[colorClasses, sizeClasses]"
      :disabled="disabled || loading"
  >
    <Icon :icon="iconWithLoading" class="mr-2" v-if="iconWithLoading"/>
    <slot></slot>
  </button>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

export type ButtonColor = 'primary' | 'green' | 'purple' | 'neutral'
export type ButtonSize = 'large' | 'small' | 'default'

export interface ButtonProps {
  color?: ButtonColor;
  size?: ButtonSize;
  plain?: boolean;
  disabled?: boolean;
  loading?: boolean;
  iconName?: string;
}

defineOptions({
  name: 'VkButton'
})

const props = withDefaults(defineProps<ButtonProps>(), {
  color: 'primary',
  size: 'default'
})

const colorVariants: Record<ButtonColor, any> = {
  'primary': {
    plain: 'bg-primary-50 text-primary-600 hover:bg-primary-100 border border-primary-200 hover:border-primary-300 focus:ring-primary-500',
    normal: 'bg-primary-600 text-white hover:bg-primary-700 border border-transparent focus:ring-primary-500 shadow-primary-500/30'
  },
  // Backward compatibility - mapping green to primary style or keeping it distinct if needed. 
  // Let's make it a nice emerald green if someone specifically asked for green, 
  // but since the default was green and we want to change the theme, let's map green to primary for now or just update default prop.
  // The user wants to "optimize styling", so switching the default to the new primary is good.
  'green': {
     plain: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 focus:ring-emerald-500',
     normal: 'bg-emerald-600 text-white hover:bg-emerald-700 border border-transparent focus:ring-emerald-500'
  },
  'purple': {
    plain: 'bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-200 focus:ring-purple-500',
    normal: 'bg-purple-600 text-white hover:bg-purple-700 border border-transparent focus:ring-purple-500'
  },
  'neutral': {
    plain: 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-gray-400 focus:ring-gray-500',
    normal: 'bg-gray-900 text-white hover:bg-gray-800 border border-transparent focus:ring-gray-500'
  }
}

const iconWithLoading = computed(() => {
  if (props.loading) {
    return 'line-md:loading-loop'
  } else {
    return props.iconName
  }
})

const colorClasses = computed(() => {
  const variant = colorVariants[props.color] || colorVariants['primary'];
  return props.plain ? variant.plain : variant.normal;
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'large':
      return 'h-[42px] px-5 text-base rounded-lg'
    case 'small':
      return 'h-[32px] px-3 text-xs rounded-md'
    default:
      return 'h-[36px] px-4 text-sm rounded-md'
  }
})
</script>
