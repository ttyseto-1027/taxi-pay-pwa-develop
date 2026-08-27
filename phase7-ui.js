(() => {
  'use strict';
  const STORAGE_KEY = 'taxiPayPhase7AccordionState';
  const accordions = [...document.querySelectorAll('.phase7-accordion, .phase7-subaccordion')];
  let state = {};
  try { state = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}'); } catch { state = {}; }

  accordions.forEach((details, index) => {
    const title = details.querySelector(':scope > summary .phase7-summary-title, :scope > summary > span')?.textContent?.trim() || `accordion-${index}`;
    const key = `${location.pathname}:${title}`;
    if (Object.prototype.hasOwnProperty.call(state, key)) details.open = Boolean(state[key]);
    details.addEventListener('toggle', () => {
      state[key] = details.open;
      try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
    });
  });

  // Phase 8: smartphone UI fixes.
  // Keep pinch-to-zoom available for accessibility, while suppressing accidental
  // double-tap zoom on the app's numeric keypad and making payroll-month
  // navigation visually unambiguous on narrow screens.
  const style = document.createElement('style');
  style.id = 'phase8-smartphone-ui-fixes';
  style.textContent = `
    .tap-number-pad button,
    .tap-number-grid button,
    #tapBreakUnits button {
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
      -webkit-user-select: none;
      user-select: none;
    }
    @media (max-width: 640px) {
      .tap-number-pad button,
      .tap-number-grid button,
      #tapBreakUnits button {
        min-height: 48px;
        font-size: 1rem;
      }
      .month-navigation-card .month-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 10px;
        align-items: stretch;
      }
      .month-navigation-card .month-row input {
        grid-column: 1 / -1;
        grid-row: 1;
        width: 100%;
        max-width: none;
        min-height: 46px;
        font-size: 16px;
      }
      .month-navigation-card #prevMonth,
      .month-navigation-card #nextMonth {
        min-width: 0;
        min-height: 46px;
        width: 100%;
        font-size: .95rem;
        white-space: nowrap;
        touch-action: manipulation;
      }
      .month-navigation-card #prevMonth { grid-column: 1; }
      .month-navigation-card #nextMonth { grid-column: 2; }
    }
  `;
  document.head.appendChild(style);

  // A browser may still synthesize dblclick on rapid taps. Cancelling it only
  // inside the custom keypad prevents accidental page zoom without disabling
  // normal browser zoom gestures elsewhere.
  document.addEventListener('dblclick', (event) => {
    if (event.target.closest('.tap-number-pad, .tap-number-grid, #tapBreakUnits')) {
      event.preventDefault();
    }
  }, { passive: false });

  // Phase 8 UI: revenue-adjustment fields are optional. On a fresh entry,
  // present them as blank instead of forcing the user to delete four zeroes.
  // Calculation code already interprets blank as 0, so calculation/storage
  // semantics remain unchanged. Existing entries opened for editing are left as-is.
  const revenueAdjustmentIds = ['idleA', 'idleB', 'otherPlus', 'otherMinus'];
  const clearFreshRevenueAdjustments = () => {
    const editingId = document.getElementById('editingId');
    if (editingId?.value) return;
    revenueAdjustmentIds.forEach((id) => {
      const input = document.getElementById(id);
      if (input && input.value === '0') input.value = '';
    });
  };
  clearFreshRevenueAdjustments();
  requestAnimationFrame(clearFreshRevenueAdjustments);
  setTimeout(clearFreshRevenueAdjustments, 0);

  document.getElementById('resetForm')?.addEventListener('click', () => {
    setTimeout(clearFreshRevenueAdjustments, 0);
  });
  document.getElementById('entryForm')?.addEventListener('submit', () => {
    setTimeout(clearFreshRevenueAdjustments, 0);
  });
})();

window.addEventListener('taxipay:profile',(event)=>{const el=document.getElementById('systemInfoMenuLink');if(el)el.hidden=event.detail?.isAdmin!==true;});
