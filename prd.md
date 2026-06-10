# Product Requirements Document (PRD)
## Estimation Using Addition and Subtraction | Grade 3 Math
### Intellia 360 | Global Primary Mathematics Curriculum
### Lesson 2.5 — Addition and Subtraction Section

---

```
═══════════════════════════════════════════════════════════════════════════════
                         DOCUMENT CONTROL
═══════════════════════════════════════════════════════════════════════════════
Document Title  : Estimation Using Addition and Subtraction — PRD
Lesson Code     : Grade3-Math-2.5
Program         : Intellia 360 Grade 3 Math
Audience        : Grade 3 Students, Age 8–9, Global
Curriculum Ref  : Global Primary Mathematics Syllabus (CCSS, UK KS2, Singapore
                  MOE, Australian AC, IB PYP, CBSE)
Hosted At       : https://intelliasg.com/courses/grade-3-math/lessons/estimation/
Tech Stack      : React 18 (Vite + JSX), CSS Modules, ElevenLabs Audio
Reference UI    : https://equal-tau.vercel.app/
Reference Repo  : https://github.com/dsamyak/equal
Version         : 1.0
Date            : June 2026
═══════════════════════════════════════════════════════════════════════════════
```

---

## 1. EXECUTIVE SUMMARY

This document defines product requirements for the **"Estimation Using Addition and Subtraction"** interactive lesson module, delivered as Lesson 2.5 within Intellia 360's Grade 3 Math program. The module targets Grade 3 students aged **8–9 years** from global classrooms — including students following CCSS (USA), UK National Curriculum (KS2), Singapore MOE, Australian Curriculum, IB PYP, and CBSE (India).

The product is a **standalone simulation-based web page** to be hosted at:
```
https://intelliasg.com/courses/grade-3-math/lessons/estimation/
```

It is built using **React 18 (Vite + JSX, JavaScript + CSS)** and designed to strictly mirror the visual and UX structure established at `https://equal-tau.vercel.app/` and the repository `https://github.com/dsamyak/equal`.

Audio narration uses **ElevenLabs exclusively** (Voice: Alice, Voice ID: `Xb7hH8MSUJpSbSDYk0k2`, Model: `eleven_multilingual_v2`) with pre-generated static `.mp3` files for all phase narrations, and dynamic generation for randomised practice questions.

The module follows Intellia's **6-phase learner journey**:

| Phase | Name | Duration | Purpose |
|-------|------|----------|---------|
| Phase 0 | INTRO | 1 min | Welcome screen + 5-step progress map |
| Phase 1 | WONDER | 1–2 min | Curiosity hook |
| Phase 2 | STORY | 3–4 min | Narrative-based concept introduction |
| Phase 3 | SIMULATE | 6–8 min | 3-station sandbox interactive simulation |
| Phase 4 | PLAY | 8–10 min | IntelliPlay™ gamified practice (100 randomised questions) |
| Phase 5 | REFLECT | 1–2 min | Journal / LearnFlow AI prompt + completion badge |

---

## 2. PRODUCT VISION & GOALS

### Vision
To make **estimation thinking** joyful, intuitive, and globally relevant for 8–9 year-old learners — building a powerful mental math bridge through animated number-line simulations, story narration featuring globally relatable characters, and adaptive gamified challenge. Students will move from "I must be exactly right" to "I can make a smart close guess" — a life skill grounded in real-world math confidence.

### Goals

| Goal | Success Metric |
|------|---------------|
| Learning Completion | ≥85% of students complete all 5 phases |
| Practice Engagement | ≥90% attempt at least 15 practice questions |
| Score Achievement | Average challenge score ≥75% on first attempt |
| Session Duration | Average engagement ≥18 minutes per session |
| Curriculum Alignment | 100% aligned to global Grade 3 syllabus standards |
| Phase Progression | ≥80% reach Play phase in a single session |
| Simulation Interaction Rate | ≥95% attempt all 3 simulation stations |
| Audio Engagement | ≥90% complete at least one full narrated story panel |

---

## 3. TARGET USERS

### Primary: Grade 3 Students (Age 8–9) — Global
- Reading ability is developing; prefer visual diagrams, animations, and rich colour
- Beginning to use mental math strategies; benefit from number-line and rounding visual anchors
- Moderate attention spans; need frequent micro-rewards, relatable characters, and narrative pull
- **Global context**: story characters use globally familiar names (John, Sarah, Mike, Emma, Lena, Arjun, Sofia, Tomás, Mei, Priya) and universal contexts (school, market, library, sports, travel)
- Comfortable with touch interaction, tap-to-select, drag-and-drop on tablets and desktops

