(() => {
  'use strict';

  const source = window.CTCN_ATLAS_DATA;
  if (!source || !Array.isArray(source.records)) return;

  const records = source.records;
  const countryCodes = source.meta?.countryCodes || {};
  const language = (document.documentElement.lang || 'en').slice(0, 2);
  const rootPrefix = language === 'en' ? '' : '../';
  let selectedId = null;

  const copy = {
    en: {
      allBranches: 'All branches', allSectors: 'All sectors', allGroups: 'All groups',
      search: 'Search', branch: 'Branch', sector: 'Sector', group: 'Group',
      activeFilters: 'Active filters', noFilters: 'No active filters',
      mitigation: 'Mitigation', adaptation: 'Adaptation',
      fullTable: 'of the full table', visibleRecords: 'of visible records',
      allRecords: 'All {n} records', records: 'records',
      treemapScope: 'the complete table', searchScope: 'search “{q}”',
      treemapCaption: 'Rectangle area = sector records ÷ {n} records in {scope}. All sectors add up to 100%. Select a sector to reveal its technology groups; select it again to clear the hierarchy.',
      noScope: 'No records are available in the active scope.',
      noSectors: 'No sectors in the active selection.',
      filterBy: 'Select', remove: 'Clear',
      noGroups: 'No technology groups are available for this sector and active search.',
      noTechnologies: 'No technologies are available for this technology group and active search.',
      profileSection: '05 / Technology profile',
      profileHowTo: 'Fifth step · Interpret the technology profile', profileHowToText: 'Read the profile as a decision-oriented sequence: first understand what the technology does and its climate function; then review its applicability, nature, form and environmental role. Continue with the infrastructure, energy, inputs and supply requirements, and examine how Hardware, Software and Orgware work together. Finish by checking critical materials, production and processing geography, analytical notes and supporting sources. Select any underlined term marked with “i” for a short definition.', instructionOpen: 'Reading sequence', 
      classification: 'Technology characterisation',
      classificationIntro: 'These four attributes describe how the technology can be applied, what it depends on, how it is delivered and under what conditions it contributes environmentally. They complement rather than replace the sectoral taxonomy.',
      applicability: 'Applicability', nature: 'Nature', form: 'Form', environmentalRole: 'Environmental role',
      justification: 'Analytical justification',
      applicabilityDefinition: 'Indicates how transferable or adaptable a technology is across contexts. It may be flexible, mainly fixed or mixed, depending on how much its design and implementation must change for the site.',
      natureDefinition: 'Describes the balance between tangible artefacts and infrastructure (hard technology) and knowledge, procedures, capabilities or institutions (soft technology). Many climate technologies combine both.',
      formDefinition: 'Explains how the technology is embodied or delivered: as equipment, an operation, a product, a service, information or a combination of these forms.',
      environmentalRoleDefinition: 'Explains whether and under what performance and life-cycle conditions the technology contributes to mitigation or adaptation without shifting environmental burdens beyond the system boundary.',
      helpLabel: 'Definition of {term}',
      aspects: 'Technology aspects — IIASA',
      aspectsIntro: 'These three dimensions show that a technology is more than equipment: its performance also depends on knowledge, operating systems, capabilities and institutional arrangements. Select each term for a short definition.',
      hardware: 'Hardware', software: 'Software', orgware: 'Orgware',
      hardwareDefinition: 'The tangible dimension of the technology: equipment, machines, components, instruments, physical installations and infrastructure required for it to operate.',
      softwareDefinition: 'The codified knowledge and information that guide the technology: data, models, algorithms, designs, procedures, operating protocols, monitoring methods and digital tools.',
      orgwareDefinition: 'The organisational and institutional capacity that makes implementation possible: roles, skills, governance, standards, training, financing, maintenance arrangements, coordination and stakeholder participation.',
      infrastructure: 'Infrastructure', energy: 'Energy', materialsInputs: 'Materials and inputs',
      suppliesSpares: 'Supplies and spare parts',
      implementationRequirements: 'Cross-cutting implementation requirements',
      implementationIntro: 'These requirements summarise the shared physical and operational base before they are disaggregated across Hardware, Software and Orgware.',
      technicalSources: 'Technical sources and analytical boundary',
      sourcesIntro: 'Open the primary taxonomy, conceptual references and technology-specific technical sources used for this record.',
      sourceCTCN: 'CTCN taxonomy', sourceTypology: 'Technology typology', sourceIIASA: 'IIASA technology concept',
      sourceTechnical: 'Technology-specific sources', sourceMaterials: 'Raw materials and countries',
      analyticalNote: 'Analytical note', openSource: 'Open source',
      notSpecified: 'Not specified in the current analytical record.',
      rawMaterials: 'Raw materials and geographic supply context',
      identifiedMaterials: 'Identified materials',
      noCritical: 'No specific critical or strategic raw material was identified in the current analytical record.',
      extractionCountries: 'Leading extraction / production countries',
      processingCountries: 'Leading refining / processing countries',
      countryResearch: 'Country information requires technology-specific research.',
      referencePeriod: 'Reference period',
      geographicView: 'Geographic view', materialContext: 'Material supply context',
      extraction: 'Extraction / production', processing: 'Refining / processing', both: 'Both stages',
      bothLong: 'Extraction / production and refining / processing',
      mapEmpty: 'No country-level supply information is available for this technology.',
      viewSource: 'View source',
      imageTitle: 'Technology image', placeholder: 'Image under review · pending update',
      photo: 'Photo', licencePending: 'Licence pending',
      scrollGroup: 'Technology groups',
      scrollExplorer: 'Technologies',
      classifications: {
        'Flexible': 'Flexible',
        'Principalmente fija': 'Mainly fixed',
        'Mixta: base flexible e implementación específica': 'Mixed: flexible base and specific implementation',
        'Principalmente dura, con dimensión blanda': 'Mainly hard, with a soft dimension',
        'Principalmente blanda, con soporte físico': 'Mainly soft, with physical support',
        'Dura y blanda': 'Hard and soft',
        'Equipo y operación': 'Equipment and operation',
        'Operación y producto/servicio de información': 'Operation and information product/service',
        'Operación y servicio': 'Operation and service',
        'Producto y equipo; operación complementaria': 'Product and equipment; complementary operation',
        'Sí, con salvedad de ciclo de vida': 'Yes, with a life-cycle caveat',
        'Sí, condicionada por desempeño y ciclo de vida': 'Yes, conditional on performance and life cycle',
        'Condicionada': 'Conditional',
        'No necesariamente': 'Not necessarily'
      }
    },
    es: {
      allBranches: 'Todas las ramas', allSectors: 'Todos los sectores', allGroups: 'Todos los grupos',
      search: 'Búsqueda', branch: 'Rama', sector: 'Sector', group: 'Grupo',
      activeFilters: 'Filtros activos', noFilters: 'Sin filtros activos',
      mitigation: 'Mitigación', adaptation: 'Adaptación',
      fullTable: 'de la tabla completa', visibleRecords: 'de los registros visibles',
      allRecords: 'Los {n} registros', records: 'registros',
      treemapScope: 'la tabla completa', searchScope: 'búsqueda “{q}”',
      treemapCaption: 'Área del rectángulo = registros del sector ÷ {n} registros en {scope}. Los sectores suman 100 %. Selecciona un sector para revelar sus grupos tecnológicos; selecciónalo de nuevo para limpiar la jerarquía.',
      noScope: 'No hay registros disponibles en el alcance activo.',
      noSectors: 'No hay sectores en la selección activa.',
      filterBy: 'Seleccionar', remove: 'Limpiar',
      noGroups: 'No hay grupos tecnológicos disponibles para este sector y la búsqueda activa.',
      noTechnologies: 'No hay tecnologías disponibles para este grupo tecnológico y la búsqueda activa.',
      profileSection: '05 / Perfil tecnológico',
      profileHowTo: 'Quinto paso · Interpretar el perfil tecnológico', profileHowToText: 'Lee el perfil como una secuencia orientada a la toma de decisiones: comienza por comprender qué hace la tecnología y cuál es su función climática; después revisa su aplicabilidad, naturaleza, forma y función ambiental. Continúa con los requisitos de infraestructura, energía, insumos y suministro, y examina cómo se articulan Hardware, Software y Orgware. Finaliza verificando las materias primas críticas, la geografía de producción y procesamiento, las notas analíticas y las fuentes de respaldo. Selecciona cualquier término subrayado con una “i” para consultar una definición breve.', instructionOpen: 'Secuencia de lectura', 
      classification: 'Caracterización tecnológica',
      classificationIntro: 'Estos cuatro atributos describen cómo puede aplicarse la tecnología, de qué depende, cómo se materializa y bajo qué condiciones contribuye ambientalmente. Complementan la taxonomía sectorial, no la sustituyen.',
      applicability: 'Aplicabilidad', nature: 'Naturaleza', form: 'Forma', environmentalRole: 'Función ambiental',
      justification: 'Justificación analítica',
      applicabilityDefinition: 'Indica qué tan transferible o adaptable es una tecnología entre distintos contextos. Puede ser flexible, principalmente fija o mixta, según cuánto deban cambiar su diseño y su implementación para cada lugar.',
      natureDefinition: 'Describe el equilibrio entre artefactos e infraestructura tangibles —tecnología dura— y conocimientos, procedimientos, capacidades o instituciones —tecnología blanda—. Muchas tecnologías climáticas combinan ambas dimensiones.',
      formDefinition: 'Explica cómo se materializa o entrega la tecnología: como equipo, operación, producto, servicio, información o una combinación de estas formas.',
      environmentalRoleDefinition: 'Explica si la tecnología contribuye a la mitigación o la adaptación y bajo qué condiciones de desempeño y ciclo de vida, evitando trasladar cargas ambientales fuera de los límites del sistema.',
      helpLabel: 'Definición de {term}',
      aspects: 'Aspectos de la tecnología — IIASA',
      aspectsIntro: 'Estas tres dimensiones muestran que una tecnología es más que un equipo: su desempeño también depende del conocimiento, los sistemas de operación, las capacidades y los arreglos institucionales. Selecciona cada término para consultar una definición breve.',
      hardware: 'Hardware', software: 'Software', orgware: 'Orgware',
      hardwareDefinition: 'Dimensión tangible de la tecnología: equipos, máquinas, componentes, instrumentos, instalaciones físicas e infraestructura necesarios para que funcione.',
      softwareDefinition: 'Conocimiento e información codificados que orientan la tecnología: datos, modelos, algoritmos, diseños, procedimientos, protocolos de operación, métodos de monitoreo y herramientas digitales.',
      orgwareDefinition: 'Capacidad organizacional e institucional que permite implementar la tecnología: funciones, competencias, gobernanza, normas, capacitación, financiación, mantenimiento, coordinación y participación de actores.',
      infrastructure: 'Infraestructura', energy: 'Energía', materialsInputs: 'Materiales e insumos',
      suppliesSpares: 'Suministros y repuestos',
      implementationRequirements: 'Requisitos transversales de implementación',
      implementationIntro: 'Estos requisitos resumen la base física y operativa compartida antes de desagregarla entre Hardware, Software y Orgware.',
      technicalSources: 'Fuentes técnicas y alcance analítico',
      sourcesIntro: 'Abre la taxonomía primaria, las referencias conceptuales y las fuentes técnicas específicas utilizadas para este registro.',
      sourceCTCN: 'Taxonomía CTCN', sourceTypology: 'Tipología tecnológica', sourceIIASA: 'Concepto de tecnología IIASA',
      sourceTechnical: 'Fuentes específicas de la tecnología', sourceMaterials: 'Materias primas y países',
      analyticalNote: 'Nota analítica', openSource: 'Abrir fuente',
      notSpecified: 'No especificado en el registro analítico actual.',
      rawMaterials: 'Materias primas y contexto geográfico del suministro',
      identifiedMaterials: 'Materiales identificados',
      noCritical: 'No se identificó una materia prima crítica o estratégica específica en el registro analítico actual.',
      extractionCountries: 'Principales países de extracción / producción',
      processingCountries: 'Principales países de refinación / procesamiento',
      countryResearch: 'La información de países requiere investigación específica para la tecnología.',
      referencePeriod: 'Periodo de referencia',
      geographicView: 'Vista geográfica', materialContext: 'Contexto del suministro de materiales',
      extraction: 'Extracción / producción', processing: 'Refinación / procesamiento', both: 'Ambas etapas',
      bothLong: 'Extracción / producción y refinación / procesamiento',
      mapEmpty: 'No hay información geográfica de suministro disponible para esta tecnología.',
      viewSource: 'Ver fuente',
      imageTitle: 'Imagen de la tecnología', placeholder: 'Imagen en revisión · pendiente de actualización',
      photo: 'Foto', licencePending: 'Licencia pendiente',
      scrollGroup: 'Grupos tecnológicos',
      scrollExplorer: 'Tecnologías',
      classifications: {
        'Flexible': 'Flexible',
        'Principalmente fija': 'Principalmente fija',
        'Mixta: base flexible e implementación específica': 'Mixta: base flexible e implementación específica',
        'Principalmente dura, con dimensión blanda': 'Principalmente dura, con dimensión blanda',
        'Principalmente blanda, con soporte físico': 'Principalmente blanda, con soporte físico',
        'Dura y blanda': 'Dura y blanda',
        'Equipo y operación': 'Equipo y operación',
        'Operación y producto/servicio de información': 'Operación y producto/servicio de información',
        'Operación y servicio': 'Operación y servicio',
        'Producto y equipo; operación complementaria': 'Producto y equipo; operación complementaria',
        'Sí, con salvedad de ciclo de vida': 'Sí, con salvedad de ciclo de vida',
        'Sí, condicionada por desempeño y ciclo de vida': 'Sí, condicionada por desempeño y ciclo de vida',
        'Condicionada': 'Condicionada',
        'No necesariamente': 'No necesariamente'
      }
    },
    de: {
      allBranches: 'Alle Bereiche', allSectors: 'Alle Sektoren', allGroups: 'Alle Gruppen',
      search: 'Suche', branch: 'Bereich', sector: 'Sektor', group: 'Gruppe',
      activeFilters: 'Aktive Filter', noFilters: 'Keine aktiven Filter',
      mitigation: 'Minderung', adaptation: 'Anpassung',
      fullTable: 'der vollständigen Tabelle', visibleRecords: 'der sichtbaren Einträge',
      allRecords: 'Alle {n} Einträge', records: 'Einträge',
      treemapScope: 'der vollständigen Tabelle', searchScope: 'Suche „{q}“',
      treemapCaption: 'Rechteckfläche = Sektoreinträge ÷ {n} Einträge in {scope}. Alle Sektoren ergeben 100 %. Wählen Sie einen Sektor, um seine Technologiegruppen anzuzeigen; wählen Sie ihn erneut, um die Hierarchie zu löschen.',
      noScope: 'Im aktiven Umfang sind keine Einträge verfügbar.',
      noSectors: 'In der aktiven Auswahl sind keine Sektoren vorhanden.',
      filterBy: 'Auswählen', remove: 'Löschen',
      noGroups: 'Für diesen Sektor und die aktive Suche sind keine Technologiegruppen verfügbar.',
      noTechnologies: 'Für diese Technologiegruppe und die aktive Suche sind keine Technologien verfügbar.',
      profileSection: '05 / Technologieprofil',
      profileHowTo: 'Fünfter Schritt · Technologieprofil einordnen', profileHowToText: 'Lesen Sie das Profil als entscheidungsorientierte Abfolge: Verstehen Sie zuerst, was die Technologie leistet und welche Klimafunktion sie erfüllt; prüfen Sie anschließend Anwendbarkeit, Natur, Form und Umweltrolle. Betrachten Sie danach die Anforderungen an Infrastruktur, Energie, Inputs und Versorgung sowie das Zusammenspiel von Hardware, Software und Orgware. Schließen Sie mit kritischen Rohstoffen, Produktions- und Verarbeitungsgeografie, analytischen Hinweisen und Belegquellen ab. Wählen Sie einen unterstrichenen Begriff mit „i“, um eine kurze Definition anzuzeigen.', instructionOpen: 'Lesereihenfolge', 
      classification: 'Technologiecharakterisierung',
      classificationIntro: 'Diese vier Merkmale beschreiben, wie die Technologie angewendet werden kann, wovon sie abhängt, in welcher Form sie bereitgestellt wird und unter welchen Bedingungen sie einen Umweltbeitrag leistet. Sie ergänzen die sektorale Taxonomie, ersetzen sie jedoch nicht.',
      applicability: 'Anwendbarkeit', nature: 'Natur', form: 'Form', environmentalRole: 'Umweltrolle',
      justification: 'Analytische Begründung',
      applicabilityDefinition: 'Zeigt, wie übertragbar oder anpassbar eine Technologie zwischen verschiedenen Kontexten ist. Sie kann flexibel, überwiegend fest oder gemischt sein, je nachdem, wie stark Planung und Umsetzung an den Standort angepasst werden müssen.',
      natureDefinition: 'Beschreibt das Verhältnis zwischen materiellen Artefakten und Infrastruktur — harter Technologie — sowie Wissen, Verfahren, Fähigkeiten oder Institutionen — weicher Technologie. Viele Klimatechnologien verbinden beide Dimensionen.',
      formDefinition: 'Erklärt, in welcher Form die Technologie verkörpert oder bereitgestellt wird: als Ausrüstung, Betrieb, Produkt, Dienstleistung, Information oder als Kombination dieser Formen.',
      environmentalRoleDefinition: 'Erklärt, ob und unter welchen Leistungs- und Lebenszyklusbedingungen die Technologie zu Minderung oder Anpassung beiträgt, ohne Umweltbelastungen über die Systemgrenze hinaus zu verlagern.',
      helpLabel: 'Definition von {term}',
      aspects: 'Technologieaspekte — IIASA',
      aspectsIntro: 'Diese drei Dimensionen zeigen, dass Technologie mehr als Ausrüstung ist: Ihre Leistung hängt auch von Wissen, Betriebssystemen, Fähigkeiten und institutionellen Regelungen ab. Wählen Sie jeden Begriff, um eine kurze Definition anzuzeigen.',
      hardware: 'Hardware', software: 'Software', orgware: 'Orgware',
      hardwareDefinition: 'Die materielle Dimension der Technologie: Geräte, Maschinen, Komponenten, Instrumente, physische Anlagen und Infrastruktur, die für den Betrieb erforderlich sind.',
      softwareDefinition: 'Kodifiziertes Wissen und Informationen, die die Technologie steuern: Daten, Modelle, Algorithmen, Entwürfe, Verfahren, Betriebsprotokolle, Überwachungsmethoden und digitale Werkzeuge.',
      orgwareDefinition: 'Organisatorische und institutionelle Kapazität, die die Umsetzung ermöglicht: Rollen, Kompetenzen, Governance, Standards, Schulung, Finanzierung, Instandhaltung, Koordination und Beteiligung von Akteuren.',
      infrastructure: 'Infrastruktur', energy: 'Energie', materialsInputs: 'Materialien und Inputs',
      suppliesSpares: 'Lieferungen und Ersatzteile',
      implementationRequirements: 'Übergreifende Umsetzungsanforderungen',
      implementationIntro: 'Diese Anforderungen fassen die gemeinsame physische und betriebliche Grundlage zusammen, bevor sie auf Hardware, Software und Orgware verteilt wird.',
      technicalSources: 'Fachquellen und analytische Abgrenzung',
      sourcesIntro: 'Öffnen Sie die Primärtaxonomie, die konzeptionellen Referenzen und die technologiespezifischen Fachquellen dieses Eintrags.',
      sourceCTCN: 'CTCN-Taxonomie', sourceTypology: 'Technologietypologie', sourceIIASA: 'IIASA-Technologiebegriff',
      sourceTechnical: 'Technologiespezifische Quellen', sourceMaterials: 'Rohstoffe und Länder',
      analyticalNote: 'Analytischer Hinweis', openSource: 'Quelle öffnen',
      notSpecified: 'Im aktuellen analytischen Eintrag nicht angegeben.',
      rawMaterials: 'Rohstoffe und geografischer Lieferkontext',
      identifiedMaterials: 'Identifizierte Materialien',
      noCritical: 'Im aktuellen analytischen Eintrag wurde kein spezifischer kritischer oder strategischer Rohstoff identifiziert.',
      extractionCountries: 'Führende Förder- / Produktionsländer',
      processingCountries: 'Führende Raffinations- / Verarbeitungsländer',
      countryResearch: 'Länderinformationen erfordern technologiespezifische Recherche.',
      referencePeriod: 'Referenzzeitraum',
      geographicView: 'Geografische Ansicht', materialContext: 'Kontext der Materialversorgung',
      extraction: 'Förderung / Produktion', processing: 'Raffination / Verarbeitung', both: 'Beide Stufen',
      bothLong: 'Förderung / Produktion und Raffination / Verarbeitung',
      mapEmpty: 'Für diese Technologie sind keine länderspezifischen Lieferinformationen verfügbar.',
      viewSource: 'Quelle anzeigen',
      imageTitle: 'Technologieabbildung', placeholder: 'Abbildung in Prüfung · Aktualisierung ausstehend',
      photo: 'Foto', licencePending: 'Lizenz ausstehend',
      scrollGroup: 'Technologiegruppen',
      scrollExplorer: 'Technologien',
      classifications: {
        'Flexible': 'Flexibel',
        'Principalmente fija': 'Überwiegend fest',
        'Mixta: base flexible e implementación específica': 'Gemischt: flexible Basis und spezifische Umsetzung',
        'Principalmente dura, con dimensión blanda': 'Überwiegend hart, mit weicher Dimension',
        'Principalmente blanda, con soporte físico': 'Überwiegend weich, mit physischer Unterstützung',
        'Dura y blanda': 'Hart und weich',
        'Equipo y operación': 'Ausrüstung und Betrieb',
        'Operación y producto/servicio de información': 'Betrieb und Informationsprodukt/-dienstleistung',
        'Operación y servicio': 'Betrieb und Dienstleistung',
        'Producto y equipo; operación complementaria': 'Produkt und Ausrüstung; ergänzender Betrieb',
        'Sí, con salvedad de ciclo de vida': 'Ja, mit Lebenszyklusvorbehalt',
        'Sí, condicionada por desempeño y ciclo de vida': 'Ja, abhängig von Leistung und Lebenszyklus',
        'Condicionada': 'Bedingt',
        'No necesariamente': 'Nicht notwendigerweise'
      }
    }
  };

  const c = copy[language] || copy.en;
  const text = (template, values = {}) =>
    String(template).replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '');

  const fields = {
    id: 'id', branch: 'branch', sector: 'sector', group: 'group', tech: 'technology',
    description: 'description', flex: 'flexibility', flexWhy: 'flexibilityJustification',
    nature: 'nature', natureWhy: 'natureJustification', embedding: 'form',
    embeddingWhy: 'formJustification', clean: 'cleanTechnology',
    cleanWhy: 'cleanTechnologyJustification', hardware: 'hardware', software: 'software',
    orgware: 'orgware', associatedInfrastructure: 'associatedInfrastructure',
    energyRequirements: 'energyRequirements', materialsInputs: 'materialsInputs',
    suppliesSpares: 'suppliesSpares', observations: 'observations',
    hwInfra: 'hardwareInfrastructure', hwEnergy: 'hardwareEnergy',
    hwMaterials: 'hardwareMaterials', hwSupplies: 'hardwareSupplies',
    swInfra: 'softwareInfrastructure', swEnergy: 'softwareEnergy',
    swMaterials: 'softwareMaterials', swSupplies: 'softwareSupplies',
    owInfra: 'orgwareInfrastructure', owEnergy: 'orgwareEnergy',
    owMaterials: 'orgwareMaterials', owSupplies: 'orgwareSupplies',
    criticalMaterials: 'criticalMaterials', extractionCountries: 'extractionCountries',
    processingCountries: 'processingCountries', geographyNote: 'geographyNote',
    geographyYear: 'geographyYear', sourceCTCN: 'sourceCTCN',
    sourceTypology: 'sourceTypology', sourceIIASA: 'sourceIIASA',
    sourceTechnical: 'sourceTechnical', sourceMaterials: 'sourceMaterials'
  };

  const $ = id => document.getElementById(id);
  const els = {
    search: $('searchInput'), branch: $('branchFilter'), sector: $('sectorFilter'), group: $('groupFilter'), reset: $('resetFilters'),
    groupSection: $('technologyGroupSection'), explorerSection: $('technologyExplorerSection'),
    groupOptions: $('groupOptions'), technologyCards: $('technologyCards'),
    sectorTreemapPanel: $('sectorTreemapPanel'), sectors: $('sectorBars'),
    visibleKpi: $('visibleKpi'), mitigationKpi: $('mitigationKpi'), adaptationKpi: $('adaptationKpi'), sectorsKpi: $('sectorsKpi'),
    activeFilters: $('activeFilters'), clearSectorChart: $('clearSectorChart'), toggleTreemapSize: $('toggleTreemapSize'),
    visibleCount: $('visibleCount'), visibleShare: $('visibleShare'), mitigationCount: $('mitigationCount'),
    mitigationShare: $('mitigationShare'), adaptationCount: $('adaptationCount'), adaptationShare: $('adaptationShare'),
    sectorCount: $('sectorCount'), scope: $('scopeText'), sectorDenominator: $('sectorDenominator'),
    sectorChartCaption: $('sectorChartCaption'), detail: $('technologyDetail')
  };

  const escapeHTML = value => String(value ?? '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));
  const normalise = value => String(value ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const unique = (field, list = records) =>
    [...new Set(list.map(record => record[field]).filter(Boolean))]
      .sort((a, b) => String(a).localeCompare(String(b)));
  const percentage = (value, total) => total ? (value / total) * 100 : 0;
  const percentageText = (value, total) => `${percentage(value, total).toFixed(1)}%`;
  const translateBranch = value => value || c.notSpecified;
  const translateClass = value => value || c.notSpecified;
  const resolveAssetPath = path => /^(?:https?:|data:|\/)/i.test(path || '') ? path : `${rootPrefix}${path || ''}`;

  const searchableFields = [
    fields.tech, fields.group, fields.sector, fields.branch, fields.description,
    fields.flex, fields.flexWhy, fields.nature, fields.natureWhy,
    fields.embedding, fields.embeddingWhy, fields.clean, fields.cleanWhy,
    fields.hardware, fields.software, fields.orgware, fields.observations,
    fields.hwInfra, fields.hwEnergy, fields.hwMaterials, fields.hwSupplies,
    fields.swInfra, fields.swEnergy, fields.swMaterials, fields.swSupplies,
    fields.owInfra, fields.owEnergy, fields.owMaterials, fields.owSupplies,
    fields.criticalMaterials, fields.extractionCountries, fields.processingCountries,
    fields.geographyNote, fields.geographyYear, fields.associatedInfrastructure,
    fields.energyRequirements, fields.materialsInputs, fields.suppliesSpares,
    fields.sourceTechnical
  ];

  const sectorPalette = [
    '#2C6E91', '#7A5C9E', '#2F7D70', '#B45F45', '#728C3C',
    '#C08A3E', '#476A9F', '#A34F75', '#40828A', '#8A6A3D',
    '#5D7F45', '#75617D', '#507080', '#AA7054', '#3E6F5D'
  ];
  const allSectors = unique(fields.sector);
  const sectorColours = new Map(allSectors.map((sector, index) => [sector, sectorPalette[index % sectorPalette.length]]));

  function hexToRgb(hex) {
    const value = hex.replace('#', '');
    return {
      r: parseInt(value.slice(0, 2), 16),
      g: parseInt(value.slice(2, 4), 16),
      b: parseInt(value.slice(4, 6), 16)
    };
  }

  function mixWithWhite(hex, amount = 0.82) {
    const rgb = hexToRgb(hex);
    const mix = channel => Math.round(channel + (255 - channel) * amount);
    return `rgb(${mix(rgb.r)}, ${mix(rgb.g)}, ${mix(rgb.b)})`;
  }

  function contrastColour(hex) {
    const {r, g, b} = hexToRgb(hex);
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return luminance > 0.58 ? '#173E52' : '#FFFFFF';
  }

  function sectorStyle(sector) {
    const colour = sectorColours.get(sector) || '#507080';
    return `--sector-color:${colour};--sector-soft:${mixWithWhite(colour)};--sector-ink:${contrastColour(colour)}`;
  }

  function fillSelect(select, values, defaultLabel, keepCurrent = true) {
    const current = keepCurrent ? select.value : '';
    select.innerHTML = `<option value="">${escapeHTML(defaultLabel)}</option>` +
      values.map(value => `<option value="${escapeHTML(value)}">${escapeHTML(value)}</option>`).join('');
    select.value = values.includes(current) ? current : '';
  }

  function matchesSearch(record) {
    const query = normalise(els.search.value.trim());
    if (!query) return true;
    const searchable = searchableFields.map(field => record[field]).join(' ');
    return normalise(searchable).includes(query);
  }

  function superiorScope(record) {
    return matchesSearch(record) &&
      (!els.branch.value || record[fields.branch] === els.branch.value);
  }

  function sectorScope(record) {
    return superiorScope(record) &&
      (!els.sector.value || record[fields.sector] === els.sector.value);
  }

  function groupScope(record) {
    return sectorScope(record) &&
      (!els.group.value || record[fields.group] === els.group.value);
  }

  function currentRecords() {
    return records.filter(groupScope);
  }

  function updateHierarchyOptions() {
    fillSelect(els.branch, unique(fields.branch), c.allBranches, true);

    const sectors = records.filter(record =>
      matchesSearch(record) && (!els.branch.value || record[fields.branch] === els.branch.value)
    );
    fillSelect(els.sector, unique(fields.sector, sectors), c.allSectors, true);

    const groups = records.filter(record =>
      matchesSearch(record) &&
      (!els.branch.value || record[fields.branch] === els.branch.value) &&
      (!els.sector.value || record[fields.sector] === els.sector.value)
    );
    fillSelect(els.group, unique(fields.group, groups), c.allGroups, true);
  }

  function activeFilterEntries() {
    const entries = [];
    if (els.search.value.trim()) entries.push(['search', `${c.search}: ${els.search.value.trim()}`]);
    if (els.branch.value) entries.push(['branch', `${c.branch}: ${translateBranch(els.branch.value)}`]);
    if (els.sector.value) entries.push(['sector', `${c.sector}: ${els.sector.value}`]);
    if (els.group.value) entries.push(['group', `${c.group}: ${els.group.value}`]);
    return entries;
  }

  function clearFilter(key) {
    if (key === 'search') {
      els.search.value = '';
      els.sector.value = '';
      els.group.value = '';
    }
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
    selectedId = null;
    updateHierarchyOptions();
    renderAll();
  }

  function renderActiveFilters() {
    const entries = activeFilterEntries();
    els.activeFilters.innerHTML = entries.length
      ? `<span class="active-filter-label">${escapeHTML(c.activeFilters)}</span>` +
        entries.map(([key, label]) =>
          `<button type="button" class="active-filter-chip" data-clear-filter="${key}">${escapeHTML(label)} <span>×</span></button>`
        ).join('')
      : `<span class="active-filter-empty">${escapeHTML(c.noFilters)}</span>`;

    els.activeFilters.querySelectorAll('[data-clear-filter]').forEach(button =>
      button.addEventListener('click', () => clearFilter(button.dataset.clearFilter))
    );
    els.clearSectorChart.hidden = !els.sector.value;
  }

  function renderKPIs() {
    const visible = currentRecords();
    const total = visible.length;
    const mitigationBranch = els.mitigationKpi.dataset.kpiBranch;
    const adaptationBranch = els.adaptationKpi.dataset.kpiBranch;
    const mitigation = visible.filter(record => record[fields.branch] === mitigationBranch).length;
    const adaptation = visible.filter(record => record[fields.branch] === adaptationBranch).length;
    const sectors = new Set(visible.map(record => record[fields.sector]).filter(Boolean)).size;
    const labels = activeFilterEntries().map(([, label]) => label);

    els.visibleCount.textContent = total.toLocaleString();
    els.visibleShare.textContent = `${percentageText(total, records.length)} ${c.fullTable}`;
    els.mitigationCount.textContent = mitigation.toLocaleString();
    els.mitigationShare.textContent = `${percentageText(mitigation, total)} ${c.visibleRecords}`;
    els.adaptationCount.textContent = adaptation.toLocaleString();
    els.adaptationShare.textContent = `${percentageText(adaptation, total)} ${c.visibleRecords}`;
    els.sectorCount.textContent = sectors.toLocaleString();
    els.scope.textContent = labels.length
      ? `${total.toLocaleString()} ${c.records} · ${labels.join(' · ')}`
      : text(c.allRecords, {n: total.toLocaleString()});

    els.mitigationKpi.classList.toggle('active-kpi-filter', els.branch.value === mitigationBranch);
    els.adaptationKpi.classList.toggle('active-kpi-filter', els.branch.value === adaptationBranch);
    els.visibleKpi.classList.toggle('active-kpi-filter',
      !els.branch.value && !els.sector.value && !els.group.value
    );
  }

  function layoutTreemap(items, x = 0, y = 0, width = 100, height = 100) {
    if (!items.length) return [];
    if (items.length === 1) return [{...items[0], x, y, width, height}];

    const total = items.reduce((sum, item) => sum + item.value, 0);
    let running = 0;
    let splitIndex = 1;
    let bestDifference = Infinity;

    for (let index = 1; index < items.length; index++) {
      running += items[index - 1].value;
      const difference = Math.abs(total / 2 - running);
      if (difference < bestDifference) {
        bestDifference = difference;
        splitIndex = index;
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

  function renderSectorTreemap() {
    const scopeRecords = records.filter(superiorScope);
    const denominator = scopeRecords.length;
    const counter = new Map();

    scopeRecords.forEach(record => {
      const sector = record[fields.sector] || 'Not classified';
      counter.set(sector, (counter.get(sector) || 0) + 1);
    });

    const counts = [...counter.entries()].sort((a, b) => b[1] - a[1]);
    els.sectorDenominator.textContent = denominator.toLocaleString();

    const scopeParts = [];
    if (els.branch.value) scopeParts.push(translateBranch(els.branch.value));
    if (els.search.value.trim()) scopeParts.push(text(c.searchScope, {q: els.search.value.trim()}));
    const scopeLabel = scopeParts.length ? scopeParts.join(' · ') : c.treemapScope;

    els.sectorChartCaption.textContent = denominator
      ? text(c.treemapCaption, {n: denominator.toLocaleString(), scope: scopeLabel})
      : c.noScope;

    if (!counts.length) {
      els.sectors.innerHTML = `<div class="empty-results">${escapeHTML(c.noSectors)}</div>`;
      return;
    }

    const items = counts.map(([name, value]) => ({
      name, value, share: percentage(value, denominator)
    }));
    const layout = layoutTreemap(items);

    els.sectors.innerHTML = layout.map(item => {
      const active = els.sector.value === item.name;
      const compact = item.width < 15 || item.height < 18;
      const action = active ? c.remove : c.filterBy;
      return `<button class="treemap-sector ${active ? 'active-chart-filter' : ''} ${compact ? 'compact-tile' : ''}"
        data-sector="${escapeHTML(item.name)}" type="button"
        style="left:${item.x.toFixed(3)}%;top:${item.y.toFixed(3)}%;width:${item.width.toFixed(3)}%;height:${item.height.toFixed(3)}%;${sectorStyle(item.name)}"
        title="${escapeHTML(action)} ${escapeHTML(item.name)} · ${item.share.toFixed(1)}% · ${item.value} ${escapeHTML(c.records)}"
        aria-label="${escapeHTML(item.name)}: ${item.share.toFixed(1)} percent, ${item.value} ${escapeHTML(c.records)}">
        <span class="treemap-name">${escapeHTML(item.name)}</span>
        <span class="treemap-percent">${item.share.toFixed(1)}%</span>
        <span class="treemap-count">${item.value} ${escapeHTML(c.records)}</span>
      </button>`;
    }).join('');

    els.sectors.querySelectorAll('[data-sector]').forEach(button =>
      button.addEventListener('click', () => {
        const selectedSector = button.dataset.sector;
        const clearing = els.sector.value === selectedSector;
        els.sector.value = clearing ? '' : selectedSector;
        els.group.value = '';
        selectedId = null;
        updateHierarchyOptions();
        renderAll();

        if (!clearing) {
          requestAnimationFrame(() =>
            els.groupSection.scrollIntoView({behavior: 'smooth', block: 'center'})
          );
        }
      })
    );
  }

  function renderTechnologyGroups() {
    if (!els.sector.value) {
      els.groupSection.hidden = true;
      els.groupOptions.innerHTML = '';
      return;
    }

    const available = records.filter(record =>
      superiorScope(record) && record[fields.sector] === els.sector.value
    );
    const groups = unique(fields.group, available);
    const style = sectorStyle(els.sector.value);

    els.groupSection.hidden = false;
    els.groupSection.setAttribute('style', style);
    els.groupOptions.innerHTML = groups.length
      ? groups.map(group => `
          <button type="button" class="hierarchy-card group-choice ${els.group.value === group ? 'active' : ''}"
            data-group="${escapeHTML(group)}" style="${style}" aria-pressed="${els.group.value === group}">
            <span>${escapeHTML(group)}</span>
          </button>`).join('')
      : `<div class="empty-results">${escapeHTML(c.noGroups)}</div>`;

    els.groupOptions.querySelectorAll('[data-group]').forEach(button =>
      button.addEventListener('click', () => {
        const selectedGroup = button.dataset.group;
        const clearing = els.group.value === selectedGroup;
        els.group.value = clearing ? '' : selectedGroup;
        selectedId = null;
        updateHierarchyOptions();
        renderAll();

        if (!clearing) {
          requestAnimationFrame(() =>
            els.explorerSection.scrollIntoView({behavior: 'smooth', block: 'center'})
          );
        }
      })
    );
  }

  function renderTechnologyExplorer() {
    if (!els.sector.value || !els.group.value) {
      els.explorerSection.hidden = true;
      els.technologyCards.innerHTML = '';
      return;
    }

    const technologies = records
      .filter(record =>
        superiorScope(record) &&
        record[fields.sector] === els.sector.value &&
        record[fields.group] === els.group.value
      )
      .sort((a, b) => String(a[fields.tech]).localeCompare(String(b[fields.tech])));

    const style = sectorStyle(els.sector.value);
    els.explorerSection.hidden = false;
    els.explorerSection.setAttribute('style', style);
    els.technologyCards.innerHTML = technologies.length
      ? technologies.map(record => `
          <button type="button" class="hierarchy-card technology-choice ${selectedId === record[fields.id] ? 'active' : ''}"
            data-technology-id="${escapeHTML(record[fields.id])}" style="${style}" aria-pressed="${selectedId === record[fields.id]}">
            <span>${escapeHTML(record[fields.tech])}</span>
          </button>`).join('')
      : `<div class="empty-results">${escapeHTML(c.noTechnologies)}</div>`;

    els.technologyCards.querySelectorAll('[data-technology-id]').forEach(button =>
      button.addEventListener('click', () => selectTechnology(button.dataset.technologyId))
    );
  }

  let helpCounter = 0;

  function infoTerm(label, definition) {
    const tooltipId = `term-help-${++helpCounter}`;
    return `<span class="info-term">
      <button type="button" class="info-term-trigger" aria-expanded="false"
        aria-describedby="${tooltipId}" aria-label="${escapeHTML(text(c.helpLabel, {term: label}))}">
        <span>${escapeHTML(label)}</span><i aria-hidden="true">i</i>
      </button>
      <span class="info-term-popover" id="${tooltipId}" role="tooltip">${escapeHTML(definition)}</span>
    </span>`;
  }

  function classificationCard(label, definition, value, why) {
    return `<article class="profile-classification-card">
      <div class="profile-classification-head">
        <div>${infoTerm(label, definition)}<strong>${escapeHTML(translateClass(value))}</strong></div>
      </div>
      <p><b>${escapeHTML(c.justification)}:</b> ${escapeHTML(why || c.notSpecified)}</p>
    </article>`;
  }

  function requirementItem(label, value, className) {
    return `<div class="aspect-subindex ${className}">
      <span class="aspect-subindex-label">${escapeHTML(label)}</span>
      <p>${escapeHTML(value || c.notSpecified)}</p>
    </div>`;
  }

  function aspectCard(number, title, definition, description, values, cardClass) {
    return `<article class="aspect-card aspect-card-expanded ${cardClass}">
      <div class="aspect-card-heading">
        <span>${number}</span>
        <div><h3>${infoTerm(title, definition)}</h3><p>${escapeHTML(description || c.notSpecified)}</p></div>
      </div>
      <div class="aspect-subindex-grid">
        ${requirementItem(c.infrastructure, values.infra, 'subindex-infrastructure')}
        ${requirementItem(c.energy, values.energy, 'subindex-energy')}
        ${requirementItem(c.materialsInputs, values.materials, 'subindex-materials')}
        ${requirementItem(c.suppliesSpares, values.supplies, 'subindex-supplies')}
      </div>
    </article>`;
  }

  function parseCountryList(value) {
    return [...new Set(String(value || '')
      .split(/[;,|]/)
      .map(item => item.trim())
      .filter(Boolean)
    )];
  }

  function renderTechnologyMap(record) {
    const mapElement = $('technology-country-map');
    const emptyElement = $('technology-map-empty');
    if (!mapElement || typeof Plotly === 'undefined') return;

    const extraction = parseCountryList(record[fields.extractionCountries]);
    const processing = parseCountryList(record[fields.processingCountries]);
    const countries = [...new Set([...extraction, ...processing])]
      .map(name => ({name, code: countryCodes[name]}))
      .filter(country => country.code);

    if (!countries.length) {
      Plotly.purge(mapElement);
      mapElement.hidden = true;
      if (emptyElement) emptyElement.hidden = false;
      return;
    }

    mapElement.hidden = false;
    if (emptyElement) emptyElement.hidden = true;

    const values = countries.map(country => {
      const extractionStage = extraction.includes(country.name);
      const processingStage = processing.includes(country.name);
      return extractionStage && processingStage ? 3 : processingStage ? 2 : 1;
    });

    const stages = values.map(value =>
      value === 3 ? c.bothLong : value === 2 ? c.processing : c.extraction
    );

    Plotly.react(mapElement, [{
      type: 'choropleth',
      locationmode: 'ISO-3',
      locations: countries.map(country => country.code),
      z: values,
      zmin: 1,
      zmax: 3,
      text: stages,
      customdata: countries.map(country => country.name),
      hovertemplate: '<b>%{customdata}</b><br>%{text}<extra></extra>',
      colorscale: [
        [0.00, '#9CB9C8'], [0.32, '#9CB9C8'],
        [0.34, '#D8A86B'], [0.65, '#D8A86B'],
        [0.67, '#395F73'], [1.00, '#395F73']
      ],
      showscale: false,
      marker: {line: {color: '#F7FAFB', width: 0.65}}
    }], {
      margin: {l: 0, r: 0, t: 0, b: 0},
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      geo: {
        projection: {type: 'natural earth'},
        showframe: false, showcoastlines: false, showcountries: true,
        countrycolor: '#D5E1E6', showland: true, landcolor: '#EDF3F5',
        showocean: true, oceancolor: '#F8FBFC', bgcolor: 'rgba(0,0,0,0)',
        lataxis: {range: [-58, 85]}
      },
      dragmode: false,
      hoverlabel: {
        bgcolor: '#173E52', bordercolor: '#173E52',
        font: {color: '#FFFFFF', family: 'Geist, Arial, sans-serif', size: 12}
      }
    }, {
      responsive: true, displayModeBar: false, scrollZoom: false
    });
  }

  function getTechnologyImage(record) {
    const manifest = window.CTCN_IMAGE_MANIFEST || {};
    const key = String(record[fields.id] || '').trim();
    return manifest[key] || manifest.default || {
      path: 'assets/technologies/placeholder.jpg',
      title: c.imageTitle,
      author: '', license: '', source: '',
      alt: String(record[fields.tech] || c.imageTitle),
      status: 'placeholder'
    };
  }

  function renderTechnologyPhoto(record) {
    const image = getTechnologyImage(record);
    const sourceLink = image.source
      ? `<a href="${escapeHTML(image.source)}" target="_blank" rel="noopener noreferrer">${escapeHTML(c.viewSource)}</a>`
      : '';
    const caption = image.status === 'placeholder'
      ? c.placeholder
      : `${c.photo}: ${image.author || 'Unknown'} · ${image.license || c.licencePending}`;
    const imageTitle = image.status === 'placeholder'
      ? c.imageTitle
      : (image.title || record[fields.tech]);

    return `<figure class="technology-photo technology-photo-standard">
      <div class="technology-photo-frame">
        <img src="${escapeHTML(resolveAssetPath(image.path))}"
          alt="${escapeHTML(image.alt || record[fields.tech])}"
          width="1200" height="675" loading="lazy"
          onerror="this.onerror=null;this.src='${escapeHTML(resolveAssetPath('assets/technologies/placeholder.jpg'))}';">
      </div>
      <figcaption>
        <span class="photo-caption-title">${escapeHTML(imageTitle)}</span>
        <span class="photo-caption-credit">${escapeHTML(caption)}${sourceLink ? ` · ${sourceLink}` : ''}</span>
      </figcaption>
    </figure>`;
  }

  function sourceCard(label, value) {
    const urls = String(value || '')
      .split(/\s*;\s*/)
      .map(item => item.trim())
      .filter(item => /^https?:\/\//i.test(item));
    const links = urls.length
      ? urls.map((url, index) => `<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(c.openSource)}${urls.length > 1 ? ` ${index + 1}` : ''} ↗</a>`).join('')
      : `<span>${escapeHTML(c.notSpecified)}</span>`;
    return `<article class="technical-source-card"><span>${escapeHTML(label)}</span><div>${links}</div></article>`;
  }

  function selectTechnology(id) {
    selectedId = id;
    const record = records.find(item => item[fields.id] === id);
    if (!record) return;

    renderTechnologyExplorer();
    const style = sectorStyle(record[fields.sector]);
    els.detail.hidden = false;
    els.detail.setAttribute('style', style);
    els.detail.innerHTML = `
      <div class="profile-section-label">${escapeHTML(c.profileSection)}</div>
      <aside class="profile-reading-guide public-step-guide">
        <div class="public-step-guide-heading"><span>${escapeHTML(c.profileHowTo)}</span><small>${escapeHTML(c.instructionOpen)}</small></div>
        <p>${escapeHTML(c.profileHowToText)}</p>
      </aside>
      <div class="detail-profile-head">
        ${renderTechnologyPhoto(record)}
        <div class="detail-profile-intro">
          <div class="detail-breadcrumb">${escapeHTML(translateBranch(record[fields.branch]))} / ${escapeHTML(record[fields.sector])} / ${escapeHTML(record[fields.group])}</div>
          <h2 class="detail-title">${escapeHTML(record[fields.tech])}</h2>
          <p class="detail-description">${escapeHTML(record[fields.description])}</p>
        </div>
      </div>

      <section class="detail-section-full profile-classification-section">
        <div class="section-number">${escapeHTML(c.classification)}</div>
        <p class="integrated-aspects-note">${escapeHTML(c.classificationIntro)}</p>
        <div class="profile-classification-grid">
          ${classificationCard(c.applicability, c.applicabilityDefinition, record[fields.flex], record[fields.flexWhy])}
          ${classificationCard(c.nature, c.natureDefinition, record[fields.nature], record[fields.natureWhy])}
          ${classificationCard(c.form, c.formDefinition, record[fields.embedding], record[fields.embeddingWhy])}
          ${classificationCard(c.environmentalRole, c.environmentalRoleDefinition, record[fields.clean], record[fields.cleanWhy])}
        </div>
      </section>

      <section class="detail-section-full implementation-requirements-section">
        <div class="section-number">${escapeHTML(c.implementationRequirements)}</div>
        <p class="integrated-aspects-note">${escapeHTML(c.implementationIntro)}</p>
        <div class="implementation-requirements-grid">
          ${requirementItem(c.infrastructure, record[fields.associatedInfrastructure], 'subindex-infrastructure')}
          ${requirementItem(c.energy, record[fields.energyRequirements], 'subindex-energy')}
          ${requirementItem(c.materialsInputs, record[fields.materialsInputs], 'subindex-materials')}
          ${requirementItem(c.suppliesSpares, record[fields.suppliesSpares], 'subindex-supplies')}
        </div>
      </section>

      <section class="detail-section-full integrated-aspects-section">
        <div class="section-number">${escapeHTML(c.aspects)}</div>
        <p class="integrated-aspects-note">${escapeHTML(c.aspectsIntro)}</p>
        <div class="aspect-grid aspect-grid-integrated">
          ${aspectCard('01', c.hardware, c.hardwareDefinition, record[fields.hardware], {
            infra: record[fields.hwInfra], energy: record[fields.hwEnergy],
            materials: record[fields.hwMaterials], supplies: record[fields.hwSupplies]
          }, 'hardware-card')}
          ${aspectCard('02', c.software, c.softwareDefinition, record[fields.software], {
            infra: record[fields.swInfra], energy: record[fields.swEnergy],
            materials: record[fields.swMaterials], supplies: record[fields.swSupplies]
          }, 'software-card')}
          ${aspectCard('03', c.orgware, c.orgwareDefinition, record[fields.orgware], {
            infra: record[fields.owInfra], energy: record[fields.owEnergy],
            materials: record[fields.owMaterials], supplies: record[fields.owSupplies]
          }, 'orgware-card')}
        </div>
      </section>

      <section class="detail-section-full raw-material-section">
        <div class="section-number">${escapeHTML(c.rawMaterials)}</div>
        <div class="raw-material-overview">
          <article class="raw-material-primary">
            <span>${escapeHTML(c.identifiedMaterials)}</span>
            <p>${escapeHTML(record[fields.criticalMaterials] || c.noCritical)}</p>
          </article>
          <article>
            <span>${escapeHTML(c.extractionCountries)}</span>
            <p>${escapeHTML(record[fields.extractionCountries] || c.countryResearch)}</p>
          </article>
          <article>
            <span>${escapeHTML(c.processingCountries)}</span>
            <p>${escapeHTML(record[fields.processingCountries] || c.countryResearch)}</p>
          </article>
        </div>
        <p class="geography-caveat">${escapeHTML(record[fields.geographyNote] || '')}${record[fields.geographyYear] ? ` ${escapeHTML(c.referencePeriod)}: ${escapeHTML(record[fields.geographyYear])}.` : ''}</p>
        <div class="technology-map-panel">
          <div class="technology-map-heading">
            <div>
              <span class="technology-map-kicker">${escapeHTML(c.geographicView)}</span>
              <h3>${escapeHTML(c.materialContext)}</h3>
            </div>
            <div class="technology-map-legend" aria-label="Map legend">
              <span><i class="map-swatch extraction-swatch"></i>${escapeHTML(c.extraction)}</span>
              <span><i class="map-swatch processing-swatch"></i>${escapeHTML(c.processing)}</span>
              <span><i class="map-swatch both-swatch"></i>${escapeHTML(c.both)}</span>
            </div>
          </div>
          <div id="technology-country-map" class="technology-country-map" role="img"></div>
          <p id="technology-map-empty" class="technology-map-empty" hidden>${escapeHTML(c.mapEmpty)}</p>
        </div>
      </section>

      <section class="detail-section-full technical-sources-section">
        <div class="section-number">${escapeHTML(c.technicalSources)}</div>
        <p class="integrated-aspects-note">${escapeHTML(c.sourcesIntro)}</p>
        <div class="technical-sources-grid">
          ${sourceCard(c.sourceCTCN, record[fields.sourceCTCN])}
          ${sourceCard(c.sourceTypology, record[fields.sourceTypology])}
          ${sourceCard(c.sourceIIASA, record[fields.sourceIIASA])}
          ${sourceCard(c.sourceTechnical, record[fields.sourceTechnical])}
          ${sourceCard(c.sourceMaterials, record[fields.sourceMaterials])}
        </div>
        <div class="analytical-note"><span>${escapeHTML(c.analyticalNote)}</span><p>${escapeHTML(record[fields.observations] || c.notSpecified)}</p></div>
      </section>`;

    requestAnimationFrame(() => {
      renderTechnologyMap(record);
      els.detail.scrollIntoView({behavior: 'smooth', block: 'start'});
    });
  }

  function hideProfile() {
    selectedId = null;
    els.detail.hidden = true;
    els.detail.innerHTML = '';
  }

  function renderAll() {
    renderActiveFilters();
    renderKPIs();
    renderSectorTreemap();
    renderTechnologyGroups();
    renderTechnologyExplorer();

    if (!selectedId) {
      els.detail.hidden = true;
      els.detail.innerHTML = '';
    }
  }

  els.search.addEventListener('input', () => {
    els.sector.value = '';
    els.group.value = '';
    hideProfile();
    updateHierarchyOptions();
    renderAll();
  });

  els.branch.addEventListener('change', () => {
    els.sector.value = '';
    els.group.value = '';
    hideProfile();
    updateHierarchyOptions();
    renderAll();
  });

  els.sector.addEventListener('change', () => {
    els.group.value = '';
    hideProfile();
    updateHierarchyOptions();
    renderAll();
  });

  els.group.addEventListener('change', () => {
    hideProfile();
    updateHierarchyOptions();
    renderAll();
  });

  els.visibleKpi.addEventListener('click', () => {
    els.branch.value = '';
    els.sector.value = '';
    els.group.value = '';
    hideProfile();
    updateHierarchyOptions();
    renderAll();
  });

  [els.mitigationKpi, els.adaptationKpi].forEach(button =>
    button.addEventListener('click', () => {
      const target = button.dataset.kpiBranch;
      els.branch.value = els.branch.value === target ? '' : target;
      els.sector.value = '';
      els.group.value = '';
      hideProfile();
      updateHierarchyOptions();
      renderAll();
    })
  );

  els.sectorsKpi.addEventListener('click', () => {
    els.sectorTreemapPanel.scrollIntoView({behavior: 'smooth', block: 'center'});
    els.sectorTreemapPanel.classList.add('taxonomy-row-pulse');
    window.setTimeout(() => els.sectorTreemapPanel.classList.remove('taxonomy-row-pulse'), 900);
  });

  els.reset.addEventListener('click', () => {
    els.search.value = '';
    els.branch.value = '';
    els.sector.value = '';
    els.group.value = '';
    hideProfile();
    updateHierarchyOptions();
    renderAll();
  });

  els.clearSectorChart.addEventListener('click', () => clearFilter('sector'));

  els.toggleTreemapSize.addEventListener('click', () => {
    const expanded = els.sectorTreemapPanel.classList.toggle('treemap-expanded');
    els.toggleTreemapSize.setAttribute('aria-pressed', String(expanded));
    const labels = language === 'es'
      ? ['Ampliar mapa', 'Ajustar mapa']
      : language === 'de'
        ? ['Karte vergrößern', 'Karte anpassen']
        : ['Expand map', 'Fit map'];
    els.toggleTreemapSize.textContent = expanded ? labels[1] : labels[0];
  });

  function closeInfoTerms(except = null) {
    document.querySelectorAll('.info-term[data-open="true"]').forEach(term => {
      if (term === except) return;
      term.removeAttribute('data-open');
      term.querySelector('.info-term-trigger')?.setAttribute('aria-expanded', 'false');
    });
  }

  document.addEventListener('click', event => {
    const trigger = event.target.closest('.info-term-trigger');
    if (!trigger) {
      closeInfoTerms();
      return;
    }
    const term = trigger.closest('.info-term');
    const willOpen = term?.dataset.open !== 'true';
    closeInfoTerms(term);
    if (term) {
      if (willOpen) term.dataset.open = 'true';
      else term.removeAttribute('data-open');
      trigger.setAttribute('aria-expanded', String(willOpen));
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeInfoTerms();
  });

  updateHierarchyOptions();
  renderAll();
})();
