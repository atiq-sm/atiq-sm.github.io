// Everything the pages say about me lives here; the page files only arrange it.
export const site = {
  name: 'Atiq Sohail Mohammed',
  tagline: 'XR developer & CS researcher — building real-time immersive systems that ship.',
  location: 'Portland, ME',
  // The tag in the top bar; keep it short.
  status: { label: 'Building CardAlive', href: '/work/#cardalive' },
  // The homepage hero: the lede under the headline and the fine print beside it.
  intro: {
    lede:
      "I'm Atiq Mohammed, an XR developer and CS researcher. I co-founded CardAlive, a " +
      'mixed-reality tabletop card battler, and built an ultrasound trainer that\'s live at ' +
      "Barbara Bush Children's Hospital.",
    fine:
      'MS Computer Science at Northeastern University and XR researcher at the Roux Institute ' +
      'with MaineHealth. Before that, full-stack AI at Aosenuma and data engineering at Capgemini.',
  },
  // Four numbers under the homepage headline, each with a one-line caption.
  stats: [
    { value: '90 Hz', label: 'Standalone mixed reality on Quest 3' },
    { value: '<100 ms', label: 'Latency, custom 6DOF marker tracking' },
    { value: 'n=32', label: 'Controlled study; 15/16 learners recommend it' },
    { value: '4.0', label: 'GPA, MS Computer Science' },
  ],
  // The About page opens with three large sentences, then a quieter closing line.
  about: {
    beats: [
      "I'm an MS Computer Science student at Northeastern (4.0 GPA) and an XR researcher at the Roux Institute.",
      "I co-founded CardAlive, a mixed-reality monster card battler, and built a pediatric cardiac ultrasound simulator that's live at Barbara Bush Children's Hospital.",
      'My background spans data engineering at Capgemini, full-stack AI at Aosenuma, and a B.Tech in Cyber Security.',
    ],
    closing:
      'It all converges on real-time systems, spatial computing, and software with direct human impact. ' +
      'The through-line is deliberate software: technically rigorous under the hood, calm and useful on the surface.',
  },
  focus: 'Clinical XR, real-time rendering and 6DOF tracking.',
  approach:
    'I care most about work where systems thinking, interface craft, and measurable usefulness all matter at the same time.',
  now: {
    text: 'Co-founding CardAlive, a mixed-reality card battler for Meta Quest 3, and still shipping pathology modules for MR POCUS.',
    updatedAt: '2026-09-23',
  },
  experience: [
    {
      kind: 'work',
      company: 'CardAlive',
      // TODO: confirm the title (Co-founder, CTO, …), the start date, and add a location if there is one.
      role: 'Co-founder',
      period: '2026 — Present',
      bullets: [
        'Co-founding a mixed-reality tabletop monster battler for Meta Quest 3: scanning a printed card summons its monster onto the real table, where it fights other monsters in turn-based combat.',
      ],
    },
    {
      kind: 'work',
      company: 'Northeastern University (Roux Institute) & MaineHealth',
      role: 'XR Developer — Student Researcher',
      period: 'Jan. 2026 — Present',
      location: 'Portland, ME',
      bullets: [
        "Engineering a real-time medical training simulator in Unity/C# for pediatric cardiac POCUS on Meta Quest 3, integrating deidentified patient imaging with interactive 3D overlays at 90Hz; evaluated in a controlled study (n=32) and deployed at Barbara Bush Children's Hospital.",
        'Built custom 6DOF tracking pipeline using OpenCV ArUco markers, achieving sub-5cm positional accuracy and sub-100ms latency; developed Android AAR plugin with C# JNI bridge for cross-platform native CV integration.',
        'Architected modular state machine system (Boot/Capture/Reconfirm/Runtime) with separation of concerns across tracking, evaluation, and feedback modules — extensible across multiple clinical pathologies.',
        'Optimized standalone VR rendering via frame budgeting, draw call batching, and camera feed + 3D overlay compositing to maintain consistent 90Hz frame timing on mobile XR hardware.',
      ],
    },
    {
      kind: 'work',
      company: 'Aosenuma LLC',
      role: 'AI Developer Intern',
      period: 'Sep. 2025 — Dec. 2025',
      location: 'Houston, TX',
      bullets: [
        'Developed full-stack healthcare platform using Next.js 15, React 19, FastAPI, and Supabase PostgreSQL with RAG architecture (pgvector, OpenAI embeddings) for AI-powered semantic search and retrieval.',
        'Implemented RBAC with 5 user roles and Row-Level Security policies ensuring multi-tenant data isolation across workspaces, with audit logging for compliance.',
        'Designed CI/CD pipelines using GitHub Actions with Docker containerization and automated deployments to staging and production environments.',
      ],
    },
    {
      kind: 'work',
      company: 'Capgemini',
      role: 'Senior Analyst — Data Analytics & Engineering',
      period: 'June 2022 — Dec. 2023',
      location: 'Bangalore, India',
      bullets: [
        'Designed ETL pipelines processing 2M+ daily records from distributed microservices with data quality monitoring and lineage tracking, improving data reliability by 40%.',
        'Built automated monitoring infrastructure with real-time dashboards and alerting, reducing incident response time by 30% and achieving 95% test coverage through CI/CD automation.',
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
  projects: [
    {
      title: 'CardAlive',
      slug: 'cardalive',
      category: 'XR',
      featured: true,
      viz: 'cardalive',
      summary:
        'Mixed-reality tabletop monster battler for Quest 3: scan a physical card and its monster spawns on your table to fight, turn by turn.',
      headline: 'Scan a card. Fight on your table.',
      facts: [
        // TODO: the exact title, the engine and the launch status.
        ['Role', 'Co-founder'],
        ['Platform', 'Meta Quest 3, passthrough mixed reality'],
        ['The loop', 'Scan a monster card, watch it summoned onto the table, then battle another monster turn by turn'],
        ['Combat', 'Moves such as Water Blade and Strike, hit points, enemy turns, and a rematch when one monster falls'],
        ['Status', 'In development'],
      ],
      description:
        'Mixed-reality tabletop monster battler for Meta Quest 3, which I co-founded. Each printed card carries a code the headset scans; the monster summons onto the real table through a spell circle and squares off against another monster in turn-based combat: pick a move, trade hits, watch the health bars drain, and go again when one falls.',
      liveHref: 'https://cardalive.xyz/',
      liveLabel: 'cardalive.xyz',
      // TODO: add the engine and language (Unity? C#?).
      tags: ['Meta Quest 3', 'Mixed Reality', 'Passthrough', 'Card scanning', 'Turn-based combat'],
    },
    {
      title: 'MR POCUS Training System',
      slug: 'mr-pocus',
      category: 'XR',
      featured: true,
      viz: 'pocus',
      summary:
        "Mixed-reality pediatric cardiac ultrasound trainer for Quest 3, live at Barbara Bush Children's Hospital.",
      // The case study on /work/: its headline, then label/value pairs.
      headline: "Mixed reality, live in a children's hospital.",
      facts: [
        ['Role', 'XR developer and student researcher, Roux Institute & MaineHealth'],
        ['Platform', 'Meta Quest 3 passthrough MR, Unity 6, C#'],
        ['Tracking', 'Custom 6DOF ArUco pipeline: sub-5 cm accuracy, sub-100 ms latency'],
        ['Rendering', '90 Hz passthrough, with a VideoPlayer-to-RenderTexture pipeline for multi-pathology content'],
        ['Evaluation', 'Controlled study, n=32; 15/16 learners recommend it'],
        ['Deployed', "Barbara Bush Children's Hospital"],
        ['Outcome', 'Medical simulation delivered in a live clinical context, tuned for responsiveness, clarity and believable spatial feedback.'],
      ],
      description:
        "Shipped mixed-reality pediatric cardiac ultrasound simulator for Meta Quest 3 — evaluated in a controlled study (n=32, 15/16 learners recommend) and deployed at Barbara Bush Children's Hospital. Custom 6DOF ArUco tracking at sub-100ms latency, 90Hz passthrough rendering, and a VideoPlayer-to-RenderTexture pipeline for multi-pathology content.",
      href: 'https://github.com/atiq-sm/MR-POCUS',
      tags: ['Unity 6', 'C#', 'Meta Quest 3', 'OpenCV', 'ArUco', 'Passthrough MR', 'Medical'],
    },
    {
      title: 'Cosmic Knockout',
      category: 'Games',
      featured: true,
      viz: 'knockout',
      summary:
        'Browser platform fighter on a custom 60 fps physics engine, with online multiplayer and every sound synthesized live.',
      description:
        'Browser platform fighter on a custom 60fps fixed-timestep physics engine — percentage-based damage and knockback, six original fighters with distinct movesets, and nine behavior-tree AI tiers. Socket.IO rooms add join-by-code multiplayer with input-delay netcode, and all 28 sound effects plus three music tracks are synthesized live via the Web Audio API — no audio files.',
      href: 'https://github.com/atiq-sm/cosmic-knockout',
      tags: ['Next.js 16', 'React 19', 'TypeScript', 'Canvas 2D', 'Socket.IO', 'Web Audio'],
    },
    {
      title: 'Mixed Reality Zombie Shooter',
      category: 'XR',
      description:
        'Room-scale MR shooter for Meta Quest 3: MRUK scans real geometry at runtime, NavMesh pathfinding lets zombies navigate real furniture, and a spatial spawning algorithm places enemies using surface classification and distance-constraint validation.',
      href: 'https://github.com/atiq-sm/ZombieGame',
      tags: ['Unity 6', 'C#', 'Meta XR SDK', 'MRUK', 'NavMesh', 'Meta Quest 3'],
    },
    {
      title: 'Fraction Kitchen',
      category: 'Games',
      description:
        'Educational fraction game on Phaser 3 + TypeScript: a juice-bar quick-play mode plus a Slay-the-Spire-style roguelike with shops, chests, and boss battles. A Phaser-free TypeScript math core (216 Vitest tests) accepts any mathematically-equivalent answer, difficulty adapts across five tiers, and WebSocket multiplayer shares an RNG seed so both players face identical scenarios.',
      href: 'https://github.com/atiq-sm/Fraction-Kitchen',
      liveHref: 'https://atiq-sm.github.io/Fraction-Kitchen/',
      tags: ['TypeScript', 'Phaser 3', 'Vite', 'Vitest', 'WebSocket'],
    },
    {
      title: 'Voice RAG Assistant',
      category: 'AI & vision',
      featured: true,
      viz: 'rag',
      summary:
        'Fully local voice assistant: Whisper in, reranked retrieval over ChromaDB, an Ollama model, Kokoro speech out.',
      description:
        'Fully local, voice-enabled RAG system: microphone → Whisper STT → ChromaDB retrieval → cross-encoder reranking → neighbor-chunk expansion → Ollama LLM → Kokoro TTS → speaker output. Two-stage retrieval with smart query routing (map-reduce summaries for broad queries), inline citations stripped before playback, and a Gradio web UI.',
      href: 'https://github.com/atiq-sm/voice-rag',
      tags: ['Python', 'Whisper', 'ChromaDB', 'Ollama', 'RAG', 'Gradio', 'TTS'],
    },
    {
      title: 'NPC Dialogue Engine',
      category: 'AI & vision',
      description:
        'Backend-first NPC conversation system: a LangGraph pipeline — intent classification → lore retrieval → assembly → generation → validation/repair → effect extraction — served over FastAPI and driven by a local Ollama model. RAG grounds replies in world lore, SQLite checkpoints persist per-thread state, and conservative game-effect extraction keeps the model from inventing state changes.',
      href: 'https://github.com/atiq-sm/NPC-AI',
      tags: ['Python', 'FastAPI', 'LangGraph', 'Ollama', 'RAG', 'SQLite'],
    },
    {
      title: 'Financial Analysis with Explainable AI',
      category: 'AI & vision',
      description:
        "ML pipeline on Lending Club loans achieving 90% ROC-AUC; UMAP + HDBSCAN clustering reveals natural borrower segments that don't map to assigned grades. Locally-run Llama 3 generates LIME/SHAP-backed plain-language explanations for every prediction.",
      href: 'https://github.com/atiq-sm/Lending-Club-Analysis',
      tags: ['Python', 'XGBoost', 'SHAP', 'UMAP', 'HDBSCAN', 'Llama 3'],
    },
    {
      title: 'Ask My Screenshots',
      category: 'AI & vision',
      description:
        'Local-first semantic search for screenshot collections — no cloud, no privacy trade-offs. Indexes screenshots with three parallel signals: VLM captions (Ollama), OCR (Tesseract/PaddleOCR), and semantic embeddings stored in sqlite-vec. Hybrid BM25 + vector retrieval, a Textual TUI, and a watchdog for continuous folder monitoring.',
      href: 'https://github.com/atiq-sm/ask-my-screenshots',
      tags: ['Python', 'Ollama', 'SQLite', 'OCR', 'Vector Search', 'Textual', 'Local AI'],
    },
    {
      title: 'Bare-Metal Snake (Raspberry Pi 4)',
      slug: 'bare-metal-snake',
      category: 'Systems',
      featured: true,
      viz: 'snake',
      summary:
        'Snake on a Raspberry Pi 4 with no OS: a 9 KB kernel, its own heap allocator, and an AI that plays when nobody does.',
      description:
        'Fully playable Snake running directly on Raspberry Pi 4 hardware — no OS, ~9 KB kernel image. Custom first-fit heap allocator with block coalescing, doubly-linked list for body segments, 1080p framebuffer rendering, and UART input (WASD + VT100 arrows). Includes an autonomous AI mode that takes over when no terminal is connected.',
      href: 'https://github.com/atiq-sm/baremetal-snake',
      tags: ['C', 'AArch64 Assembly', 'Raspberry Pi', 'Bare Metal', 'Systems Programming'],
    },
    {
      title: 'Journey Builder',
      category: 'Web',
      description:
        'React app for editing prefill mappings on a DAG of forms (Avantos front-end challenge). Dual state management — React Query owns the server-side graph (fetched once, staleTime: Infinity) while useReducer manages client-side prefill state keyed per node. Pluggable data-source registry lets new mapping types integrate with zero changes to the picker, panel, or reducer.',
      href: 'https://github.com/atiq-sm/journeyBuilder',
      tags: ['TypeScript', 'React', 'React Query', 'DAG', 'Vitest'],
    },
    {
      title: 'ISBN Scanner',
      category: 'AI & vision',
      description:
        'Desktop book-identification app: Sobel/Scharr gradient operators, morphological ops, and contour analysis locate barcodes under varied lighting and angles; pyzbar decodes and OpenLibrary fills in titles and authors.',
      href: 'https://github.com/atiq-sm/CS-5330-Final-Project',
      tags: ['Python', 'OpenCV', 'Computer Vision', 'Tkinter', 'pyzbar'],
    },
    {
      title: 'Decentralized Crowdfunding Platform',
      category: 'Web',
      description:
        'End-to-end Ethereum dApp with upgradeable proxy pattern, re-entrancy guards, and RBAC in Solidity — 25% gas cost reduction and 100% test coverage across 1,000+ Ganache transactions. React frontend with Hardhat local chain.',
      // TODO: replace with the exact repo URL once confirmed.
      href: 'https://github.com/atiq-sm',
      tags: ['Solidity', 'React', 'Hardhat', 'Ethereum', 'RBAC'],
    },
    {
      title: 'Multiplayer Network Game',
      category: 'Systems',
      description:
        'Concurrent TCP game server in C handling 50K msgs/s with mutex-synchronized game state and POSIX thread architecture supporting 5 simultaneous players — real-time state replication with low-latency socket design.',
      // TODO: replace with the exact repo URL once confirmed.
      href: 'https://github.com/atiq-sm',
      tags: ['C', 'POSIX Threads', 'TCP/IP', 'Sockets', 'Systems Programming'],
    },
    {
      title: 'EV Route Optimization',
      category: 'AI & vision',
      description:
        'RL-based route optimizer with a custom reward model achieving 15% battery efficiency improvement over baseline; training parallelized via multiprocessing for 40% faster convergence, with real-time REST API dashboard integration.',
      // TODO: replace with the exact repo URL once confirmed.
      href: 'https://github.com/atiq-sm',
      tags: ['Python', 'Reinforcement Learning', 'REST APIs', 'Multiprocessing'],
    },
    {
      title: 'Portfolio Site',
      category: 'Web',
      description:
        'This site: a Vite + React multi-page build, pre-rendered to static HTML, with Bayer-dithered canvas illustrations, live GitHub repo stats and cross-page view transitions. The design language is adapted from the Laya playground by brain function collapse.',
      href: 'https://github.com/atiq-sm/atiq-sm.github.io',
      liveHref: 'https://atiq-sm.github.io/',
      tags: ['React', 'Vite', 'Pre-rendering', 'Canvas'],
    },
  ],
};
