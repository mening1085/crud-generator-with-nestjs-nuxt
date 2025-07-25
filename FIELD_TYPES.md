# Field Types Documentation

## Supported Field Types

### Basic Types

- **string**: Regular text input field
- **number**: Numeric input field
- **boolean**: Toggle/checkbox input

### Enhanced Types

- **email**: Email input with validation and mailto links in list view
- **textarea**: Multi-line text input for longer content
- **date**: Date picker (YYYY-MM-DD format)
- **datetime**: Date and time picker (YYYY-MM-DDTHH:MM format)
- **select**: Dropdown selection with predefined options

### Numeric Types

- **integer**: Integer numbers
- **float**: Floating point numbers
- **double**: Double precision numbers
- **decimal**: Precise decimal numbers with scale and precision

## Field Configuration

### Basic Field Structure

```javascript
{
  name: 'field_name',
  type: 'field_type',
  required: true|false,
  nullable: true|false,
  unique: true|false,
  defaultValue: 'default_value'
}
```

### Select Field with Options

```javascript
{
  name: 'status',
  type: 'select',
  required: true,
  options: [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Pending', value: 'pending' }
  ]
}
```

### Date/DateTime Fields

```javascript
// Date only (YYYY-MM-DD)
{ name: 'birth_date', type: 'date', required: false }

// Date and time (YYYY-MM-DDTHH:MM)
{ name: 'created_at', type: 'datetime', required: false }
```

### Email Field

```javascript
{ name: 'email', type: 'email', required: true }
```

### Textarea Field

```javascript
{ name: 'description', type: 'textarea', required: false }
```

## Frontend Features

### Form Components

- **String/Email**: `UInput` with appropriate type
- **Number**: `UInput` with type="number" and v-model.number
- **Boolean**: `UToggle` component
- **Date**: `UInput` with type="date"
- **DateTime**: `UInput` with type="datetime-local"
- **Select**: `USelect` with options array
- **Textarea**: `UTextarea` with configurable rows

### List View Display

- **Boolean**: Colored badges (Green="Yes", Red="No")
- **Date/DateTime**: Formatted dates with localization
- **Email**: Clickable mailto links
- **Select**: Colored badges
- **Textarea**: Truncated text with tooltip
- **Regular**: Plain text display

### Data Handling

- **Date/DateTime**: Automatic ISO string conversion for API
- **Select**: Value-based storage with label display
- **Boolean**: True/false values
- **Numbers**: Proper type casting

## Backend Features

### Entity Generation

- **String/Email/Select**: `varchar` columns with appropriate length
- **Textarea**: `text` column type
- **Date**: `date` column type
- **DateTime**: `timestamp` column type
- **Number/Integer**: `int` column type
- **Float/Double**: `float` column type
- **Decimal**: `decimal` with precision and scale
- **Boolean**: `boolean` column type

### TypeScript Types

- **String types**: `string`
- **Numeric types**: `number`
- **Boolean**: `boolean`
- **Date types**: `Date`

## Examples

See the following schema files for complete examples:

- `tools/schemas/users.schema.js` - User management with email, select, date, boolean, textarea
- `tools/schemas/product.schema.js` - Product catalog with categories, dates, descriptions
- `tools/schemas/event.schema.js` - Event management with all field types

## Usage

1. Define your schema with the desired field types
2. Run the generator: `npm run plop`
3. The generator will create:
   - Backend entity with proper column types
   - Frontend form with appropriate input components
   - Frontend list with formatted display
   - API endpoints with proper validation