### Secondary: Teachers & Parents (Global)
- Assign as classwork, digital homework, or enrichment activity
- Expect strict international curriculum alignment (CCSS 3.NBT, UK KS2 Year 3–4, etc.)
- Monitor via phase completion indicators embedded in lesson page
- Value real-world contexts that travel across cultures

---

## 4. CURRICULUM ALIGNMENT — Global Grade 3 Standards

### Topic: Estimation Using Addition and Subtraction (Lesson 2.5)
**Programme:** Intellia 360 Grade 3 Math — Section 2: Addition and Subtraction

**Lesson URL:** `https://intelliasg.com/courses/grade-3-math/lessons/estimation/`

### Aligned Global Standards

| Curriculum | Standard | Description |
|-----------|---------|-------------|
| **CCSS (USA)** | 3.NBT.A.2 | Fluently add and subtract within 1000 using strategies; use estimation to check |
| **CCSS (USA)** | 3.OA.D.8 | Solve two-step word problems; use mental computation and estimation to assess reasonableness |
| **UK KS2 / Year 3** | NC Maths Y3 | Estimate the answer to a calculation and use inverse operations to check answers |
| **UK KS2 / Year 4** | NC Maths Y4 | Estimate and use inverse operations to check answers to a calculation |
| **Singapore MOE** | Primary 3 (2023 Revised) | Estimation of sum and difference by rounding to the nearest 10 or 100 |
| **Australian Curriculum** | ACMNA055 | Apply place value to partition, rearrange and regroup numbers; estimate results |
| **IB PYP** | Phase 3 Number | Use estimation strategies in real-life situations; determine reasonableness of answer |
| **CBSE India** | Class 3–4 Maths | Estimation — rounding numbers to estimate sums and differences |
| **Ontario Canada** | Grade 3 Number Sense | Estimate sums and differences of whole numbers to 1000 using rounding |
| **New Zealand NZC** | Level 2–3 Number | Use a range of counting, grouping and equal sharing strategies; estimate |

### Learning Objectives (All Global Standards Combined)

| Code | Learning Objective |
|------|--------------------|
| LO1 | Understand that estimation means finding a close, reasonable answer (not exact) |
| LO2 | Round 2-digit and 3-digit numbers to the nearest 10 and nearest 100 |
| LO3 | Estimate sums by rounding addends to the nearest 10 or 100 before adding |
| LO4 | Estimate differences by rounding minuend and subtrahend before subtracting |
| LO5 | Use a number line to visually identify which round number a value is closest to |
| LO6 | Determine if an estimated answer is "close enough" and reasonable |
| LO7 | Solve real-world word problems using estimation strategies |
| LO8 | Compare estimates to exact answers; understand the concept of "about" |
| LO9 | Use front-end estimation strategy (leading digit) as an alternative approach |
| LO10 | Apply estimation to check whether an answer to a computation is reasonable |

### Concept Scope & Number Ranges

| Level | Range | Rounding To | Example |
|-------|-------|-------------|---------|
| Beginner | 2-digit numbers (10–99) | Nearest 10 | 47 + 32 → 50 + 30 = **80** |
| Intermediate | 3-digit numbers (100–999) | Nearest 10 or 100 | 352 + 214 → 350 + 210 = **560** |
| Advanced | Mixed 3-digit | Nearest 100 | 689 – 241 → 700 – 200 = **500** |
| Challenge | Multi-step context | Nearest 10 or 100 | Word problems with 2 operations |

### Key Vocabulary (Age-Appropriate)
> **estimate**, **about**, **approximately**, **close to**, **round**, **round up**, **round down**, **nearest ten**, **nearest hundred**, **reasonable**, **number line**, **benchmark number**, **front-end estimation**, **compatible numbers**, **overestimate**, **underestimate**

---

## 5. THE 6-PHASE LEARNER JOURNEY (Intellia Model)

