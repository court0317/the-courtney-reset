# Rooted v8.1.2 — Hydration Stability Fix

This release fixes the water counter jumping backwards after 1 L. Hydration now uses one shared counter and synchronises Today, Aquarium, Weekly Breakdown and Coach.

Deploy every file in this folder to GitHub Pages, then open once with `?v=rooted812#today`.


## Version 8.1.3
- Fixed Calendar History opening with an independent navigation handler.
- Added the calendar script to offline caching.
- Replaced unsupported instant scrolling for better iPhone compatibility.

Rooted 2.0 recovery build: rebuilt home UI from stable v8.1.3 while preserving app logic.


## Rooted 9 Interactive Living World
- Time-aware greeting and gentle streak
- Daily mood check-in and monthly mood history
- Australian seasonal garden, time-of-day ambience and daily visitors
- Unlockable featured flowers and habit celebrations
- Optional generated garden sounds (no external audio files)
- Guided journal prompts
- Interactive Memory Tree with locally saved moments

All Rooted 9 data is additive and stored separately under `rooted-v9-interactive`. Existing planner data and features are unchanged.


## Rooted 10 — Story World
Adds the Reading Corner, Letters to Future You, weekly Garden Snapshots, Achievement Scrapbook and Evening Wrap-up. New feature data is stored separately under `rooted-v10-story-features`; existing planner data is unchanged.
