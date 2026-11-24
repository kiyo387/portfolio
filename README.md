# Shreyas Bhavsar — Portfolio

Interactive AI/ML & Computer Vision portfolio built with React 19, Vite, Tailwind CSS v4, Motion, Lenis, and Lucide React.

## Run Locally

```bash
npm install
npm run dev
```

## Build & Verify

```bash
npm run build
npm run verify
```

## Key Interactive Modules

- **YOLOv8 + ByteTrack Calibration Viewport (`src/components/VisionViewport.tsx`)**: Toggle `640px` vs `1280px` inference scale, ByteTrack IDs/trails, and draggable polygon ROI gates.
- **Credit Card Fraud & Threshold Workbench (`src/components/FraudSimulator.tsx`)**: Interactive Precision-Recall threshold calibration (`0.10`–`0.95`, default `0.70`) and live `POST /predict` microservice simulator.
- **ISRO BAH 2026 SatRetrieval Lab (`src/components/SatRetrievalLab.tsx`)**: Cross-modal SAR-to-optical split-curtain comparator and `k`-reciprocal re-ranking toggle over `FAISS HNSW (24,050 vectors)`.
- **Command Palette (`src/components/CommandPalette.tsx`)**: Instant `Ctrl+K` / `Cmd+K` navigation, resume download, contact copy, and theme switcher.
