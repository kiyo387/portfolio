export const personalInfo = {
  name: "Shreyas Jayesh Bhavsar",
  preferredName: "Shreyas",
  title: "Computer Science & AIML Engineer • ML Enthusiast",
  tagline: "Undergraduate at RAIT Navi Mumbai • ML enthusiast who does vibe coding in his free time • Building intelligent software & modern web architectures",
  age: 19,
  location: "Navi Mumbai, Maharashtra, India",
  coordinates: "19.0330° N, 73.0297° E",
  academicTerm: "Semester III (2nd Year) • Batch 2025–2029",
  coreFocus: "AIML & Algorithmic Systems",
  university: "Ramrao Adik Institute of Technology (RAIT)",
  universityShort: "RAIT, Navi Mumbai",
  department: "Department of Computer Science and Engineering",
  degree: "B.Tech in Computer Science and Engineering (AIML)",
  specialization: "Artificial Intelligence & Machine Learning",
  graduationYear: "2029",
  currentYear: "2nd Year Undergraduate (Semester III)",
  batch: "2025–2029",
  status: "Available for Summer 2026 Engineering Internships",
  email: "shreyasbhavsar387@gmail.com",
  personalEmail: "shreyasbhavsar387@gmail.com",
  institutionalEmail: "shr.bha.rt25@dypatil.edu",
  github: "https://github.com/kiyo387",
  githubUsername: "kiyo387",
  avatarUrl: "https://avatars.githubusercontent.com/u/219173405?v=4",
  linkedin: "https://www.linkedin.com/in/shreyas-bhavsar-053b8440a/",
  twitter: "https://x.com/shreyas_dev",
  bio: "I am a 19-year-old Computer Science & Engineering (AIML) undergraduate at RAIT Navi Mumbai (Batch 2025–2029, Semester III). An ML enthusiast who loves vibe coding in his free time, my work bridges low-level algorithmic efficiency and intelligent computing—from C pointer memory architectures and graph routing engines to credit card fraud anomaly detection pipelines and production web platforms.",
  highlights: [
    { label: "Degree & Track", value: "B.Tech CSE (AIML)", detail: "RAIT Navi Mumbai • Batch 2025–2029" },
    { label: "Academic Term", value: "Semester III (2nd Year)", detail: "Ramrao Adik Institute of Technology" },
    { label: "Production Platforms", value: "ScholarBridge & Campus Navigator", detail: "Live on Vercel with active users" },
    { label: "Machine Learning", value: "Fraud & Anomaly ML", detail: "Scikit-Learn, XGBoost, imbalanced datasets" }
  ]
};