### PHASE 0 — INTRO SCREEN
```
┌─────────────────────────────────────────────────────────────────────────┐
│  INTRO SCREEN → Progress Map (5-step visual tracker, top bar)           │
│                                                                         │
│  Intellia 360 Logo (top-left)     Lesson badge (locked, top-right)     │
│                                                                         │
│  Title: "Estimation: Addition & Subtraction 🎯"                         │
│  Subtitle: "Grade 3 · Lesson 2.5"                                       │
│                                                                         │
│  5-phase dot tracker glows: ◉ ○ ○ ○ ○ (Wonder lit, rest dim)           │
│                                                                         │
│  Mascot (LearnFlow robot) appears:                                      │
│  "Hi! I'm Spark ⚡ — your math guide! Ready to become an              │
│   estimation expert? Let's go!"                                         │
│                                                                         │
│  [▶ START LEARNING] button — glowing, pulsing CTA                      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### PHASE 1 — WONDER (≈ 1–2 min)

**Hook Scenario:**
> *Sarah and John are at a school book fair. Sarah has 247 coins saved up. A book costs 189 coins. Sarah needs to know quickly — does she have ENOUGH?*
> *She doesn't have a calculator. But she has her brain! 🧠*
> *"About 250 minus about 190... that's about 60! Yes! I think I have enough!"*
> **Can YOU do that kind of clever, quick math? That's called ESTIMATION!**

**Visual Design:**
- Animated book fair scene — colourful shelves, two cartoon characters (Sarah: girl with braids; John: boy in blue cap)
- A thought bubble appears above Sarah's head showing `247 → 250`, `189 → 190`
- Coins burst out in an animated scatter, then reorganise into round groups
- Mascot (Spark) appears in corner with a lightbulb `💡` expression

**Interaction:**
- A single big glowing question appears: *"Is 247 close to 250? Tap YES or NO!"*
- Correct tap → Spark dances, coins sparkle, "You're already thinking like an estimator!"
- A curiosity dial on screen fills from 0 → 100% as student engages

**Narration (ElevenLabs — Alice Voice):**
> *"Sarah and John are at the book fair. Sarah has 247 coins. A book costs 189 coins. She needs to decide fast — does she have enough? Watch how she uses a special math trick called estimation!"*

---

### PHASE 2 — STORY (≈ 3–4 min)

**Narrative Title:** *"The Great Market Day Mix-Up"*

**Characters:**
- **John** — 8-year-old boy visiting a global market with his dad
- **Sarah** — John's classmate, loves solving math puzzles
- **Mike** — the friendly market stall owner
- **Emma** — the teacher who taught them the estimation trick

**Story Panels:**

**Panel 1 — Setting the Scene**
> *John and Sarah are helping at Mike's fruit stall at the Saturday market. It's busy and there's no time to use paper and pencil!*
> *Mike needs to know fast: "I sold 318 mangoes yesterday and 253 today. About how many total?"*
> 🥭 *Animated mangoes pile up. Counter spins fast.*

**Panel 2 — Introducing Rounding**
> *Sarah whispers to John: "Remember what Emma taught us? Round first!"*
> *318 is close to 300. 253 is close to 250.*
> 📍 **Number line slides in:** `|---250---300---318---|`
> *"See? 318 is closer to 300 than to 350. So we round DOWN to 300!"*
> Key term highlighted: **ROUND DOWN ↓**

**Panel 3 — Estimation in Action (Addition)**
> *"300 + 250 = 550! Mike sold about 550 mangoes total!" 🎉*
> *The exact answer? 318 + 253 = 571. Their estimate 550 is very close!*
> 💡 *Pop-up banner: "Estimate: 550 | Exact: 571 | Difference: only 21!"*
> *Spark says: "Close enough? Absolutely! That's the magic of estimation!"*

**Panel 4 — Subtraction Estimation**
> *Now Sarah has a problem: John brought 462 flyers. They gave out 179.*
> *"About how many flyers are LEFT?"*
> 📍 **Number line:** `|---100---179---200---400---462---500---|`
> *"462 rounds to 500. 179 rounds to 200. So... 500 − 200 = 300!"*
> Key term: **ROUND UP ↑**, **ESTIMATE DIFFERENCE**

**Panel 5 — Real Life Check**
> *"The exact answer is 462 − 179 = 283."*
> *"Our estimate was 300. How close is that? Pretty good!"*
> *Sarah: "Estimation isn't about being perfect — it's about being SMART!"*
> 🌍 *Globe icon: "Estimators use this trick everywhere — in markets, airports, classrooms, and kitchens all over the world!"*

**Panel 6 — Summary (CPA Bridge)**
> *Three-step summary card slides in:*
> ```
> STEP 1: ROUND each number  →  48 ≈ 50,  23 ≈ 20
> STEP 2: ADD or SUBTRACT    →  50 + 20 = 70
> STEP 3: CHECK reasonableness → Is 70 close to the real answer 71? YES! ✅
> ```
> *Spark: "You've got the secret! Now let's try it yourself!"*

**Visual Style (matching equal-tau.vercel.app):**
- Illustrated story panels with slide-in animations (CSS transitions)
- Each panel is a "card" that fades/slides left-to-right
- ElevenLabs narration plays on each panel advance
- Key vocabulary words highlighted in yellow bubbles
- Number lines are animated SVG components
- Progress indicator: Panel 1 of 6, breadcrumb dots below

---

### PHASE 3 — SIMULATE (≈ 6–8 min)

**3 Interactive Stations — student must complete all 3 to advance**

---

#### Station A — "The Number Line Slider" 🎚️ (Concrete)
**Concept:** Round numbers to nearest 10 or 100 using a visual number line

**Visual:**
- A large horizontal number line rendered as animated SVG
- Sliding "pointer" the student drags to snap to the nearest benchmark
- Two numbers appear: the original and the nearby round number (e.g., 47 → 50)
- "Snap zones" — when student drags within range of 50, pointer magnetically snaps

**Interaction:**
- A number (e.g., **347**) appears above
- Number line shows: `|---300----350----400---|`
- Student drags a glowing dot to the correct round number
- On snap: number pops up "347 rounds to 350! ✅"

**Feedback:**
- Correct → Spark cheers + coin splash animation + "Great rounding!"
- Incorrect → gentle nudge, "Try again! Which ten is closer?"

**Rounds (randomised):**
- Round A1: Round 63 to nearest 10 → 60
- Round A2: Round 78 to nearest 10 → 80
- Round A3: Round 340 to nearest 100 → 300
- Round A4: Round 450 to nearest 100 → 500 (discuss: equidistant rule)
- Round A5: Round 289 to nearest 10 → 290

**Narration Script (ElevenLabs):**
> *"Drag the glowing dot to the round number that [347] is closest to. Remember — look at which big number it's nearest to on the number line!"*

---

#### Station B — "Estimate-O-Meter" 🔭 (Pictorial)
**Concept:** Estimate sums and differences; judge if answers are reasonable

**Visual:**
- A giant "Estimate-O-Meter" gauge (like a speedometer) ranging from 0–1000
- A word problem appears with an emoji context (e.g., 🍎 apples, 📚 books)
- Four estimation options appear as glowing buttons (A, B, C, D)
- After selecting, the gauge needle dramatically swings to the student's answer
- Then the "exact zone" flashes — student sees how close their estimate is

**Interaction:**
- Q1: *"John has 423 stickers. He gives away 198. About how many left?"*
- Options: A) 100  B) 200  C) 600  D) 800
- Student taps choice → needle swings → comparison reveals

**Feedback:**
- Correct estimate zone → needle lands in green zone, Spark backflips 🤸
- Wrong zone → needle lands in red zone, Spark shows exact vs estimate side-by-side

**Rounds (randomised per session):**
- B1: Estimate a sum (3-digit + 3-digit, round to 100)
- B2: Estimate a difference (3-digit − 2-digit, round to 10)
- B3: Identify which estimate is "reasonable" from 4 options
- B4: Estimate then check — is 420 a reasonable estimate for 387 + 44?
- B5: Over- or underestimate? (conceptual reasoning round)

---

#### Station C — "Build the Estimate" 🏗️ (Abstract)
**Concept:** Complete the estimation sentence step-by-step

**Visual:**
- A step-by-step "build board" — like scaffolded note-taking
- Three rows: [Round First] → [Operation] → [Estimate]
- Each row has a blank tile the student taps a number pad to fill

**Interaction (Example):**
```
Problem:  387 + 241 = ?

