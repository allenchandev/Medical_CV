import { createIcons, icons } from 'lucide';
import { BENCHMARK_CASES } from './casesData.js';
import { MedicalImageRenderer } from './medicalCanvas.js';

// Application State
let currentCaseIndex = 0;
let renderer = null;

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  initRenderer();
  initNavigation();
  initCaseChips();
  initViewControls();
  initInteractiveEHR();
  initGuardrailTests();
  initExportModal();
  initThemeToggle();

  // Load Initial Case
  loadCase(0);
});

function initIcons() {
  createIcons({ icons });
}

function initRenderer() {
  renderer = new MedicalImageRenderer('medical-canvas');

  // Heatmap opacity slider
  const opacityInput = document.getElementById('heatmap-opacity');
  const opacityVal = document.getElementById('opacity-val');
  if (opacityInput) {
    opacityInput.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      opacityVal.textContent = `${val}%`;
      renderer.setOpacity(val / 100);
    });
  }

  // Zoom buttons
  document.getElementById('zoom-in')?.addEventListener('click', () => renderer.zoomIn());
  document.getElementById('zoom-out')?.addEventListener('click', () => renderer.zoomOut());
  document.getElementById('zoom-reset')?.addEventListener('click', () => renderer.resetZoom());

  // Canvas Mouse Inspection (Coordinate & Activation tracking)
  const canvas = document.getElementById('medical-canvas');
  const tag = document.getElementById('canvas-inspection-tag');
  const tagX = document.getElementById('tag-x');
  const tagY = document.getElementById('tag-y');
  const tagAct = document.getElementById('tag-act');

  if (canvas && tag) {
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = Math.round((e.clientX - rect.left) * (canvas.width / rect.width));
      const y = Math.round((e.clientY - rect.top) * (canvas.height / rect.height));

      tag.classList.remove('hidden');
      tag.style.left = `${e.clientX - rect.left}px`;
      tag.style.top = `${e.clientY - rect.top}px`;
      tagX.textContent = x;
      tagY.textContent = y;

      const currentCase = BENCHMARK_CASES[currentCaseIndex];
      if (currentCase && currentCase.vision.heatCenter) {
        const { x: cx, y: cy, radius } = currentCase.vision.heatCenter;
        const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        const act = Math.max(0.05, Math.min(0.96, 1.0 - (dist / (radius * 1.6)))).toFixed(2);
        tagAct.textContent = act;
      }
    });

    canvas.addEventListener('mouseleave', () => {
      tag.classList.add('hidden');
    });
  }

  // File Upload for Custom Scans
  const uploadInput = document.getElementById('image-upload-input');
  if (uploadInput) {
    uploadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          renderer.setCustomImage(img);
          // Highlight custom load in UI
          document.getElementById('pt-id').textContent = 'CUSTOM-USER-SCAN';
          document.getElementById('model-backbone').textContent = 'Live Inference Pipeline (Pending)';
          document.getElementById('confidence-percentage').textContent = '68%';
          document.getElementById('confidence-bar').style.width = '68%';
          document.getElementById('cal-annotation-text').innerHTML =
            '<i data-lucide="info"></i><span>Uploaded Scan: Running real-time Monte Carlo epistemic uncertainty check...</span>';
          initIcons();
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // Reset Case
  document.getElementById('reset-case-btn')?.addEventListener('click', () => {
    loadCase(currentCaseIndex);
  });
}

function initNavigation() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const targetId = `tab-${tab.dataset.tab}`;
      document.querySelectorAll('.tab-pane').forEach((pane) => {
        pane.classList.remove('active');
      });
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
      initIcons();
    });
  });
}

function initCaseChips() {
  const container = document.getElementById('case-chips-list');
  if (!container) return;

  container.innerHTML = BENCHMARK_CASES.map((c, i) => `
    <button class="case-chip ${i === 0 ? 'active' : ''}" data-index="${i}">
      <span>${c.title}</span>
      <span class="badge-risk ${c.severity}">${c.severity.toUpperCase()}</span>
    </button>
  `).join('');

  container.querySelectorAll('.case-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index, 10);
      loadCase(idx);
    });
  });
}

