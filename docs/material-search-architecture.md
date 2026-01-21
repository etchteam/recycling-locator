# Material Search Architecture

This document describes how material searches, categories, and material IDs flow through the recycling locator application.

## URL Parameters

Three URL parameters control material filtering:

| Parameter | Example | Description |
|-----------|---------|-------------|
| `materials` | `materials=28` | Single material ID |
| `materials` | `materials=1,2,3` | Comma-separated material IDs |
| `category` | `category=1` | Material category ID |
| `search` | `search=Batteries` | Display text (should match material/category name) |

**Important**: `materials` and `category` are mutually exclusive - a search uses one or the other, never both.

## Data Flow

### 1. Search Input → URL Parameters

When a user searches for a material:

```
MaterialSearchForm.tsx
  ↓
  POST /materials (with search term)
  ↓
  API returns: { id, name, type: 'LocatorMaterial' | 'LocatorMaterialCategory' }
  ↓
  If type === 'LocatorMaterialCategory' → sets `category` param
  If type === 'LocatorMaterial' → sets `materials` param
  Also sets `search` param with the material/category name
```

### 2. URL Parameters → API Calls

#### Locations API (`useLocations.ts`)
```
GET /locations/{postcode}?materials=X&category=Y&limit=30&radius=25

- Supports both `materials` and `category` params
- Supports comma-separated materials (e.g., materials=1,2,3)
- Returns locations that accept ANY of the specified materials
```

#### Material API (`useMaterial.ts`)
```
GET /materials/{id}

- Single material ID only
- Returns: { id, name, hazardous, nonRecyclable, ... }
- Returns null if no ID provided
```

#### Category API (`useCategory.ts`)
```
GET /material-categories/{id}

- Single category ID only
- Returns: { id, name, materials: [...] }
- Returns null if no ID provided
```

#### Doorstep Collections API (`useDoorstepCollections.ts`)
```
GET /doorstep-collections/{postcode}/{materialId}

- Single material ID only
- Does NOT fetch if materialId contains commas
- Does NOT fetch if materialId is null (category search)
```

### 3. Display Logic

#### Search Term Display (`useMaterialSearchTerm.ts`)

The displayed search term is derived from API data, NOT the URL `search` param:

```typescript
searchTerm = material?.data?.name ?? category?.data?.name ?? urlSearchTerm
```

This prevents URL injection where someone could craft a URL like:
`/EX32 7RB/material?materials=28&search=dogs`

The user would see "Batteries" (material 28's actual name), not "dogs".

**For comma-separated materials**: Only the first material ID is used for display purposes.

## Page-Specific Behavior

### Material Results Page (`/[postcode]/material`)

| Feature | Material Search | Category Search | Multi-Material |
|---------|-----------------|-----------------|----------------|
| Search term display | ✅ Material name | ✅ Category name | ✅ First material name |
| Locations | ✅ | ✅ | ✅ |
| Home recycling | ✅ | ✅ | ✅ |
| Doorstep collections | ✅ | ❌ | ❌ |
| Tips | ✅ | ❌ | ❌ |
| Hazardous warning | ✅ | ❌ | ✅ (first material) |
| Non-recyclable warning | ✅ | ❌ | ✅ (first material) |

### Places Page (`/[postcode]/places`)

| Feature | Material Search | Category Search | Multi-Material |
|---------|-----------------|-----------------|----------------|
| Search term display | ✅ Material name | ✅ Category name | ✅ First material name |
| Locations list | ✅ | ✅ | ✅ |
| Map | ✅ | ✅ | ✅ |

### Material Start Page (`/material`)

Entry point for external links with pre-filled material/category:

```
/material?materials=28                    → Fetches material name
/material?category=1                      → Fetches category name
/material?materials=28&search=Batteries   → Uses search param (validated by fetch)
```

## Client-Side Filtering

### Container Material Matching (`containerHasMaterial.ts`)

Used for filtering home recycling containers:

```typescript
// For materials param (supports comma-separated)
materials.split(',').includes(String(material.id))

// For category param
material.category.id == category
```

### Properties Filtering (`getPropertiesByMaterial.ts`)

Filters local authority properties that accept the material/category:

```typescript
getPropertiesByMaterial(properties, { materials, category })
```

## Key Hooks

| Hook | Purpose | Supports Category | Supports Multi-Material |
|------|---------|-------------------|------------------------|
| `useMaterialSearchTerm` | Derives display search term | ✅ | ✅ (first only) |
| `useMaterial` | Fetches single material data | ❌ | ❌ |
| `useCategory` | Fetches single category data | ✅ | N/A |
| `useMaterials` | Fetches all materials (A-Z list) | N/A | N/A |
| `useLocations` | Fetches nearby locations | ✅ | ✅ |
| `useDoorstepCollections` | Fetches doorstep collection options | ❌ | ❌ |
| `useTip` | Fetches contextual tips | ❌ | ❌ |

## Analytics

Analytics events use the derived `searchTerm` (not URL param) to prevent injection:

```typescript
// Material results page
recordEvent({
  category: 'MaterialResult::MaterialSearch',
  action: searchTerm,  // Derived from API, not URL
});

// Places page
recordEvent({
  category: `PlacesList::MaterialSearch::${showLocations ? '' : 'Empty'}`,
  action: searchTerm,  // Derived from API, not URL
});
```

## Known Limitations

1. **Category searches** don't show:
  - Doorstep collection options
  - Material-specific tips
  - Hazardous/non-recyclable warnings

  This is intentional - categories contain multiple materials with potentially different properties.

2. **Multi-material searches** (comma-separated):
  - Display only the first material's name
  - Only fetch first material's hazardous/nonRecyclable status
  - Don't fetch doorstep collections or tips
  - Location filtering works correctly for all materials

3. **The `search` URL param** is kept for:
  - Fallback display when material/category fetch fails
  - SEO/sharing purposes
  - But should not be trusted for display without validation