Step 1:  387 → [___]      (student enters 400)
Step 2:  241 → [___]      (student enters 200)
Step 3:  [___] + [___] = [___]   (400 + 200 = 600)

✅ "Great estimate! The exact answer is 628. Your estimate 600 is really close!"
```

**Number Pad:** Large, tap-friendly, 0–9 digits + backspace

**Rounds (randomised):**
- C1: 3-digit + 3-digit, round to nearest 100
- C2: 3-digit − 2-digit, round to nearest 10
- C3: 2-digit + 2-digit, round to nearest 10
- C4: 3-digit − 3-digit, round to nearest 100
- C5: Mixed — student chooses whether to round to 10 or 100

**Narration Script (ElevenLabs):**
> *"Time to build your own estimate! First, round each number. Then add or subtract. You're thinking like a real mathematician!"*

---

### PHASE 4 — PLAY — IntelliPlay™ (≈ 8–10 min)

**Structure:**
- **100 randomised questions** across **10 worlds** (10 questions per world)
- World unlocks when student scores ≥6/10 correct
- Stars (1–3) awarded per world based on score: 6=⭐, 8=⭐⭐, 10=⭐⭐⭐
- XP (experience points): +10 per correct, +5 bonus per ⭐⭐⭐ world
- Badges unlock at specific milestones (see Section 8)
- Streak fire counter activates at 5+ consecutive correct answers 🔥

**10 World Themes (Global, Diverse):**

| World | Theme | Context |
|-------|-------|---------|
| 1 | 🏫 School Supply Shop | Books, pencils, erasers |
| 2 | 🍎 The Fruit Market | Mangoes, apples, oranges |
| 3 | 🚂 Train Journey | Passengers, stops, distances |
| 4 | 🏖️ Beach Day | Shells, sunflowers, sand castles |
| 5 | 🎨 Art Class | Crayons, paper, paintings |
| 6 | 🏟️ Sports Stadium | Players, fans, scores |
| 7 | 🌍 World Geography | Mountains, rivers, populations |
| 8 | 🍕 Pizza Party | Slices, guests, ingredients |
| 9 | 🚀 Space Mission | Stars, kilometres, fuel |
| 10 | 🎉 Grand Finale | Mixed real-world challenges |

**Question Types (10 types, equally distributed):**

| # | Type | Description |
|---|------|-------------|
| Q1 | Round to Nearest 10 | Single number, round to nearest 10 |
| Q2 | Round to Nearest 100 | Single number, round to nearest 100 |
| Q3 | Estimate Sum (MCQ) | 4-choice: best estimate of a + b |
| Q4 | Estimate Difference (MCQ) | 4-choice: best estimate of a − b |
| Q5 | Fill the Blank (Sum) | "___ + ___ ≈ ___" type-in |
| Q6 | Fill the Blank (Difference) | "___ − ___ ≈ ___" type-in |
| Q7 | Word Problem (Addition) | Story-based, estimate the total |
| Q8 | Word Problem (Subtraction) | Story-based, estimate the difference |
| Q9 | Reasonableness Check | Is this estimate reasonable? YES/NO + explain |
| Q10 | Over/Under Estimate | Did we overestimate or underestimate? |

**Randomisation Rules:**
- All 100 questions generated from parameterised seeds on every session load
- No two consecutive questions use the same character name or world theme
- Number values regenerated on every attempt — no repeated exact numbers
- Wrong answer distractors are algorithmically generated (plausible errors: wrong rounding direction, off-by-one ten/hundred, swapped operation)

**Question Examples (per type):**

*Q1 — Round to Nearest 10:*
> "Sarah has 347 marbles. Round 347 to the nearest 10."
> Answer: **350** | Distractors: 300, 340, 400

*Q3 — Estimate Sum (MCQ):*
> "Mike baked 284 cookies. Emma baked 139. About how many cookies total?"
> A) 300  B) 400  C) 500  D) 600  →  **Answer: B (280+140=420 ≈ 400)**

*Q7 — Word Problem (Addition):*
> "Arjun read 312 pages in June. He read 256 pages in July. About how many pages did he read in both months?"
> Answer: **570** (300+300=600 acceptable; 310+260=570 better)

*Q10 — Over/Under Estimate:*
> "Lena estimated 47 + 38 ≈ 90 (rounding both to nearest 10: 50+40). Is this an overestimate or underestimate?"
> Answer: **Overestimate** (exact = 85, estimate = 90)

---

### PHASE 5 — REFLECT (≈ 1–2 min)

**Journal Prompt (on-screen):**
> *"Think of a time in real life when you might need to estimate instead of getting the exact answer. Draw it or write about it!"*

**LearnFlow AI Chat (optional):**
- Student types or speaks their understanding
- AI responds with encouragement + 1 follow-up thinking question
- Example: *"Great answer! So if you were at a shop with ₹500 and two items cost ₹247 and ₹189, would you estimate or calculate exactly? Why?"*

**Completion State:**
- Lesson badge unlocks (animated badge flip)
- XP total shown with celebration
- Summary: Worlds completed, total stars, best streak, badges earned
- Share button: "Show your teacher!" (screenshot-ready summary card)
- Progress saved to localStorage (24-hour resume available)

---

## 6. STORY CHARACTERS — FULL PROFILES

| Name | Age | Background | Role in Story |
|------|-----|-----------|---------------|
| **John** | 8 | American, loves science | Main protagonist, curious learner |
| **Sarah** | 8 | British-Caribbean, loves math puzzles | Co-protagonist, quick thinker |
| **Mike** | 35 | Market stall owner, warm and funny | Adult guide, real-world context setter |
| **Emma** | 28 | Global teacher, calm and encouraging | Teacher who introduces estimation |
| **Arjun** | 9 | Indian, cricket fan | Appears in sports world questions |
| **Lena** | 8 | German, loves baking | Appears in kitchen/measurement questions |
| **Sofia** | 8 | Brazilian, loves dancing | Appears in counting/event questions |
| **Tomás** | 9 | Mexican, loves astronomy | Appears in space world questions |
| **Mei** | 8 | Chinese-Australian, loves reading | Appears in library/book questions |
| **Priya** | 8 | Sri Lankan, loves cooking | Appears in market/food questions |

---

## 7. AUDIO DESIGN & NARRATION SCRIPTS

### Audio Voice Configuration
- **Engine:** ElevenLabs API
- **Voice:** Alice
- **Voice ID:** `Xb7hH8MSUJpSbSDYk0k2`
- **Model:** `eleven_multilingual_v2`
- **Stability:** 0.5 | **Similarity Boost:** 0.85 | **Style:** 0.3
- **Delivery:** Pre-generated `.mp3` files for all phase narrations; dynamic generation for randomised practice questions

### Narration Scripts by Phase

**INTRO (audio_intro_welcome.mp3)**
> *"Welcome to Estimation! I'm Spark, your math guide. In this lesson, you'll learn how to make super-smart close guesses — and that's a skill you'll use your whole life. Let's go on an adventure!"*

**WONDER Hook (audio_wonder_hook.mp3)**
> *"Sarah and John are at the book fair. Sarah has 247 coins. A book costs 189 coins. She needs to decide fast — does she have enough? Watch how she uses a special math trick called estimation!"*

**STORY Panel 1 (audio_story_p1.mp3)**
> *"John and Sarah are helping at Mike's fruit stall at the Saturday market. It's a busy day, and there's no time to use paper and pencil! Mike says — about how many mangoes have I sold in two days?"*

**STORY Panel 2 (audio_story_p2.mp3)**
> *"Sarah says: Remember what Emma taught us? Round first! Three hundred and eighteen is close to three hundred. Two hundred and fifty-three is close to two hundred and fifty. Look at the number line — three eighteen is closer to three hundred than to three fifty. So we round down!"*

**STORY Panel 3 (audio_story_p3.mp3)**
> *"Three hundred plus two hundred and fifty equals five hundred and fifty! Mike sold about five hundred and fifty mangoes total! The exact answer is five hundred and seventy-one — and our estimate of five fifty is very close! That's the power of estimation!"*

**STORY Panel 4 (audio_story_p4.mp3)**
> *"Now here's a subtraction challenge. John brought four hundred and sixty-two flyers. They gave out one hundred and seventy-nine. About how many flyers are left? Let's round! Four sixty-two rounds up to five hundred. One seventy-nine rounds up to two hundred. Five hundred minus two hundred is three hundred!"*

**STORY Panel 5 (audio_story_p5.mp3)**
> *"The exact answer is two hundred and eighty-three. Our estimate was three hundred — that's really close! Sarah says: Estimation isn't about being perfect — it's about being smart! And people everywhere use this trick every single day."*

**STORY Panel 6 (audio_story_p6.mp3)**
> *"Here's the three-step secret: Step one — round each number. Step two — add or subtract the rounded numbers. Step three — check! Is your estimate close? If yes, you're an estimator! Now let's try it ourselves!"*

**SIMULATE Station A (audio_sim_a_instruction.mp3)**
> *"Drag the glowing dot to the round number that this number is closest to. Look at the number line — which benchmark is it nearer to?"*

**SIMULATE Station B (audio_sim_b_instruction.mp3)**
> *"Look at this problem. Round the numbers in your head, then choose the best estimate from the four choices. Watch the Estimate-O-Meter!"*

**SIMULATE Station C (audio_sim_c_instruction.mp3)**
> *"Time to build your own estimate! Fill in each step. First, round the numbers. Then do the math. You're thinking like a real mathematician!"*

**CORRECT Feedback (audio_correct_01.mp3)**
> *"Fantastic! You're an estimation superstar!"*

**INCORRECT Feedback (audio_incorrect_01.mp3)**
> *"Good try! Remember — round first, then add or subtract. Want a hint?"*

**REFLECT Prompt (audio_reflect_prompt.mp3)**
> *"Amazing work! Before you get your badge, tell me — when might YOU use estimation in real life? At a shop? On a trip? Think about it and write or draw your answer!"*

**BADGE UNLOCK (audio_badge_unlock.mp3)**
> *"Congratulations! You've earned the Estimation Explorer badge! You're officially a brilliant mathematical thinker. Well done!"*

---

## 8. GAMIFICATION SYSTEM

### XP & Level System

| Action | XP Earned |
|--------|-----------|
| Complete Wonder phase | +20 XP |
| Complete each Story panel | +10 XP each |
| Complete each Simulation station | +30 XP each |
| Correct answer in Play phase | +10 XP |
| 3-star world completion | +25 XP bonus |
| Streak of 5+ correct | +5 XP per question |
| Complete Reflect phase | +30 XP |

### Badges

| Badge | Name | Unlock Condition |
|-------|------|-----------------|
| 🎯 | **Estimation Explorer** | Complete Phase 3 (all 3 stations) |
| 🔥 | **Streak Champion** | Achieve 10-question correct streak |
| 🌟 | **3-Star Superstar** | 3 stars on any 5 worlds |
| 💡 | **Quick Thinker** | Complete a world in under 2 minutes with 8+ correct |
| 🏆 | **Estimation Master** | Complete all 10 worlds |
| 🌍 | **Global Estimator** | Complete all 10 world themes |
| 📖 | **Story Reader** | Watch all 6 story panels without skipping |
| 🔬 | **Simulation Pro** | Complete all 3 simulation stations with no errors |

### Mascot States (Spark the Robot)

| State | Trigger | Visual |
|-------|---------|--------|
| `idle` | Default, waiting | Gentle breathing animation |
| `thinking` | Question displayed | Hand on chin, blinking |
| `happy` | Correct answer | Bounces, small sparkle burst |
| `celebrate` | World complete / badge unlock | Full backflip, confetti |
| `encourage` | Wrong answer | Soft nod, "Try again!" |
| `excited` | Streak activated | Fire particles around Spark |

---

## 9. UI/UX DESIGN REQUIREMENTS

### Design Reference
The UI **strictly mirrors** the established design system at `https://equal-tau.vercel.app/` and the repository `https://github.com/dsamyak/equal`. All layout, component spacing, colour, typography, and interaction patterns must match this reference.

