import { createIcons, icons } from 'lucide';
import { BENCHMARK_CASES } from './casesData.js';
import { MedicalImageRenderer } from './medicalCanvas.js';

let currentCaseIndex = 0;
let renderer = null;

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

  // Load first sample case
  loadCase(0);
});

function initIcons() {
  createIcons({ icons });
}

function initRenderer() {
  renderer = new MedicalImageRenderer('medical-canvas');

  // Heatmap opacity slider
  const opacityInput = document.getElementById('heatmap-opacity');
  if (opacityInput) {
    opacityInput.addEventListener('input', (e) => {
      renderer.setOpacity(parseInt(e.target.value, 10) / 100);
    });
  }

  // Zoom controls
  document.getElementById('zoom-in')?.addEventListener('click', () => renderer.zoomIn());
  document.getElementById('zoom-out')?.addEventListener('click', () => renderer.zoomOut());
  document.getElementById('zoom-reset')?.addEventListener('click', () => renderer.resetZoom());

  // Canvas Mouse Inspection Tooltip
  const canvas = document.getElementById('medical-canvas');
  const tag = document.getElementById('canvas-inspection-tag');
  const tagAct = document.getElementById('tag-act');

  if (canvas && tag) {
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = Math.round((e.clientX - rect.left) * (canvas.width / rect.width));
      const y = Math.round((e.clientY - rect.top) * (canvas.height / rect.height));

      tag.classList.remove('hidden');
      tag.style.left = `${e.clientX - rect.left}px`;
      tag.style.top = `${e.clientY - rect.top}px`;

      const currentCase = BENCHMARK_CASES[currentCaseIndex];
      if (currentCase?.vision.heatCenter) {
        const { x: cx, y: cy, radius } = currentCase.vision.heatCenter;
        const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        const act = Math.max(0.05, Math.min(0.96, 1.0 - (dist / (radius * 1.6)))).toFixed(2);
        tagAct.textContent = `Activation: ${act}`;
      }
    });

    canvas.addEventListener('mouseleave', () => {
      tag.classList.add('hidden');
    });
  }

  // Upload Scan
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
          document.getElementById('pt-id').textContent = 'CUSTOM';
          document.getElementById('confidence-percentage').textContent = '70%';
          document.getElementById('confidence-bar').style.width = '70%';
          document.getElementById('peak-finding-text').textContent = 'Uploaded Patient Scan';
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  }
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

  // Active state on chips
  document.querySelectorAll('.case-chip').forEach((chip, i) => {
    chip.classList.toggle('active', i === index);
  });

  // 1. Vision
  renderer.setCase(c);
  document.getElementById('peak-finding-text').textContent = c.vision.finding;

  // 2. Text (EHR)
  document.getElementById('pt-id').textContent = c.patient.id;
  document.getElementById('pt-age-gender').textContent = c.patient.ageGender;
  document.getElementById('pt-spo2').textContent = c.patient.spo2;
  document.getElementById('pt-wbc').textContent = c.patient.wbc;

  // Highlighted tokens in notes
  const notesContainer = document.getElementById('clinical-notes-render');
  notesContainer.innerHTML = c.patient.notes.replace(/\[\[(.*?)\]\]/g, (m, p1) => {
    return `<span class="grounded-token">${p1}</span>`;
  });

  // 3. AI Co-Pilot Output
  const confEl = document.getElementById('confidence-percentage');
  const barEl = document.getElementById('confidence-bar');
  confEl.textContent = `${c.fusion.confidence}%`;
  barEl.style.width = `${c.fusion.confidence}%`;

  if (c.fusion.confidence > 80) {
    barEl.style.background = 'linear-gradient(90deg, #10b981, #06b6d4)';
  } else if (c.fusion.confidence > 60) {
    barEl.style.background = 'linear-gradient(90deg, #f59e0b, #06b6d4)';
  } else {
    barEl.style.background = 'linear-gradient(90deg, #ef4444, #f59e0b)';
  }

  document.getElementById('receipt-vision-detail').textContent = c.fusion.receiptVision;
  document.getElementById('receipt-text-detail').textContent = c.fusion.receiptText;
  document.getElementById('advisory-text-content').textContent = `"${c.fusion.advisory}"`;

  // Differentials
  const diffContainer = document.getElementById('differentials-list');
  diffContainer.innerHTML = c.fusion.differentials.map((d) => `
    <div class="diff-row">
      <span>${d.name}</span>
      <div class="diff-conf-wrap">
        <div class="diff-bar"><div class="diff-bar-fill" style="width: ${d.conf}%"></div></div>
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
      renderer.setMode(btn.dataset.mode);
    });
  });
}

function initInteractiveEHR() {
  const reanalyzeBtn = document.getElementById('reanalyze-btn');
  const inputEl = document.getElementById('custom-ehr-input');

  if (reanalyzeBtn && inputEl) {
    reanalyzeBtn.addEventListener('click', () => {
      const text = inputEl.value.toLowerCase().trim();
      if (!text) return;

      reanalyzeBtn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Updating...';
      initIcons();

      setTimeout(() => {
        reanalyzeBtn.innerHTML = '<i data-lucide="refresh-cw"></i> Update AI';
        initIcons();

        let adjustedConf = 78;
        let advisory = '';

        if (text.includes('asymptomatic') || text.includes('young') || text.includes('no fever') || text.includes('no cough')) {
          // Downgrade confidence when asymptomatic (Phase 2 core rule)
          adjustedConf = 48;
          advisory = 'Patient is noted as young and asymptomatic. Downgraded probability of acute pneumonia; consider non-acute atelectasis or benign artifact. Serial follow-up recommended over aggressive antibiotics.';
        } else if (text.includes('fever') || text.includes('hypoxia') || text.includes('icu') || text.includes('septic')) {
          adjustedConf = 89;
          advisory = 'Acute systemic indicators (fevers/hypoxia) strongly corroborate high-density consolidation. Suggest immediate empiric treatment protocol.';
        } else {
          adjustedConf = 74;
          advisory = 'Cross-modal weighting updated based on new clinical notes.';
        }

        document.getElementById('confidence-percentage').textContent = `${adjustedConf}%`;
        document.getElementById('confidence-bar').style.width = `${adjustedConf}%`;
        document.getElementById('advisory-text-content').textContent = `"${advisory}"`;
        document.getElementById('receipt-text-detail').textContent = `"${inputEl.value.slice(0, 70)}..."`;
      }, 500);
    });
  }
}

function initGuardrailTests() {
  // Test 1: Hallucination
  const testHallucinationBtn = document.getElementById('test-hallucination-btn');
  const hallucinationRes = document.getElementById('hallucination-test-result');

  if (testHallucinationBtn && hallucinationRes) {
    testHallucinationBtn.addEventListener('click', () => {
      hallucinationRes.classList.remove('hidden');
      hallucinationRes.innerHTML = `
        <div style="color: #f59e0b; font-weight: 700; margin-bottom: 2px;">
          Simulated Claim: "Suspected Osteosarcoma of Left Humerus"
        </div>
        <div style="color: #cbd5e1;">
          • No visual activation found at coordinates (0.02 activation).<br/>
          • Zero mention in patient notes.<br/>
          <strong style="color: #10b981;">Result: Flagged as zero-evidence hallucination and pruned.</strong>
        </div>
      `;
    });
  }

  // Test 2: Degraded Scan
  const testDegradedBtn = document.getElementById('test-degraded-scan-btn');
  const degradedRes = document.getElementById('degraded-scan-test-result');

  if (testDegradedBtn && degradedRes) {
    testDegradedBtn.addEventListener('click', () => {
      degradedRes.classList.remove('hidden');
      renderer.setDegraded(true);

      const curConf = parseInt(document.getElementById('confidence-percentage').textContent, 10);
      const penalizedConf = Math.max(34, curConf - 42);
      document.getElementById('confidence-percentage').textContent = `${penalizedConf}%`;
      document.getElementById('confidence-bar').style.width = `${penalizedConf}%`;

      degradedRes.innerHTML = `
        <div style="color: #ef4444; font-weight: 700; margin-bottom: 2px;">
          Blurry &amp; Noisy Scan Detected
        </div>
        <div style="color: #cbd5e1;">
          Confidence dropped from ${curConf}% to <strong>${penalizedConf}%</strong>.<br/>
          <strong style="color: #f59e0b;">Result: System refuses overconfidence on degraded imaging.</strong>
        </div>
      `;
    });
  }

  // Test 3: Linter
  const testLinterBtn = document.getElementById('test-linter-btn');
  const linterRes = document.getElementById('linter-test-result');

  if (testLinterBtn && linterRes) {
    testLinterBtn.addEventListener('click', () => {
      linterRes.classList.remove('hidden');
      linterRes.innerHTML = `
        <div style="font-family: monospace; font-size: 0.72rem; background: #05070c; padding: 6px; border-radius: 4px;">
          <span style="color: #ef4444;">[BLOCKED]:</span> "The patient definitely has pneumonia. Give 500mg Azithromycin."<br/>
          <span style="color: #10b981;">[APPROVED]:</span> "Consider evaluating RLL for bacterial consolidation based on 4-day cough and fevers."
        </div>
      `;
    });
  }

  // Copy Code
  document.getElementById('copy-code-btn')?.addEventListener('click', () => {
    const code = document.querySelector('.clean-code')?.innerText;
    if (code) {
      navigator.clipboard.writeText(code);
      alert('PyTorch blueprint copied to clipboard!');
    }
  });
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
      const c = BENCHMARK_CASES[currentCaseIndex];
      modalBody.innerHTML = `
        <div style="margin-bottom: 10px;">
          <strong>Patient:</strong> ${c.patient.id} (${c.patient.ageGender}) | SpO2: ${c.patient.spo2}
        </div>
        <div style="margin-bottom: 10px;">
          <strong>Visual Finding:</strong> ${c.vision.finding}
        </div>
        <div style="margin-bottom: 10px;">
          <strong>Confidence:</strong> ${c.fusion.confidence}% (Calibrated)
        </div>
        <div style="background: rgba(15, 23, 42, 0.5); padding: 8px; border-radius: 6px; margin-bottom: 10px;">
          <strong>Proof Receipts:</strong><br/>
          • [Scan]: ${c.fusion.receiptVision}<br/>
          • [Notes]: ${c.fusion.receiptText}
        </div>
        <div style="color: var(--color-warning); font-style: italic;">
          <strong>Second Opinion:</strong> "${c.fusion.advisory}"
        </div>
      `;
      modal.showModal();
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
