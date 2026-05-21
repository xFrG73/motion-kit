# @Sudothink/motion-kit

Shared motion design system for Sudothink web and agent.

- **Tokens**: durations, easings, distances, stagger — single source of truth
- **CSS**: variables + reduced-motion overrides + utility classes (`.press`, `.lift`, `.underline-grow`, `.brighten`)
- **Composables**: `useReducedMotion`, `useCountUp`, `useStagger`, `useSparkline`
- **Primitives**: `<MotionList>`, `<MotionNumber>`, `<MotionStatusDot>`, `<MotionSparkline>`, `<MotionRoute>`, `<MotionSkeleton>`

**Import discipline**: consumers never import `motion-v` directly. They use the primitives.

See `docs/superpowers/specs/2026-04-15-motion-design-refresh-design.md` for the design rationale.