### Colour Palette (from reference repo)

| Token | Hex | Usage |
|-------|-----|-------|
| `--primary` | `#7C3AED` | CTA buttons, progress fill, mascot accent |
| `--primary-light` | `#EDE9FE` | Card backgrounds, hover states |
| `--success` | `#10B981` | Correct answer feedback, XP bar |
| `--error` | `#EF4444` | Wrong answer feedback, red meter zone |
| `--warning` | `#F59E0B` | Hint indicator, cautionary states |
| `--neutral-900` | `#111827` | Body text, headings |
| `--neutral-100` | `#F3F4F6` | Page background, card base |
| `--accent-blue` | `#3B82F6` | Number line, SVG diagrams, station accents |
| `--accent-yellow` | `#FCD34D` | Stars, XP coins, streak fire |
| `--white` | `#FFFFFF` | Card surfaces, overlay backgrounds |

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Page title | `Inter` or `Nunito` | 2rem | 800 |
| Phase heading | `Inter` | 1.5rem | 700 |
| Body / story text | `Inter` | 1.125rem | 400 |
| Question text | `Inter` | 1.25rem | 600 |
| Number display | `Inter Mono` | 2rem | 700 |
| Button label | `Inter` | 1rem | 600 |
| Mascot speech | `Nunito` | 1rem | 500, italic |

