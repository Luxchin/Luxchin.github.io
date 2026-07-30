STVDIØ CTCN Technology Atlas v8

CTCN TECHNOLOGY ATLAS — FIRST WORKING VERSION
=============================================

Main page
---------
technology-atlas.html

Files added
-----------
atlas.css
atlas.js
data/ctcn-data.js
es/atlas-tecnologico.html

Data boundary
-------------
The interface uses the 458 records from:
CTCN_Tabla_Completa_Campos_Desarrollados.xlsx

All counts and percentages are calculated in the browser from the active
selection. No visual indicator uses an external estimate.

Publication on GitHub Pages
---------------------------
1. Copy the contents of this folder into the root of the GitHub Pages repository.
2. Preserve the directory structure, especially data/ctcn-data.js.
3. Commit and push the files.
4. Open: https://<user>.github.io/<repository>/technology-atlas.html

Local preview
-------------
Opening technology-atlas.html directly works because the data are loaded as a
JavaScript file. A local server can also be used:

python -m http.server 8000

Then open:
http://localhost:8000/technology-atlas.html

Version scope
-------------
- English interface
- Spanish URL redirects to the English first version
- Filters: search, branch, sector, hard/soft nature and clean technology
- Dynamic KPIs and percentages
- Branch distribution
- Sector distribution
- Four typology distributions
- Paginated explorer
- Full technology profile panel

The original STVDIØ pages and visual language were retained as the design guide.


VERSION 2 ADJUSTMENTS
---------------------
- Cascading Branch → Sector → Technology group filters.
- Filters for flexible/fixed, hard/soft, equipment/operation/product and clean technology.
- Aspect and requirement search across hardware, software, orgware, infrastructure, energy, materials and supplies.
- Global search now includes all analytical fields; terms such as lithium return related technologies.
- Click chart categories to apply or remove filters. Active filters appear as removable chips.
- Generic non-AI placeholder image included for every technology until verified real photographs are assigned.


Version 3 adjustments:
- Strict Branch > Sector > Technology group hierarchy.
- Removed typology and aspect-content filters.
- Global search includes all analytical fields.
- Classification attributes moved into Explorer.
- Full-width technology profile below Explorer.


VERSION 4 CHANGES
-----------------
- Removed the Technology classification explanation block from the technology detail.
- Classification fields remain visible only in the Explorer table.
- Sector bars now use the true percentage of the active scope, not a relative-to-maximum visual scale.
- The sector chart shows its denominator and a dynamic caption.
- The sector comparison excludes the sector filter itself so comparison remains visible after selecting a sector.


VERSION 5
- Fixed sector-bar rendering by making the percentage fill a block element.
- Removed divider lines and excessive spacing between technology aspects and associated requirements.

VERSION 6
---------
- The upper filter toolbar now contains only the complete-record search.
- Visible records, Mitigation, Adaptation and Sectors represented are compact interactive cards.
- Branch, Sector and Technology group are controlled through hierarchical clickable options below the KPI cards.
- Changing Branch clears Sector and Technology group; changing Sector clears Technology group.
- Clicking Visible records clears the taxonomy hierarchy while preserving the current text search.


V8 adjustments:
- The sector-chip filter was removed.
- The taxonomy treemap is now the sole sector selector.
- Clicking a treemap sector updates the Technology group options.
- Clicking the active sector again restores all groups compatible with the active branch.


VERSION 9
---------
Technology group filters only 03 / Explorer. It no longer changes the sector treemap, its percentages or denominator.

VERSION 18
----------
- Removed the remaining top spacing and divider above Associated requirements and dependencies.


V19
- Reduced the full vertical gap between Technology aspects and Associated requirements.
- Removed the horizontal separator above Associated requirements.
- Removed the trailing horizontal separator at the bottom of the technology profile.

V20
- Rebuilt dashboard data from the expanded IIASA and raw-material workbook.
- Infrastructure, energy, materials/inputs and supplies/spares are now subindices inside Hardware, Software and Orgware.
- Removed the separate Associated requirements block.
- Added a raw-material and geographic supply-context section to each technology profile.
- Global search now includes all new IIASA subindices, raw materials and country fields.

V21
- Added an interactive world map to the selected technology profile.
- Countries are highlighted as extraction/production, refining/processing, or both.
- The map updates automatically whenever a different technology is selected.
- Plotly is bundled locally under vendor/plotly.min.js.

V22
- Added locally stored, standardised real-photograph support.
- Standard image size: 1200 × 675 px, compressed JPEG.
- Added visible source, author and licence under each photograph.
- Added a Wikimedia Commons downloader restricted to reusable photographs.
- No AI-generated images are used.

V23
- Complete application package.
- Replaced first-result image selection with relevance scoring.
- Searches exact technology terms before fallback queries.
- Evaluates Wikimedia title, description and categories.
- Rejects maps, diagrams, illustrations and low-relevance results.
- Adds image-review.csv for human approval.
- Adds a reset utility for prior automatic image selections.

V24 — PLACEHOLDER ONLY
- Removed all automatically selected technology photographs.
- Removed the automatic Wikimedia image downloader.
- Reset the image manifest to a single placeholder.
- The atlas is ready for manually curated photographs later.