export const skillsData = {
  categories: [
    {
      id: "aiml",
      title: "AI, Machine Learning & Data",
      description: "Statistical modeling, fraud anomaly detection pipelines, and predictive analytics.",
      skills: [
        { name: "Python", context: "Primary language for ML modeling, automation, and data pipelines." },
        { name: "Credit Card Fraud Detection", context: "Imbalanced classification, SMOTE oversampling, PR-AUC tuning, and anomaly scoring." },
        { name: "Scikit-Learn & XGBoost", context: "Ensemble learning, Random Forests, gradient boosting, and cross-validated estimators." },
        { name: "NumPy & Pandas", context: "Matrix computations, vectorized operations, data cleansing, and feature engineering." },
        { name: "Model Evaluation & Metrics", context: "Precision-Recall curves, ROC-AUC, confusion matrices, and latency profiling." }
      ]
    },
    {
      id: "systems",
      title: "Core Languages & Systems",
      description: "Low-level memory awareness, object-oriented design, and type-safe systems.",
      skills: [
        { name: "C (C11)", context: "Pointers, dynamic memory layouts, POSIX system calls, and custom allocators." },
        { name: "Java", context: "Object-oriented design patterns, multithreading, and the Collections Framework." },
        { name: "TypeScript", context: "Strict typing, structural models, interface contracts, and modern ESNext." },
        { name: "SQL & Databases", context: "Relational schema design, normalization, SQLite, and query optimization." }
      ]
    },
    {
      id: "web",
      title: "Modern Web Engineering",
      description: "Fast, accessible, and responsive user interfaces built with modern tooling.",
      skills: [
        { name: "React 19", context: "Concurrent rendering, hooks lifecycle, server/client patterns, and state architecture." },
        { name: "Tailwind CSS v4", context: "Fluid layouts, design tokens, hardware-accelerated transitions, and dark modes." },
        { name: "Vite", context: "Optimized Rollup bundles, lightning-fast HMR, and modern asset bundling." },
        { name: "HTML5 & CSS3", context: "Semantic architecture, responsive fluid grids, and accessible interfaces." }
      ]
    },
    {
      id: "fundamentals",
      title: "Computer Science Foundations",
      description: "Algorithmic rigor, version control, and development environments.",
      skills: [
        { name: "Data Structures & Algorithms", context: "Graph traversal (Dijkstra, A*), dynamic programming, trees, and heaps." },
        { name: "Object-Oriented Programming (OOP)", context: "SOLID design principles, modularity, abstraction, and clean architecture." },
        { name: "Linux & Shell Scripting", context: "Bash, process signals, build automation, and command-line workflows." },
        { name: "Git & GitHub", context: "Collaborative workflows, branching strategies, and CI/CD automation." }
      ]
    }
  ]
};

