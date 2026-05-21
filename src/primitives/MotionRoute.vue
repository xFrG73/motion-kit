<!--
  packages/motion-kit/src/primitives/MotionRoute.vue

  Drop-in replacement for <NuxtPage /> that animates route transitions.

  We delegate to NuxtPage's built-in :transition prop, which internally wraps
  the resolved page component in a <Transition> via the v-slot pattern. This
  is the correct place to mount the transition: wrapping <slot /> around a
  <NuxtPage /> does NOT work because NuxtPage is reactive to the route and
  swaps its internal child out the moment the URL changes — even while a leave
  animation is playing — causing the new content to flash before the enter
  animation plays.

  CSS classes for the "motion-route" transition are defined globally in
  packages/motion-kit/src/css/motion.css so they inherit the motion-kit tokens
  (--motion-duration-base, --motion-easing-out, --motion-distance-short) and
  automatically respect reduced-motion preferences.
-->
<template>
  <NuxtPage :transition="{ name: 'motion-route', mode: 'out-in', appear: true }" />
</template>
