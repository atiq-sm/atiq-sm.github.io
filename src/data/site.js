export const site = {
  name: 'Atiq Sohail Mohammed',
  tagline: 'XR developer & CS researcher — building real-time immersive systems that ship.',
  about:
    'MS Computer Science student at Northeastern (4.0 GPA) and XR researcher at the Roux Institute, ' +
    "building a mixed-reality pediatric cardiac ultrasound simulator that's live at Barbara Bush " +
    "Children's Hospital. Background spans data engineering at Capgemini, full-stack AI at Aosenuma, " +
    'and a B.Tech in Cyber Security — converging on real-time systems, spatial computing, and software ' +
    'with direct human impact.',
  now: {
    text: 'Shipping the next pathology module for MR POCUS and wrapping up my MS at Northeastern (May 2026).',
    updatedAt: '2026-04-21',
  },
  experience: [
    {
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
      company: 'Northeastern University',
      role: 'M.S. Computer Science — GPA 4.0 / 4.0',
      period: 'Jan. 2024 — May 2026',
      location: 'Portland, ME',
      bullets: [
        'Coursework: Machine Learning, Computer Vision, Mixed Reality, Algorithms, Computer Networks.',
      ],
    },
    {
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
  },
  projects: [
    {
      title: 'MR POCUS Training System',
      description:
        "Shipped mixed-reality pediatric cardiac ultrasound simulator for Meta Quest 3 — evaluated in a controlled study (n=32, 15/16 learners recommend) and deployed at Barbara Bush Children's Hospital. Custom 6DOF ArUco tracking at sub-100ms latency, 90Hz passthrough rendering, and VideoPlayer-to-RenderTexture pipeline for multi-pathology content.",
      href: 'https://github.com/atiq-sm/MR-POCUS',
      tags: ['Unity 6', 'C#', 'Meta Quest 3', 'OpenCV', 'ArUco', 'Passthrough MR', 'Medical'],
    },
    {
      title: 'Mixed Reality Zombie Shooter',
      description:
        'Room-scale MR shooter for Meta Quest 3: MRUK scans real geometry at runtime, NavMesh pathfinding lets zombies navigate real furniture, and a spatial spawning algorithm places enemies using surface classification and distance-constraint validation.',
      href: 'https://github.com/atiq-sm/ZombieGame',
      tags: ['Unity 6', 'C#', 'Meta XR SDK', 'MRUK', 'NavMesh', 'Meta Quest 3'],
    },
    {
      title: 'Financial Analysis with Explainable AI',
      description:
        "ML pipeline on Lending Club loans achieving 90% ROC-AUC; UMAP + HDBSCAN clustering reveals natural borrower segments that don't map to assigned grades. Locally-run Llama 3 generates LIME/SHAP-backed plain-language explanations for every prediction.",
      href: 'https://github.com/atiq-sm/Lending-Club-Analysis',
      tags: ['Python', 'XGBoost', 'SHAP', 'UMAP', 'HDBSCAN', 'Llama 3'],
    },
    {
      title: 'Decentralized Crowdfunding Platform',
      description:
        'End-to-end Ethereum dApp with upgradeable proxy pattern, re-entrancy guards, and RBAC in Solidity — 25% gas cost reduction and 100% test coverage across 1,000+ Ganache transactions. React frontend with Hardhat local chain.',
      // TODO: replace with the exact repo URL once confirmed.
      href: 'https://github.com/atiq-sm',
      tags: ['Solidity', 'React', 'Hardhat', 'Ethereum', 'RBAC'],
    },
    {
      title: 'ISBN Scanner',
      description:
        'Desktop book-identification app: Sobel/Scharr gradient operators, morphological ops, and contour analysis locate barcodes under varied lighting and angles; pyzbar decodes and OpenLibrary fills in titles and authors.',
      href: 'https://github.com/atiq-sm/CS-5330-Final-Project',
      tags: ['Python', 'OpenCV', 'Computer Vision', 'Tkinter', 'pyzbar'],
    },
    {
      title: 'Multiplayer Network Game',
      description:
        'Concurrent TCP game server in C handling 50K msgs/s with mutex-synchronized game state and POSIX thread architecture supporting 5 simultaneous players — real-time state replication with low-latency socket design.',
      // TODO: replace with the exact repo URL once confirmed.
      href: 'https://github.com/atiq-sm',
      tags: ['C', 'POSIX Threads', 'TCP/IP', 'Sockets', 'Systems Programming'],
    },
    {
      title: 'EV Route Optimization',
      description:
        'RL-based route optimizer with a custom reward model achieving 15% battery efficiency improvement over baseline; training parallelized via multiprocessing for 40% faster convergence, with real-time REST API dashboard integration.',
      // TODO: replace with the exact repo URL once confirmed.
      href: 'https://github.com/atiq-sm',
      tags: ['Python', 'Reinforcement Learning', 'REST APIs', 'Multiprocessing'],
    },
    {
      title: 'Portfolio Site',
      description:
        'This site — Vite + React with live GitHub repo metadata, Framer Motion scroll reveals, command palette (⌘K), and a tuned type + color system with light/dark/system theme switching.',
      href: 'https://github.com/atiq-sm/atiq-sm.github.io',
      liveHref: 'https://atiq-sm.github.io/',
      tags: ['React', 'Vite', 'Framer Motion'],
    },
  ],
};
