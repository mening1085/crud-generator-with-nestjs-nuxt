# CRUD Generator : NestJS + Nuxt3

This project is a tool for automatically generating CRUD (Create, Read, Update, Delete) code, supporting both Backend (NestJS) and Frontend (Nuxt3).

## Installation

```bash
npm install
```

## Main File Structure

```
crud-generator/
├── crud-gen-backend/      # NestJS (Backend) code
├── crud-gen-frontend/     # Nuxt3 (Frontend) code
├── tools/
│   ├── schemas/           # Example schemas for generation
│   └── templates/         # Templates for file generation
├── plopfile.js            # Generator logic configuration
├── package.json           # Main dependencies
└── README.md
```

- **crud-gen-backend/** : Backend code (NestJS)
- **crud-gen-frontend/** : Frontend code (Nuxt3)
- **tools/schemas/** : Store schema files for generation (recommended to create new schemas here)
- **tools/templates/** : Store templates for generating various files
- **plopfile.js** : Define the logic and flow of the generator
- **package.json** : Main project dependencies

## Usage

1. Create the desired schema file in `tools/schemas/`, for example:

```js
// tools/schemas/product.js
module.exports = {
  name: "product",
  fields: [
    { name: "title", type: "string", required: true },
    { name: "price", type: "number", required: true },
    { name: "isActive", type: "boolean", required: false },
  ],
};
```

2. Run the plop command to start the generator

```bash
npx plop
```

3. Choose whether to Create or Delete
4. Specify the destination
5. Select the schema name to generate
6. The generated files will be in the specified folder

## Example Usage

```bash
npx plop
# Select "create crud"
# Specify the destination
# Select the schema name to generate (e.g., product)
# The system will automatically generate CRUD files
```

## Prerequisites

- Node.js
- npm

---

## [NEW] Web UI + API CRUD Generator (React + Tailwind + Express.js)

The system will be enhanced with 2 new components:

- **/backend/** : Express.js API for receiving/saving schemas, generating, and deleting CRUD
- **/frontend/** : React + Tailwind UI for schema input, selecting generate/delete CRUD operations

### Workflow

1. Users input schema or select existing schemas through the web interface
2. Click generate/delete CRUD buttons instantly
3. Express API will save the schema as a file and execute CRUD generation using existing logic (plop)

### New File Structure

```
/backend/         <-- Express API
/frontend/        <-- React + Tailwind
/tools/schemas/   <-- Shared schemas
```

---
