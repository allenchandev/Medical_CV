#!/usr/bin/env python3
"""
Synthetic Medical Dataset Generator
Creates labeled chest radiograph simulations paired with structured clinical notes
for Pneumonia, Cardiomegaly, Pneumothorax, Pulmonary Nodule, and Normal findings.
"""

import os
import json
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
IMAGES_DIR = os.path.join(DATA_DIR, "images")
os.makedirs(IMAGES_DIR, exist_ok=True)

SAMPLES = [
    {
        "id": "CASE_PN_01",
        "label": "Pneumonia",
        "category": "infectious",
        "patient": {
            "id": "PT-9482-CXR",
            "age": 64,
            "gender": "Male",
            "spo2": "91%",
            "wbc": "14.8k",
            "history": "4-day worsening productive cough with rust-colored sputum, fevers reaching 102.1F, localized inspiratory crackles in right lower base."
        },
        "pathology_center": (380, 390),
        "pathology_radius": 85,
        "intensity": 0.88,
        "mask_polygon": [[310, 340], [360, 310], [430, 330], [470, 390], [460, 460], [400, 480], [330, 440], [305, 380]]
    },
    {
        "id": "CASE_CM_02",
        "label": "Cardiomegaly",
        "category": "cardiac",
        "patient": {
            "id": "PT-3104-CXR",
            "age": 72,
            "gender": "Female",
            "spo2": "93%",
            "wbc": "8.1k",
            "history": "Progressive 3-pillow orthopnea, bilateral 2+ pitting leg edema, paroxysmal nocturnal dyspnea, S3 gallop, weight gain of 8 lbs over 10 days."
        },
        "pathology_center": (300, 350),
        "pathology_radius": 115,
        "intensity": 0.82,
        "mask_polygon": [[190, 310], [250, 240], [360, 260], [425, 340], [430, 440], [360, 480], [240, 465], [180, 400]]
    },
    {
        "id": "CASE_PTX_03",
        "label": "Pneumothorax",
        "category": "pleural",
        "patient": {
            "id": "PT-7729-CXR",
            "age": 22,
            "gender": "Male",
            "spo2": "94%",
            "wbc": "6.9k",
            "history": "Acute onset sudden sharp left pleuritic chest pain while resting, dyspnea at rest, absent lung sounds over the left apex."
        },
        "pathology_center": (420, 160),
        "pathology_radius": 65,
        "intensity": 0.92,
        "mask_polygon": [[370, 110], [440, 95], [490, 140], [480, 210], [430, 240], [380, 190]]
    },
    {
        "id": "CASE_NOD_04",
        "label": "Pulmonary Nodule",
        "category": "oncology_indeterminate",
        "patient": {
            "id": "PT-5519-CXR",
            "age": 58,
            "gender": "Female",
            "spo2": "98%",
            "wbc": "7.2k",
            "history": "Asymptomatic executive screening. Former 25 pack-year cigarette smoker, quit 4 years ago. No cough, hemoptysis, fevers, or weight loss."
        },
        "pathology_center": (210, 190),
        "pathology_radius": 45,
        "intensity": 0.79,
        "mask_polygon": [[185, 175], [225, 170], [240, 195], [220, 215], [185, 205]]
    },
    {
        "id": "CASE_NORM_05",
        "label": "Normal Baseline",
        "category": "healthy",
        "patient": {
            "id": "PT-1102-CXR",
            "age": 34,
            "gender": "Female",
            "spo2": "99%",
            "wbc": "6.0k",
            "history": "Pre-operative assessment prior to elective laparoscopic surgery. No respiratory symptoms, clear breath sounds bilaterally, active athletic history."
        },
        "pathology_center": (300, 300),
        "pathology_radius": 0,
        "intensity": 0.12,
        "mask_polygon": []
    }
]

def generate_medical_scan(sample):
    """Synthesize high-contrast realistic thoracic radiograph for testing"""
    w, h = 600, 600
    img = Image.new("L", (w, h), color=15)
    draw = ImageDraw.Draw(img)

    # Spine silhouette
    draw.line([(300, 50), (300, 520)], fill=60, width=16)

    # Clavicles
    draw.line([(280, 110), (100, 120)], fill=85, width=14)
    draw.line([(320, 110), (500, 120)], fill=85, width=14)

    # Rib cage
    for i in range(7):
        y = 160 + i * 44
        draw.arc([80, y - 20, 300, y + 40], start=180, end=360, fill=45, width=8)
        draw.arc([300, y - 20, 520, y + 40], start=180, end=360, fill=45, width=8)

    # Bilateral dark lung zones
    draw.ellipse([160, 140, 280, 450], fill=25)
    draw.ellipse([320, 140, 440, 450], fill=25)

    # Cardiac silhouette
    draw.polygon([(280, 240), (370, 360), (320, 430), (240, 410), (220, 330)], fill=75)

    # Add pathology artifact if present
    cx, cy = sample["pathology_center"]
    rad = sample["pathology_radius"]
    if rad > 0:
        draw.ellipse([cx - rad, cy - rad, cx + rad, cy + rad], fill=int(80 + sample["intensity"] * 100))

    img = img.filter(ImageFilter.GaussianBlur(radius=3))
    
    # Save Image
    filepath = os.path.join(IMAGES_DIR, f"{sample['id']}.png")
    img.save(filepath)
    sample["image_path"] = filepath
    return sample

def main():
    metadata = []
    print("Generating synthetic clinical datasets...")
    for s in SAMPLES:
        processed = generate_medical_scan(s)
        metadata.append(processed)
        print(f"Generated {processed['id']} -> {processed['label']}")

    meta_file = os.path.join(DATA_DIR, "dataset_manifest.json")
    with open(meta_file, "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"Dataset manifest written to {meta_file}")

if __name__ == "__main__":
    main()
