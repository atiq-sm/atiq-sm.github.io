// Everything the pages say about me lives here; the page files only arrange it.
export const site = {
  name: 'Atiq Sohail Mohammed',
  tagline: 'XR engineer building mixed reality that works in real rooms.',
  location: 'Portland, ME',
  // The tag in the top bar; keep it short.
  status: { label: 'Building CardAlive', href: '/work/cardalive/' },
  // The homepage hero: the lede under the headline and the fine print beside it.
  intro: {
    lede:
      "I'm Atiq Mohammed, an XR engineer who builds with AI agents. I was lead developer of a " +
      "pediatric ultrasound trainer that clinicians tested at Barbara Bush Children's Hospital, and " +
      "I'm co-founder and CTO of CardAlive, a mixed-reality card battler for Quest 3.",
    fine:
      'MS Computer Science, Northeastern University (May 2026). Before CardAlive: XR developer at the ' +
      'Roux Institute with MaineHealth, full-stack AI at Aosenuma, and data engineering at Capgemini.',
  },
  // Four facts under the homepage headline, in order, each with a one-line caption.
  stats: [
    { value: '16/16', label: 'MR learners told the pathologies apart, vs 5/16 with standardized patients' },
    { value: 'Agents', label: 'Unity, Blender and Mixamo driven through MCP to build CardAlive' },
    { value: 'MS CS', label: 'Northeastern University, graduated May 2026' },
    { value: 'Now', label: 'Co-founding CardAlive, a mixed-reality card battler for Quest 3' },
  ],
  // The closing lime band on every page.
  cta: {
    title: 'Open to XR engineering roles.',
    lede:
      'Applied AI and agentic tooling too. I finished my MS at Northeastern in May 2026 and can start ' +
      "immediately; if your team builds for Quest, Vision Pro or other spatial platforms, I'd like to hear about it.",
  },
  // The About page opens with three large sentences, then a quieter closing line.
  about: {
    beats: [
      'I like software where computation meets the physical world: a controller held to a manikin that plays the right ultrasound, a printed card that becomes a monster on your table.',
      "That pulled me from data engineering at Capgemini into XR. At Northeastern's Roux Institute I was lead developer of a pediatric ultrasound trainer that clinicians tested at Barbara Bush Children's Hospital, and now I'm co-founding CardAlive.",
      'I build with AI agents, and build them: CardAlive is made through agents driving Unity, Blender and Mixamo, and my NPC engine checks and repairs its own replies. Underneath it all, I like the machinery: a kernel that runs Snake on a bare Raspberry Pi.',
    ],
    closing:
      'The through-line is deliberate software: technically rigorous under the hood, calm and useful on the surface.',
  },
  focus: 'Mixed reality, real-time interaction, computer vision and agentic AI tooling.',
  approach:
    'I care most about work where systems thinking, interface craft, and measurable usefulness all matter at the same time.',
  now: {
    text: 'Building CardAlive as co-founder and CTO, and available now for XR engineering and applied AI roles.',
    updatedAt: '2026-09-25',
  },
  experience: [
    {
      kind: 'work',
      company: 'CardAlive',
      // TODO: the start month, and a location if there is one.
      role: 'Co-founder & CTO',
      period: '2026 — Present',
      bullets: [
        'Building a mixed-reality tabletop creature battler for Meta Quest 3 in Unity 6 and C#: scan printed QR cards and two 3D monsters appear on your real table for a turn-based duel.',
        'Built the card-to-fight pipeline: passthrough camera frames, multi-QR decoding with ZXing.NET, and placement by raycasting against the MRUK depth mesh so creatures stand on the real table.',
        'Wrote the combat system, with rigged and procedural animation paths and layered hit detection (animation event, blade-velocity peak, then a timer), so every attack lands even on a model without a rig.',
        'Generated nearly every asset in code: a DSP synth for all sound and a five-stem adaptive score, pooled VFX, SDF-drawn UI, and QR cards verified by re-decoding.',
        'Build with AI agents: Unity, Blender and Mixamo driven through MCP servers, editor scripts that bake every scene and prefab, and headless builds for desktop and Quest.',
      ],
    },
    {
      kind: 'work',
      company: 'Northeastern University (Roux Institute) & MaineHealth',
      role: 'XR Developer, Research',
      period: 'Jan. 2026 — Apr. 2026',
      location: 'Portland, ME',
      bullets: [
        'Lead developer of a mixed-reality pediatric cardiac ultrasound trainer for Meta Quest 3, in Unity and C#. In a controlled study (n = 32) at the BBCH Pediatric Ultrasound Conference, all 16 MR learners told the pathologies apart, against 5 of 16 trained on standardized patients.',
        'Designed probe-pose matching with position and angle tolerances and entry and exit dwell gates, so clips start reliably and hold steady while a learner adjusts the probe.',
        'Prototyped 6DOF marker tracking with OpenCV ArUco through an Android plugin and a C# JNI bridge, then replaced it with Quest 3 spatial anchors when markers proved too sensitive to angle, lighting and distance.',
        'Structured the app as a Boot, Capture, Reconfirm and Runtime state machine with separate tracking, evaluation and feedback modules, so new pathologies and organs are added as content rather than code.',
      ],
    },
    {
      kind: 'work',
      company: 'Aosenuma LLC',
      role: 'AI Developer Intern',
      period: 'Sep. 2025 — Dec. 2025',
      location: 'Houston, TX',
      bullets: [
        'Built a full-stack healthcare platform (Next.js, React, FastAPI, Supabase Postgres) with AI semantic search over pgvector embeddings.',
        "Kept each workspace's data separate with five-role access control and Postgres row-level security, plus audit logging for compliance.",
        'Set up CI/CD with GitHub Actions and Docker, deploying automatically to staging and production.',
      ],
    },
    {
      kind: 'work',
      company: 'Capgemini',
      role: 'Senior Analyst — Data Analytics & Engineering',
      period: 'June 2022 — Dec. 2023',
      location: 'Bangalore, India',
      // TODO: the reliability and response-time gains can come back once they have their context.
      bullets: [
        'Built ETL pipelines for 2M+ records a day from distributed microservices, with data-quality monitoring and lineage tracking.',
        'Built the monitoring around them: real-time dashboards, alerting, and CI/CD test automation.',
      ],
    },
    {
      kind: 'education',
      company: 'Northeastern University',
      role: 'M.S. Computer Science — GPA 4.0 / 4.0',
      period: 'Jan. 2024 — May 2026',
      location: 'Portland, ME',
      bullets: [
        'Coursework: Machine Learning, Computer Vision, Mixed Reality, Algorithms, Computer Networks.',
      ],
    },
    {
      kind: 'education',
      company: 'KL Deemed to be University',
      role: 'B.Tech Computer Science (Cyber Security) — GPA 8.8 / 10',
      period: 'Aug. 2018 — May 2022',
      location: 'Hyderabad, India',
      bullets: [
        'Coursework: Cryptography, Digital Forensics, Network Security, Blockchain, Data Science.',
      ],
    },
  ],
  links: {
    github: 'https://github.com/atiq-sm',
    // TODO: confirm your LinkedIn handle and swap in the real URL.
    linkedin: 'https://www.linkedin.com/in/atiq-sm/',
    email: 'mohammed.ati@northeastern.edu',
    source: 'https://github.com/atiq-sm/atiq-sm.github.io',
  },
  // Every project has a tier:
  // - 'flagship': on the homepage and at full width on /work/; with a `story`,
  //   it also gets its own page at /work/<slug>/
  // - 'more': a full entry on /work/
  // - 'archive': one line at the foot of /work/
  // Descriptions lead with what exists, then what was hard; the stack comes last, in `tags`.
  projects: [
    {
      title: 'MR POCUS Training System',
      slug: 'mr-pocus',
      tier: 'flagship',
      category: 'XR',
      viz: 'pocus',
      summary:
        'A mixed-reality trainer for pediatric cardiac ultrasound on Quest 3. In a 32-learner study, all 16 MR learners told the pathologies apart, against 5 of 16 on standardized patients.',
      headline: 'Every pathology, at every probe position.',
      // The teaser on /work/: label/value pairs.
      facts: [
        ['Role', 'Lead developer; I built the app'],
        ['Platform', 'Meta Quest 3 passthrough MR, Unity 6, C#'],
        ['Result', '16/16 MR learners told the pathologies apart, vs 5/16 with standardized patients (p = 0.003)'],
      ],
      description:
        'A mixed-reality trainer for pediatric cardiac ultrasound on Meta Quest 3. The controller becomes the probe, and at six standard positions on a manikin the headset plays real deidentified ultrasound for a normal heart, myocardial dysfunction or pericardial effusion.',
      href: 'https://github.com/atiq-sm/MR-POCUS',
      tags: ['Unity 6', 'C#', 'Meta Quest 3', 'Passthrough MR', 'Spatial anchors', 'Medical simulation'],
      // The page at /work/mr-pocus/. Everything here comes from the conference poster.
      story: {
        title: 'MR POCUS',
        pitch:
          'A Quest 3 trainer that lets a learner hold a probe to a manikin and see real ultrasound for that view: a normal heart, myocardial dysfunction or pericardial effusion, at every position.',
        figure: {
          src: '/media/pocus-runtime.jpg',
          width: 1600,
          height: 904,
          alt: 'The view through the headset: translucent virtual probes labelled P1 to P6 float in the room, with an ultrasound clip playing on a virtual screen behind them.',
          caption: 'Runtime, through the headset: the six registered probe points and the clip for the matched one.',
        },
        facts: [
          ['Role', 'Lead developer; I built the app'],
          ['Team', "The Roux Institute's Working Lab at Northeastern, with MaineHealth pediatricians"],
          ['Platform', 'Meta Quest 3 passthrough MR, Unity 6, C#'],
          ['When', 'Jan. — Apr. 2026'],
          ['Evaluated', 'Controlled study, n = 32, at the BBCH Pediatric Ultrasound Conference'],
        ],
        sections: [
          {
            title: 'The problem',
            body: [
              'Pediatric cardiac ultrasound is a critical skill, but practice is scarce: real patients are limited and dedicated simulators are expensive.',
              'Standardized patients, healthy volunteers, help with probe technique, but a healthy heart is all they can show. A learner never sees what an effusion looks like from the same probe position.',
            ],
          },
          {
            title: 'What I built',
            body: [
              'A passthrough mixed-reality app for Meta Quest 3. The controller becomes the probe. An instructor registers six standard probe points on a manikin once, and persistent spatial anchors bring them back on every launch.',
              'When the probe reaches a point, the headset plays real deidentified ultrasound for that view on a virtual screen, with a haptic pulse, and the learner can cycle through three pathologies without moving.',
              'The app runs as four states: Boot loads the saved anchors, Capture registers the six points, Reconfirm verifies them on relaunch, and Runtime matches the probe pose and plays video. Tracking, evaluation and feedback are separate modules, so a new pathology or organ is new content, not new code.',
            ],
            figures: [
              {
                src: '/media/pocus-probe-points.jpg',
                width: 1200,
                height: 1352,
                alt: 'A diagram of a child manikin torso with six numbered probe positions: PLAX, PSAX and A4C over the heart, and Subcostal, IVC Long and IVC Trans below it.',
                caption: 'The six standard pediatric cardiac probe positions.',
              },
              {
                src: '/media/pocus-menu.jpg',
                width: 1600,
                height: 1032,
                alt: 'A menu floating in the room listing the six probe points, with actions to reconfirm, recalibrate each point, recalibrate all, and reset.',
                caption: 'The trainer menu, in the room: point assignments, recalibration and reset.',
              },
            ],
          },
          {
            title: 'A decision: anchors over markers',
            body: [
              'I first built marker tracking with OpenCV ArUco, bridged into Unity through an Android plugin. It depended too much on viewing angle, lighting and distance, and every lost marker interrupted the session.',
              "So I dropped it for the Quest 3's persistent spatial anchors, which turned out to be very accurate, and the experience became seamless: the learner just picks up the probe.",
            ],
          },
          {
            title: 'The hard part',
            body: [
              "Deciding when the probe is at a point. Hands shake and tracking jitters, so a plain distance check fires on the way past a point and flickers at its edge.",
              // TODO: confirm the reasoning behind the longer exit gate.
              'A match needs the probe within 4 cm and 20° of the closest point, held for 60 ms before its clip starts; it has to leave for 180 ms before the clip stops. The longer exit keeps the image steady while a learner makes small corrections, which is exactly when they are looking hardest.',
            ],
          },
          {
            title: "What's next",
            body: [
              'The architecture was built for more than the heart: the planned next module covers lung ultrasound, with 8 probe points and 4 pathologies across 32 clips.',
            ],
          },
        ],
        results: {
          title: 'Results',
          lede: 'A controlled study at the BBCH Pediatric Ultrasound Conference: 32 learners, half trained in mixed reality and half on standardized patients.',
          items: [
            ['16/16 vs 5/16', 'Learners who could tell the pathologies apart, MR vs standardized patients (p = 0.003)'],
            ['100% vs 40%', 'Said the training helped them tell normal from abnormal'],
            ['95%', 'Would use the MR trainer at future courses'],
            ['80%', 'Prefer a 50/50 mix of MR and standardized patients'],
            ['15/16 + 4/4', 'Learners and faculty who recommend it'],
            ['1 of 20', 'Reported any VR symptoms'],
          ],
          chart: {
            caption:
              'Learners who agreed, per training domain (16 per arm). Standardized patients still led on anatomic landmarks; mixed reality led by far on telling pathologies apart.',
            series: ['Mixed reality', 'Standardized patients'],
            max: 16,
            rows: [
              ['Anatomic landmarks', 11, 16],
              ['Image quality', 12, 14],
              ['Theory to practice', 14, 15],
              ['Comfort repeating', 14, 14],
              ['Pathology differentiation', 16, 5],
              ['Clinical steps', 7, 8],
              ['Would recommend', 15, 16],
            ],
          },
        },
        credits:
          "Atiq Mohammed (lead developer), Pethuel Mutalenu, Ryan Bockmon, PhD, Scott Valcourt, PhD, Michael Zubrow, MD, and Michael Ferguson, MD. The Roux Institute at Northeastern University, MaineHealth and Barbara Bush Children's Hospital.",
        evidence: [{ href: 'https://lnkd.in/p/gGXfJqgF', label: "Northeastern's video" }],
        next: 'cardalive',
      },
    },
    {
      title: 'CardAlive',
      slug: 'cardalive',
      tier: 'flagship',
      category: 'XR',
      viz: 'cardalive',
      summary:
        'A mixed-reality creature battler I co-founded and build as CTO: scan printed QR cards with a Quest 3 and two 3D monsters appear on your real table for a turn-based duel.',
      headline: 'Scan a card. Fight on your table.',
      facts: [
        ['Role', 'Co-founder & CTO; I build the game'],
        ['Platform', 'Meta Quest 3 passthrough MR and desktop, from one Unity codebase'],
        ['The hard part', 'Landing creatures on a real table from a QR code, and making every attack land, rig or no rig'],
      ],
      description:
        'A mixed-reality tabletop creature battler for Meta Quest 3, which I co-founded and build as CTO. The headset scans printed QR cards, their monsters appear on the real table, and two of them fight a turn-based, anime-style duel.',
      liveHref: 'https://cardalive.xyz/',
      liveLabel: 'cardalive.xyz',
      tags: ['Unity 6', 'C#', 'OpenXR', 'Meta XR SDK', 'MRUK', 'ZXing.NET', 'glTFast', 'HLSL', 'MCP'],
      story: {
        title: 'CardAlive',
        pitch: 'Print a card, scan it, and its monster steps onto your real table to fight.',
        video: {
          src: '/media/cardalive-gameplay.mp4',
          poster: '/media/cardalive-turn.jpg',
          width: 1280,
          height: 720,
          label: 'CardAlive gameplay, recorded through a Meta Quest 3',
          caption: 'Recorded through the headset: scan, summon, battle and rematch, in one take.',
        },
        facts: [
          ['Role', 'Co-founder & CTO; I build the game'],
          ['Platform', 'Meta Quest 3 and 3S, plus a desktop build with a webcam'],
          ['Engine', 'Unity 6, C#, OpenXR, Meta XR Core and MRUK'],
          // TODO: the start month.
          ['When', '2026 — present'],
          ['Status', 'In development, with a waitlist at cardalive.xyz'],
        ],
        sections: [
          {
            title: 'How it plays',
            body: [
              'Put a card on the table and look at it. The headset reads the QR code printed on the card, a summoning circle opens, and its monster rises out of it at table scale.',
              'Scan a second card and the two face off in a turn-based, anime-style duel: pick a move from a panel in the room, watch it play out across the table, and trade hits until one falls. Then press A for a rematch.',
              'There are four creatures so far, each with a trait: Aqua Slime (Absorb), Goblin Raider (Enrage), Skeleton Warrior (Undying: it revives) and Dire Wolf (First Instinct). Any two cards can fight.',
            ],
            figures: [
              {
                src: '/media/cardalive-scan.jpg',
                width: 1280,
                height: 720,
                alt: 'A printed Goblin Raider card with a QR code lying on a white table, with a "Scan a card to summon" prompt floating above it.',
                caption: 'Scan: the headset looks for the code on a printed card.',
              },
              {
                src: '/media/cardalive-summon.jpg',
                width: 1280,
                height: 720,
                alt: 'A red summoning circle spinning around the card as a green goblin appears on it, under a health bar reading Goblin 100/100.',
                caption: 'Summon: the monster rises out of its card.',
              },
              {
                src: '/media/cardalive-water-blade.jpg',
                width: 1280,
                height: 720,
                alt: 'A blue slime on one end of a real table fires a stream of water across it at the goblin on the other end.',
                caption: 'Battle: a Water Blade crosses a real table.',
              },
              {
                src: '/media/cardalive-rematch.jpg',
                width: 1280,
                height: 720,
                alt: 'The goblin stands alone on its card at the end of the table under a "Goblin wins! Press A to play again" banner.',
                caption: 'Rematch: one press starts the next battle.',
              },
            ],
          },
          {
            title: 'What I built',
            body: [
              'The whole game, in Unity 6 and C#, from one codebase for Quest 3 and a desktop demo. From card to fight, it runs in five steps:',
            ],
            steps: [
              ['Camera', "On Quest, frames come from the Passthrough Camera API, tagged with the head pose at the moment of capture; on desktop, from a webcam."],
              ['Decode', 'ZXing.NET finds every QR code in a frame, so both cards are read at once, a few times a second.'],
              ['Place', 'A ray from each code is cast against the depth mesh MRUK builds of the room, so the creature stands on the real table.'],
              ['Spawn', 'The code picks the creature, which appears with its health bar, facing its opponent.'],
              ['Battle', 'A state machine runs the duel: scanning, ready, then the player and enemy turns until a creature falls.'],
            ],
          },
          {
            title: 'The hard part',
            body: [
              'Making every attack land. Damage should arrive on the hit, not the button press, but not every creature has a clean rig. Combat plays rigged animation clips when a creature has them and falls back to procedural animation when it does not.',
              "The hit itself comes from the first signal available: an event in the animation, else the peak of the blade's velocity, else a timer. A broken clip slows a creature down; it never stalls the fight.",
            ],
          },
          {
            title: 'Decisions',
            body: [
              'Generate it rather than import it. Almost nothing in the game is a binary asset: a DSP synth makes every sound, creature voices included, with a five-stem adaptive score that follows the tension of the battle. The hit-stops, flashes, beams and shockwaves are pooled effects, the interface is drawn from signed distance fields, and seven shaders are written by hand. Every printed card is generated with high error correction and decoded again to prove it scans.',
              'Comfort over spectacle in the headset. The desktop build shakes the screen on big hits; the Quest build never does, and hits land through controller haptics instead.',
            ],
          },
          {
            title: 'How I build it',
            body: [
              'With AI agents. MCP servers let an agent work directly in the Unity editor, Blender and Mixamo. Scenes, prefabs and animation controllers are baked by editor scripts rather than assembled by hand, so they can be rebuilt at any time, and headless builds produce the desktop, Link and Quest versions from one command.',
            ],
          },
          {
            title: "What's next",
            body: [
              'An animation platform: data-driven clip sets per creature, a one-command creature bake that fails when a clip is broken, and IK grounding for creatures that are not humanoid.',
              'The long-term goal is a licensable engine for mixed-reality card games, not a clone of an existing one.',
            ],
          },
        ],
        evidence: [{ href: 'https://cardalive.xyz/', label: 'cardalive.xyz' }],
        next: 'mr-pocus',
      },
    },
    {
      title: 'NPC Dialogue Engine',
      slug: 'npc-dialogue-engine',
      tier: 'flagship',
      category: 'AI & agents',
      viz: 'npc',
      summary:
        "An agent pipeline that lets game characters talk freely without breaking the game: each reply is grounded in lore, validated, repaired, and checked before it can change the game's state.",
      headline: "Characters that can't break the game.",
      facts: [
        ['What', "A backend that turns a player's line into an in-character reply and a safe set of game effects"],
        ['The hard part', "Letting a model improvise while the game stays in charge: drafts are validated and repaired, and effects are extracted conservatively, so a character can't invent a quest or hand out an item the game doesn't allow"],
        ['How', 'A LangGraph pipeline (intent, lore retrieval, assembly, generation, validation and repair, effect extraction) on FastAPI, with a local Ollama model and each conversation checkpointed in SQLite'],
      ],
      description:
        "An agent pipeline for game characters: a LangGraph graph classifies intent, retrieves world lore, drafts a reply with a local model, then validates and repairs it before any effect reaches the game.",
      href: 'https://github.com/atiq-sm/NPC-AI',
      tags: ['Python', 'LangGraph', 'FastAPI', 'Ollama', 'RAG', 'SQLite'],
    },
    {
      title: 'Bare-Metal Snake (Raspberry Pi 4)',
      slug: 'bare-metal-snake',
      tier: 'flagship',
      category: 'Systems',
      viz: 'snake',
      summary:
        'Snake running straight on a Raspberry Pi 4 with no operating system: my own kernel, memory allocator and screen driver, and an AI that plays when nobody is connected.',
      headline: 'No operating system. Just Snake.',
      facts: [
        ['What', 'A bootable kernel for the Raspberry Pi 4 that runs a full game of Snake'],
        ['The hard part', 'Everything an OS usually provides: a first-fit heap allocator with block coalescing, 1080p framebuffer drawing, and keyboard input over UART, VT100 arrow keys included'],
        ['Result', 'The whole kernel image is about 9 KB, and an autonomous mode takes over when no terminal is connected'],
      ],
      description:
        'A playable Snake that runs directly on Raspberry Pi 4 hardware, with no operating system underneath. I wrote the parts an OS would normally provide: a heap allocator, framebuffer drawing and serial keyboard input.',
      href: 'https://github.com/atiq-sm/baremetal-snake',
      tags: ['C', 'AArch64 Assembly', 'Raspberry Pi', 'Bare metal'],
    },
    {
      title: 'Cosmic Knockout',
      tier: 'flagship',
      category: 'Games',
      viz: 'knockout',
      summary:
        'A browser platform fighter on a physics engine I wrote from scratch, with online multiplayer and every sound synthesized in code.',
      headline: 'A platform fighter, from the physics up.',
      facts: [
        ['What', 'Six original fighters, knockback that grows with damage, and AI opponents at nine difficulty tiers'],
        ['The hard part', 'A fixed-timestep physics loop at 60 fps, so a hit lands the same on every machine, and input-delay netcode for online rooms joined by code'],
        ['Sound', 'All 28 effects and three music tracks are synthesized live with the Web Audio API; the game ships no audio files'],
      ],
      description:
        'A browser platform fighter built on my own fixed-timestep physics engine, with six original fighters, behavior-tree AI and online rooms joined by code.',
      href: 'https://github.com/atiq-sm/cosmic-knockout',
      tags: ['TypeScript', 'React', 'Next.js', 'Canvas 2D', 'Socket.IO', 'Web Audio'],
    },
    {
      title: 'Mixed Reality Zombie Shooter',
      tier: 'more',
      category: 'XR',
      description:
        'Zombies that walk around your real furniture. A room-scale mixed-reality shooter for Quest 3: the headset scans the room at runtime, zombies find paths around real tables and couches, and the spawner only places them on surfaces where they could actually stand.',
      href: 'https://github.com/atiq-sm/ZombieGame',
      tags: ['Unity 6', 'C#', 'Meta XR SDK', 'MRUK', 'NavMesh'],
    },
    {
      title: 'Voice RAG Assistant',
      tier: 'more',
      category: 'AI & vision',
      description:
        'Ask your documents a question out loud and hear the answer, with nothing leaving your machine. Whisper transcribes, a two-stage retriever finds and reranks passages, a local model answers with citations, and Kokoro reads it back. Broad "summarize this" questions go to a map-reduce summary instead of retrieval, so both narrow and broad questions work.',
      href: 'https://github.com/atiq-sm/voice-rag',
      tags: ['Python', 'Whisper', 'ChromaDB', 'Ollama', 'Kokoro TTS'],
    },
    {
      title: 'Ask My Screenshots',
      tier: 'more',
      category: 'AI & vision',
      description:
        "Search years of screenshots by what is in them or what is written in them, entirely offline. Each one is indexed three ways, as a vision-model caption, OCR text and an embedding, and a hybrid keyword and vector search combines them, so both \"that error with the red banner\" and the exact error text find it.",
      href: 'https://github.com/atiq-sm/ask-my-screenshots',
      tags: ['Python', 'Ollama', 'OCR', 'sqlite-vec', 'Textual'],
    },
    {
      title: 'Fraction Kitchen',
      tier: 'more',
      category: 'Games',
      description:
        'A fraction game you can play in the browser: a quick juice-bar mode and a roguelike with shops and boss fights. The math core is separate from the game engine and accepts any equivalent answer, so 2/4 counts for 1/2; difficulty adapts across five tiers, and two players can race identical scenarios over WebSockets.',
      href: 'https://github.com/atiq-sm/Fraction-Kitchen',
      liveHref: 'https://atiq-sm.github.io/Fraction-Kitchen/',
      liveLabel: 'Play',
      tags: ['TypeScript', 'Phaser 3', 'Vitest', 'WebSocket'],
    },
    {
      title: 'Financial Analysis with Explainable AI',
      tier: 'archive',
      category: 'AI & vision',
      description: 'Loan-default prediction on Lending Club data, with a local Llama 3 explaining each prediction in plain language from SHAP and LIME.',
      href: 'https://github.com/atiq-sm/Lending-Club-Analysis',
    },
    {
      title: 'Journey Builder',
      tier: 'archive',
      category: 'Web',
      description: 'A React editor for prefill mappings across a graph of forms, built for the Avantos front-end challenge.',
      href: 'https://github.com/atiq-sm/journeyBuilder',
    },
    {
      title: 'ISBN Scanner',
      tier: 'archive',
      category: 'AI & vision',
      description: 'A desktop app that finds and reads book barcodes with classic computer vision, then looks up the title.',
      href: 'https://github.com/atiq-sm/CS-5330-Final-Project',
    },
    {
      title: 'Decentralized Crowdfunding Platform',
      tier: 'archive',
      category: 'Web',
      description: 'An Ethereum crowdfunding app with upgradeable contracts, re-entrancy guards and role-based access.',
      // TODO: replace with the exact repo URL once confirmed.
      href: 'https://github.com/atiq-sm',
    },
    {
      title: 'Multiplayer Network Game',
      tier: 'archive',
      category: 'Systems',
      description: 'A multiplayer game server in C, with POSIX threads sharing game state over TCP.',
      // TODO: replace with the exact repo URL once confirmed.
      href: 'https://github.com/atiq-sm',
    },
    {
      title: 'EV Route Optimization',
      tier: 'archive',
      category: 'AI & vision',
      description: 'A reinforcement-learning route planner for electric vehicles that rewards routes that save battery.',
      // TODO: replace with the exact repo URL once confirmed.
      href: 'https://github.com/atiq-sm',
    },
  ],
};
