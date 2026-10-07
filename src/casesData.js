// Benchmark Medical Cases with Ground-Truth Annotations, Heatmap Geometry, and Strict Receipts
export const BENCHMARK_CASES = [
  {
    id: "case-pneumonia-1",
    title: "Bacterial Lobar Pneumonia",
    severity: "high",
    patient: {
      id: "PT-9482-CXR",
      ageGender: "64 yo Male",
      spo2: "91% (Room Air)",
      wbc: "14.8 x10³/µL (Elevated)",
      notes: "Patient presents to ED with 4-day history of worsening shortness of breath and [[productive cough with purulent rust-colored sputum]]. Reports [[tactile fevers reaching 102.1°F]] and sharp right-sided pleuritic chest pain on inspiration. [[Auscultation reveals bronchial breath sounds and inspiratory crackles in right lower base]]. No prior history of COPD or heart failure."
    },
    vision: {
      backbone: "DenseNet-121 + ViT-B/16",
      finding: "Right Lower Lobe Consolidation",
      peakActivation: "0.91 (RLL Zone)",
      // Heatmap epicenter
      heatCenter: { x: 380, y: 390, radius: 85 },
      // U-Net polygonal boundary coordinates (proportional [x, y] in 600x600 space)
      polygon: [
        [310, 340], [360, 310], [430, 330], [470, 390], 
        [460, 460], [400, 480], [330, 440], [305, 380]
      ],
      description: "Dense opacity occupying the right lower thoracic zone obscuring the hemidiaphragmatic margin (air bronchograms noted)."
    },
    fusion: {
      confidence: 78,
      reliability: "HIGH CORROBORATION",
      reliabilityDesc: "Image clarity index: 0.94, Text concordance: 0.88, Expected Calibration Error < 0.03.",
      visionWeight: 58,
      textWeight: 42,
      receiptVision: "Right Lower Lobe Consolidation (Centroid: X: 380, Y: 390, Radius: 85px, Area: 19.2% right hemithorax).",
      receiptText: "“Productive cough with purulent rust-colored sputum... tactile fevers reaching 102.1°F... inspiratory crackles in right lower base.”",
      advisory: "Consider evaluating the right lower lobe for dense bacterial lobar consolidation/pneumonia in correlation with 4-day febrile illness, elevated leukocyte count (14.8k), and hypoxia (91%). Recommend sputum culture, urine Streptococcus pneumoniae antigen test, and empiric antibiotic coverage per institutional Community-Acquired Pneumonia (CAP) guidelines.",
      differentials: [
        { name: "Bacterial Lobar Pneumonia", conf: 78, barClass: "accent" },
        { name: "Right Lower Lobe Atelectasis", conf: 14, barClass: "subtle" },
        { name: "Loculated Parapneumonic Effusion", conf: 8, barClass: "subtle" }
      ]
    }
  },
  {
    id: "case-cardiomegaly-2",
    title: "Cardiomegaly & Pulm. Edema",
    severity: "moderate",
    patient: {
      id: "PT-3104-CXR",
      ageGender: "72 yo Female",
      spo2: "93% (2L NC)",
      wbc: "8.1 x10³/µL (Normal)",
      notes: "Patient with known hypertensive cardiomyopathy presents with [[progressive orthopnea requiring 3 pillows]] and [[bilateral lower extremity 2+ pitting edema]]. Denies fever or chills. Noted [[paroxysmal nocturnal dyspnea]] and 8 lb weight gain over 10 days. S3 gallop audible on cardiac auscultation."
    },
    vision: {
      backbone: "DenseNet-121 + ResNet-50",
      finding: "Cardiomegaly (CTR > 0.58) & Cephalization",
      peakActivation: "0.86 (Cardiac Silhouette)",
      heatCenter: { x: 300, y: 350, radius: 115 },
      polygon: [
        [190, 310], [250, 240], [360, 260], [425, 340], 
        [430, 440], [360, 480], [240, 465], [180, 400]
      ],
      description: "Transverse cardiac diameter enlarged relative to transthoracic diameter. Blunting of costophrenic angles and prominent vascular pedicle."
    },
    fusion: {
      confidence: 84,
      reliability: "HIGH CONCORDANCE",
      reliabilityDesc: "Cardiothoracic ratio 0.61 verified. Text strongly confirms volume overload without infectious markers.",
      visionWeight: 52,
      textWeight: 48,
      receiptVision: "Transverse cardiac silhouette > 61% transthoracic ratio, perihilar vascular haziness.",
      receiptText: "“Progressive orthopnea requiring 3 pillows... bilateral lower extremity 2+ pitting edema... paroxysmal nocturnal dyspnea.”",
      advisory: "Consider evaluating for decompensated congestive heart failure with cardiomegaly and vascular redistribution. Visual cardiac enlargement strongly corroborated by clinical symptoms of volume overload (orthopnea, PND, peripheral edema) and normal WBC. Recommend serum NT-proBNP evaluation and urgent echocardiographic review.",
      differentials: [
        { name: "Congestive Heart Failure / Edema", conf: 84, barClass: "accent" },
        { name: "Pericardial Effusion", conf: 11, barClass: "subtle" },
        { name: "Bilateral Hypostatic Infiltrate", conf: 5, barClass: "subtle" }
      ]
    }
  },
  {
    id: "case-pneumothorax-3",
    title: "Apical Pneumothorax",
    severity: "high",
    patient: {
      id: "PT-7729-CXR",
      ageGender: "22 yo Male",
      spo2: "94% (Room Air)",
      wbc: "6.9 x10³/µL (Normal)",
      notes: "Tall, thin athletic male with [[acute onset sudden sharp left pleuritic chest pain]] while resting, followed immediately by [[dyspnea at rest]]. No antecedent trauma. Auscultation demonstrates [[diminished breath sounds over the left apex]]. Normal inflammatory markers."
    },
    vision: {
      backbone: "U-Net + ViT-Hybrid",
      finding: "Left Apical Pleural Line Separation",
      peakActivation: "0.93 (Left Apex)",
      heatCenter: { x: 420, y: 160, radius: 65 },
      polygon: [
        [370, 110], [440, 95], [490, 140], [480, 210], 
        [430, 240], [380, 190]
      ],
      description: "Thin visceral pleural line visible in the left apex with absent peripheral pulmonary vascular markings."
    },
    fusion: {
      confidence: 91,
      reliability: "SURGICAL EMERGENCY CORROBORATION",
      reliabilityDesc: "Clear visceral pleural line with absent peripheral lung markings in left superior apex.",
      visionWeight: 65,
      textWeight: 35,
      receiptVision: "Left apical pleural separation (Centroid: X: 420, Y: 160, Depth: 24mm from inner thoracic wall).",
      receiptText: "“Acute onset sudden sharp left pleuritic chest pain... dyspnea at rest... diminished breath sounds over the left apex.”",
      advisory: "Consider urgent evaluation for spontaneous left apical pneumothorax (approximately 20-25% apical volume loss). Findings match presentation of sudden pleuritic chest pain and unilateral decreased breath sounds. Recommend urgent bedside thoracic ultrasound and surgical/interventional consultation for observation vs small-bore chest tube placement.",
      differentials: [
        { name: "Spontaneous Left Pneumothorax", conf: 91, barClass: "accent" },
        { name: "Apical Bullous Disease", conf: 6, barClass: "subtle" },
        { name: "Musculoskeletal Pleurisy", conf: 3, barClass: "subtle" }
      ]
    }
  },
  {
    id: "case-nodule-4",
    title: "Solitary Pulmonary Nodule",
    severity: "subtle",
    patient: {
      id: "PT-5519-CXR",
      ageGender: "58 yo Female",
      spo2: "98% (Room Air)",
      wbc: "7.2 x10³/µL (Normal)",
      notes: "Asymptomatic executive presenting for annual executive physical screening. [[Former 25 pack-year cigarette smoker, quit 4 years ago]]. [[No cough, hemoptysis, fevers, or unintentional weight loss]]. Physical examination unremarkable."
    },
    vision: {
      backbone: "DenseNet-121 + Mask R-CNN",
      finding: "Right Upper Lobe Circumscribed Nodule",
      peakActivation: "0.82 (RUL Periphery)",
      heatCenter: { x: 210, y: 190, radius: 45 },
      polygon: [
        [185, 175], [225, 170], [240, 195], [220, 215], [185, 205]
      ],
      description: "Circumscribed non-calcified nodular opacity measuring ~14mm in the peripheral right upper lobe."
    },
    fusion: {
      confidence: 72,
      reliability: "MODERATE CONFIDENCE (Fleischner Criteria Applicable)",
      reliabilityDesc: "Nodule visible on scan. Text identifies high-risk demographic (25 pack-year smoking history).",
      visionWeight: 50,
      textWeight: 50,
      receiptVision: "14mm solid nodular opacity in right upper lobe (Centroid: X: 210, Y: 190).",
      receiptText: "“Former 25 pack-year cigarette smoker, quit 4 years ago... No cough, hemoptysis, fevers.”",
      advisory: "Consider evaluating circumscribed 14mm nodule in right upper lobe. In the context of a 25 pack-year smoking history, Fleischner Society guidelines recommend dedicated high-resolution non-contrast CT chest and comparison with prior historical imaging to assess doubling time.",
      differentials: [
        { name: "Solitary Pulmonary Nodule (Etiology Indeterminate)", conf: 72, barClass: "accent" },
        { name: "Granuloma / Prior Histoplasmosis", conf: 18, barClass: "subtle" },
        { name: "Vascular Malformation / AVM", conf: 10, barClass: "subtle" }
      ]
    }
  },
  {
    id: "case-normal-5",
    title: "Unremarkable Baseline Scan",
    severity: "clear",
    patient: {
      id: "PT-1102-CXR",
      ageGender: "34 yo Female",
      spo2: "99% (Room Air)",
      wbc: "6.0 x10³/µL (Normal)",
      notes: "Pre-operative assessment prior to elective laparoscopic cholecystectomy. [[Patient reports no respiratory symptoms, no chest discomfort, no fever]]. Fully active without exercise limitation. [[Lungs clear to auscultation bilaterally]]."
    },
    vision: {
      backbone: "DenseNet-121 + ViT-B/16",
      finding: "No Acute Thoracic Abnormality",
      peakActivation: "0.14 (Diffuse baseline)",
      heatCenter: { x: 300, y: 300, radius: 20 },
      polygon: [],
      description: "Clear lung fields, normal cardiothoracic silhouette, sharp costophrenic sulci bilaterally."
    },
    fusion: {
      confidence: 96,
      reliability: "HIGH CALIBRATION (True Negative)",
      reliabilityDesc: "Visual feature entropy low, negative predictive value corroborated by asymptomatic clinical history.",
      visionWeight: 45,
      textWeight: 55,
      receiptVision: "No focal consolidation, pneumothorax, or pleural effusion detected across thoracic fields.",
      receiptText: "“Patient reports no respiratory symptoms, no chest discomfort... lungs clear to auscultation bilaterally.”",
      advisory: "Visual and clinical evaluation demonstrates no acute cardiopulmonary process. Cardiomediastinal contour and pulmonary vascularity within normal physiological limits. Patient appears cleared from a pulmonary standpoint for elective surgical intervention.",
      differentials: [
        { name: "Normal Cardiopulmonary Examination", conf: 96, barClass: "accent" },
        { name: "Minimal Incidental Tracheobronchial Markings", conf: 4, barClass: "subtle" }
      ]
    }
  }
];