### Layout Principles

- **Single-page vertical scroll** — no routing, all phases stack and reveal
- **Max content width:** 860px, centred with `auto` margins
- **Mobile-first:** optimised for 375px–428px (phone), 768px (tablet), 1280px (desktop)
- **Phase cards** slide in with CSS `translateX` or `opacity` transitions (300ms ease)
- **Number line:** Full-width SVG, minimum 320px, responsive
- **Tap targets:** minimum 48×48px for all interactive elements
- **Progress map:** fixed top bar (64px height), always visible
- **Mascot:** fixed bottom-right corner (64×64px bubble), accessible

### Accessibility

- WCAG 2.1 AA compliance
- All images: descriptive `alt` attributes
- Audio narration: manual captions available (toggle in settings)
- Colour contrast: minimum 4.5:1 ratio for all text
- Keyboard navigation: full tab order for all interactive elements
- Screen reader: ARIA labels on all simulation drag zones and number pads
- Motion: reduced-motion media query respected for all animations

---

## 10. SIMULATION TECHNICAL SPECIFICATIONS

### Station A — Number Line Slider
- SVG-based number line, dynamically generated based on problem range
- Pointer implemented as draggable SVG element with snap zones (±5 unit snap radius)
- Benchmark numbers rendered as labeled tick marks
- "Snap" feedback: visual scale-up + colour change + sound effect
- Range adapts: 0–100 for 2-digit rounding; 0–1000 for 3-digit rounding