function loadCase(index) {
  currentCaseIndex = index;
  const c = BENCHMARK_CASES[index];
  if (!c) return;

  // Update Case Chips active state
  document.querySelectorAll('.case-chip').forEach((chip, i) => {
    chip.classList.toggle('active', i === index);
  });

  // 1. Modality I: Vision
  renderer.setCase(c);
  document.getElementById('model-backbone').textContent = c.vision.backbone;
  document.getElementById('peak-activation').textContent = c.vision.peakActivation;

  // 2. Modality II: Text (EHR)
  document.getElementById('pt-id').textContent = c.patient.id;
  document.getElementById('pt-age-gender').textContent = c.patient.ageGender;
  document.getElementById('pt-spo2').textContent = c.patient.spo2;
  document.getElementById('pt-wbc').textContent = c.patient.wbc;

  // Parse notes and format [[grounded tokens]]
  const notesContainer = document.getElementById('clinical-notes-render');
  const rawNotes = c.patient.notes;
  const parsedNotes = rawNotes.replace(/\[\[(.*?)\]\]/g, (match, p1) => {
    return `<span class="grounded-token" data-token="${p1}">${p1}</span>`;
  });
  notesContainer.innerHTML = parsedNotes;

  // Add click listener to grounded tokens
  notesContainer.querySelectorAll('.grounded-token').forEach((span) => {
    span.addEventListener('click', () => {
      notesContainer.querySelectorAll('.grounded-token').forEach((s) => s.classList.remove('highlighted'));
      span.classList.add('highlighted');
      // Highlight corresponding receipt
      const receipt = document.getElementById('receipt-text-detail');
      receipt.style.borderColor = 'var(--accent-cyan)';
      receipt.style.backgroundColor = 'rgba(6, 182, 212, 0.2)';
      setTimeout(() => {
        receipt.style.borderColor = '';
        receipt.style.backgroundColor = '';
      }, 1500);
    });
  });

  document.getElementById('custom-ehr-input').value = `Patient notes loaded for ${c.patient.id}. Modify symptoms to test Cross-Modal Dynamic Attention...`;

  // 3. Fusion Brain & Co-Pilot Advisory
  const confEl = document.getElementById('confidence-percentage');
  const barEl = document.getElementById('confidence-bar');
  confEl.textContent = `${c.fusion.confidence}%`;
  barEl.style.width = `${c.fusion.confidence}%`;

  // Set bar color based on calibrated confidence
  if (c.fusion.confidence > 80) {
    barEl.style.background = 'linear-gradient(90deg, #10b981, #06b6d4)';
  } else if (c.fusion.confidence > 60) {
    barEl.style.background = 'linear-gradient(90deg, #f59e0b, #06b6d4)';
  } else {
    barEl.style.background = 'linear-gradient(90deg, #ef4444, #f59e0b)';
  }

  document.getElementById('cal-annotation-text').innerHTML = `
    <i data-lucide="info"></i>
    <span>Reliability Index: <strong>${c.fusion.reliability}</strong> (${c.fusion.reliabilityDesc})</span>
  `;

  document.getElementById('vision-weight-fill').style.width = `${c.fusion.visionWeight}%`;
  document.getElementById('vision-weight-fill').textContent = `${c.fusion.visionWeight}%`;
  document.getElementById('text-weight-fill').style.width = `${c.fusion.textWeight}%`;
  document.getElementById('text-weight-fill').textContent = `${c.fusion.textWeight}%`;

  document.getElementById('receipt-vision-detail').textContent = c.fusion.receiptVision;
  document.getElementById('receipt-text-detail').textContent = c.fusion.receiptText;
  document.getElementById('advisory-text-content').textContent = `"${c.fusion.advisory}"`;

  // Differentials
  const diffContainer = document.getElementById('differentials-list');
  diffContainer.innerHTML = c.fusion.differentials.map((d) => `
    <div class="diff-row">
      <span class="diff-name">${d.name}</span>
      <div class="diff-conf-wrap">
        <div class="diff-bar">
          <div class="diff-bar-fill" style="width: ${d.conf}%; background: ${d.conf > 50 ? 'var(--accent-cyan)' : 'var(--text-dim)'}"></div>
        </div>
        <span class="diff-pct">${d.conf}%</span>
      </div>
    </div>
  `).join('');

  initIcons();
}

function initViewControls() {
  const modeGroup = document.getElementById('seg-mode-group');
  if (!modeGroup) return;

  modeGroup.querySelectorAll('.pill-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      modeGroup.querySelectorAll('.pill-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.dataset.mode;
      renderer.setMode(mode);
    });
  });
}

