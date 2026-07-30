(() => {
  'use strict';

  const source = window.CTCN_ATLAS_DATA;
  if (!source || !Array.isArray(source.records)) return;

  const records = source.records;
  const PAGE_SIZE = 12;
  let filtered = [...records];
  let currentPage = 1;
  let selectedId = null;

  const fields = {
    id: 'technology_id', branch: 'Rama CTCN', sector: 'A. Sector (CTCN)', group: 'B. Technology group (CTCN)',
    tech: 'C. Technology (CTCN)', description: 'Descripción / función de la tecnología',
    flex: 'Flexible / fija', flexWhy: 'Justificación flexible / fija', nature: 'Dura / blanda', natureWhy: 'Justificación dura / blanda',
    embedding: 'Equipo / operación / producto', embeddingWhy: 'Justificación equipo / operación / producto',
    clean: 'Tecnología limpia', cleanWhy: 'Justificación tecnología limpia', hardware: 'Hardware', software: 'Software',
    orgware: 'Orgware', infra: 'Infraestructura asociada', energy: 'Energéticos', materials: 'Materias primas e insumos',
    supplies: 'Suministros y repuestos', observations: 'Observaciones',
    hwInfra: 'Hardware — Infraestructura', hwEnergy: 'Hardware — Energía',
    hwMaterials: 'Hardware — Materiales e insumos', hwSupplies: 'Hardware — Suministros y repuestos',
    swInfra: 'Software — Infraestructura', swEnergy: 'Software — Energía',
    swMaterials: 'Software — Materiales e insumos', swSupplies: 'Software — Suministros y repuestos',
    owInfra: 'Orgware — Infraestructura', owEnergy: 'Orgware — Energía',
    owMaterials: 'Orgware — Materiales e insumos', owSupplies: 'Orgware — Suministros y repuestos',
    criticalMaterials: 'Materias primas críticas / estratégicas identificadas',
    extractionCountries: 'Principales países de extracción / producción',
    processingCountries: 'Principales países de refinación / procesamiento',
    geographyNote: 'Nota geográfica y de trazabilidad',
    geographyYear: 'Año de referencia geográfica',
    materialSources: 'Fuente de materias primas y países'
  };

  const $ = id => document.getElementById(id);
  const els = {
    search: $('searchInput'), branch: $('branchFilter'), sector: $('sectorFilter'), group: $('groupFilter'), reset: $('resetFilters'),
    groupOptions: $('groupOptions'), sectorTreemapPanel: $('sectorTreemapPanel'),
    visibleKpi: $('visibleKpi'), mitigationKpi: $('mitigationKpi'), adaptationKpi: $('adaptationKpi'), sectorsKpi: $('sectorsKpi'),
    activeFilters: $('activeFilters'), clearSectorChart: $('clearSectorChart'), toggleTreemapSize: $('toggleTreemapSize'),
    visibleCount: $('visibleCount'), visibleShare: $('visibleShare'), mitigationCount: $('mitigationCount'), mitigationShare: $('mitigationShare'), adaptationCount: $('adaptationCount'), adaptationShare: $('adaptationShare'), sectorCount: $('sectorCount'),
    scope: $('scopeText'),
    sectors: $('sectorBars'), sectorDenominator: $('sectorDenominator'), sectorChartCaption: $('sectorChartCaption'), rows: $('technologyRows'), range: $('resultRange'), prev: $('prevPage'), next: $('nextPage'), detail: $('technologyDetail')
  };

  const escapeHTML = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const normalise = value => String(value ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const pct = (value, total) => total ? value / total * 100 : 0;
  const pctText = (value, total) => `${pct(value, total).toFixed(1)}%`;
  const unique = (field, list = records) => [...new Set(list.map(r => r[field]).filter(Boolean))].sort((a,b) => String(a).localeCompare(String(b)));
  const counts = (field, list = filtered) => {
    const map = new Map();
    list.forEach(r => map.set(r[field] || 'Not classified', (map.get(r[field] || 'Not classified') || 0) + 1));
    return [...map.entries()].sort((a,b) => b[1] - a[1]);
  };

  const searchableFields = [
    fields.tech, fields.group, fields.sector, fields.branch, fields.description,
    fields.flex, fields.flexWhy, fields.nature, fields.natureWhy,
    fields.embedding, fields.embeddingWhy, fields.clean, fields.cleanWhy,
    fields.hardware, fields.software, fields.orgware,
    fields.infra, fields.energy, fields.materials, fields.supplies, fields.observations,
    fields.hwInfra, fields.hwEnergy, fields.hwMaterials, fields.hwSupplies,
    fields.swInfra, fields.swEnergy, fields.swMaterials, fields.swSupplies,
    fields.owInfra, fields.owEnergy, fields.owMaterials, fields.owSupplies,
    fields.criticalMaterials, fields.extractionCountries, fields.processingCountries,
    fields.geographyNote, fields.geographyYear
  ];

  function fillSelect(select, values, defaultLabel, keepCurrent = true) {
    const current = keepCurrent ? select.value : '';
    select.innerHTML = `<option value="">${escapeHTML(defaultLabel)}</option>` + values.map(v => `<option value="${escapeHTML(v)}">${escapeHTML(v)}</option>`).join('');
    select.value = values.includes(current) ? current : '';
  }

  function updateHierarchyOptions() {
    // Branch is the superior hierarchy and always keeps every available branch.
    fillSelect(els.branch, unique(fields.branch), 'All branches', true);

    // Sector depends only on branch. A selected sector must never remove the alternative branch.
    const sectorPool = els.branch.value
      ? records.filter(r => r[fields.branch] === els.branch.value)
      : records;
    fillSelect(els.sector, unique(fields.sector, sectorPool), 'All sectors', true);

    // Technology group depends on branch and sector.
    const groupPool = records.filter(r =>
      (!els.branch.value || r[fields.branch] === els.branch.value) &&
      (!els.sector.value || r[fields.sector] === els.sector.value)
    );
    fillSelect(els.group, unique(fields.group, groupPool), 'All groups', true);
    renderHierarchyFilters();
  }

  function optionButton(label, value, activeValue, level) {
    const active = activeValue === value;
    return `<button type="button" class="taxonomy-option ${active ? 'active' : ''}" data-taxonomy-level="${level}" data-taxonomy-value="${escapeHTML(value)}" aria-pressed="${active}">${escapeHTML(label)}</button>`;
  }

  function renderHierarchyFilters() {
    const groups = [...els.group.options].slice(1).map(option => option.value);
    els.groupOptions.innerHTML = optionButton('All groups', '', els.group.value, 'group') +
      groups.map(value => optionButton(value, value, els.group.value, 'group')).join('');

    els.groupOptions.querySelectorAll('[data-taxonomy-level="group"]').forEach(button => button.addEventListener('click', () => {
      els.group.value = button.dataset.taxonomyValue;
      applyFilters('group');
    }));
  }

  function recordMatches(record) {
    const q = normalise(els.search.value.trim());
    const searchable = searchableFields.map(field => record[field]).join(' ');
    return (!q || normalise(searchable).includes(q)) &&
      (!els.branch.value || record[fields.branch] === els.branch.value) &&
      (!els.sector.value || record[fields.sector] === els.sector.value) &&
      (!els.group.value || record[fields.group] === els.group.value);
  }

  function recordMatchesSectorScope(record) {
    // The sector treemap represents the distribution of the superior scope only.
    // Technology group is a descending filter and must affect Explorer, not Taxonomy.
    const q = normalise(els.search.value.trim());
    const searchable = searchableFields.map(field => record[field]).join(' ');
    return (!q || normalise(searchable).includes(q)) &&
      (!els.branch.value || record[fields.branch] === els.branch.value);
  }

  function applyFilters(changed = '') {
    if (changed === 'branch') {
      // A superior hierarchy change resets its dependent selections.
      els.sector.value = '';
      els.group.value = '';
    } else if (changed === 'sector') {
      els.group.value = '';
    }
    updateHierarchyOptions();
    filtered = records.filter(recordMatches);
    currentPage = 1;
    selectedId = null;
    renderAll();
  }

  function activeFilterEntries() {
    const entries = [];
    if (els.search.value.trim()) entries.push(['search', `Search: ${els.search.value.trim()}`]);
    if (els.branch.value) entries.push(['branch', `Branch: ${els.branch.value}`]);
    if (els.sector.value) entries.push(['sector', `Sector: ${els.sector.value}`]);
    if (els.group.value) entries.push(['group', `Group: ${els.group.value}`]);
    return entries;
  }

  function clearFilter(key) {
    if (key === 'search') els.search.value = '';
    if (key === 'branch') {
      els.branch.value = '';
      els.sector.value = '';
      els.group.value = '';
    }
    if (key === 'sector') {
      els.sector.value = '';
      els.group.value = '';
    }
    if (key === 'group') els.group.value = '';
    updateHierarchyOptions();
    filtered = records.filter(recordMatches);
    currentPage = 1;
    selectedId = null;
    renderAll();
  }

  function renderActiveFilters() {
    const entries = activeFilterEntries();
    els.activeFilters.innerHTML = entries.length
      ? `<span class="active-filter-label">Active filters</span>${entries.map(([key,label]) => `<button type="button" class="active-filter-chip" data-clear-filter="${key}">${escapeHTML(label)} <span>×</span></button>`).join('')}`
      : '<span class="active-filter-empty">No active filters</span>';
    els.activeFilters.querySelectorAll('[data-clear-filter]').forEach(button => button.addEventListener('click', () => clearFilter(button.dataset.clearFilter)));
    els.clearSectorChart.hidden = !els.sector.value;
  }

  function renderKPIs() {
    const total = filtered.length;
    const mit = filtered.filter(r => r[fields.branch] === 'Mitigación').length;
    const adp = filtered.filter(r => r[fields.branch] === 'Adaptación').length;
    const sectors = new Set(filtered.map(r => r[fields.sector])).size;
    const labels = activeFilterEntries().map(([,label]) => label);

    els.visibleCount.textContent = total.toLocaleString();
    els.visibleShare.textContent = `${pctText(total, records.length)} of the full table`;
    els.mitigationCount.textContent = mit.toLocaleString();
    els.mitigationShare.textContent = `${pctText(mit, total)} of visible records`;
    els.adaptationCount.textContent = adp.toLocaleString();
    els.adaptationShare.textContent = `${pctText(adp, total)} of visible records`;
    els.sectorCount.textContent = sectors.toLocaleString();
    els.scope.textContent = labels.length ? `${total.toLocaleString()} records · ${labels.join(' · ')}` : `All ${total.toLocaleString()} records`;
    els.mitigationKpi.classList.toggle('active-kpi-filter', els.branch.value === 'Mitigación');
    els.adaptationKpi.classList.toggle('active-kpi-filter', els.branch.value === 'Adaptación');
    els.visibleKpi.classList.toggle('active-kpi-filter', !els.branch.value && !els.sector.value && !els.group.value);
  }

  function layoutTreemap(items, x = 0, y = 0, width = 100, height = 100) {
    if (!items.length) return [];
    if (items.length === 1) return [{...items[0], x, y, width, height}];

    const total = items.reduce((sum, item) => sum + item.value, 0);
    let running = 0;
    let splitIndex = 1;
    let bestDifference = Infinity;
    for (let i = 1; i < items.length; i++) {
      running += items[i - 1].value;
      const difference = Math.abs(total / 2 - running);
      if (difference < bestDifference) {
        bestDifference = difference;
        splitIndex = i;
      }
    }

    const first = items.slice(0, splitIndex);
    const second = items.slice(splitIndex);
    const firstTotal = first.reduce((sum, item) => sum + item.value, 0);
    const ratio = total ? firstTotal / total : 0.5;

    if (width >= height) {
      const firstWidth = width * ratio;
      return [
        ...layoutTreemap(first, x, y, firstWidth, height),
        ...layoutTreemap(second, x + firstWidth, y, width - firstWidth, height)
      ];
    }

    const firstHeight = height * ratio;
    return [
      ...layoutTreemap(first, x, y, width, firstHeight),
      ...layoutTreemap(second, x, y + firstHeight, width, height - firstHeight)
    ];
  }

  function renderSectorBars() {
    // Sector and technology-group selections do not change the treemap denominator.
    // The treemap always represents the superior scope: search + branch.
    const sectorScope = records.filter(recordMatchesSectorScope);
    const sectorCounts = counts(fields.sector, sectorScope);
    const denominator = sectorScope.length;
    els.sectorDenominator.textContent = denominator.toLocaleString();

    const scopeParts = [];
    if (els.branch.value) scopeParts.push(els.branch.value === 'Mitigación' ? 'Mitigation' : 'Adaptation');
    if (els.search.value.trim()) scopeParts.push(`search “${els.search.value.trim()}”`);
    const scopeLabel = scopeParts.length ? scopeParts.join(' · ') : 'the complete table';
    els.sectorChartCaption.textContent = denominator
      ? `Rectangle area = sector records ÷ ${denominator.toLocaleString()} records in ${scopeLabel}. All sectors add up to 100%. Click a rectangle to filter; click it again to remove the filter.`
      : 'No records are available in the active scope.';

    if (!sectorCounts.length) {
      els.sectors.innerHTML = '<div class="empty-results">No sectors in the active selection.</div>';
      return;
    }

    const items = sectorCounts.map(([name, value]) => ({name, value, share: pct(value, denominator)}));
    const layout = layoutTreemap(items);
    els.sectors.innerHTML = layout.map((item, index) => {
      const active = els.sector.value === item.name;
      const compact = item.width < 15 || item.height < 18;
      return `<button class="treemap-sector treemap-tone-${index % 6} ${active ? 'active-chart-filter' : ''} ${compact ? 'compact-tile' : ''}"
        data-sector="${escapeHTML(item.name)}" type="button"
        style="left:${item.x.toFixed(3)}%;top:${item.y.toFixed(3)}%;width:${item.width.toFixed(3)}%;height:${item.height.toFixed(3)}%"
        title="${active ? 'Remove' : 'Filter by'} ${escapeHTML(item.name)} · ${item.share.toFixed(1)}% · ${item.value} records"
        aria-label="${escapeHTML(item.name)}: ${item.share.toFixed(1)} percent, ${item.value} records">
        <span class="treemap-name">${escapeHTML(item.name)}</span>
        <span class="treemap-percent">${item.share.toFixed(1)}%</span>
        <span class="treemap-count">${item.value} records</span>
      </button>`;
    }).join('');

    els.sectors.querySelectorAll('[data-sector]').forEach(button => button.addEventListener('click', () => {
      const selected = els.sector.value === button.dataset.sector;
      els.sector.value = selected ? '' : button.dataset.sector;
      els.group.value = '';
      updateHierarchyOptions();
      filtered = records.filter(recordMatches);
      currentPage = 1;
      selectedId = null;
      renderAll();
    }));
  }


  function classificationIcon(kind, value) {
    const exact = String(value || 'Not classified');
    const key = exact.trim().toLowerCase();

    const catalog = {
      applicability: {
        'flexible': {
          state: 'flexible', code: 'F',
          svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19V6m0 0 4 4M5 6l4-4M14 19v-6m0 0 4 4m-4-4 4-4"/><path d="M9 12h5"/></svg>'
        },
        'principalmente fija': {
          state: 'fixed', code: 'FX',
          svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h12v14H6z"/><path d="M9 9h6M9 13h6"/><path d="M4 5h16M4 19h16"/></svg>'
        },
        'mixta: base flexible e implementación específica': {
          state: 'mixed', code: 'MX',
          svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h7v7H4zM13 10h7v7h-7z"/><path d="M8 18c3-1 5-3 7-6M15 12l-1-3m1 3 3-1"/></svg>'
        }
      },
      nature: {
        'principalmente dura, con dimensión blanda': {
          state: 'hard-led', code: 'H+',
          svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8l8-4 8 4-8 4-8-4Z"/><path d="M4 8v8l8 4 8-4V8"/><path d="M15 15c1.5-2 3-2 4.5 0-1.5 2-3 2-4.5 0Z"/></svg>'
        },
        'principalmente blanda, con soporte físico': {
          state: 'soft-led', code: 'S+',
          svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 14c3-4 7-6 14-7-1 7-5 11-11 11-2 0-3-2-3-4Z"/><path d="M7 18c2-4 5-7 10-9"/><path d="M17 17h3v3h-3z"/></svg>'
        },
        'dura y blanda': {
          state: 'hard-soft', code: 'H/S',
          svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12l5-5 5 5-5 5-5-5Z"/><path d="M13 15c2-3 4-4 8-4-1 4-3 6-6 6-1 0-2-1-2-2Z"/><path d="M10 12h4"/></svg>'
        }
      },
      form: {
        'equipo y operación': {
          state: 'equipment-operation', code: 'E/O',
          svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h9v9H4z"/><path d="M8.5 8v3M7 9.5h3"/><path d="M14 16h6M17 13v6"/><path d="M13 10l4 3"/></svg>'
        },
        'operación y producto/servicio de información': {
          state: 'operation-information', code: 'O/I',
          svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H4z"/><path d="M8 20h8M12 16v4"/><path d="M8 12l2-3 2 2 3-4 2 3"/></svg>'
        },
        'operación y servicio': {
          state: 'operation-service', code: 'O/S',
          svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7a5 5 0 0 1 8-1l2-2v6h-6l2-2a3 3 0 0 0-4 4"/><path d="M17 17a5 5 0 0 1-8 1l-2 2v-6h6l-2 2a3 3 0 0 0 4-4"/></svg>'
        },
        'producto y equipo; operación complementaria': {
          state: 'product-equipment', code: 'P/E',
          svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7l8-4 8 4-8 4-8-4Z"/><path d="M4 7v9l8 5 8-5V7"/><path d="M12 11v10"/><path d="M16 12a3 3 0 1 1-2-3"/></svg>'
        }
      },
      clean: {
        'sí, con salvedad de ciclo de vida': {
          state: 'clean-lifecycle', code: 'LC',
          svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 5c-7 0-11 4-11 10 0 2 1 4 3 5 0-5 3-8 7-10-3 3-5 6-5 10 5-1 8-6 6-15Z"/><path d="M4 8a8 8 0 0 1 3-3M4 8V4m0 4h4"/></svg>'
        },
        'sí, condicionada por desempeño y ciclo de vida': {
          state: 'clean-performance', code: 'PC',
          svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 5c-7 0-11 4-11 10 0 2 1 4 3 5 0-5 3-8 7-10-3 3-5 6-5 10 5-1 8-6 6-15Z"/><path d="M4 18l4-4 3 2 5-6 4 2"/></svg>'
        },
        'condicionada': {
          state: 'conditional', code: 'C',
          svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 5c-7 0-11 4-11 10 0 2 1 4 3 5 0-5 3-8 7-10-3 3-5 6-5 10 5-1 8-6 6-15Z"/><path d="M12 4v3M12 17v3M4 12h3M17 12h3"/></svg>'
        },
        'no necesariamente': {
          state: 'not-necessarily', code: 'N',
          svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 5c-7 0-11 4-11 10 0 2 1 4 3 5 0-5 3-8 7-10-3 3-5 6-5 10 5-1 8-6 6-15Z"/><path d="M5 5l14 14"/></svg>'
        }
      }
    };

    const item = catalog[kind] && catalog[kind][key]
      ? catalog[kind][key]
      : { state: 'neutral', code: '•', svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 8v5M12 16h.01"/></svg>' };

    return `<span class="classification-icon ${kind}-icon state-${item.state}" tabindex="0" role="img" aria-label="${escapeHTML(exact)}" title="${escapeHTML(exact)}">${item.svg}<span class="classification-code">${item.code}</span></span>`;
  }
  function renderTable() {
    const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    currentPage = Math.min(currentPage, pageCount);
    const start = (currentPage - 1) * PAGE_SIZE;
    const pageRows = filtered.slice(start, start + PAGE_SIZE);

    els.rows.innerHTML = pageRows.length ? pageRows.map(r => `
      <tr data-id="${escapeHTML(r[fields.id])}" class="${selectedId === r[fields.id] ? 'selected' : ''}">
        <td>${escapeHTML(r[fields.tech])}</td>
        <td><span class="branch-chip ${r[fields.branch] === 'Mitigación' ? 'mitigation' : 'adaptation'}">${escapeHTML(r[fields.branch])}</span></td>
        <td>${escapeHTML(r[fields.sector])}</td>
        <td>${escapeHTML(r[fields.group])}</td>
        <td class="classification-cell">${classificationIcon('applicability', r[fields.flex])}</td>
        <td class="classification-cell">${classificationIcon('nature', r[fields.nature])}</td>
        <td class="classification-cell">${classificationIcon('form', r[fields.embedding])}</td>
        <td class="classification-cell">${classificationIcon('clean', r[fields.clean])}</td>
      </tr>`).join('') : '<tr><td colspan="8" class="empty-results">No technology records match these filters.</td></tr>';

    els.rows.querySelectorAll('[data-id]').forEach(row => row.addEventListener('click', () => selectTechnology(row.dataset.id)));
    els.range.textContent = filtered.length ? `${start + 1}–${Math.min(start + PAGE_SIZE, filtered.length)} of ${filtered.length}` : '0 records';
    els.prev.disabled = currentPage <= 1;
    els.next.disabled = currentPage >= pageCount;
  }


  function requirementItem(label, value, className) {
    return `<div class="aspect-subindex ${className}">
      <span class="aspect-subindex-label">${escapeHTML(label)}</span>
      <p>${escapeHTML(value || 'Not specified in the current analytical record.')}</p>
    </div>`;
  }

  function aspectCard(number, title, description, values, cardClass) {
    return `<article class="aspect-card aspect-card-expanded ${cardClass}">
      <div class="aspect-card-heading">
        <span>${number}</span>
        <div><h3>${escapeHTML(title)}</h3><p>${escapeHTML(description)}</p></div>
      </div>
      <div class="aspect-subindex-grid">
        ${requirementItem('Infrastructure', values.infra, 'subindex-infrastructure')}
        ${requirementItem('Energy', values.energy, 'subindex-energy')}
        ${requirementItem('Materials and inputs', values.materials, 'subindex-materials')}
        ${requirementItem('Supplies and spare parts', values.supplies, 'subindex-supplies')}
      </div>
    </article>`;
  }


  const countryAliases = {
    'Democratic Republic of the Congo': 'Democratic Republic of the Congo',
    'DR Congo': 'Democratic Republic of the Congo',
    'Congo, Dem. Rep.': 'Democratic Republic of the Congo',
    'USA': 'United States',
    'Republic of Korea': 'South Korea',
    'Russian Federation': 'Russia',
    'Türkiye': 'Turkey',
    'Viet Nam': 'Vietnam'
  };

  function parseCountryList(value) {
    return [...new Set(String(value || '')
      .split(/[;,|]/)
      .map(item => item.trim())
      .filter(Boolean)
      .filter(item => !/requires|depend|local|regional|supplier|investig/i.test(item))
      .map(item => countryAliases[item] || item)
    )];
  }

  function renderTechnologyMap(record) {
    const mapElement = document.getElementById('technology-country-map');
    const emptyElement = document.getElementById('technology-map-empty');
    if (!mapElement || typeof Plotly === 'undefined') return;

    const extraction = parseCountryList(record[fields.extractionCountries]);
    const processing = parseCountryList(record[fields.processingCountries]);
    const allCountries = [...new Set([...extraction, ...processing])];

    if (!allCountries.length) {
      Plotly.purge(mapElement);
      mapElement.hidden = true;
      if (emptyElement) emptyElement.hidden = false;
      return;
    }

    mapElement.hidden = false;
    if (emptyElement) emptyElement.hidden = true;

    const values = allCountries.map(country => {
      const extractionStage = extraction.includes(country);
      const processingStage = processing.includes(country);
      return extractionStage && processingStage ? 3 : processingStage ? 2 : 1;
    });

    const stages = values.map(value => (
      value === 3
        ? 'Extraction / production and refining / processing'
        : value === 2
          ? 'Refining / processing'
          : 'Extraction / production'
    ));

    Plotly.react(mapElement, [{
      type: 'choropleth',
      locationmode: 'country names',
      locations: allCountries,
      z: values,
      zmin: 1,
      zmax: 3,
      text: stages,
      customdata: allCountries,
      hovertemplate: '<b>%{customdata}</b><br>%{text}<extra></extra>',
      colorscale: [
        [0.00, '#9cb9c8'],
        [0.32, '#9cb9c8'],
        [0.34, '#d8a86b'],
        [0.65, '#d8a86b'],
        [0.67, '#395f73'],
        [1.00, '#395f73']
      ],
      showscale: false,
      marker: { line: { color: '#f7fafb', width: 0.65 } }
    }], {
      margin: { l: 0, r: 0, t: 0, b: 0 },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      geo: {
        projection: { type: 'natural earth' },
        showframe: false,
        showcoastlines: false,
        showcountries: true,
        countrycolor: '#d5e1e6',
        showland: true,
        landcolor: '#edf3f5',
        showocean: true,
        oceancolor: '#f8fbfc',
        bgcolor: 'rgba(0,0,0,0)',
        lataxis: { range: [-58, 85] }
      },
      dragmode: false,
      hoverlabel: {
        bgcolor: '#173e52',
        bordercolor: '#173e52',
        font: { color: '#ffffff', family: 'Arial, sans-serif', size: 12 }
      }
    }, {
      responsive: true,
      displayModeBar: false,
      scrollZoom: false
    });
  }


  function getTechnologyImage(record) {
    const manifest = window.CTCN_IMAGE_MANIFEST || {};
    const key = String(record[fields.id] || '').trim();
    return manifest[key] || manifest.default || {
      path: 'assets/technologies/placeholder.jpg',
      title: 'Technology photograph',
      author: 'Unknown',
      license: 'Source pending',
      source: '',
      alt: String(record[fields.tech] || 'Technology photograph'),
      status: 'fallback'
    };
  }

  function renderTechnologyPhoto(record) {
    const image = getTechnologyImage(record);
    const sourceLink = image.source
      ? `<a href="${escapeHTML(image.source)}" target="_blank" rel="noopener noreferrer">View source</a>`
      : '';
    return `<figure class="technology-photo technology-photo-standard">
      <div class="technology-photo-frame">
        <img src="${escapeHTML(image.path)}"
             alt="${escapeHTML(image.alt || record[fields.tech])}"
             width="1200" height="675" loading="lazy"
             onerror="this.onerror=null;this.src='assets/technologies/placeholder.jpg';">
      </div>
      <figcaption>
        <span class="photo-caption-title">${escapeHTML(image.title || record[fields.tech])}</span>
        <span class="photo-caption-credit">${image.status === 'placeholder' ? 'Temporary placeholder · photograph pending manual selection' : `Photo: ${escapeHTML(image.author || 'Unknown')} · ${escapeHTML(image.license || 'Licence pending')}`}${sourceLink ? ` · ${sourceLink}` : ''}</span>
      </figcaption>
    </figure>`;
  }

  function selectTechnology(id) {
    selectedId = id;
    const r = records.find(item => item[fields.id] === id);
    if (!r) return;
    renderTable();
    els.detail.innerHTML = `
      <div class="detail-profile-head">
        ${renderTechnologyPhoto(r)}
        <div class="detail-profile-intro">
          <div class="detail-breadcrumb">${escapeHTML(r[fields.branch])} / ${escapeHTML(r[fields.sector])} / ${escapeHTML(r[fields.group])}</div>
          <h2 class="detail-title">${escapeHTML(r[fields.tech])}</h2>
          <p class="detail-description">${escapeHTML(r[fields.description])}</p>
        </div>
      </div>

      <section class="detail-section-full integrated-aspects-section">
        <div class="section-number">Technology aspects — IIASA</div>
        <p class="integrated-aspects-note">Each IIASA aspect retains its core description and incorporates the infrastructure, energy, materials and supply requirements associated with that particular technological dimension.</p>
        <div class="aspect-grid aspect-grid-integrated">
          ${aspectCard('01', 'Hardware', r[fields.hardware], {
            infra: r[fields.hwInfra], energy: r[fields.hwEnergy],
            materials: r[fields.hwMaterials], supplies: r[fields.hwSupplies]
          }, 'hardware-card')}
          ${aspectCard('02', 'Software', r[fields.software], {
            infra: r[fields.swInfra], energy: r[fields.swEnergy],
            materials: r[fields.swMaterials], supplies: r[fields.swSupplies]
          }, 'software-card')}
          ${aspectCard('03', 'Orgware', r[fields.orgware], {
            infra: r[fields.owInfra], energy: r[fields.owEnergy],
            materials: r[fields.owMaterials], supplies: r[fields.owSupplies]
          }, 'orgware-card')}
        </div>
      </section>

      <section class="detail-section-full raw-material-section">
        <div class="section-number">Raw materials and geographic supply context</div>
        <div class="raw-material-overview">
          <article class="raw-material-primary">
            <span>Identified materials</span>
            <p>${escapeHTML(r[fields.criticalMaterials] || 'No specific critical or strategic raw material was identified in the current analytical record.')}</p>
          </article>
          <article>
            <span>Leading extraction / production countries</span>
            <p>${escapeHTML(r[fields.extractionCountries] || 'Country information requires technology-specific research.')}</p>
          </article>
          <article>
            <span>Leading refining / processing countries</span>
            <p>${escapeHTML(r[fields.processingCountries] || 'Country information requires technology-specific research.')}</p>
          </article>
        </div>
        <p class="geography-caveat">${escapeHTML(r[fields.geographyNote] || '')}${r[fields.geographyYear] ? ` Reference period: ${escapeHTML(r[fields.geographyYear])}.` : ''}</p>
        <div class="technology-map-panel">
          <div class="technology-map-heading">
            <div>
              <span class="technology-map-kicker">Geographic view</span>
              <h3>Material supply context</h3>
            </div>
            <div class="technology-map-legend" aria-label="Map legend">
              <span><i class="map-swatch extraction-swatch"></i>Extraction / production</span>
              <span><i class="map-swatch processing-swatch"></i>Refining / processing</span>
              <span><i class="map-swatch both-swatch"></i>Both stages</span>
            </div>
          </div>
          <div id="technology-country-map" class="technology-country-map" role="img" aria-label="World map showing countries associated with the selected technology"></div>
          <p id="technology-map-empty" class="technology-map-empty" hidden>No country-level supply information is available for this technology.</p>
        </div>
      </section>`;
    requestAnimationFrame(() => renderTechnologyMap(r));
    els.detail.scrollIntoView({behavior: 'smooth', block: 'start'});
  }

  function renderDetailEmpty() {
    if (selectedId) return;
    els.detail.innerHTML = `<div class="detail-empty detail-empty-wide"><span class="detail-index">Select a record in 04 / Explorer</span><h2>Technology profile</h2><div class="technology-photo-placeholder"><img src="assets/technologies/placeholder.jpg" alt="Example of climate technology"></div><p>The selected technology will appear here with its description, the three IIASA aspects —hardware, software and orgware— with their integrated infrastructure, energy, materials and supply subindices, plus the identified raw-material geography.</p></div>`;
  }

  function renderAll() {
    renderActiveFilters();
    renderKPIs();
    renderSectorBars();
    renderTable();
    renderDetailEmpty();
  }

  els.search.addEventListener('input', () => {
    filtered = records.filter(recordMatches);
    currentPage = 1;
    selectedId = null;
    renderAll();
  });
  els.branch.addEventListener('change', () => applyFilters('branch'));
  els.sector.addEventListener('change', () => applyFilters('sector'));
  els.group.addEventListener('change', () => applyFilters('group'));
  els.visibleKpi.addEventListener('click', () => {
    els.branch.value = '';
    els.sector.value = '';
    els.group.value = '';
    updateHierarchyOptions();
    filtered = records.filter(recordMatches);
    currentPage = 1;
    selectedId = null;
    renderAll();
  });
  [els.mitigationKpi, els.adaptationKpi].forEach(button => button.addEventListener('click', () => {
    const target = button.dataset.kpiBranch;
    els.branch.value = els.branch.value === target ? '' : target;
    applyFilters('branch');
  }));
  els.sectorsKpi.addEventListener('click', () => {
    els.sectorTreemapPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    els.sectorTreemapPanel.classList.add('taxonomy-row-pulse');
    window.setTimeout(() => els.sectorTreemapPanel.classList.remove('taxonomy-row-pulse'), 900);
  });
  els.reset.addEventListener('click', () => {
    els.search.value = '';
    els.branch.value = '';
    els.sector.value = '';
    els.group.value = '';
    updateHierarchyOptions();
    filtered = [...records];
    currentPage = 1;
    selectedId = null;
    renderAll();
  });
  els.clearSectorChart.addEventListener('click', () => clearFilter('sector'));
  els.toggleTreemapSize.addEventListener('click', () => {
    const expanded = els.sectorTreemapPanel.classList.toggle('treemap-expanded');
    els.toggleTreemapSize.setAttribute('aria-pressed', String(expanded));
    els.toggleTreemapSize.textContent = expanded ? 'Fit map' : 'Expand map';
  });
  els.prev.addEventListener('click', () => { if (currentPage > 1) { currentPage--; renderTable(); } });
  els.next.addEventListener('click', () => { if (currentPage < Math.ceil(filtered.length / PAGE_SIZE)) { currentPage++; renderTable(); } });

  updateHierarchyOptions();
  renderAll();
})();