### Station B — Estimate-O-Meter
- Gauge implemented as SVG arc + animated needle
- Needle rotates via CSS `transform: rotate()` with `transition: 1s ease-in-out`
- Three colour zones: Red (wrong), Yellow (close), Green (correct)
- After student selects: needle swings to estimate, pauses, then arrow shows exact answer
- Side-by-side comparison card fades in: "Your estimate: 400 | Exact: 423 | Difference: 23"

### Station C — Build the Estimate
- Step-by-step scaffolded input board
- Each blank tile highlights on focus (blue border, scale 1.05)
- Number pad: 3×3 grid + 0 row + backspace, minimum button size 56×56px
- Auto-advance: after filling one blank correctly, cursor jumps to next blank
- Error state: wrong input → tile shakes + red border + hint tooltip

---

## 11. CONTENT LOCALISATION

The module is designed for global students. Content follows these localisation rules:

| Dimension | Approach |
|-----------|---------|
| Currency | Use generic "coins" / "credits" not specific currencies |
| Character names | Globally diverse (see Section 6) — rotate per question set |
| Units | Use both metric and general references (km, items, pages) |
| Cultural contexts | Universal (market, school, sports, travel) — no country-specific customs |
| Language | English (US), clear and simple for EFL students |
| Number format | Western numerals only; comma as thousands separator |
| Reading direction | LTR layout only |