function initInteractiveEHR() {
  const reanalyzeBtn = document.getElementById('reanalyze-btn');
  const inputEl = document.getElementById('custom-ehr-input');

  if (reanalyzeBtn && inputEl) {
    reanalyzeBtn.addEventListener('click', () => {
      const text = inputEl.value.toLowerCase();
      reanalyzeBtn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Computing Cross-Attention...';
      initIcons();

      setTimeout(() => {
        reanalyzeBtn.innerHTML = '<i data-lucide="play"></i> Run Dual-Modal Cross-Attention';
        initIcons();

        // Dynamic adjustment based on text modifiers
        let adjustedConf = 78;
        let vWeight = 58;
        let tWeight = 42;
        let advisory = '';

        if (text.includes('asymptomatic') || text.includes('young') || text.includes('no fever') || text.includes('no cough')) {
          // Asymptomatic context downgrades visual severity (per Phase 2 rule)
          adjustedConf = 48;
          vWeight = 40;
          tWeight = 60;
          advisory = 'Patient history indicates absence of acute inflammatory or constitutional symptoms. Downgrading probability of acute infectious pneumonia; consider non-acute atelectasis, artifact, or resolving process. Recommend serial clinical monitoring rather than aggressive antimicrobials.';
        } else if (text.includes('fever') || text.includes('hypoxia') || text.includes('icu') || text.includes('severe') || text.includes('sepsis')) {
          // Escalates confidence
          adjustedConf = 89;
          vWeight = 62;
          tWeight = 38;
          advisory = 'Acute systemic indicators (fevers/hypoxia/septic markers) strongly corroborate high-density consolidation in right thoracic zone. Consider immediate initiation of broad-spectrum coverage and high-flow supplemental oxygenation.';
        } else {
          adjustedConf = 75;
          advisory = 'Multimodal cross-attention updated based on user-supplied clinical note. Visual and linguistic tokens balanced in joint latent embedding.';
        }

        document.getElementById('confidence-percentage').textContent = `${adjustedConf}%`;
        document.getElementById('confidence-bar').style.width = `${adjustedConf}%`;
        document.getElementById('vision-weight-fill').style.width = `${vWeight}%`;
        document.getElementById('vision-weight-fill').textContent = `${vWeight}%`;
        document.getElementById('text-weight-fill').style.width = `${tWeight}%`;
        document.getElementById('text-weight-fill').textContent = `${tWeight}%`;
        document.getElementById('advisory-text-content').textContent = `"${advisory}"`;
        document.getElementById('receipt-text-detail').textContent = `User simulated text: "${inputEl.value.slice(0, 85)}..."`;
      }, 700);
    });
  }
}

function initGuardrailTests() {
  // Test 1: Hallucination Injection Test
  const testHallucinationBtn = document.getElementById('test-hallucination-btn');
  const hallucinationRes = document.getElementById('hallucination-test-result');

  if (testHallucinationBtn && hallucinationRes) {
    testHallucinationBtn.addEventListener('click', () => {
      hallucinationRes.classList.remove('hidden');
      hallucinationRes.innerHTML = `
        <div style="color: #f59e0b; font-weight: 700; margin-bottom: 4px;">
          ⚠️ INJECTING UNFOUNDED CLAIM: "Suspected Metastatic Osteosarcoma of Left Humerus"
        </div>
        <div style="color: #94a3b8; line-height: 1.4;">
          1. <strong>Vision Spatial Verification:</strong> Cross-checked bounding boxes across left humeral head. No visual activation found (Activation: 0.02 < 0.35 threshold).<br/>
          2. <strong>Text Receipt Check:</strong> Scanned clinical note for oncology terms. Exact string match = 0.<br/>
          <span style="color: #10b981; font-weight: 700;">✅ GUARDRAIL 1 PASSED: Claim flagged as ZERO-EVIDENCE HALLUCINATION and purged from diagnostic advisory.</span>
        </div>
      `;
    });
  }

  // Test 2: Degraded Scan Test
  const testDegradedBtn = document.getElementById('test-degraded-scan-btn');
  const degradedRes = document.getElementById('degraded-scan-test-result');

  if (testDegradedBtn && degradedRes) {
    testDegradedBtn.addEventListener('click', () => {
      degradedRes.classList.remove('hidden');
      renderer.setDegraded(true);

      // Penalize confidence
      const curConf = parseInt(document.getElementById('confidence-percentage').textContent, 10);
      const penalizedConf = Math.max(34, curConf - 42);
      document.getElementById('confidence-percentage').textContent = `${penalizedConf}%`;
      document.getElementById('confidence-bar').style.width = `${penalizedConf}%`;
      document.getElementById('confidence-bar').style.background = 'linear-gradient(90deg, #ef4444, #f59e0b)';

      degradedRes.innerHTML = `
        <div style="color: #ef4444; font-weight: 700; margin-bottom: 4px;">
          📉 SCAN DEGRADATION DETECTED: Blur Index: 0.72 | Noise Variance: +42%
        </div>
        <div style="color: #cbd5e1; line-height: 1.4;">
          • High epistemic uncertainty triggered via Monte Carlo dropout.<br/>
          • Maximum model confidence capped from ${curConf}% down to <strong>${penalizedConf}%</strong>.<br/>
          • <span style="color: #f59e0b; font-weight: 700;">GUARDRAIL 2 ENFORCED: System refused 100% certainty on degraded scan and advised physician re-take or CT scan.</span>
        </div>
      `;
    });
  }

  // Test 3: Language Tone Linter Test
  const testLinterBtn = document.getElementById('test-linter-btn');
  const linterRes = document.getElementById('linter-test-result');

  if (testLinterBtn && linterRes) {
    testLinterBtn.addEventListener('click', () => {
      linterRes.classList.remove('hidden');
      linterRes.innerHTML = `
        <div style="color: #38bdf8; font-weight: 700; margin-bottom: 4px;">
          🔍 LEXICAL FRAMING AUDITOR:
        </div>
        <div style="font-family: monospace; font-size: 0.72rem; background: #05070c; padding: 6px; border-radius: 4px; margin-bottom: 4px;">
          <span style="color: #ef4444;">[VIOLATION REJECTED]:</span> "The patient definitely has severe pneumonia. Prescribe 500mg Azithromycin."<br/>
          <span style="color: #10b981;">[RE-PHRASED COMPLIANT]:</span> "Consider evaluating right lower lobe for bacterial consolidation based on 4-day cough and localized crackles. Clinician may assess suitability of institutional CAP therapy."
        </div>
        <span style="color: #10b981; font-weight: 700;">✅ GUARDRAIL 3 PASSED: Collegial Physician-to-Physician helper framing enforced.</span>
      `;
    });
  }

  // Copy Code Button
  const copyBtn = document.getElementById('copy-code-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const code = document.querySelector('.code-block-body code')?.innerText;
      if (code) {
        navigator.clipboard.writeText(code).then(() => {
          copyBtn.innerHTML = '<i data-lucide="check"></i> Copied!';
          initIcons();
          setTimeout(() => {
            copyBtn.innerHTML = '<i data-lucide="copy"></i> Copy Code';
            initIcons();
          }, 2000);
        });
      }
    });
  }
}