export const projectsData = [
  {
    id: "scholarbridge",
    title: "ScholarBridge",
    subtitle: "Centralized Scholarship & Academic Mentorship Discovery Engine",
    badge: "Featured Flagship",
    category: "Fullstack / EdTech Platform",
    summary: "Intelligent scholarship discovery engine matching undergraduate students with verified academic grants and fellowships.",
    description: "Developed to eliminate fragmented scholarship searches for university students. ScholarBridge unifies hundreds of institutional, corporate, and governmental grants into a streamlined dashboard with real-time multi-attribute matching and application deadlines.",
    techStack: ["React 19", "Three.js", "Framer Motion", "Tailwind CSS", "Vite"],
    liveDemo: "https://scholarbridge-mauve.vercel.app/",
    github: "https://github.com/kiyo387/scholarbridge",
    metrics: [
      { label: "Search Latency", value: "Sub-50ms" },
      { label: "UI Physics", value: "Spring Motion" },
      { label: "Platform", value: "Vercel" }
    ],
    architecture: "Client-side search index with memoized scoring heuristics, responsive fluid design system, and accessible modal navigation.",
    highlights: [
      "Dynamic filtering across income brackets, academic tiers, and STEM disciplines",
      "Smooth layout transitions with Framer Motion spring physics",
      "Direct GitHub repository with continuous iteration and clean component boundaries",
      "Comprehensive scholarship drawer with application deadlines and requirements"
    ]
  },
  {
    id: "campus-navigator",
    title: "RAIT Campus Navigator",
    subtitle: "Geospatial Graph Routing Engine & DAA Algorithm Visualizer",
    badge: "Graph Algorithms (DAA)",
    category: "Algorithms & Geospatial Routing",
    summary: "Shortest-path campus navigation engine implementing Dijkstra and A* pathfinding over custom digitized GeoJSON graph networks.",
    description: "Engineered as a flagship Data Structures and Algorithms project at RAIT. Digitized campus blueprints and outdoor pathways into a weighted graph network, enabling students and visitors to calculate optimal routes between 50+ lecture halls, laboratories, and facilities with handicap and elevator routing options.",
    techStack: ["React 19", "TypeScript", "Leaflet GeoJSON", "Dijkstra / A*", "Tailwind CSS"],
    liveDemo: "https://navigation-gilt-mu.vercel.app/",
    github: "https://github.com/kiyo387/DYPU-navigation",
    metrics: [
      { label: "Waypoints", value: "50+ Landmarks" },
      { label: "Heuristics", value: "Euclidean A*" },
      { label: "Accuracy", value: "Mathematically Optimal" }
    ],
    architecture: "Adjacency-list graph model with min-priority queues for Dijkstra, Euclidean distance heuristics for A*, and animated path rendering.",
    highlights: [
      "Custom GeoJSON spatial digitization of RAIT buildings, corridors, and campus plazas",
      "Visual step-through mode demonstrating node exploration frontiers for algorithmic pedagogy",
      "Dynamic weight adjustments for accessibility (staircases vs elevators)",
      "Accompanied by comprehensive algorithmic research documentation and presentation"
    ]
  },
  {
    id: "fraud-detection",
    title: "Credit Card Fraud Detection",
    subtitle: "Real-Time Transaction Anomaly Detection & Imbalanced ML Pipeline",
    badge: "Machine Learning & Anomaly Detection",
    category: "Supervised Learning / Anomaly Detection",
    summary: "High-precision machine learning pipeline designed to detect fraudulent credit card transactions within extremely skewed, imbalanced distributions.",
    description: "Tackling the critical class imbalance problem (0.17% fraud rate) in financial transaction streams. Built an end-to-end anomaly detection architecture utilizing SMOTE oversampling, robust feature scaling, and ensemble models (Random Forest, XGBoost, Logistic Regression) evaluated on Precision-Recall AUC to minimize costly false declines while stopping fraudulent charges in real time.",
    techStack: ["Python", "FastAPI", "Scikit-Learn", "Docker", "Pandas", "XGBoost"],
    liveDemo: null,
    github: "https://github.com/kiyo387/credit-card-fraud-detection",
    metrics: [
      { label: "ROC-AUC Score", value: "0.984 ROC-AUC" },
      { label: "Fraud Class Ratio", value: "0.17% Imbalanced" },
      { label: "Inference Latency", value: "< 1.8ms Per Txn" }
    ],
    architecture: "Robust feature pipeline applying RobustScaler to transaction amounts and time offsets, SMOTE synthetic balancing on train folds, ensemble tree classification, and FastAPI microservice containerized with Docker.",
    highlights: [
      "Mitigated severe class imbalance (0.17% fraud rate) using SMOTE and stratified k-fold cross-validation",
      "Achieved 0.984 ROC-AUC and 0.865 PR-AUC, significantly outperforming baseline linear classifiers",
      "Containerized production inference microservice with FastAPI and Docker for sub-2ms transaction scoring",
      "Constructed feature importance rankings and confusion matrix visualizations using Seaborn and Matplotlib"
    ]
  }
];

