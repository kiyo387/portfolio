export interface Profile {
  name: string;
  role: string;
  location: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  cgpa: string;
  availability: string;
  resumeUrl: string;
}

export interface TelemetryMetric {
  id: string;
  value: string;
  label: string;
  context: string;
}

export interface ProjectEntry {
  id: 'traffic-cv' | 'fraud-api' | 'isro-satretrieval';
  index: string;
  title: string;
  period: string;
  category: string;
  headlineMetric: string;
  repoUrl?: string;
  sectionAnchor: 'traffic-architecture' | 'fraud-workbench' | 'sat-retrieval';
  bullets: string[];
  technologies: string[];
}

export interface PipelineStage {
  id: 'data' | 'modeling' | 'evaluation' | 'deployment';
  code: string;
  title: string;
  skills: {
    name: string;
    usage: string;
    projectIds: ProjectEntry['id'][];
  }[];
}

export interface Certification {
  issuer: string;
  title: string;
  date: string;
}

export const PROFILE: Profile = {
  name: 'Shreyas Bhavsar',
  role: 'AI/ML & Computer Vision Engineer',
  location: 'Mumbai, Maharashtra, India',
  email: 'shreyasbhavsar387@gmail.com',
  githubUrl: 'https://github.com/kiyo387',
  linkedinUrl: 'https://www.linkedin.com/in/shreyas-bhavsar-053b8440a/',
  cgpa: '8.98/10',
  availability: 'Seeking AI/ML Internship',
  resumeUrl: '/Shreyas_Bhavsar_Resume.pdf',
};

export const METRICS: TelemetryMetric[] = [
  {
    id: 'map',
    value: '0.443',
    label: 'YOLOv8 validation mAP@50:95',
    context: '+28% vs 0.345 baseline on IDD (41K+ images)',
  },
  {
    id: 'latency',
    value: '< 1.8 ms',
    label: 'Fraud scoring inference latency',
    context: '0.984 ROC-AUC · 0.865 PR-AUC · FastAPI + Docker',
  },
  {
    id: 'faiss',
    value: '24,050',
    label: 'FAISS HNSW index vectors',
    context: 'ISRO BAH 2026 · CROMA ViT-Base SAR-to-optical',
  },
  {
    id: 'fps',
    value: '39–41 FPS',
    label: '1080p real-time tracking speed',
    context: '94–100% directional count accuracy on RTX 4050',
  },
];