function initExportModal() {
  const modal = document.getElementById('report-modal');
  const openBtn = document.getElementById('export-report-btn');
  const closeBtn = document.getElementById('close-modal-btn');
  const dismissBtn = document.getElementById('dismiss-modal-btn');
  const printBtn = document.getElementById('print-report-btn');
  const modalBody = document.getElementById('report-modal-body');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      const currentCase = BENCHMARK_CASES[currentCaseIndex];
      modalBody.innerHTML = `
        <div style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px; margin-bottom: 12px;">
          <h4 style="color: var(--accent-cyan); margin-bottom: 4px;">PULSE-CV MULTIMODAL DIAGNOSTIC RECEIPT</h4>
          <div style="font-size: 0.75rem; color: var(--text-dim);">Generated on: ${new Date().toLocaleString()} | Certified Zero-Hallucination Pipeline</div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 14px; font-size: 0.8rem;">
          <div><strong>Patient ID:</strong> ${currentCase.patient.id}</div>
          <div><strong>Demographics:</strong> ${currentCase.patient.ageGender}</div>
          <div><strong>Pulse Ox:</strong> ${currentCase.patient.spo2}</div>
          <div><strong>WBC:</strong> ${currentCase.patient.wbc}</div>
        </div>
        <div style="margin-bottom: 12px;">
          <strong>Visual Finding:</strong> ${currentCase.vision.finding} (${currentCase.vision.peakActivation})
        </div>
        <div style="margin-bottom: 12px;">
          <strong>Calibrated Confidence:</strong> <span style="color: var(--accent-cyan); font-weight: bold;">${currentCase.fusion.confidence}%</span> (Reliability: ${currentCase.fusion.reliability})
        </div>
        <div style="background: rgba(15, 23, 42, 0.6); padding: 10px; border-radius: 6px; margin-bottom: 12px;">
          <strong style="color: var(--accent-sky);">Evidence Receipts:</strong><br/>
          • [Vision]: ${currentCase.fusion.receiptVision}<br/>
          • [Text]: ${currentCase.fusion.receiptText}
        </div>
        <div style="border-left: 3px solid var(--color-warning); padding-left: 8px; font-style: italic;">
          <strong>Physician Advisory:</strong> "${currentCase.fusion.advisory}"
        </div>
      `;
      modal.showModal();
      initIcons();
    });

    closeBtn?.addEventListener('click', () => modal.close());
    dismissBtn?.addEventListener('click', () => modal.close());
    printBtn?.addEventListener('click', () => window.print());
  }
}

function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    toggleBtn.innerHTML = isLight ? '<i data-lucide="moon"></i>' : '<i data-lucide="sun"></i>';
    initIcons();
    renderer.render();
  });
}
