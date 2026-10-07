# PULSE-CV: Multimodal Medical Image Intelligence

> **An Evidence-Grounded AI Diagnostic Assistant Functioning as a Second Doctor in the Room.**

[![Vite](https://img.shields.io/badge/Vite-8.3.3-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![Zero Hallucination](https://img.shields.io/badge/Guardrails-Zero%20Hallucinations-10B981?style=flat)]()
[![Calibrated Confidence](https://img.shields.io/badge/Calibration-Platt%20%2F%20ECE%20%3C%200.03-06B6D4?style=flat)]()
[![FDA SaMD Guideline](https://img.shields.io/badge/Framing-Physician--to--Physician-F59E0B?style=flat)]()

---

## 🌟 Overview & Hackathon Topic Focus

Standard medical AI models output naive binary predictions (e.g. `Pneumonia: Yes`). **PULSE-CV** operates as a true clinical peer:
1. **Reads the chest X-ray** and pinpoints the anatomical lesion using Grad-CAM heatmaps and surgical U-Net polygon outlines.
2. **Parses the patient chart & EHR history** using clinical NLP (ClinicalBERT).
3. **Merges visual and linguistic representations** in a joint cross-attention latent space to produce **calibrated probability estimates**.
4. **Enforces evidence receipts** for every claim (zero hallucinations allowed) and uses **physician-to-physician framing** ("Consider evaluating...").

---

## 🧬 Core Architecture

```
[ Chest X-Ray / DICOM ]                [ Clinical Notes / EHR History ]
          │                                           │
   Vision Encoder                              Text Encoder
(DenseNet-121 / ViT-B/16)                   (ClinicalBERT / NLP)
          │                                           │
          └─────────────► [ Cross-Modal Fusion ] ◄────┘
                                  │
          ┌───────────────────────┼──────────────────────┐
          ▼                       ▼                      ▼
 [Calibrated Softmax]   [Grad-CAM / U-Net Mask]  [Evidence Receipts]
 (Temperature Scaled)    (Spatial Coordinates)   (Quoted EHR Strings)
```

- **Vision Encoder (The Eyes):** Extracts multi-scale spatial feature maps $(B, C, H, W)$ to retain exact spatial coordinates rather than global pooling.
- **Text Encoder (The Reader):** BioClinicalBERT processes patient demographics, vitals, auscultation findings, and symptom duration.
- **Multimodal Fusion (The Brain):** Bidirectional Cross-Attention:
  $$\mathbf{Z}_{fused} = \text{LayerNorm}(\mathbf{H}_{vis} + \text{CrossAttn}(Q=\mathbf{H}_{txt}, K=\mathbf{H}_{vis}, V=\mathbf{H}_{vis}))$$

---

## 🛡️ Strict Clinical Guardrails

1. **Zero Hallucinations (Evidence-Based Only):**
   - Every claim requires a **Visual Receipt** (spatial centroid & radius / mask) OR a **Textual Receipt** (verbatim note excerpt).
   - Unverified claims are automatically pruned by our cross-modal auditor.
2. **Calibrated Confidence & Uncertainty Quantification:**
   - Evaluates image quality (blur index, noise). Overconfidence on degraded scans is strictly penalized.
   - Temperature scaling ensures a predicted 78% probability matches historical empirical truth.
3. **Role Enforcement (Physician Co-Pilot):**
   - Framing is collegial and collaborative ("Consider evaluating RLL for consolidation based on...") rather than paternalistic diagnostic verdicts.

---

## 🚀 3-Phase Step-by-Step Implementation Roadmap

| Phase | Milestone | Datasets | Deliverables |
|---|---|---|---|
| **Phase 1** | *Single Modality & Localization* | MIMIC-CXR, CheXpert, RSNA Pneumonia | CNN/ViT baseline, Grad-CAM activation heatmaps proving parenchymal focus. |
| **Phase 2** | *Multimodal Integration* | MIMIC-CXR paired with Radiology Reports | Dual-encoder cross-attention, bidirectional text/visual evidence receipts. |
| **Phase 3** | *Advanced Segmentation & Polish* | SIIM-ACR Pneumothorax, QaTa-COV19 | U-Net / Mask R-CNN vector polygon boundaries with volumetric quantification. |

---

## 💻 Running the Application

### Prerequisites
- Node.js (v18+) & npm

### Development
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## 🧪 Interactive Web App Features
- **Benchmark Case Switcher:** Bacterial Lobar Pneumonia, Cardiomegaly & Pulmonary Edema, Apical Pneumothorax, Solitary Pulmonary Nodule, and Baseline Normal.
- **Visual Display Modes:** Raw Scan, Grad-CAM Heatmap overlay, U-Net Polygon Boundary, and Split-screen comparison.
- **Real-Time Cross-Attention Simulation:** Edit clinical notes (e.g. inject "asymptomatic" vs "acute sepsis") and observe immediate confidence and modality weight adjustments.
- **Live Guardrail Auditor:** Interactive simulations of Hallucination Injections, Degraded Scan Penalties, and Physician Tone Linters.
- **Formal Clinical Receipt Note Generator:** Export and print ready clinical notes.