export const journeyTimeline = [
  {
    order: 1,
    stage: "Semester I",
    term: "1st Year • Odd Semester",
    period: "August 2025 — December 2025",
    role: "Semester I: Inception of Coding, Procedural C Systems & Developer Tooling",
    institution: "Ramrao Adik Institute of Technology (RAIT)",
    location: "Navi Mumbai, India",
    status: "Coding Inception (2025)",
    statusType: "foundational",
    focus: "Computational Thinking, Memory Addressing & UNIX Workflows",
    description: "Official inception of programming and computational engineering in 2025. Built disciplined fundamentals in procedural programming using C (C11)—focusing on control structures, recursion, pointers, manual memory allocation (malloc/free), stack/heap layouts, and struct data models. Established standard developer workflows with Linux/Bash shell environments, GCC compilation toolchains, and Git/GitHub version control discipline.",
    milestone: "Key Build: Algorithmic Problem Solving & Command-Line Utility Tooling in C",
    highlights: [
      "Coding Inception (2025)",
      "Procedural C (C11)",
      "Pointers & Memory Allocation",
      "Linux & Bash CLI",
      "Git & GitHub",
      "Discrete Mathematics"
    ]
  },
  {
    order: 2,
    stage: "Semester II",
    term: "1st Year • Even Semester",
    period: "January 2026 — May 2026",
    role: "Semester II: Object-Oriented Java, Linear Data Structures & Modern Web Inception",
    institution: "Academic Labs & Software Engineering",
    location: "Navi Mumbai, India",
    status: "Foundational Systems",
    statusType: "shipped",
    focus: "OOP Principles, Asymptotic Complexity & Frontend Architecture",
    description: "Transitioned from procedural coding to Object-Oriented Programming (OOP) in Java and rigorous linear data structures (linked lists, stacks, queues, hash maps) alongside asymptotic Big-O complexity analysis. Extended engineering capabilities into modern web architectures: mastered TypeScript type systems, Tailwind CSS design systems, and component-driven React lifecycles.",
    milestone: "Key Milestone: Java OOP Collections Benchmark & Full-Stack Componentry",
    highlights: [
      "Java OOP & Collections",
      "Linear Data Structures",
      "Asymptotic Big-O Analysis",
      "TypeScript & React 19",
      "Tailwind CSS v4",
      "Clean Architecture"
    ]
  },
  {
    order: 3,
    stage: "Semester III",
    term: "2nd Year • Current Standing",
    period: "July 2026 — Present",
    role: "Semester III: Advanced DAA, Graph Engineering & Applied ML Foundations",
    institution: "RAIT Academic Labs & Autonomous Builds",
    location: "Navi Mumbai, India",
    status: "Current Active Focus",
    statusType: "active",
    focus: "Non-Linear Data Structures, Heuristic Search & Python ML Stack",
    description: "Deepened algorithmic rigor through Design & Analysis of Algorithms (DAA)—mastering non-linear structures (heaps, binary search trees), greedy heuristics, and dynamic programming. Architected the RAIT Campus Navigator implementing Dijkstra and Euclidean A* shortest-path routing over digitized campus blueprints. Initiated formal AIML track: Python scientific computing (NumPy, Pandas), matrix mathematics, and credit card fraud anomaly detection with imbalanced ML models.",
    milestone: "Key Build: RAIT Campus Navigator (Graph Routing Engine) & ScholarBridge",
    highlights: [
      "DAA & Graph Heuristics",
      "Dijkstra & Euclidean A*",
      "RAIT Campus Navigator",
      "ScholarBridge Platform",
      "Python & NumPy",
      "Fraud Detection ML"
    ]
  }
];

export const resumeData = {
  summary: "Computer Science & Engineering (AIML) undergraduate at RAIT Navi Mumbai (Batch 2025–2029, Semester III). ML enthusiast who does vibe coding in his free time, with proven hands-on experience building production full-stack web applications, algorithmic graph engines, and intelligent software systems. Strong foundations in C, Java, Python, TypeScript, Data Structures & Algorithms, and modern React architectures.",
  education: [
    {
      institution: "Ramrao Adik Institute of Technology (RAIT), D.Y. Patil University",
      degree: "Bachelor of Technology in Computer Science and Engineering (AIML)",
      period: "2025 – 2029",
      location: "Navi Mumbai, Maharashtra, India",
      details: "Current: 2nd Year (Semester III). Relevant coursework: Artificial Intelligence, Machine Learning Foundations, Data Structures & Algorithms (DAA), Object-Oriented Programming (Java), Database Management Systems, Computer Networks, Operating Systems."
    }
  ],
  skillsList: [
    { category: "Languages", items: "C, Java, Python, TypeScript, JavaScript, SQL, HTML5, CSS3" },
    { category: "AI / ML & Systems", items: "Credit Card Fraud Detection, Scikit-Learn, XGBoost, Anomaly Detection, NumPy, Pandas, DAA" },
    { category: "Frontend & Fullstack", items: "React 19, Vite, Tailwind CSS v4, Three.js, Framer Motion, Node.js" },
    { category: "Developer Tools", items: "Git, GitHub, Linux CLI, Bash, VS Code, GDB, Vercel" }
  ]
};
