# SignTalk Link — Full Project Prompt Planning Guide

> A complete, phase-by-phase prompt blueprint for building a **real-time Sign Language ↔ Speech** translation web application.  
> Copy each phase's prompt into a new AI coding session to incrementally build the project.

---

## Table of Contents

1. [Project Overview & Architecture](#project-overview--architecture)
2. [Phase 0 — Project Scaffolding & Design System](#phase-0--project-scaffolding--design-system)
3. [Phase 1 — Core Layout, Navigation & Landing Page](#phase-1--core-layout-navigation--landing-page)
4. [Phase 2 — Speech-to-Text Display (Feature 1: Voice → Text for Deaf Users)](#phase-2--speech-to-text-display)
5. [Phase 3 — Camera & Hand Detection UI (MediaPipe Integration)](#phase-3--camera--hand-detection-ui)
6. [Phase 4 — Sign-to-Speech via Gemini API (Feature 2: The Core Feature)](#phase-4--sign-to-speech-via-gemini-api)
7. [Phase 5 — Smart Sentence Assembly & Text-to-Speech Output](#phase-5--smart-sentence-assembly--text-to-speech-output)
8. [Phase 6 — Polish, PWA, Mobile Optimization & Production](#phase-6--polish-pwa-mobile-optimization--production)
9. [Phase 7 — On-Device Gesture AI with TensorFlow.js (Future Upgrade)](#phase-7--on-device-gesture-ai-with-tensorflowjs-future-upgrade)

---

## Project Overview & Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    SignTalk Link                         │
│         Real-time Sign Language ↔ Speech Platform        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────┐       ┌──────────────────────┐     │
│  │  MODE 1          │       │  MODE 2 (Core)       │     │
│  │  Voice → Text    │       │  Sign → Speech       │     │
│  │                  │       │                      │     │
│  │  Web Speech API  │       │  Camera (getUserMedia)│     │
│  │  (Recognition)   │       │  MediaPipe Hands     │     │
│  │       ↓          │       │       ↓              │     │
│  │  Live transcript │       │  Record short clip   │     │
│  │  on screen for   │       │       ↓              │     │
│  │  deaf user to    │       │  Send to Gemini API  │     │
│  │  read            │       │  (Multimodal Vision) │     │
│  │                  │       │       ↓              │     │
│  │                  │       │  Natural sentence    │     │
│  │                  │       │       ↓              │     │
│  │                  │       │  Web Speech API      │     │
│  │                  │       │  (Synthesis/TTS)     │     │
│  └─────────────────┘       └──────────────────────┘     │
│                                                         │
│  Tech Stack:                                            │
│  ├── Frontend: React 18 + Vite + TypeScript             │
│  ├── Styling: Tailwind CSS + shadcn/ui                  │
│  ├── Hand Tracking: @mediapipe/tasks-vision (WASM)      │
│  ├── AI Translation: Gemini 2.0 Flash API               │
│  ├── Voice I/O: Web Speech API (browser-native)         │
│  ├── Backend: Express.js (API proxy + session)          │
│  └── State: TanStack Query + Zustand                    │
└─────────────────────────────────────────────────────────┘
```

---

## Phase 0 — Project Scaffolding & Design System

### Prompt

```
Create a new full-stack web application called "SignTalk Link" — a real-time sign language
to speech translation platform. Use the following tech stack:

**Frontend:**
- React 18 with TypeScript
- Vite as the build tool
- Tailwind CSS for styling
- shadcn/ui component library (install with CLI)
- Lucide React for icons
- Zustand for client-side state management
- TanStack Query for server-state
- wouter for routing

**Backend:**
- Express.js with TypeScript
- A simple API proxy route at POST /api/translate that will later forward requests to
  the Gemini API

**Project structure:**
```
signtalk-link/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/          (shadcn components)
│   │   │   ├── layout/      (AppShell, Navbar, MobileNav)
│   │   │   └── shared/      (reusable pieces)
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── stores/          (Zustand stores)
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── index.html
├── server/
│   ├── index.ts
│   ├── routes.ts
│   └── gemini.ts            (Gemini API client, placeholder)
├── shared/
│   └── types.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

**Design System — set up in index.css and tailwind.config.ts:**

Color palette concept: Deep navy/dark background (#0a0e1a) with electric blue (#3b82f6)
and cyan (#06b6d4) accents. Glassmorphism cards with backdrop-blur. Soft glow/neon
effects for interactive elements.

Typography: Use "Inter" from Google Fonts as the primary font, "JetBrains Mono" for
any code/technical labels.

Create CSS custom properties for:
- --color-primary (electric blue)
- --color-accent (cyan)
- --color-surface (semi-transparent glass cards)
- --color-glow (soft blue glow for active states)

Add utility classes for:
- .glass-card  (backdrop-blur + semi-transparent bg + subtle border)
- .glow-border (animated glowing border effect)
- .pulse-ring  (ripple/pulse animation for microphone/camera buttons)
- .scan-line   (a subtle horizontal scanning line animation for the camera HUD)

Do NOT add any pages or features yet — just the scaffolding, design tokens, and an
empty App.tsx with routing set up for these future routes:
  /              → Home (landing page)
  /translate     → Main translation interface
  /history       → Conversation history
  /settings      → Settings page

Make sure `npm run dev` works and shows a blank styled page.
```

---

## Phase 1 — Core Layout, Navigation & Landing Page

### Prompt

```
Build the core layout shell and a stunning landing/home page for SignTalk Link.

**1. AppShell layout (client/src/components/layout/AppShell.tsx):**
- A responsive app shell that wraps all pages
- On desktop: a slim left sidebar (width ~72px collapsed, ~240px expanded on hover)
  with navigation icons for Home, Translate, History, Settings
- On mobile: a bottom tab bar with the same 4 navigation items
- The sidebar/tab bar should use glass-card styling with subtle blur
- Active route indicator: a small glowing dot or highlighted icon
- Include a dark/light mode toggle (default to dark mode)
- Show "SignTalk Link" branding with a small animated logo (CSS-only waveform icon)

**2. Landing page (client/src/pages/Home.tsx):**
Create a visually spectacular landing page that explains the app. Include:

- **Hero section:**
  - Large heading: "Break the silence barrier." with a gradient text effect
    (electric blue → cyan)
  - Subheading: "Real-time sign language translation powered by AI.
    No app install needed — just open your browser."
  - Two large CTA buttons side by side:
    - "Start Translating" (primary, glowing, links to /translate)
    - "Learn How It Works" (outline, scrolls to features section)
  - A decorative animated background: subtle floating particles or gentle
    gradient mesh that slowly shifts colors

- **How it works section (3 steps):**
  Step 1: "Sign in front of your camera" — with a camera icon
  Step 2: "AI understands your message" — with a brain/sparkle icon
  Step 3: "Your words are spoken aloud" — with a speaker/sound wave icon
  Each step card should animate in on scroll (use Intersection Observer,
  no heavy libraries)

- **Two feature cards side by side:**
  Card 1: "🧏 Sign → Speech" — "Sign language in front of your camera.
           AI translates and speaks your words naturally."
           Tag: "Core Feature" with a glow badge
  Card 2: "🗣️ Voice → Text" — "Speak into your mic. Your words appear
           as large, clear text for deaf users to read."
           Tag: "Accessibility"

- **Stats/trust section:**
  Three animated counters: "< 2s Response Time", "21 Hand Landmarks",
  "Powered by Gemini AI"

- **Footer:**
  Minimal footer with "Built with ❤️ for accessibility" centered text

All sections should have smooth reveal animations on scroll. Use only CSS animations
and Intersection Observer — no Framer Motion or GSAP. The page must feel alive,
premium, and inspiring.
```

---

## Phase 2 — Speech-to-Text Display

### Prompt

```
Build the "Voice → Text" feature for SignTalk Link. This is the simpler of the two
modes: a hearing person speaks into their microphone, and their words appear as
large text on screen for a deaf user to read.

**Page: client/src/pages/Translate.tsx**
This page is the main translation interface with two mode tabs at the top:
- Tab 1: "🧏 Sign → Speech" (will be built in Phase 3-5, show a "Coming Soon"
  placeholder card for now)
- Tab 2: "🗣️ Voice → Text" (build this now)

The tabs should be large, touch-friendly, and use the glass-card style.

**Voice → Text mode UI (when Tab 2 is active):**

1. **Microphone button (center of screen):**
   - A large circular button (96px on mobile, 120px on desktop)
   - Idle state: subtle breathing pulse animation (scale 1.0 → 1.05)
   - Listening state: active ripple rings emanating outward (pulse-ring class),
     button turns electric blue with a glow effect
   - Below the button: small status text ("Tap to start listening" / "Listening..." /
     "Tap to stop")

2. **Live transcript display:**
   - Above the microphone button, show a large text area (like a teleprompter)
   - Text appears word by word in real-time as the user speaks
   - Use large font size (min 28px on mobile, 36px on desktop) for readability
   - The current "in-progress" sentence should be in a slightly dimmer color
   - Completed/finalized sentences should be fully opaque
   - Auto-scroll to the latest text
   - Show a blinking cursor/caret at the end of the current text

3. **Controls bar below the microphone:**
   - Language selector dropdown (Thai / English) — this sets the recognition language
   - A "Clear transcript" button (trash icon)
   - Font size adjustment (A- / A+) to let the deaf user choose their comfort level

**Technical implementation:**
- Use the Web Speech API (window.SpeechRecognition or webkitSpeechRecognition)
- Set continuous = true and interimResults = true for real-time streaming
- Handle the onresult event to separate interim vs final transcripts
- Handle onerror and onend gracefully (auto-restart if the user hasn't pressed stop)
- Store transcript history in Zustand store

**Create these files:**
- client/src/hooks/useSpeechRecognition.ts  (custom hook wrapping Web Speech API)
- client/src/stores/transcriptStore.ts      (Zustand store for transcript state)
- client/src/components/shared/MicrophoneButton.tsx
- client/src/components/shared/TranscriptDisplay.tsx
- client/src/components/shared/LanguageSelector.tsx

Make sure the microphone button feels satisfying to press with proper haptic-like
visual feedback (scale bounce on press). The transcript text should feel alive as
words appear in real-time.
```

---

## Phase 3 — Camera & Hand Detection UI

### Prompt

```
Build the camera interface and MediaPipe hand detection overlay for the
"Sign → Speech" mode in SignTalk Link.

**Install dependencies:**
- @mediapipe/tasks-vision (the latest MediaPipe Vision WASM bundle for hand landmark
  detection in the browser)

**Update the Translate page:**
Replace the "Coming Soon" placeholder in Tab 1 ("🧏 Sign → Speech") with the
full camera interface.

**Camera interface UI design:**

1. **Camera viewport (takes up most of the screen):**
   - Use navigator.mediaDevices.getUserMedia to access the camera
   - On mobile: default to the front-facing camera (facingMode: "user"),
     with a camera flip button (toggle to "environment")
   - Display the video feed in a rounded-2xl container with a subtle
     glass border
   - Aspect ratio: 4:3 on mobile (portrait), 16:9 on desktop

2. **MediaPipe Hand Landmarks overlay:**
   - Layer a <canvas> element exactly on top of the <video> element
   - Use @mediapipe/tasks-vision HandLandmarker to detect hand landmarks
   - Draw the 21 hand landmark points as small glowing cyan dots
   - Draw the bone connections between landmarks as thin electric-blue lines
   - The skeleton should update at the camera's frame rate (aim for 30fps)
   - When NO hand is detected: show a subtle text overlay
     "Show your hand to the camera" with a ghost hand icon

3. **HUD (Heads-Up Display) overlay elements:**
   - Top-left corner: "LIVE" indicator (small red dot + "LIVE" text,
     pulsing animation)
   - Top-right corner: FPS counter showing current detection frame rate
   - Bottom of the viewport: a translucent status bar showing:
     - Detection status: "Hand detected ✓" (green) or "No hand" (gray)
     - Number of hands detected: "Hands: 1" / "Hands: 2"
   - The entire HUD should have a sci-fi / medical scanner aesthetic
     — think subtle scan-line animation across the viewport

4. **Control buttons (below the camera viewport):**
   - "Start Recording" / "Stop Recording" toggle button (large, primary style)
     This button will be used in Phase 4 to record a short video clip.
     For now, it should toggle a state and show visual feedback (button
     glows red when recording, with a recording timer "0:02 / 0:03")
   - "Flip Camera" button (icon button)
   - "Settings" button (icon button — placeholder for future detection
     settings like sensitivity)

**Technical implementation — create these files:**

- client/src/hooks/useCamera.ts
  Custom hook that manages:
  - getUserMedia stream lifecycle (start, stop, flip camera)
  - Attaching stream to a <video> element ref
  - Cleanup on unmount

- client/src/hooks/useHandDetection.ts
  Custom hook that manages:
  - Loading the MediaPipe HandLandmarker WASM model
  - Running detection on each video frame via requestAnimationFrame
  - Returning the latest HandLandmarkerResult (landmarks array)
  - Calculating and exposing current FPS
  - Providing a "loading" state while the model downloads

- client/src/components/camera/CameraViewport.tsx
  The main camera + canvas + HUD overlay component

- client/src/components/camera/HandSkeleton.tsx
  A pure rendering component: given a canvas context and landmarks array,
  draws the hand skeleton with the glowing dot + line style

- client/src/components/camera/CameraHUD.tsx
  The HUD overlay (LIVE indicator, FPS, detection status)

- client/src/components/camera/CameraControls.tsx
  The control buttons bar

**Important notes:**
- The MediaPipe WASM files should be loaded from CDN
  (https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm)
- Use the "lite" model variant for faster loading on mobile
  (hand_landmarker.task)
- Make sure to properly dispose of the HandLandmarker when the component
  unmounts to prevent memory leaks
- The canvas drawing should use requestAnimationFrame for smooth rendering
- Test that it works on both desktop (Chrome) and mobile (Chrome Android /
  Safari iOS)
```

---

## Phase 4 — Sign-to-Speech via Gemini API

### Prompt

```
Build the core "Sign → Speech" translation pipeline for SignTalk Link.
This is THE key feature: the user performs sign language gestures in front of
their camera, the system records a short video clip, sends it to the Gemini API
for multimodal analysis, and receives a natural language translation.

**Architecture overview:**
```
[User signs in front of camera]
       ↓
[Browser records 3-second video clip using MediaRecorder API]
       ↓
[Video blob is sent to our Express backend: POST /api/translate]
       ↓
[Backend forwards the video to Gemini 2.0 Flash API with a specialized prompt]
       ↓
[Gemini analyzes the sign language video and returns a natural sentence]
       ↓
[Frontend displays the translated sentence + speaks it aloud via TTS]
```

**Step 1: Video recording hook — client/src/hooks/useVideoRecorder.ts**
- Use the MediaRecorder API to record from the existing camera stream
- Record for a configurable duration (default: 3 seconds)
- Output format: video/webm (with VP8 codec for broad compatibility)
- Provide states: idle → recording → processing
- Return the recorded video as a Blob
- Show a visual countdown during recording (3... 2... 1...)
- Auto-stop recording when duration is reached

**Step 2: Backend Gemini integration — server/gemini.ts**
- Create a Gemini API client using @google/genai (official Google AI SDK)
- Read the API key from environment variable: GEMINI_API_KEY
- Create a function translateSignLanguage(videoBuffer, mimeType, targetLanguage):
  - Converts the video buffer to base64
  - Sends it to Gemini 2.0 Flash with the following system prompt:

"""
You are a professional sign language interpreter specializing in medical and
daily-life communication. You will receive a short video clip of a person
performing sign language gestures.

Your task:
1. Carefully observe ALL visual cues: hand shapes, hand movements, facial
   expressions, body posture, and mouth movements.
2. Identify the sign language words/concepts being expressed.
3. Translate them into a single, natural, polite sentence in {targetLanguage}.

Rules:
- Output ONLY the translated sentence. No explanations, no labels,
  no extra commentary.
- If the gestures are ambiguous or unclear, provide your best interpretation
  with natural phrasing.
- If you cannot identify any sign language gestures, respond with exactly:
  "[NO_SIGN_DETECTED]"
- Keep the tone polite and appropriate for a medical/service context.
- Do NOT invent information beyond what the gestures convey.

Target language: {targetLanguage}
"""

  - Parse the response and return { translatedText: string, success: boolean }

**Step 3: Backend route — server/routes.ts**
- POST /api/translate
  - Accepts multipart/form-data with fields:
    - video: the video file (Blob)
    - targetLanguage: "Thai" | "English" (default: "Thai")
  - Use multer or busboy to parse the multipart upload
  - Call translateSignLanguage() with the video buffer
  - Return JSON: { translatedText: string, success: boolean, error?: string }
  - Handle errors gracefully (API timeout, invalid video, rate limits)
  - Add a simple in-memory rate limiter: max 10 requests per minute per IP

**Step 4: Frontend translation hook — client/src/hooks/useTranslation.ts**
- Custom hook that orchestrates the full pipeline:
  1. Call useVideoRecorder to get the video blob
  2. Send the blob to POST /api/translate via fetch (multipart/form-data)
  3. Handle loading/error/success states
  4. Return { translate(), translatedText, isTranslating, error }

**Step 5: Update the Translate page UI**
Integrate the recording + translation flow into the Sign → Speech tab:

- When user presses "Start Recording":
  1. Button turns red with recording animation
  2. A circular countdown timer appears over the camera viewport (3... 2... 1...)
  3. HUD shows "RECORDING" instead of "LIVE"
  
- When recording finishes:
  1. Button shows "Translating..." with a loading spinner
  2. A glass-card panel slides up from the bottom showing:
     - "Analyzing your signs..." with a shimmer/skeleton animation
  
- When translation result arrives:
  1. The bottom panel updates to show the translated sentence in large text
  2. A "Speak" button auto-triggers (or manually) to read it aloud
  3. The sentence card has a subtle entrance animation (slide up + fade in)
  4. Show a "Copy" button and a "Translate Again" button

- If no sign was detected:
  1. Show a friendly message: "I couldn't detect any signs. Please try again
     with clearer hand movements in good lighting."
  2. Show tips: "Make sure your hands are visible and well-lit"

**Step 6: Translation result display — client/src/components/camera/TranslationResult.tsx**
- A slide-up panel that shows the AI's translation
- Large text display (min 24px)
- Speaker icon button that triggers TTS (Web Speech Synthesis)
- "Copy to clipboard" button
- "Try again" button
- Timestamp of when the translation was made
- Animation: slides up from bottom with spring easing

**Environment setup:**
- Add GEMINI_API_KEY to a .env file (with .env.example for reference)
- Document that users need to get a free API key from
  https://aistudio.google.com/apikey
```

---

## Phase 5 — Smart Sentence Assembly & Text-to-Speech Output

### Prompt

```
Enhance the translation output and build the Text-to-Speech system for
SignTalk Link. This phase focuses on making the spoken output natural
and the conversation flow smooth.

**1. Dual-Mode Text-to-Speech hook — client/src/hooks/useTextToSpeech.ts**
Create a custom hook that manages both **Local Browser TTS** (Web Speech API) and **Backend Cloud TTS** (Google Cloud Text-to-Speech or Microsoft Azure Neural TTS via backend proxy), depending on settings:
- `speak(text, language)`: Speak the given text.
  - If `ttsMode === "local"`: Use native `window.speechSynthesis` with proper voice selection fallbacks.
  - If `ttsMode === "cloud"`: Fetch high-quality neural Thai audio (MP3 base64/binary) from `POST /api/tts` and play it via a native HTML `<audio>` element dynamic context.
- `stop()`: Stop any current speech (both local utterance or cloud audio playback).
- `isSpeaking`: boolean state.
- `ttsMode`: `"local" | "cloud"` (configured in Settings, loaded from Zustand store).
- `voices`: available local system voices.
- `selectedVoice`: current local voice (persist in localStorage).
- `rate` / `pitch`: speech rate and pitch adjustments.

Implementation details:
- For Local Mode: Filter available local voices. For Thai, prefer Microsoft Natural, Google Thai, or Apple Kanya/Siri Premium. Fall back to local system voice.
- **iOS Safari Unlock:** To bypass iOS blocking asynchronous audio plays, trigger an empty/silent utterance `new SpeechSynthesisUtterance("")` with 0 volume synchronously on user interaction (e.g. clicking the Translate/Record button).
- For Cloud Mode: Fetch high-quality neural voice from `/api/tts` passing `{ text, language }`. Play using a single reused Web Audio API context or HTMLAudioElement.
- Auto-speak the translation result when it arrives (configurable in settings).

**2. Conversation history — client/src/stores/conversationStore.ts**
Create a Zustand store that maintains the conversation flow:

type Message = {
  id: string;
  timestamp: number;
  type: "sign-to-speech" | "voice-to-text";
  originalInput: string;      // keywords detected or voice transcript
  translatedOutput: string;   // AI-restructured sentence or displayed text
  language: "th" | "en";
  videoThumbnail?: string;    // base64 thumbnail from the recorded video
};

- addMessage(message): Add to conversation
- clearHistory(): Clear all
- messages: Message[]  (most recent first)
- Persist to localStorage so history survives page reload

**3. Conversation history page — client/src/pages/History.tsx**
Build a beautiful conversation history page:

- Display messages in a chat-bubble style timeline
- Sign-to-speech messages: show on the LEFT side with a hand icon,
  include a small video thumbnail if available
- Voice-to-text messages: show on the RIGHT side with a mic icon
- Each message bubble shows:
  - The translated/displayed text
  - Timestamp (relative: "2 min ago", "1 hour ago")
  - A "Replay" button (speaks the text again via TTS)
  - A "Copy" button
- Empty state: "No conversations yet. Start translating to see your
  history here."
- "Clear all history" button with confirmation dialog

**4. Continuous translation mode (optional enhancement):**
Add a toggle in the Sign → Speech tab: "Continuous Mode"
When enabled:
- After each translation completes and is spoken, automatically start
  recording again after a 2-second pause
- This creates a flow where the deaf user can sign multiple sentences
  continuously without pressing the button each time
- Show a small queue of recent translations stacking up in the
  bottom panel (like a chat log within the translation view)
- The user can tap any previous translation to re-speak it

**5. Update Settings page — client/src/pages/Settings.tsx**
Build a settings page with these sections:

Section 1: "Speech Output"
- **TTS Mode Selection:** Toggle/Select between "On-Device (Free, local voices)" and "Cloud Neural (High Quality, identical on all devices)"
- Voice selection dropdown (filtered by current language, enabled when in local mode)
- Speech rate slider (0.8x — 1.2x)
- Speech pitch slider
- "Test voice" button that speaks a sample sentence
- Auto-speak toggle (on/off)

Section 2: "Camera"
- Default camera selection (front/back)
- Recording duration slider (2s — 5s, default 3s)

Section 3: "Language"
- Primary language: Thai / English
- This affects both the Gemini prompt and TTS voice

Section 4: "Accessibility"
- High contrast mode toggle
- Large text mode toggle (increases all font sizes by 25%)
- Reduced motion toggle (disables animations)

Section 5: "Data"
- "Clear conversation history" button
- "About SignTalk Link" info

All settings should persist to localStorage and be read from a Zustand
settings store.

**Create these files:**
- client/src/hooks/useTextToSpeech.ts
- server/tts.ts                              (Backend service for Google Cloud or Azure TTS)
- client/src/stores/conversationStore.ts
- client/src/stores/settingsStore.ts         (holds `ttsMode: "local" | "cloud"`)
- client/src/pages/History.tsx
- client/src/pages/Settings.tsx
- client/src/components/history/MessageBubble.tsx
- client/src/components/history/ConversationTimeline.tsx
- client/src/components/settings/SettingsSection.tsx
- client/src/components/settings/VoiceSelector.tsx
```

---

## Phase 6 — Polish, PWA, Mobile Optimization & Production

### Prompt

```
Final polish phase for SignTalk Link. Make it production-ready, installable
as a PWA, and optimized for mobile use.

**1. Progressive Web App (PWA) setup:**
- Add a manifest.json with:
  - name: "SignTalk Link"
  - short_name: "SignTalk"
  - description: "Real-time sign language translation"
  - theme_color: "#0a0e1a"
  - background_color: "#0a0e1a"
  - display: "standalone"
  - orientation: "portrait"
  - icons: generate proper PWA icons (192x192, 512x512)
- Add a basic service worker (use vite-plugin-pwa or workbox) for:
  - Caching static assets (CSS, JS, fonts)
  - Offline fallback page: "You're offline. SignTalk Link needs an internet
    connection for AI translation."
  - Cache the MediaPipe WASM model files after first download
- Add the "install app" prompt: detect beforeinstallprompt event and show
  a dismissible banner: "Install SignTalk Link for the best experience"

**2. Mobile-specific optimizations:**
- Camera viewport: full-screen on mobile with minimal UI chrome
- Add "Keep screen awake" using the Wake Lock API (navigator.wakeLock)
  during active translation sessions
- Optimize touch targets: all buttons minimum 48x48px
- Add haptic feedback on button press (navigator.vibrate(50)) for supported
  devices
- Handle orientation changes gracefully (lock to portrait if possible,
  or adapt layout for landscape)
- Optimize MediaPipe performance for mobile:
  - Use the "lite" model variant
  - Reduce detection frame rate to 15fps on low-end devices
  - Add a performance detection heuristic: if FPS drops below 10,
    show a tip: "For better performance, close other apps"

**3. Error handling & edge cases:**
- Camera permission denied: show a clear instruction card with steps
  to enable camera access for each browser
- Microphone permission denied: same pattern
- Gemini API errors: show user-friendly messages, offer retry
- Slow network: show progress indicator when uploading video
- Browser not supported: detect if Web Speech API or MediaPipe is
  unavailable and show alternative suggestions
- Rate limit exceeded: show "Please wait a moment before translating again"

**4. Loading & onboarding experience:**
- App loading screen: show the SignTalk logo with a subtle pulse animation
  while the app bundle loads
- First-time onboarding flow (3 slides, shown only once):
  Slide 1: "Welcome to SignTalk Link" + app illustration
  Slide 2: "Sign → Speech: Sign in front of your camera, AI speaks for you"
  Slide 3: "Voice → Text: Speak into your mic, words appear on screen"
  + "Get Started" button
- Store onboarding completion in localStorage

**5. Accessibility (a11y) — critical for this app:**
- All interactive elements must have proper aria-labels
- Camera viewport: aria-live="polite" region for detection status updates
- Translation results: aria-live="assertive" so screen readers announce them
- Focus management: when translation result appears, move focus to the
  result panel
- Keyboard navigation: all features must be usable without a mouse
- Color contrast: ensure all text meets WCAG AA standards (4.5:1 ratio)
- Reduced motion: respect prefers-reduced-motion media query

**6. SEO & meta tags (in index.html):**
- Title: "SignTalk Link — Real-time Sign Language Translation"
- Meta description: "Break the silence barrier. Translate sign language to
  speech in real-time using AI. Free, browser-based, no installation needed."
- Open Graph tags for social sharing
- Proper lang attribute on <html>

**7. Performance checklist:**
- Lazy-load the MediaPipe WASM model (don't load until user opens the
  camera tab)
- Code-split pages with React.lazy + Suspense
- Compress all assets, use modern image formats
- Target Lighthouse scores: Performance > 90, Accessibility > 95
- Bundle size budget: main JS bundle < 200KB gzipped (excluding MediaPipe
  WASM which loads separately)

**8. Production build configuration:**
- Ensure `npm run build` produces an optimized production bundle
- Environment variable validation on startup
- Add a health check endpoint: GET /api/health → { ok: true, version: "1.0.0" }
- Add basic request logging on the backend
```

---

## Appendix: Key Technical References

### MediaPipe Hands Integration
```typescript
// Example: Loading HandLandmarker in the browser
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

const vision = await FilesetResolver.forVisionTasks(
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
);

const handLandmarker = await HandLandmarker.createFromOptions(vision, {
  baseOptions: {
    modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
    delegate: "GPU"
  },
  runningMode: "VIDEO",
  numHands: 2
});
```

### Web Speech API — Recognition
```typescript
// Example: Speech Recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "th-TH"; // or "en-US"
```

### Web Speech API — Synthesis (TTS)
```typescript
// Example: Text-to-Speech
const utterance = new SpeechSynthesisUtterance("สวัสดีครับ ผมปวดท้อง");
utterance.lang = "th-TH";
utterance.rate = 1.0;
window.speechSynthesis.speak(utterance);
```

### Gemini API — Video Analysis
```typescript
// Example: Sending video to Gemini (server-side with @google/genai)
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const response = await ai.models.generateContent({
  model: "gemini-2.0-flash",
  contents: [{
    role: "user",
    parts: [
      { text: "Translate the sign language in this video to Thai..." },
      { inlineData: { mimeType: "video/webm", data: base64Video } }
    ]
  }]
});
```

### MediaRecorder — Video Recording
```typescript
// Example: Recording a video clip from camera stream
const mediaRecorder = new MediaRecorder(stream, {
  mimeType: "video/webm;codecs=vp8"
});
const chunks: Blob[] = [];
mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
mediaRecorder.onstop = () => {
  const blob = new Blob(chunks, { type: "video/webm" });
  // Send blob to backend...
};
mediaRecorder.start();
setTimeout(() => mediaRecorder.stop(), 3000); // Record 3 seconds
```

### TensorFlow.js — Loading and Running LSTM Gesture Model (Phase 7)
```typescript
// Example: Loading a converted Keras LSTM model in the browser
import * as tf from "@tensorflow/tfjs";

// Load model from public directory
const model = await tf.loadLayersModel("/models/gesture_lstm/model.json");

// Input shape: [1, 30, 126] = [batch, frames, features]
// 30 frames × (21 landmarks × 3 coordinates × 2 hands) = 126 features per frame
const inputTensor = tf.tensor3d([landmarkSequence], [1, 30, 126]);

const prediction = model.predict(inputTensor) as tf.Tensor;
const probabilities = await prediction.data();
const predictedIndex = probabilities.indexOf(Math.max(...probabilities));
const confidence = probabilities[predictedIndex];

// Map index to gesture label
const labels = ["ache", "eat", "good", "hurt", "medicine", "name", "slow", "drug_please"];
const detectedGesture = labels[predictedIndex];

// Cleanup tensors to prevent memory leaks
inputTensor.dispose();
prediction.dispose();
```

### TensorFlow.js — Landmark Normalization (Phase 7)
```typescript
// Normalize landmarks relative to wrist (landmark 0) for position invariance
function normalizeLandmarks(landmarks: { x: number; y: number; z: number }[]): number[] {
  const wrist = landmarks[0];
  const features: number[] = [];
  for (const lm of landmarks) {
    features.push(lm.x - wrist.x, lm.y - wrist.y, lm.z - wrist.z);
  }
  return features; // 63 values per hand (21 × 3)
}
```

---

## Phase 7 — On-Device Gesture AI with TensorFlow.js (Future Upgrade)

### Why This Phase Exists

Phase 4 uses Gemini API to analyze sign language from video clips. This works
well and produces excellent results, but it has trade-offs:
- **1.5–2.5 second latency** per translation (network round-trip)
- **API cost** scales with usage (not ideal for a free public tool)
- **Requires internet** at all times
- **Cannot do true real-time** continuous recognition

Phase 7 replaces the Gemini video analysis with an **on-device LSTM/GRU neural
network** that runs directly in the browser via TensorFlow.js. This enables:
- **~50ms latency** (true real-time, no network needed for gesture detection)
- **Zero API cost** for gesture recognition
- **Offline-capable** gesture detection
- **Continuous streaming** recognition (no "press to record" needed)

The Gemini API is still used as a **fallback** and for the **sentence
restructuring** step (keywords → natural sentence), but the heavy lifting
of gesture classification moves to the client.

### Prompt

```
Upgrade SignTalk Link's "Sign → Speech" pipeline to use an on-device gesture
classification model (LSTM) running in the browser via TensorFlow.js,
replacing the Gemini video analysis for gesture detection. This eliminates
network latency for gesture recognition and enables true real-time,
continuous sign language detection.

**IMPORTANT: This phase has TWO parts:**
- Part A: A Python training pipeline (run once offline to produce the model)
- Part B: Browser integration (load the trained model in the web app)

---

**PART A — Training Pipeline (Python / Keras)**

Create a standalone training directory: `training/`

```
training/
├── collect_data.py        (record landmark sequences from webcam)
├── train_model.py         (train LSTM/GRU classifier)
├── convert_model.py       (convert Keras → TensorFlow.js format)
├── evaluate_model.py      (test accuracy + confusion matrix)
├── requirements.txt       (Python dependencies)
├── data/                  (collected landmark sequences, .npy files)
├── models/                (saved Keras + TF.js models)
└── README.md              (instructions)
```

**Step A1: Data Collection Script — training/collect_data.py**

Build a Python script using OpenCV + MediaPipe that:
1. Opens the webcam and runs MediaPipe Hands detection
2. Shows the camera feed with hand skeleton overlay (similar to the web app)
3. Displays a UI prompt: "Perform the sign for: [WORD]"
4. When the user presses 'R', records 30 frames (~1 second at 30fps) of
   hand landmark data
5. Each frame captures: 21 landmarks × 3 coordinates (x, y, z) × 2 hands
   = 126 features per frame (pad with zeros if only 1 hand detected)
6. Normalizes landmarks relative to the wrist joint (landmark 0) to make
   the model position-invariant and scale-invariant
7. Saves each recording as a numpy array of shape (30, 126) in
   `data/{gesture_name}/sequence_{n}.npy`
8. Supports these gesture labels (matching the video files in the project):
   - "ache" (ปวด)
   - "eat" (กิน)
   - "good" (ดี)
   - "hurt" (เจ็บ)
   - "medicine" (ยา)
   - "name" (ชื่อ)
   - "slow" (ช้า)
   - "drug_please" (ขอยา)
   - "idle" (no gesture — IMPORTANT: include a "nothing" class to prevent
     false positives when the user is not signing)
9. Target: collect at least 30 samples per gesture class
   (more samples = better accuracy)
10. Include data augmentation: for each recorded sequence, generate 2-3
    augmented versions with small random noise (±2% on each coordinate)
    and slight time-stretching (±10% frame interpolation)

**Step A2: Model Training — training/train_model.py**

Train a lightweight LSTM gesture classifier:

Architecture:
```python
model = Sequential([
    # Input: (30 frames, 126 features)
    LSTM(64, return_sequences=True, input_shape=(30, 126)),
    Dropout(0.3),
    LSTM(128, return_sequences=False),
    Dropout(0.3),
    Dense(64, activation='relu'),
    Dropout(0.2),
    Dense(num_classes, activation='softmax')
])
```

Training details:
- Optimizer: Adam (lr=0.001)
- Loss: categorical_crossentropy
- Epochs: 100 with EarlyStopping (patience=15, restore_best_weights=True)
- Validation split: 20%
- Batch size: 32
- Save the best model as `models/gesture_lstm.keras`
- Print final accuracy, per-class precision/recall, and confusion matrix
- Target accuracy: > 90% on validation set

**Step A3: Model Conversion — training/convert_model.py**

Convert the trained Keras model to TensorFlow.js format:
```python
import tensorflowjs as tfjs
tfjs.converters.save_keras_model(model, 'models/tfjs_gesture_lstm/')
```
This produces:
- `models/tfjs_gesture_lstm/model.json` (model architecture + weight manifest)
- `models/tfjs_gesture_lstm/group1-shard1of1.bin` (weights binary)

Copy these files to the web app: `client/public/models/gesture_lstm/`

**Step A4: Evaluation — training/evaluate_model.py**
- Load the saved model and test data
- Print classification report (precision, recall, F1 per class)
- Generate and display a confusion matrix heatmap
- Test with "live" webcam inference to verify real-time performance
- Measure average inference time per prediction (target: < 10ms)

---

**PART B — Browser Integration (TensorFlow.js)**

**Install dependencies:**
- @tensorflow/tfjs (TensorFlow.js core library)

**Step B1: Gesture classifier hook — client/src/hooks/useGestureClassifier.ts**

Create a custom hook that:
1. Loads the TF.js model from `/models/gesture_lstm/model.json` on mount
   (with a loading state indicator)
2. Maintains a rolling buffer of the last 30 frames of normalized
   MediaPipe hand landmarks (a sliding window)
3. On each new frame from useHandDetection:
   a. Normalize the 21 landmarks relative to wrist (subtract wrist position)
   b. Flatten to 63 values per hand (126 total for 2 hands, zero-pad if 1 hand)
   c. Push into the rolling buffer, discard oldest frame
4. Every 5 frames (6 times per second), run inference:
   a. Convert the 30-frame buffer to a TF.js tensor of shape [1, 30, 126]
   b. Call model.predict() to get probability distribution over gesture classes
   c. Apply confidence threshold: only accept if max probability > 0.75
   d. Apply stability filter: only emit a gesture if the SAME gesture is
      predicted for 3 consecutive inference cycles (debounce to prevent
      flickering)
5. Return:
   - detectedGesture: string | null (the current gesture label)
   - confidence: number (0-1)
   - isModelLoaded: boolean
   - isDetecting: boolean
   - gestureHistory: string[] (accumulated keywords for sentence building)

**Step B2: Keyword accumulator — client/src/hooks/useKeywordAccumulator.ts**

Create a hook that builds a sentence from detected gestures:
1. When a new gesture is detected (different from the previous one),
   add it to a keywords array
2. Ignore consecutive duplicates (e.g., "hurt, hurt, hurt" → just "hurt")
3. Ignore the "idle" class entirely (it means no gesture)
4. Detect "sentence end" trigger:
   - If no hand is detected for > 2 seconds (user lowered their hands)
   - OR if the user presses a manual "Send" button
5. When sentence ends:
   a. Take the accumulated keywords array, e.g. ["hurt", "stomach", "medicine"]
   b. Send ONLY these keywords (not a video) to the backend for AI restructuring
   c. Clear the accumulator for the next sentence
6. Return:
   - keywords: string[] (current accumulated keywords)
   - sendSentence(): manually trigger sentence end
   - clearKeywords(): reset the accumulator
   - isAccumulating: boolean

**Step B3: Lightweight restructuring endpoint — server/routes.ts**

Add a new endpoint: POST /api/restructure
This is MUCH cheaper and faster than sending video, because we only send
a small JSON payload of keywords:

Request body:
{
  "keywords": ["hurt", "stomach", "medicine"],
  "targetLanguage": "Thai"
}

Gemini prompt for restructuring:
"""
You are a sign language interpreter assistant. You receive a sequence of
keywords that were detected from sign language gestures. Convert these
keywords into a single natural, polite sentence in {targetLanguage}.

Rules:
- Output ONLY the final sentence. No explanations.
- Add appropriate grammar, particles, and politeness markers.
- Infer reasonable connecting words from context.
- Do NOT add meaning beyond what the keywords imply.
- If the keywords don't make sense together, do your best interpretation.

Keywords: {keywords}
Target language: {targetLanguage}
"""

Response: { "sentence": "..." }

This call is extremely fast (~300ms) because it's text-only, no video upload.

**Step B4: Update the Translate page UI for hybrid mode**

Add a toggle in the Sign → Speech tab: "Detection Mode"
- Option A: "Cloud (Gemini Video)" — the Phase 4 approach (record → upload → translate)
- Option B: "On-Device (AI Model)" — the Phase 7 approach (real-time → keywords → restructure)
  Default to Option B if the TF.js model is available.

When "On-Device" mode is active:
1. The camera viewport shows the hand skeleton as before
2. NEW: Below the camera, show a "Keyword Bar" — a horizontal row of
   rounded chips/pills that appear one by one as gestures are detected:
   e.g., [hurt] → [hurt] [stomach] → [hurt] [stomach] [medicine]
   Each chip has a small ✕ button to remove a misdetected keyword
3. NEW: Show a confidence meter next to the detected gesture label
   (a small arc/gauge showing 0-100%)
4. NEW: The HUD overlay shows the current detected gesture name in
   large text at the bottom of the camera viewport, e.g., "HURT" with
   a green highlight, fading out after 1 second
5. When hands are lowered (sentence end detected):
   - The keyword bar animates: chips slide together and a "Restructuring..."
     shimmer appears
   - After ~300ms, the natural sentence appears in the result panel
   - TTS speaks the sentence aloud
6. Manual controls:
   - "Send" button to manually trigger restructuring
   - "Clear" button to discard current keywords and start over

**Step B5: Fallback logic**

Implement smart fallback between on-device and cloud modes:
- If the TF.js model fails to load (e.g., model files missing, old browser),
  automatically fall back to Cloud mode and show a notice
- If on-device detection confidence is consistently low (< 0.5 for 5+
  consecutive attempts), suggest: "Having trouble? Try Cloud mode for
  more accurate detection"
- Add a "Not sure? Use Cloud" button that records a 3-second clip and
  sends it to Gemini for a one-off accurate translation (Phase 4 pipeline)
- This hybrid approach gives users the best of both worlds:
  fast on-device for common gestures, accurate cloud for difficult ones

**Step B6: Add a "Teach New Sign" feature (optional, impressive for demos)**

Add a page or modal: /teach (or accessible from Settings)
This allows users to teach the model new signs in the browser:

1. Show a text input: "What word does this sign mean?"
2. User types the word (e.g., "water")
3. User presses "Record samples" and performs the sign 5 times
4. Each time, the system captures 30 frames of landmarks and stores them
   in IndexedDB as training samples
5. Use TensorFlow.js on-device training (model.fit()) to fine-tune
   the model with the new class using transfer learning:
   - Freeze the LSTM layers
   - Replace the final Dense layer with num_classes + 1 outputs
   - Train for 10 epochs on the combined old + new data
6. Save the fine-tuned model to IndexedDB so it persists across sessions
7. The new gesture becomes immediately available for detection

This feature is technically advanced but very impressive for demos:
it shows that the system can grow and adapt to individual users.

**Performance targets for Phase 7:**
- Model file size: < 2MB (should load in < 1 second on 4G)
- Inference time: < 15ms per prediction on modern smartphones
- End-to-end latency (gesture → spoken sentence): < 1 second
  (vs 2-3 seconds in Phase 4)
- Memory usage: < 50MB additional for TF.js runtime + model
- Battery impact: moderate (continuous camera + inference), mitigated
  by reducing inference frequency to 6x per second instead of every frame

**Create these files (Part B):**
- client/src/hooks/useGestureClassifier.ts
- client/src/hooks/useKeywordAccumulator.ts
- client/src/components/camera/KeywordBar.tsx
- client/src/components/camera/ConfidenceMeter.tsx
- client/src/components/camera/GestureLabel.tsx
- client/src/components/camera/DetectionModeToggle.tsx
- client/src/pages/TeachSign.tsx  (optional)
```

---

## Appendix: Key Technical References

### MediaPipe Hands Integration
```typescript
// Example: Loading HandLandmarker in the browser
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

const vision = await FilesetResolver.forVisionTasks(
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
);

const handLandmarker = await HandLandmarker.createFromOptions(vision, {
  baseOptions: {
    modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
    delegate: "GPU"
  },
  runningMode: "VIDEO",
  numHands: 2
});
```

### Web Speech API — Recognition
```typescript
// Example: Speech Recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "th-TH"; // or "en-US"
```

### Web Speech API — Synthesis (TTS)
```typescript
// Example: Text-to-Speech (Local fallback)
const utterance = new SpeechSynthesisUtterance("สวัสดีครับ ผมปวดท้อง");
utterance.lang = "th-TH";
utterance.rate = 1.0;
window.speechSynthesis.speak(utterance);

// Bypassing iOS Safari Async blocking (Unlock trick)
const unlockIOSAudio = () => {
  const silentUtterance = new SpeechSynthesisUtterance("");
  silentUtterance.volume = 0;
  window.speechSynthesis.speak(silentUtterance);
};
```

### Backend Cloud TTS Integration (Google Cloud / Azure Neural TTS)

#### 1. Express Backend Service (`server/tts.ts`)
```typescript
import { TextToSpeechClient } from "@google-cloud/text-to-speech";

const ttsClient = new TextToSpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS, // or automated auth
});

export async function synthesizeSpeechCloud(text: string, language: "th" | "en"): Promise<Buffer> {
  const isThai = language === "th";
  
  const [response] = await ttsClient.synthesizeSpeech({
    input: { text },
    voice: {
      languageCode: isThai ? "th-TH" : "en-US",
      name: isThai ? "th-TH-Neural2-F" : "en-US-Neural2-F", // High quality Neural2 voices
    },
    audioConfig: {
      audioEncoding: "MP3",
      speakingRate: 1.0,
      pitch: 0.0,
    },
  });

  if (!response.audioContent) {
    throw new Error("Failed to synthesize speech");
  }

  return Buffer.from(response.audioContent as Uint8Array);
}
```

#### 2. Express Route Setup (`server/routes.ts` snippet)
```typescript
import { synthesizeSpeechCloud } from "./tts";

router.post("/api/tts", async (req, res) => {
  try {
    const { text, language } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const audioBuffer = await synthesizeSpeechCloud(text, language || "th");
    
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(audioBuffer);
  } catch (error: any) {
    console.error("Cloud TTS error:", error);
    res.status(500).json({ error: "Cloud TTS failed. Falling back to local." });
  }
});
```

#### 3. Frontend Playback (`client/src/hooks/useTextToSpeech.ts` Cloud player logic)
```typescript
// Playing audio binary streamed from Express backend
let currentAudio: HTMLAudioElement | null = null;

const playCloudSpeech = async (text: string, language: "th" | "en") => {
  if (currentAudio) {
    currentAudio.pause();
  }

  const response = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, language }),
  });

  if (!response.ok) throw new Error("TTS failed");
  
  const blob = await response.blob();
  const audioUrl = URL.createObjectURL(blob);
  
  currentAudio = new Audio(audioUrl);
  currentAudio.play();
  
  currentAudio.onended = () => {
    URL.revokeObjectURL(audioUrl);
    currentAudio = null;
  };
};
```

### Gemini API — Video Analysis
```typescript
// Example: Sending video to Gemini (server-side with @google/genai)
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const response = await ai.models.generateContent({
  model: "gemini-2.0-flash",
  contents: [{
    role: "user",
    parts: [
      { text: "Translate the sign language in this video to Thai..." },
      { inlineData: { mimeType: "video/webm", data: base64Video } }
    ]
  }]
});
```

### MediaRecorder — Video Recording
```typescript
// Example: Recording a video clip from camera stream
const mediaRecorder = new MediaRecorder(stream, {
  mimeType: "video/webm;codecs=vp8"
});
const chunks: Blob[] = [];
mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
mediaRecorder.onstop = () => {
  const blob = new Blob(chunks, { type: "video/webm" });
  // Send blob to backend...
};
mediaRecorder.start();
setTimeout(() => mediaRecorder.stop(), 3000); // Record 3 seconds
```

### TensorFlow.js — Loading and Running LSTM Gesture Model (Phase 7)
```typescript
// Example: Loading a converted Keras LSTM model in the browser
import * as tf from "@tensorflow/tfjs";

const model = await tf.loadLayersModel("/models/gesture_lstm/model.json");

// Input shape: [1, 30, 126] = [batch, frames, features]
// 30 frames × (21 landmarks × 3 coords × 2 hands) = 126 features per frame
const inputTensor = tf.tensor3d([landmarkSequence], [1, 30, 126]);

const prediction = model.predict(inputTensor) as tf.Tensor;
const probabilities = await prediction.data();
const predictedIndex = probabilities.indexOf(Math.max(...probabilities));
const confidence = probabilities[predictedIndex];

const labels = ["ache", "eat", "good", "hurt", "medicine", "name", "slow", "drug_please"];
const detectedGesture = labels[predictedIndex];

// IMPORTANT: Always dispose tensors to prevent memory leaks
inputTensor.dispose();
prediction.dispose();
```

### TensorFlow.js — Landmark Normalization (Phase 7)
```typescript
// Normalize landmarks relative to wrist (landmark 0) for position invariance
function normalizeLandmarks(landmarks: { x: number; y: number; z: number }[]): number[] {
  const wrist = landmarks[0];
  const features: number[] = [];
  for (const lm of landmarks) {
    features.push(lm.x - wrist.x, lm.y - wrist.y, lm.z - wrist.z);
  }
  return features; // 63 values per hand (21 × 3)
}
```

### Python — LSTM Model Architecture (Phase 7 Training)
```python
# Keras model for gesture classification
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

model = Sequential([
    LSTM(64, return_sequences=True, input_shape=(30, 126)),
    Dropout(0.3),
    LSTM(128, return_sequences=False),
    Dropout(0.3),
    Dense(64, activation='relu'),
    Dropout(0.2),
    Dense(num_classes, activation='softmax')
])

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
```

### Python — Data Collection with MediaPipe (Phase 7 Training)
```python
# Collecting hand landmark sequences using OpenCV + MediaPipe
import cv2
import mediapipe as mp
import numpy as np

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(max_num_hands=2, min_detection_confidence=0.7)

cap = cv2.VideoCapture(0)
sequence = []  # Will hold 30 frames

while len(sequence) < 30:
    ret, frame = cap.read()
    results = hands.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

    if results.multi_hand_landmarks:
        landmarks = []
        for hand in results.multi_hand_landmarks:
            wrist = hand.landmark[0]
            for lm in hand.landmark:
                landmarks.extend([lm.x - wrist.x, lm.y - wrist.y, lm.z - wrist.z])
        # Pad to 126 if only 1 hand (63 features per hand)
        while len(landmarks) < 126:
            landmarks.append(0.0)
        sequence.append(landmarks[:126])

np.save(f"data/{gesture_name}/sequence_{n}.npy", np.array(sequence))
```

---

## Quick Start Checklist

- [ ] **Phase 0:** Project scaffolding → `npm run dev` works
- [ ] **Phase 1:** Landing page + navigation → visually stunning first impression
- [ ] **Phase 2:** Voice → Text mode → microphone works, live transcript displays
- [ ] **Phase 3:** Camera + MediaPipe → hand skeleton draws on screen in real-time
- [ ] **Phase 4:** Sign → Speech core → video records, sends to Gemini, gets translation
- [ ] **Phase 5:** TTS + History + Settings → full conversation flow works end-to-end
- [ ] **Phase 6:** PWA + Polish → installable, fast, accessible, production-ready
- [ ] **Phase 7:** On-device LSTM → real-time gesture keywords, hybrid cloud/local mode

---

> **Estimated development time:**
> - **Phases 0–4 (~2 days):** Working demo — records sign language and speaks the translation via Gemini.
> - **Phases 5–6 (~1–3 days):** Full-featured app — conversation history, settings, PWA, production-ready.
> - **Phase 7 (~3–5 days):** On-device AI upgrade — requires collecting training data, training the LSTM model in Python, and integrating TensorFlow.js. This is a significant but rewarding upgrade that unlocks true real-time performance and eliminates per-request API costs.
