# HNX26PSI05: Multimodal Medical Image Intelligence (PULSE-CV)

> **Computer Vision · Medical AI · Multimodal AI**  
> An open-source **Gemma Medical AI Agent** acting as a second doctor in the room with calibrated confidence, cross-modal evidence grounding, and surgical U-Net outlines.

[![Gemma Agent](https://img.shields.io/badge/Agent-Gemma--2--Medical--CoPilot-4285F4?style=flat&logo=google)]()
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20REST-009688?style=flat&logo=fastapi)]()
[![Vite](https://img.shields.io/badge/Frontend-Vite%20Vanilla%20JS-646CFF?style=flat&logo=vite)](http://localhost:5173)
[![Zero Hallucinations](https://img.shields.io/badge/Guardrails-Strict%20Receipts-10B981?style=flat)]()
[![Physician Framing](https://img.shields.io/badge/Framing-Doctor%2C%20consider...-F59E0B?style=flat)]()

---

## 🎯 Hackathon Criteria & Core Mandates Addressed

| Hackathon Requirement | Implementation in PULSE-CV |
|---|---|
| **Second opinion helper (not a replacement)** | System outputs peer-to-peer phrasing: `"Doctor, consider evaluating right lower base for..."` rather than `"Patient has pneumonia"`. |
| **Points to exact region in image** | Interactive canvas renders **Grad-CAM heatmaps** (with $x, y$ coordinates & activation scores) and **U-Net vector outlines**. |
| **Combines image + patient context** | Joint dual-encoder cross-attention. Clinical notes (e.g. *"asymptomatic"* vs *"fevers/chills"*) dynamically adjust visual probability. |
| **Strict Zero Hallucination Rule** | Every claim requires an image location receipt OR clinical note quote. Unsupported claims are purged. |
| **Calibrated confidence levels** | Temperature scaling ($T=1.35$) ensures realistic confidence (e.g. 78% vs 95%). Blurry/degraded scans immediately trigger penalties. |
| **Segment/outline problem areas** | Precise U-Net polygon masks for pleural lines, infiltrates, and cardiomegaly boundaries. |

---

## 🏗️ System Architecture

```
[ Chest X-Ray / CT Scan ]              [ Clinical Notes / Vitals ]
          │                                         │
   Vision Encoder                             Text Encoder
 (DenseNet / ViT / CAM)                    (ClinicalBERT / NLP)
          │                                         │
          └─────────────► [ Cross-Modal Fusion ] ◄──┘
                                  │
                                  ▼
               [ Gemma-2 Medical Reasoning Agent ]
               - Location Receipts (Centroid x,y)
               - Verbatim Clinical Quotes
               - Temperature-Scaled Confidence
               - "Doctor, consider evaluating..." Framing
                                  │
           ┌──────────────────────┴──────────────────────┐
           ▼                                             ▼
 [FastAPI Service (:8000)]                    [Vite UI Dashboard (:5173)]
```

---

## 🚀 How to Run the Project

### 1. Start the Backend API & Gemma Agent (Port 8000)
```bash
python3 backend/app.py
```
*Health Check:* `curl http://localhost:8000/api/health`

### 2. Start the Frontend Application (Port 5173)
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 📊 Dataset & Model Training Pipeline

- **Data Generation:** `python3 scripts/generate_dataset.py` generates labeled radiographic images and paired clinical notes across 5 pathologies.
- **Model Training & Calibration:** `python3 scripts/train_model.py` extracts spatial CAM statistics, calculates Platt temperature scaling, and saves artifacts to `models/multimodal_weights.json`.

---

## 🛡️ Live Guardrail Verifications
- **Hallucination Rejection Test:** Injects fake claim `"Suspected Osteosarcoma"`. Since it has no image centroid or text receipt, the Gemma Agent returns `FAIL_UNSUPPORTED_HALLUCINATION`.
- **Degraded Scan Stress Test:** Injects synthetic blur and noise. Confidence drops by over 40% to prevent unsafe certainty on low-quality scans.
- **Language Linter:** Filters out deterministic assertions and enforces collaborative physician-to-physician phrasing.