---

## 12. CONTENT INTEGRITY & SAFETY

- All story content is age-appropriate for 8–9 year-olds globally
- No competitive scoring that could cause anxiety; XP is personal, not ranked
- Mascot feedback is always encouraging — never shaming or mocking
- Wrong answer feedback uses: "Good try!", "Almost!", "Let's look again!" — never "Wrong!" in isolation
- No personal data collection beyond session state (localStorage)
- No login required for lesson access; progress saved locally

---

## 13. NON-FUNCTIONAL REQUIREMENTS

| Requirement | Specification |
|-------------|--------------|
| Page load time | < 3 seconds on 4G mobile connection |
| Time to interactive | < 5 seconds |
| Audio load time | < 2 seconds per `.mp3` (pre-cached on lesson load) |
| Offline support | Phase 2 (Story) must work fully offline after initial load |
| Browser support | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| Device support | iOS 14+, Android 8+, Windows/Mac desktop |
| Accessibility | WCAG 2.1 AA |
| Session persistence | 24-hour localStorage resume |
| SEO | Proper meta tags for `intelliasg.com` site map inclusion |
| Analytics | Phase completion events trackable via existing Intellia analytics pipeline |

---

## 14. SUCCESS CRITERIA

The lesson module is considered successfully launched when:

1. All 6 phases render correctly on mobile (375px) and desktop (1280px)
2. ElevenLabs audio plays for all 15+ pre-generated narration scripts
3. All 3 simulation stations are completable with correct answer validation
4. 100 randomised questions generate without repeats in a single session
5. XP, stars, badges, and streak all update correctly
6. Session state persists in localStorage and resumes correctly
7. Page passes WCAG 2.1 AA audit (Lighthouse Accessibility ≥90)
8. Page loads in <3s on simulated 4G throttling (Chrome DevTools)
9. All 10 badge conditions trigger correctly
10. Lesson badge unlocks upon Reflect phase completion

---

## 15. OUT OF SCOPE (v1.0)

- Multi-language localisation (v2.0 roadmap)
- Teacher dashboard / class reporting
- Student login / cloud progress sync
- AI-powered adaptive difficulty (v2.0)
- Parent progress notifications
- Curriculum-specific variant builds (CCSS vs Singapore MOE splits)
- Multiplayer / collaborative estimation challenges

---

*End of PRD — Estimation Using Addition and Subtraction | Grade 3 Math | Intellia 360*
*Document Version 1.0 | June 2026*