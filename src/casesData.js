// Unified Multi-Dataset Benchmark Corpus (12 Real-World Cohorts)
// Sources: MIMIC-CXR, Stanford CheXpert, SIIM-ACR, NLST, NIH CXR-14, BIMCV PadChest, 
// COVID-19 Radiography DB, Montgomery/Shenzhen TB, VinDr-CXR, RSNA Vascular/PE, and Sarcoidosis

export const BENCHMARK_CASES = [
  {
    id: "case-pneumonia-1",
    datasetSource: "MIMIC-CXR v2.0 (MIT-LCP)",
    title: "Bacterial Lobar Pneumonia",
    severity: "high",
    category: "Infectious / Alveolar",
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
      reliabilityDesc: "Image clarity index: 0.94, Text concordance: 0.88, Expected Calibration Error < 0.02.",
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
    category: "Hemodynamic / Cardiac",
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
    category: "Pleural / Emergency",
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
    category: "Oncologic Surveillance",
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
    datasetSource: "NIH ChestX-ray14 (112,120 Scans)",
    title: "Moderate Pleural Effusion",
    severity: "moderate",
    category: "Pleural / Fluid Accumulation",
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
    category: "Healthy / Clear",
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
  },
  {
    id: "case-tb-7",
    datasetSource: "Montgomery & Shenzhen TB Sets (NIH/NLM)",
    title: "Apical Cavitary Tuberculosis",
    severity: "high",
    category: "Infectious / Mycobacterial",
    patient: {
      id: "PT-4219-TB",
      ageGender: "43 yo Male",
      spo2: "93% (Room Air)",
      wbc: "12.6 x10³/µL (Elevated)",
      notes: "3-week history of [[drenching night sweats]], progressive [[12 lb unintentional weight loss]], low-grade afternoon fevers, and [[intermittent hemoptysis with blood-streaked sputum]]. Born in an endemic tuberculosis region. Auscultation shows post-tussive apical crackles."
    },
    vision: {
      backbone: "DenseNet-121 + ResNet-101 (Montgomery TB Model)",
      finding: "Right Apical Thick-Walled Cavitation",
      peakActivation: "0.94 (Right Apex)",
      heatCenter: { x: 410, y: 180, radius: 60 },
      polygon: [[360, 140], [430, 130], [470, 170], [455, 230], [390, 240], [355, 190]],
      description: "Thick-walled radiolucent cavitary lesion with surrounding consolidative infiltrate in the right apical and posterior segment."
    },
    fusion: {
      confidence: 88,
      reliability: "HIGH INFECTIOUS CONCORDANCE",
      reliabilityDesc: "Apical cavitation matches triad of night sweats, weight loss, and hemoptysis.",
      visionWeight: 60,
      textWeight: 40,
      receiptVision: "Centroid: X=410, Y=180, Radius=60px (Thick-walled Cavity, CTR=0.43)",
      receiptText: "“Drenching night sweats, 12 lb unintentional weight loss, intermittent hemoptysis with blood-streaked sputum.”",
      advisory: "Doctor, consider immediate evaluation of right apical thick-walled cavitary lesion consistent with active pulmonary tuberculosis. Presentation of drenching night sweats, hemoptysis, and weight loss warrants prompt airborne isolation and sputum acid-fast bacilli smear.",
      next_steps: [
        { step: "Place in Airborne Infection Isolation Room (Negative Pressure)", urgency: "Stat / Immediate", protocol: "CDC TB Infection Control" },
        { step: "Sputum AFB Smear & GeneXpert MTB/RIF Nucleic Acid Amplification x3", urgency: "Immediate", protocol: "Morning induced sputum" },
        { step: "Initiate Standard 4-Drug RIPE Therapy (Rifampin, INH, PZA, Ethambutol)", urgency: "Urgent (<12h)", protocol: "WHO Treatment Guidelines" }
      ],
      differentials: [
        { name: "Active Cavitary Tuberculosis (MTB)", conf: 88 },
        { name: "Necrotizing / Lung Abscess", conf: 8 },
        { name: "Cavitary Bronchogenic Carcinoma", conf: 4 }
      ]
    }
  },
  {
    id: "case-covid-8",
    datasetSource: "COVID-19 Radiography Database (Qatar Univ)",
    title: "Bilateral Ground-Glass Opacities",
    severity: "high",
    category: "Viral Pneumonitis",
    patient: {
      id: "PT-8803-COV",
      ageGender: "54 yo Male",
      spo2: "88% (Room Air)",
      wbc: "4.1 x10³/µL (Lymphopenia 0.6)",
      notes: "Day 8 of acute viral respiratory infection with worsening dyspnea, [[persistent dry hacking cough]], myalgias, profound fatigue, and [[anosmia]]. Demonstrates [[silent hypoxia with room air SpO2 88%]] without proportional respiratory distress."
    },
    vision: {
      backbone: "EfficientNet-B4 + ViT (COVID-19 Radiography Ensemble)",
      finding: "Multifocal Peripheral Ground-Glass Opacities",
      peakActivation: "0.88 (Bilateral Lower Zones)",
      heatCenter: { x: 240, y: 360, radius: 95 },
      polygon: [[160, 280], [250, 270], [280, 360], [260, 440], [170, 430], [140, 350]],
      description: "Bilateral, predominantly peripheral and subpleural ground-glass opacities with vascular thickening in the lower lung lobes."
    },
    fusion: {
      confidence: 85,
      reliability: "ACUTE VIRAL CORROBORATION",
      reliabilityDesc: "Peripheral ground-glass haze strongly aligns with silent hypoxia (88%) and lymphopenia.",
      visionWeight: 56,
      textWeight: 44,
      receiptVision: "Centroid: X=240, Y=360, Radius=95px (Peripheral Ground Glass, CTR=0.48)",
      receiptText: "“Day 8 acute viral illness, persistent dry cough, anosmia, silent hypoxia SpO2 88%.”",
      advisory: "Doctor, consider evaluating for multifocal peripheral ground-glass opacities and viral pneumonitis. Severe hypoxia (88%) despite modest tachypnea is consistent with acute COVID-19/viral lung injury. Recommend rapid PCR panel, supplemental high-flow cannula, and proning.",
      next_steps: [
        { step: "Supplemental High-Flow Nasal Cannula (HFNC) & Awake Self-Proning", urgency: "Immediate", protocol: "Target SpO2 92-96%" },
        { step: "Multiplex Viral Respiratory PCR Panel (COVID/Flu/RSV)", urgency: "Immediate", protocol: "Rapid lab confirmation" },
        { step: "Dexamethasone 6mg IV Daily + Remdesivir Course", urgency: "Urgent (<4h)", protocol: "NIH COVID-19 Guidelines" }
      ],
      differentials: [
        { name: "COVID-19 / Viral Multifocal Pneumonitis", conf: 85 },
        { name: "Pneumocystis Jirovecii Pneumonia (PJP)", conf: 10 },
        { name: "Cryptogenic Organizing Pneumonia (COP)", conf: 5 }
      ]
    }
  },
  {
    id: "case-atelectasis-9",
    datasetSource: "VinDr-CXR Benchmark (Vingroup & Hospital 108)",
    title: "Bibasilar Subsegmental Atelectasis",
    severity: "subtle",
    category: "Mechanical / Post-Surgical",
    patient: {
      id: "PT-6194-VND",
      ageGender: "68 yo Male",
      spo2: "94% (Room Air)",
      wbc: "7.5 x10³/µL (Normal)",
      notes: "Post-operative Day 2 following open abdominal colectomy. [[Splinting respirations secondary to incisional pain]]. [[Afebrile, no purulent sputum, normal leukocyte count]]. Bilateral basilar crackles that clear noticeably after deep sustained cough."
    },
    vision: {
      backbone: "DenseNet-121 (VinDr-CXR Benchmark)",
      finding: "Bibasilar Horizontal Plate-Like Opacities",
      peakActivation: "0.74 (Bibasilar)",
      heatCenter: { x: 390, y: 430, radius: 65 },
      polygon: [[330, 410], [420, 395], [470, 430], [450, 470], [350, 480]],
      description: "Linear band-like opacities parallel to the hemidiaphragm bilaterally, characteristic of discoid/plate-like subsegmental atelectasis."
    },
    fusion: {
      confidence: 76,
      reliability: "POST-SURGICAL CORROBORATION",
      reliabilityDesc: "Discoid bands with normal WBC indicate non-infectious alveolar hypoventilation.",
      visionWeight: 50,
      textWeight: 50,
      receiptVision: "Centroid: X=390, Y=430, Radius=65px (Linear Band Opacity, CTR=0.50)",
      receiptText: "“Post-op Day 2 open abdominal surgery, splinting respirations, afebrile, normal WBC.”",
      advisory: "Doctor, consider evaluating linear plate-like opacities at bilateral lung bases representing compressive post-surgical atelectasis rather than bacterial pneumonia. Normal WBC and absence of fever support pulmonary toilet and adequate pain control.",
      next_steps: [
        { step: "Aggressive Incentive Spirometry (10 breaths/hour while awake)", urgency: "Routine", protocol: "Alveolar recruitment protocol" },
        { step: "Optimize Multimodal Post-Op Analgesia to Allow Deep Breathing", urgency: "Urgent", protocol: "Enhanced Recovery After Surgery (ERAS)" },
        { step: "Early Ambulation with Physical Therapy", urgency: "Same Day", protocol: "Prevent venothromboembolism & atelectasis" }
      ],
      differentials: [
        { name: "Plate-Like Post-Surgical Atelectasis", conf: 76 },
        { name: "Early Hospital-Acquired Pneumonia (HAP)", conf: 16 },
        { name: "Subclinical Pulmonary Embolism", conf: 8 }
      ]
    }
  },
  {
    id: "case-fibrosis-10",
    datasetSource: "PadChest Cohort (BIMCV / Univ Alicante)",
    title: "Idiopathic Pulmonary Fibrosis",
    severity: "moderate",
    category: "Interstitial / Restrictive",
    patient: {
      id: "PT-5082-PDC",
      ageGender: "70 yo Male",
      spo2: "91% (Room Air)",
      wbc: "6.8 x10³/µL (Normal)",
      notes: "9-month history of [[insidious progressive exertional dyspnea]] and persistent dry non-productive cough. Physical exam notable for [[bilateral fine Velcro-like end-inspiratory crackles]] at both lung bases and [[digital clubbing]]. Afebrile."
    },
    vision: {
      backbone: "DenseNet-169 + Spatial CAM (PadChest Model)",
      finding: "Bibasilar Reticular Markings & Volume Loss",
      peakActivation: "0.85 (Peripheral Bases)",
      heatCenter: { x: 220, y: 420, radius: 70 },
      polygon: [[160, 380], [250, 360], [280, 420], [250, 470], [170, 480]],
      description: "Coarse peripheral and basilar reticular opacities with reduced lung volume and diaphragmatic elevation."
    },
    fusion: {
      confidence: 83,
      reliability: "CHRONIC INTERSTITIAL CONCORDANCE",
      reliabilityDesc: "Peripheral reticulation matches 9-month dyspnea, Velcro crackles, and digital clubbing.",
      visionWeight: 53,
      textWeight: 47,
      receiptVision: "Centroid: X=220, Y=420, Radius=70px (Basilar Reticular Markings, Reduced Lung Vol)",
      receiptText: "“9-month progressive dyspnea, dry cough, bilateral Velcro inspiratory crackles, clubbing.”",
      advisory: "Doctor, consider evaluating peripheral reticular interstitial markings and volume loss for usual interstitial pneumonia (UIP) pattern. Velcro crackles and digital clubbing strongly suggest Idiopathic Pulmonary Fibrosis. Recommend high-resolution CT and formal pulmonary function testing.",
      next_steps: [
        { step: "High-Resolution Prone & Supine Inspiratory/Expiratory CT (HRCT)", urgency: "High Priority", protocol: "ATS/ERS/JRS/ALAT IPF Criteria" },
        { step: "Full Pulmonary Function Tests (PFTs) with DLCO Measurement", urgency: "Standard", protocol: "Evaluate restrictive deficit" },
        { step: "Interstitial Lung Disease (ILD) Multidisciplinary Review", urgency: "Elective", protocol: "Consider antifibrotic therapy" }
      ],
      differentials: [
        { name: "Idiopathic Pulmonary Fibrosis (IPF / UIP)", conf: 83 },
        { name: "Connective Tissue Disease-Related ILD", conf: 12 },
        { name: "Chronic Hypersensitivity Pneumonitis", conf: 5 }
      ]
    }
  },
  {
    id: "case-pe-11",
    datasetSource: "RSNA Pulmonary Vascular Benchmark",
    title: "Westermark Sign (Pulmonary Embolism)",
    severity: "high",
    category: "Vascular / Occlusive Emergency",
    patient: {
      id: "PT-9011-RSNA",
      ageGender: "51 yo Female",
      spo2: "89% (Room Air)",
      wbc: "9.4 x10³/µL (Normal)",
      notes: "Sudden onset [[severe dyspnea and tachycardia (HR 118 bpm)]] shortly after completing a 14-hour international flight. Acute [[sharp pleuritic right-sided chest pain]]. Examination demonstrates a [[swollen, warm, tender right calf (Wells score 6.0)]]. Afebrile."
    },
    vision: {
      backbone: "DenseNet-121 + Dual-Tree Wavelet (RSNA PE Model)",
      finding: "Focal Right Oligemia (Westermark Sign)",
      peakActivation: "0.89 (Right Mid Zone)",
      heatCenter: { x: 200, y: 260, radius: 75 },
      polygon: [[150, 200], [240, 200], [270, 280], [240, 330], [150, 310]],
      description: "Marked focal hypoperfusion and relative lucency (oligemia) in the right middle and lower lung field without parenchymal consolidation."
    },
    fusion: {
      confidence: 89,
      reliability: "HIGH EMERGENCY RISK CORROBORATION",
      reliabilityDesc: "Focal oligemia corroborated by immobilization, tachycardia, pleurisy, and unilateral leg swelling.",
      visionWeight: 58,
      textWeight: 42,
      receiptVision: "Centroid: X=200, Y=260, Radius=75px (Focal Oligemia / Westermark Sign, CTR=0.49)",
      receiptText: "“Sudden dyspnea, HR 118 bpm after long flight, pleuritic right pain, tender right calf.”",
      advisory: "Doctor, consider immediate evaluation for massive/submassive pulmonary embolism. Relative focal oligemia (Westermark sign) in right lung matches acute hypoxia, sinus tachycardia, and high Wells score. Recommend stat CT Pulmonary Angiography and therapeutic anticoagulation.",
      next_steps: [
        { step: "Stat CT Pulmonary Angiography (CTPA) with IV Contrast", urgency: "Stat / Immediate", protocol: "Gold standard vascular scan" },
        { step: "Initiate Weight-Adjusted Low Molecular Weight Heparin or UFH", urgency: "Stat", protocol: "Prior to scan if high clinical probability" },
        { step: "Bedside Echocardiogram & High-Sensitivity Troponin / BNP", urgency: "Urgent", protocol: "Stratify Right Ventricular (RV) Strain" }
      ],
      differentials: [
        { name: "Acute Pulmonary Embolism (High Risk)", conf: 89 },
        { name: "Acute Aortic Syndromes", conf: 6 },
        { name: "Spontaneous Pneumothorax", conf: 5 }
      ]
    }
  },
  {
    id: "case-sarcoid-12",
    datasetSource: "NLST & CheXpert Multi-Center Node Set",
    title: "Bilateral Hilar Lymphadenopathy",
    severity: "moderate",
    category: "Granulomatous / Mediastinal",
    patient: {
      id: "PT-3388-SRC",
      ageGender: "38 yo Female",
      spo2: "97% (Room Air)",
      wbc: "6.2 x10³/µL (Normal)",
      notes: "Young female presenting with [[painful tender red pretibial subcutaneous nodules (erythema nodosum)]], [[bilateral ankle arthralgias]], and mild fatigue. Denies cough, fever, hemoptysis, or smoking history. Lungs clear on auscultation."
    },
    vision: {
      backbone: "DenseNet-121 + Mediastinal FPN (CheXpert / NLST Node Set)",
      finding: "Symmetrical Bilateral Hilar Adenopathy (Garland Triad)",
      peakActivation: "0.87 (Hilar Stations)",
      heatCenter: { x: 360, y: 270, radius: 70 },
      polygon: [[320, 220], [390, 220], [420, 280], [390, 340], [320, 320]],
      description: "Well-circumscribed potato-like enlargement of bilateral pulmonary hila with right paratracheal prominence."
    },
    fusion: {
      confidence: 87,
      reliability: "LÖFGREN SYNDROME CONCORDANCE",
      reliabilityDesc: "Bilateral symmetrical hilar enlargement strongly aligns with erythema nodosum and periarthritis.",
      visionWeight: 54,
      textWeight: 46,
      receiptVision: "Centroid: X=360, Y=270, Radius=70px (Symmetrical Bilateral Hilar Adenopathy, CTR=0.45)",
      receiptText: "“Painful red pretibial nodules (erythema nodosum), bilateral ankle arthritis, afebrile.”",
      advisory: "Doctor, consider evaluating symmetrical bilateral hilar and right paratracheal lymphadenopathy (Garland triad). In association with erythema nodosum and periarthritis, findings strongly indicate Löfgren syndrome (acute sarcoidosis stage 1). Prognosis is typically favorable.",
      next_steps: [
        { step: "Contrast-Enhanced Chest CT with Mediastinal Window", urgency: "Standard", protocol: "Characterize lymph node stations" },
        { step: "Serum ACE (Angiotensin-Converting Enzyme) & Calcium Panel", urgency: "Standard", protocol: "Metabolic granulomatous activity" },
        { step: "Formal Ophthalmologic Slit-Lamp Examination", urgency: "Elective", protocol: "Screen for silent anterior uveitis" }
      ],
      differentials: [
        { name: "Stage 1 Sarcoidosis (Löfgren Syndrome)", conf: 87 },
        { name: "Lymphoma / Mediastinal Neoplasm", conf: 9 },
        { name: "Histoplasmosis / Primary Tuberculosis", conf: 4 }
      ]
    }
  }
];
