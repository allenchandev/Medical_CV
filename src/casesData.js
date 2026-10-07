// Multi-Dataset Unified Clinical Corpus (MIMIC-CXR, Stanford CheXpert, SIIM-ACR, NLST, NIH ChestX-ray14)

export const BENCHMARK_CASES = [
  {
    id: "case-pneumonia-1",
    datasetSource: "MIMIC-CXR v2.0 (MIT-LCP)",
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
      backbone: "DenseNet-121 + ViT-B/16 (RadImageNet Pre-trained)",
      finding: "Right Lower Lobe Consolidation",
      peakActivation: "0.91 (RLL Zone)",
      heatCenter: { x: 380, y: 390, radius: 85 },
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
      receiptVision: "Centroid: X=380, Y=390, Radius=85px (RLL Opacity, CTR=0.46)",
      receiptText: "“Productive cough with purulent rust-colored sputum... tactile fevers reaching 102.1°F... inspiratory crackles in right lower base.”",
      advisory: "Doctor, consider evaluating the right lower lobe for dense bacterial lobar consolidation/pneumonia in correlation with 4-day febrile illness, elevated leukocyte count (14.8k), and hypoxia (91%). Recommend sputum culture, urine Streptococcus pneumoniae antigen test, and empiric antibiotic coverage per institutional Community-Acquired Pneumonia (CAP) guidelines.",
      next_steps: [
        { step: "Obtain Sputum Gram Stain & Blood Cultures x2", urgency: "Immediate", protocol: "Prior to antibiotic administration" },
        { step: "Initiate Empiric CAP Regimen (Beta-lactam + Macrolide)", urgency: "Stat (<4h)", protocol: "ATS/IDSA Guidelines" },
        { step: "Continuous Pulse Oximetry & Supplemental Oxygenation", urgency: "Immediate", protocol: "Maintain SpO2 > 92%" }
      ],
      differentials: [
        { name: "Bacterial Lobar Pneumonia", conf: 78 },
        { name: "Right Lower Lobe Atelectasis", conf: 14 },
        { name: "Loculated Parapneumonic Effusion", conf: 8 }
      ]
    }
  },
  {
    id: "case-cardiomegaly-2",
    datasetSource: "Stanford CheXpert (14 Pathologies)",
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
      backbone: "DenseNet-121 + ResNet-50 (CheXpert Ensemble)",
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
      receiptVision: "Centroid: X=300, Y=350, Radius=115px (CTR=0.61 > 0.50 threshold)",
      receiptText: "“Progressive orthopnea requiring 3 pillows... bilateral lower extremity 2+ pitting edema... paroxysmal nocturnal dyspnea.”",
      advisory: "Doctor, consider evaluating for decompensated congestive heart failure with cardiomegaly and vascular redistribution. Visual cardiac enlargement strongly corroborated by clinical symptoms of volume overload (orthopnea, PND, peripheral edema) and normal WBC. Recommend serum NT-proBNP evaluation and urgent echocardiographic review.",
      next_steps: [
        { step: "Serum NT-proBNP & Basic Metabolic Panel (BMP)", urgency: "Immediate", protocol: "Cardiac stress & renal baseline" },
        { step: "IV Loop Diuretic Therapy (Furosemide 40mg)", urgency: "Urgent", protocol: "Decongestion protocol" },
        { step: "Transthoracic Echocardiogram (TTE)", urgency: "Within 24h", protocol: "Assess LVEF & wall motion" }
      ],
      differentials: [
        { name: "Congestive Heart Failure / Edema", conf: 84 },
        { name: "Pericardial Effusion", conf: 11 },
        { name: "Bilateral Hypostatic Infiltrate", conf: 5 }
      ]
    }
  },
  {
    id: "case-pneumothorax-3",
    datasetSource: "SIIM-ACR Pneumothorax Challenge",
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
      backbone: "U-Net + ViT-Hybrid (SIIM-ACR Segmentor)",
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
      receiptVision: "Centroid: X=420, Y=160, Radius=65px (Apical Pleural Separation, CTR=0.42)",
      receiptText: "“Acute onset sudden sharp left pleuritic chest pain... dyspnea at rest... diminished breath sounds over the left apex.”",
      advisory: "Doctor, consider urgent evaluation for spontaneous left apical pneumothorax (approximately 20-25% apical volume loss). Findings match presentation of sudden pleuritic chest pain and unilateral decreased breath sounds. Recommend urgent bedside thoracic ultrasound and surgical/interventional consultation for observation vs small-bore chest tube placement.",
      next_steps: [
        { step: "Bedside Lung Ultrasound (BLUE Protocol)", urgency: "Stat", protocol: "Confirm absence of lung sliding" },
        { step: "Thoracic Surgery Consult for Chest Tube / Pigtail Catheter", urgency: "Immediate", protocol: "Pleural decompression" },
        { step: "High-Flow 100% O2 via Non-Rebreather", urgency: "Immediate", protocol: "Accelerates nitrogen resorption 4x" }
      ],
      differentials: [
        { name: "Spontaneous Left Pneumothorax", conf: 91 },
        { name: "Apical Bullous Disease", conf: 6 },
        { name: "Musculoskeletal Pleurisy", conf: 3 }
      ]
    }
  },
  {
    id: "case-nodule-4",
    datasetSource: "National Lung Screening Trial (NLST)",
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
      backbone: "DenseNet-121 + Mask R-CNN (NLST Detector)",
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
      receiptVision: "Centroid: X=210, Y=190, Radius=45px (CTR=0.44)",
      receiptText: "“Former 25 pack-year cigarette smoker, quit 4 years ago... No cough, hemoptysis, fevers.”",
      advisory: "Doctor, consider evaluating circumscribed 14mm nodule in right upper lobe. In the context of a 25 pack-year smoking history, Fleischner Society guidelines recommend dedicated high-resolution non-contrast CT chest and comparison with prior historical imaging to assess doubling time.",
      next_steps: [
        { step: "Order High-Resolution Non-Contrast Chest CT (HRCT)", urgency: "High Priority", protocol: "Fleischner Society Guidelines 2026" },
        { step: "Retrieve Historical Imaging for Volumetric Doubling Time", urgency: "Standard", protocol: "Compare 12-24 mo prior scans" },
        { step: "Schedule Pulmonology / Thoracic Multidisciplinary Review", urgency: "Elective", protocol: "If size > 8mm solid component" },
        { step: "Serum Inflammatory Panel & Sputum Cytology (Optional)", urgency: "Low", protocol: "Exclude occult granulomatous disease" }
      ],
      differentials: [
        { name: "Solitary Pulmonary Nodule (Etiology Indeterminate)", conf: 72 },
        { name: "Granuloma / Prior Histoplasmosis", conf: 18 },
        { name: "Vascular Malformation / AVM", conf: 10 }
      ]
    }
  },
  {
    id: "case-effusion-5",
    datasetSource: "NIH ChestX-ray14 (112k Scans)",
    title: "Moderate Pleural Effusion",
    severity: "moderate",
    patient: {
      id: "PT-6681-CXR",
      ageGender: "61 yo Male",
      spo2: "92% (Room Air)",
      wbc: "11.2 x10³/µL (Elevated)",
      notes: "Progressive [[exertional breathlessness over 2 weeks]] with [[dull aching right lower chest discomfort]]. Physical exam confirms [[dullness to percussion and diminished vesicular breathing at right base]]."
    },
    vision: {
      backbone: "DenseNet-121 + Feature Pyramid Network",
      finding: "Right Costophrenic Sulcus Meniscus Sign",
      peakActivation: "0.89 (Right Base)",
      heatCenter: { x: 395, y: 440, radius: 75 },
      polygon: [
        [320, 420], [380, 400], [450, 410], [480, 480], [390, 500], [320, 460]
      ],
      description: "Homogeneous blunting of right lateral and posterior costophrenic angles with classic concave meniscus contour."
    },
    fusion: {
      confidence: 86,
      reliability: "HIGH RADIOLOGICAL-CLINICAL CONCORDANCE",
      reliabilityDesc: "Fluid meniscus sign verified with percussion dullness.",
      visionWeight: 54,
      textWeight: 46,
      receiptVision: "Centroid: X=395, Y=440, Radius=75px (Meniscus Sign, Blunted Costophrenic Angle, CTR=0.49)",
      receiptText: "“Dull aching right lower chest discomfort, dullness to percussion, diminished vesicular breathing.”",
      advisory: "Doctor, consider evaluating the right costophrenic sulcus for moderate free-flowing pleural effusion (meniscus sign observed). Correlates with physical exam dullness and exertional dyspnea. Recommend diagnostic thoracentesis to differentiate exudate vs transudate using Light's criteria.",
      next_steps: [
        { step: "Diagnostic Ultrasound-Guided Thoracentesis", urgency: "Urgent", protocol: "Light's Criteria (LDH, Protein, Cell Count, pH)" },
        { step: "Decubitus Chest Radiograph or Thoracic Ultrasound", urgency: "Same Day", protocol: "Confirm fluid layering > 10mm depth" },
        { step: "Pleural Fluid Cytology & Gram Stain / Acid-Fast Smear", urgency: "Standard", protocol: "Rule out parapneumonic vs malignancy" }
      ],
      differentials: [
        { name: "Right Pleural Effusion (Exudative vs Transudative)", conf: 86 },
        { name: "Subpulmonic Pleural Collection", conf: 9 },
        { name: "Basilar Pleural Thickening / Plaque", conf: 5 }
      ]
    }
  },
  {
    id: "case-normal-6",
    datasetSource: "MIMIC-CXR Verified Healthy Baseline",
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
      backbone: "DenseNet-121 + ViT-B/16 (MIMIC Baseline)",
      finding: "No Acute Thoracic Abnormality",
      peakActivation: "0.14 (Diffuse baseline)",
      heatCenter: { x: 300, y: 300, radius: 0 },
      polygon: [],
      description: "Clear lung fields, normal cardiothoracic silhouette, sharp costophrenic sulci bilaterally."
    },
    fusion: {
      confidence: 96,
      reliability: "HIGH CALIBRATION (True Negative)",
      reliabilityDesc: "Visual feature entropy low, negative predictive value corroborated by asymptomatic clinical history.",
      visionWeight: 45,
      textWeight: 55,
      receiptVision: "Diffuse baseline thoracic parenchyma (CTR=0.41, Sharp Sulci)",
      receiptText: "“Patient reports no respiratory symptoms, no chest discomfort... lungs clear to auscultation bilaterally.”",
      advisory: "Doctor, visual and clinical evaluation demonstrates no acute cardiopulmonary process. Cardiomediastinal contour and pulmonary vascularity within normal physiological limits. Patient appears cleared from a pulmonary standpoint for elective surgical intervention.",
      next_steps: [
        { step: "Proceed with Standard Surgical Clearance", urgency: "Routine", protocol: "No pulmonary contraindications" },
        { step: "Routine Outpatient Follow-up as Needed", urgency: "Elective", protocol: "Standard preventive care" }
      ],
      differentials: [
        { name: "Normal Cardiopulmonary Examination", conf: 96 },
        { name: "Minimal Incidental Tracheobronchial Markings", conf: 4 }
      ]
    }
  }
];
