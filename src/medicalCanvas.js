// High-Fidelity Medical Canvas Synthesizer for Realistic Chest X-rays, Grad-CAM, and U-Net Polygons

export class MedicalImageRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.mode = 'gradcam'; // 'raw' | 'gradcam' | 'unet' | 'split'
    this.opacity = 0.7;
    this.zoom = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.currentCase = null;
    this.customImage = null;
    this.degradedMode = false;
  }

  setCase(caseData) {
    this.currentCase = caseData;
    this.customImage = null;
    this.degradedMode = false;
    this.render();
  }

  setCustomImage(img) {
    this.customImage = img;
    this.render();
  }

  setMode(mode) {
    this.mode = mode;
    this.render();
  }

  setOpacity(val) {
    this.opacity = val;
    this.render();
  }

  setDegraded(flag) {
    this.degradedMode = flag;
    this.render();
  }

  zoomIn() {
    this.zoom = Math.min(2.5, this.zoom + 0.2);
    this.render();
  }

  zoomOut() {
    this.zoom = Math.max(0.8, this.zoom - 0.2);
    this.render();
  }

  resetZoom() {
    this.zoom = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.render();
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.save();
    ctx.clearRect(0, 0, w, h);

    // Apply Zoom & Pan
    ctx.translate(w / 2 + this.panX, h / 2 + this.panY);
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-w / 2, -h / 2);

    // 1. Draw Base Chest X-Ray
    if (this.customImage) {
      ctx.drawImage(this.customImage, 0, 0, w, h);
    } else {
      this.drawSynthesizedCXR(ctx, w, h);
    }

    // Apply Degraded Artifacts if enabled
    if (this.degradedMode) {
      this.applyNoiseAndMotionBlur(ctx, w, h);
    }

    // 2. Draw Overlays based on Mode
    if (this.mode === 'gradcam' && this.currentCase) {
      this.drawGradCamHeatmap(ctx, this.currentCase.vision.heatCenter);
    } else if (this.mode === 'unet' && this.currentCase) {
      this.drawUNetSegmentation(ctx, this.currentCase.vision.polygon);
    } else if (this.mode === 'split' && this.currentCase) {
      this.drawSplitComparison(ctx, w, h);
    }

    // Grid Coordinates / Medical Calipers Overlay
    this.drawMedicalHUD(ctx, w, h);

    ctx.restore();
  }

  drawSynthesizedCXR(ctx, w, h) {
    // Medical Dark Thoracic Background
    const bgGrad = ctx.createRadialGradient(w/2, h/2, 50, w/2, h/2, w*0.7);
    bgGrad.addColorStop(0, '#0c1017');
    bgGrad.addColorStop(1, '#020408');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Thoracic Rib Cage & Spinal Column Skeleton Silhouette
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';

    // Spine
    ctx.beginPath();
    ctx.moveTo(w/2, 60);
    ctx.lineTo(w/2, 520);
    ctx.stroke();

    // Clavicles (collar bones)
    ctx.lineWidth = 18;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.beginPath();
    ctx.moveTo(w/2 - 20, 110);
    ctx.quadraticCurveTo(w/2 - 120, 80, 100, 120);
    ctx.moveTo(w/2 + 20, 110);
    ctx.quadraticCurveTo(w/2 + 120, 80, w - 100, 120);
    ctx.stroke();

    // Rib Arcs
    ctx.lineWidth = 9;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.13)';
    for (let i = 0; i < 7; i++) {
      const y = 160 + i * 44;
      // Left ribs
      ctx.beginPath();
      ctx.moveTo(w/2 - 30, y - 20);
      ctx.quadraticCurveTo(w/2 - 160, y + 25, 90 + i*6, y + 20);
      ctx.stroke();
      // Right ribs
      ctx.beginPath();
      ctx.moveTo(w/2 + 30, y - 20);
      ctx.quadraticCurveTo(w/2 + 160, y + 25, w - (90 + i*6), y + 20);
      ctx.stroke();
    }

    // Lung Fields (Radiolucent dark lung zones with vascular arborization)
    this.drawLungField(ctx, w/2 - 125, 270, 95, 170, true);
    this.drawLungField(ctx, w/2 + 125, 270, 95, 170, false);

    // Cardiac Silhouette (Heart Shadow)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.beginPath();
    // Heart leans left in AP/PA CXR (viewer's right)
    ctx.moveTo(w/2 - 15, 220);
    ctx.quadraticCurveTo(w/2 + 30, 260, w/2 + 80, 360);
    ctx.quadraticCurveTo(w/2 + 60, 430, w/2 - 40, 420);
    ctx.quadraticCurveTo(w/2 - 70, 350, w/2 - 15, 220);
    ctx.fill();

    // Hemidiaphragms (Dome contours)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    // Right Hemidiaphragm (higher)
    ctx.beginPath();
    ctx.moveTo(60, 520);
    ctx.quadraticCurveTo(w/2 - 100, 410, w/2 - 10, 450);
    ctx.lineTo(w/2 - 10, 560);
    ctx.lineTo(60, 560);
    ctx.fill();

    // Left Hemidiaphragm
    ctx.beginPath();
    ctx.moveTo(w - 60, 520);
    ctx.quadraticCurveTo(w/2 + 100, 425, w/2, 450);
    ctx.lineTo(w/2, 560);
    ctx.lineTo(w - 60, 560);
    ctx.fill();

    // Dynamic localized pathology rendering for all multi-dataset cohorts
    if (this.currentCase && this.currentCase.vision && this.currentCase.vision.heatCenter) {
      const hc = this.currentCase.vision.heatCenter;
      const cid = this.currentCase.id || '';
      if (hc.radius > 0) {
        if (cid.includes('nodule')) {
          // Circumscribed dense nodule
          ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.beginPath();
          ctx.arc(hc.x, hc.y, 16, 0, Math.PI * 2);
          ctx.fill();
        } else if (cid.includes('tb')) {
          // Thick-walled cavitation (ring)
          ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
          ctx.beginPath();
          ctx.arc(hc.x, hc.y, 35, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#0a0e17';
          ctx.beginPath();
          ctx.arc(hc.x, hc.y, 16, 0, Math.PI * 2);
          ctx.fill();
        } else if (cid.includes('cardiomegaly')) {
          // Huge enlarged cardiac silhouette
          ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.beginPath();
          ctx.ellipse(320, 360, 125, 100, 0.2, 0, Math.PI * 2);
          ctx.fill();
        } else if (cid.includes('pneumothorax')) {
          // Pleural separation lucency line
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(hc.x, hc.y + 20, 48, Math.PI * 0.9, Math.PI * 1.8);
          ctx.stroke();
        } else if (cid.includes('effusion')) {
          // Fluid meniscus at costophrenic angle
          const fluidGrad = ctx.createLinearGradient(300, 380, 480, 500);
          fluidGrad.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
          fluidGrad.addColorStop(1, 'rgba(255, 255, 255, 0.65)');
          ctx.fillStyle = fluidGrad;
          ctx.beginPath();
          ctx.moveTo(330, 420);
          ctx.quadraticCurveTo(400, 420, 470, 400);
          ctx.lineTo(470, 520);
          ctx.lineTo(330, 520);
          ctx.fill();
        } else if (cid.includes('sarcoid')) {
          // Bilateral hilar adenopathy shadows
          ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.beginPath();
          ctx.arc(235, 270, 26, 0, Math.PI * 2);
          ctx.arc(365, 270, 26, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // General consolidative infiltrate / ground-glass gradient
          const infGrad = ctx.createRadialGradient(hc.x, hc.y, 10, hc.x, hc.y, hc.radius);
          infGrad.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
          infGrad.addColorStop(0.6, 'rgba(255, 255, 255, 0.28)');
          infGrad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
          ctx.fillStyle = infGrad;
          ctx.beginPath();
          ctx.arc(hc.x, hc.y, hc.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.restore();
  }

  drawLungField(ctx, cx, cy, rx, ry, isRight) {
    ctx.save();
    // Soft transparent parenchyma
    const lungGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, rx);
    lungGrad.addColorStop(0, 'rgba(15, 23, 42, 0.6)');
    lungGrad.addColorStop(1, 'rgba(30, 41, 59, 0.3)');
    ctx.fillStyle = lungGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, isRight ? -0.05 : 0.05, 0, Math.PI * 2);
    ctx.fill();

    // Subtle pulmonary vascular markings (bronchovascular tree)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(isRight ? cx + 25 : cx - 25, cy - 30);
      ctx.quadraticCurveTo(cx, cy + (i*20) - 40, isRight ? cx - 40 : cx + 40, cy + (i*25) - 30);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawGradCamHeatmap(ctx, center) {
    if (!center || center.radius <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.opacity;

    const { x, y, radius } = center;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius * 1.5);
    // Jet/Turbo-style explainability colormap (Red -> Yellow -> Green -> Blue -> Transparent)
    grad.addColorStop(0.0, 'rgba(239, 68, 68, 0.95)');   // Peak Activation (Red)
    grad.addColorStop(0.25, 'rgba(245, 158, 11, 0.85)'); // High (Orange/Yellow)
    grad.addColorStop(0.55, 'rgba(16, 185, 129, 0.6)');  // Moderate (Green)
    grad.addColorStop(0.8, 'rgba(6, 182, 212, 0.3)');   // Low (Cyan)
    grad.addColorStop(1.0, 'rgba(6, 182, 212, 0.0)');   // Periphery (0)

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Focal Crosshair Centroid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - 12, y);
    ctx.lineTo(x + 12, y);
    ctx.moveTo(x, y - 12);
    ctx.lineTo(x, y + 12);
    ctx.stroke();

    // Centroid Label
    ctx.font = '600 11px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`CAM Peak (${x}, ${y})`, x + 16, y - 6);

    ctx.restore();
  }

  drawUNetSegmentation(ctx, polygon) {
    if (!polygon || polygon.length < 3) return;
    ctx.save();

    // Fill polygon with semi-transparent cyan
    ctx.fillStyle = `rgba(6, 182, 212, ${this.opacity * 0.45})`;
    ctx.beginPath();
    ctx.moveTo(polygon[0][0], polygon[0][1]);
    for (let i = 1; i < polygon.length; i++) {
      ctx.lineTo(polygon[i][0], polygon[i][1]);
    }
    ctx.closePath();
    ctx.fill();

    // Draw Surgical Vector Boundary with Glowing Line
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 10;
    ctx.stroke();

    // Draw Vertex Markers
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    for (let pt of polygon) {
      ctx.beginPath();
      ctx.arc(pt[0], pt[1], 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Segmentation Tag
    const first = polygon[0];
    ctx.font = '700 11px monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('U-Net Mask: Dice 0.89', first[0] - 20, first[1] - 12);

    ctx.restore();
  }

  drawSplitComparison(ctx, w, h) {
    // Left half: Raw Scan; Right half: Grad-CAM overlay
    ctx.save();
    // Divider line
    const midX = w / 2;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(midX, 0);
    ctx.lineTo(midX, h);
    ctx.stroke();

    // Clip right side and draw Grad-CAM
    ctx.save();
    ctx.beginPath();
    ctx.rect(midX, 0, midX, h);
    ctx.clip();
    if (this.currentCase) {
      this.drawGradCamHeatmap(ctx, this.currentCase.vision.heatCenter);
    }
    ctx.restore();

    // Split Badges
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(10, 10, 100, 22);
    ctx.fillRect(midX + 10, 10, 140, 22);

    ctx.font = '700 10px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('RAW CXR', 20, 25);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('GRAD-CAM OVERLAY', midX + 20, 25);

    ctx.restore();
  }

  applyNoiseAndMotionBlur(ctx, w, h) {
    ctx.save();
    // Simulate degraded scan: gaussian grain & contrast wash
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(0, 0, w, h);

    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 45;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i+1] = Math.min(255, Math.max(0, data[i+1] + noise));
      data[i+2] = Math.min(255, Math.max(0, data[i+2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);

    // Warning Badge on Canvas
    ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
    ctx.fillRect(w/2 - 120, 20, 240, 26);
    ctx.font = '700 11px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('⚠️ DEGRADED SCAN ARTIFACTS INJECTED', w/2, 37);

    ctx.restore();
  }

  drawMedicalHUD(ctx, w, h) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;

    // Corner Calipers
    const len = 18;
    // Top-Left
    ctx.beginPath();
    ctx.moveTo(14, 14 + len); ctx.lineTo(14, 14); ctx.lineTo(14 + len, 14);
    // Top-Right
    ctx.moveTo(w - 14 - len, 14); ctx.lineTo(w - 14, 14); ctx.lineTo(w - 14, 14 + len);
    // Bottom-Left
    ctx.moveTo(14, h - 14 - len); ctx.lineTo(14, h - 14); ctx.lineTo(14 + len, h - 14);
    // Bottom-Right
    ctx.moveTo(w - 14 - len, h - 14); ctx.lineTo(w - 14, h - 14); ctx.lineTo(w - 14, h - 14 - len);
    ctx.stroke();

    // Scale Ruler (5cm marker)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.moveTo(20, h - 40);
    ctx.lineTo(80, h - 40);
    ctx.moveTo(20, h - 45); ctx.lineTo(20, h - 35);
    ctx.moveTo(80, h - 45); ctx.lineTo(80, h - 35);
    ctx.stroke();

    ctx.font = '600 9px monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText('5 cm', 42, h - 45);

    // Orientation Markers
    ctx.font = '800 14px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText('R', 24, h / 2);
    ctx.fillText('L', w - 34, h / 2);

    ctx.restore();
  }
}