export const PROJECTS: ProjectEntry[] = [
  {
    id: 'traffic-cv',
    index: '01',
    title: 'Indian Traffic Vehicle Detection with YOLOv8',
    period: 'Nov 2026 – Present',
    category: 'Computer Vision',
    headlineMetric: '+28% mAP@50:95 (0.345 -> 0.443)',
    repoUrl: 'https://github.com/kiyo387/indian-traffic-detection',
    sectionAnchor: 'traffic-architecture',
    bullets: [
      'Boosted YOLOv8 validation mAP@50:95 by 28% (0.345 to 0.443) and small-object recall by 18–26 pp on IDD (41K+ images, 507K+ boxes, leak-free sequence splits) via error analysis and 640-to-1280 scaling in PyTorch (W&B).',
      'Achieved 94–100% directional counting accuracy (Hungarian-matched to ground truth) using ByteTrack multi-object tracking and polygon ROI gating.',
      'Sustained 39–41 FPS on 1080p video (RTX 4050) and deployed a Dockerized FastAPI REST API with a Gradio UI for ROI calibration.',
    ],
    technologies: [
      'Python',
      'PyTorch',
      'YOLOv8',
      'ByteTrack',
      'OpenCV',
      'FastAPI',
      'Docker',
      'Gradio',
      'Pandas',
      'Weights & Biases',
    ],
  },
  {
    id: 'fraud-api',
    index: '02',
    title: 'Real-Time Credit Card Fraud Detection & Anomaly Scoring',
    period: 'Sep 2026',
    category: 'ML Systems',
    headlineMetric: '0.984 ROC-AUC · < 1.8 ms/tx',
    repoUrl: 'https://github.com/kiyo387/credit-card-fraud-detection',
    sectionAnchor: 'fraud-workbench',
    bullets: [
      'Achieved 0.984 ROC-AUC and 0.865 PR-AUC at under 1.8 ms inference latency per transaction by building an end-to-end fraud detection pipeline and Dockerized FastAPI REST microservice for a 0.17% fraud-rate dataset.',
      'Addressed severe class imbalance by combining RobustScaler, SMOTE oversampling, and tree-based ensembles (XGBoost, Random Forest), tuning decision thresholds on Precision-Recall curves to balance precision and recall.',
    ],
    technologies: ['Python', 'Scikit-learn', 'XGBoost', 'FastAPI', 'Docker'],
  },
  {
    id: 'isro-satretrieval',
    index: '03',
    title: 'ISRO Bharatiya Antariksh Hackathon 2026 — SatRetrieval',
    period: '2026',
    category: 'Hackathon',
    headlineMetric: '24,050 FAISS HNSW Vectors',
    sectionAnchor: 'sat-retrieval',
    bullets: [
      'Contributed to SatRetrieval, a team system for SAR-to-optical satellite image retrieval across Sentinel-1, Sentinel-2, Landsat, LISS-3, and RISAT imagery.',
      'Collaborated on a CROMA ViT-Base embedding pipeline and FAISS HNSW index (24,050 vectors) with k-reciprocal re-ranking, and helped prepare the competition demo and presentation.',
    ],
    technologies: [
      'Python',
      'PyTorch',
      'CROMA ViT-Base',
      'FAISS HNSW',
      'k-Reciprocal Re-Ranking',
      'SAR & Optical Imagery',
    ],
  },
];

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'data',
    code: '01',
    title: 'Data & Preparation',
    skills: [
      { name: 'Python', usage: 'End-to-end training, inference, and microservice codebases', projectIds: ['traffic-cv', 'fraud-api', 'isro-satretrieval'] },
      { name: 'Pandas', usage: 'Annotation auditing, sequence split validation, feature pipelines', projectIds: ['traffic-cv', 'fraud-api'] },
      { name: 'NumPy', usage: 'Vectorized bounding-box math, HNSW embedding prep, scoring arrays', projectIds: ['traffic-cv', 'fraud-api', 'isro-satretrieval'] },
      { name: 'SQL', usage: 'Structured dataset querying and DBMS coursework foundations', projectIds: ['fraud-api'] },
      { name: 'Data Analysis', usage: 'Error analysis across object scale buckets and 0.17% fraud distributions', projectIds: ['traffic-cv', 'fraud-api'] },
    ],
  },
  {
    id: 'modeling',
    code: '02',
    title: 'Vision & ML Modeling',
    skills: [
      { name: 'PyTorch', usage: 'YOLOv8 640->1280 training and CROMA ViT-Base inference pipelines', projectIds: ['traffic-cv', 'isro-satretrieval'] },
      { name: 'YOLOv8', usage: 'IDD traffic detector scaled to 1280px for small-object recall', projectIds: ['traffic-cv'] },
      { name: 'Deep Learning', usage: 'Vision backbones, multi-scale feature pyramids, cross-modal encoders', projectIds: ['traffic-cv', 'isro-satretrieval'] },
      { name: 'Object Detection', usage: '507K+ labeled traffic boxes across dense heterogeneous Indian roads', projectIds: ['traffic-cv'] },
      { name: 'Scikit-learn', usage: 'RobustScaler, SMOTE pipelines, Random Forest, PR-curve calibration', projectIds: ['fraud-api'] },
      { name: 'XGBoost', usage: 'Low-latency ensemble classifier achieving 0.984 ROC-AUC', projectIds: ['fraud-api'] },
      { name: 'Java', usage: 'Core OOP and algorithmic problem-solving coursework', projectIds: [] },
    ],
  },
  {
    id: 'evaluation',
    code: '03',
    title: 'Tracking & Evaluation',
    skills: [
      { name: 'ByteTrack', usage: '94–100% directional vehicle counting with polygon ROI gating', projectIds: ['traffic-cv'] },
      { name: 'OpenCV', usage: '1080p frame decoding, ROI polygon overlays, real-time stream processing', projectIds: ['traffic-cv'] },
      { name: 'Model Evaluation', usage: 'Hungarian matching, mAP@50:95 diagnostics, PR-AUC threshold tuning', projectIds: ['traffic-cv', 'fraud-api', 'isro-satretrieval'] },
      { name: 'Weights & Biases', usage: 'Tracking 640-vs-1280 ablation runs and small-object recall gains', projectIds: ['traffic-cv'] },
    ],
  },
  {
    id: 'deployment',
    code: '04',
    title: 'API & Deployment',
    skills: [
      { name: 'FastAPI', usage: 'Production REST APIs for traffic inference and <1.8 ms fraud scoring', projectIds: ['traffic-cv', 'fraud-api'] },
      { name: 'REST APIs', usage: 'Typed Pydantic request schemas, threshold controls, health checks', projectIds: ['traffic-cv', 'fraud-api'] },
      { name: 'Docker', usage: 'Reproducible containerized runtime environments for model serving', projectIds: ['traffic-cv', 'fraud-api'] },
      { name: 'Gradio', usage: 'Interactive ROI polygon calibration interface for traffic streams', projectIds: ['traffic-cv'] },
      { name: 'Git', usage: 'Version control across experiments, hackathons, and API releases', projectIds: ['traffic-cv', 'fraud-api', 'isro-satretrieval'] },
    ],
  },
];

export const EDUCATION = {
  institution: 'Ramrao Adik Institute of Technology, D.Y. Patil University',
  period: '2025–2029 (Expected)',
  degree: 'B.Tech, Computer Science and Engineering (Artificial Intelligence & Machine Learning)',
  cgpa: '8.98/10',
  coursework: ['Data Structures and Algorithms', 'Database Management Systems', 'Java Programming'],
  secondary: [
    { level: 'CBSE Class XII', year: '2025' },
    { level: 'CBSE Class X', year: '2023' },
  ],
};

export const CERTIFICATIONS: Certification[] = [
  { issuer: 'Kaggle', title: 'Python', date: 'Sep 2026' },
  { issuer: 'Kaggle', title: 'Pandas, Data Visualization, Intro to Machine Learning', date: 'Oct 2026' },
];
