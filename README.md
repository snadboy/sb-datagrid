# sb-datagrid

A lightweight, flexible DataGrid library for web applications with built-in theming support.

## Features

- Column sorting, resizing, and reordering
- Multiple built-in themes (light, dark, compact, bordered)
- Custom cell renderers
- Mixed unit support (px, fr, %)
- Framework agnostic
- Bootstrap integration ready

## Installation

### CDN

```html
<!-- CSS -->
<link rel="stylesheet" href="https://snadboy.github.io/sb-datagrid/css/datagrid.css">

<!-- JavaScript -->
<script src="https://snadboy.github.io/sb-datagrid/js/datagrid.js"></script>
```

### Local Installation

Download the files from the repository and include them in your project:

```html
<link rel="stylesheet" href="path/to/datagrid.css">
<script src="path/to/datagrid.js"></script>
```

## Basic Usage

```javascript
const grid = new DataGrid('#my-grid', {
    columns: [
        { field: 'id', header: 'ID', width: '100px' },
        { field: 'name', header: 'Name', width: '2fr' },
        { field: 'status', header: 'Status', width: '150px' }
    ],
    data: [
        { id: 1, name: 'John Doe', status: 'active' },
        { id: 2, name: 'Jane Smith', status: 'inactive' }
    ],
    theme: 'bordered'
});
```

## Themes

sb-datagrid includes several built-in themes that can be used individually or combined:

### Available Themes

- **Default** (no theme specified): Clean, minimal styling
- **`dark`**: Dark background with light text
- **`compact`**: Reduced padding for denser data display
- **`bordered`**: Adds borders between cells and around the grid

### Theme Combinations

Themes can be combined by separating them with spaces:

```javascript
// Dark theme with borders
grid.setTheme('dark bordered');

// Compact dark theme
grid.setTheme('dark compact');

// All themes combined
grid.setTheme('dark compact bordered');
```

### Dynamic Theme Switching

Change themes at runtime using the `setTheme()` method:

```javascript
// Switch to dark theme
grid.setTheme('dark bordered');

// Switch back to light theme
grid.setTheme('bordered');
```

## Custom Cell Renderers

Custom cell renderers allow you to control how cell content is displayed. When creating custom renderers, follow these best practices to maintain theme compatibility:

### Best Practices for Theme-Compatible Renderers

#### 1. Use CSS Classes Instead of Inline Styles

**Good:**
```javascript
renderer: function(value, row, column) {
    if (value === 'active') {
        return '<span class="status-active">Active</span>';
    }
    return '<span class="status-inactive">Inactive</span>';
}
```

```css
.status-active { color: #28a745; }
.status-inactive { color: #dc3545; }

/* Theme-specific overrides */
.datagrid-dark .status-active { color: #5dd879; }
.datagrid-dark .status-inactive { color: #ff6b6b; }
```

**Avoid:**
```javascript
renderer: function(value, row, column) {
    // Hard-coded colors won't adapt to themes
    return `<span style="color: #28a745">${value}</span>`;
}
```

#### 2. Leverage CSS Custom Properties

Define theme-aware colors using CSS custom properties:

```css
:root {
    --status-success: #28a745;
    --status-danger: #dc3545;
    --status-warning: #ffc107;
}

.datagrid-dark {
    --status-success: #5dd879;
    --status-danger: #ff6b6b;
    --status-warning: #ffd93d;
}
```

```javascript
renderer: function(value, row, column) {
    return `<span class="status-${value.toLowerCase()}">${value}</span>`;
}
```

#### 3. Use Framework Classes (Bootstrap, Tailwind, etc.)

If using a CSS framework, leverage its utility classes:

```javascript
renderer: function(value, row, column) {
    if (value === 'connected') {
        return '<span class="badge bg-success">Connected</span>';
    } else if (value === 'error') {
        return '<span class="badge bg-danger">Error</span>';
    }
    return '<span class="badge bg-secondary">Unknown</span>';
}
```

#### 4. Detect Theme in Renderer

For dynamic styling based on the current theme:

```javascript
renderer: function(value, row, column) {
    const isDark = document.querySelector('.datagrid-dark') !== null;
    const color = isDark ? '#5dd879' : '#28a745';
    
    return `<span class="status" style="color: ${color}">${value}</span>`;
}
```

#### 5. Use Semantic HTML with CSS

Let CSS handle the styling based on semantic HTML:

```javascript
renderer: function(value, row, column) {
    if (value > 90) {
        return `<strong class="high-value">${value}%</strong>`;
    } else if (value > 50) {
        return `<span class="medium-value">${value}%</span>`;
    } else {
        return `<span class="low-value">${value}%</span>`;
    }
}
```

```css
.high-value { color: var(--bs-success, #28a745); font-weight: bold; }
.medium-value { color: var(--bs-warning, #ffc107); }
.low-value { color: var(--bs-danger, #dc3545); }

/* Automatic theme adaptation with Bootstrap */
[data-bs-theme="dark"] .high-value { color: var(--bs-success); }
[data-bs-theme="dark"] .medium-value { color: var(--bs-warning); }
[data-bs-theme="dark"] .low-value { color: var(--bs-danger); }
```

### Example: Complete Theme-Aware Renderer

```javascript
const grid = new DataGrid('#my-grid', {
    columns: [
        {
            field: 'status',
            header: 'Status',
            renderer: function(value, row, column) {
                // Use semantic classes that work with any theme
                const statusClass = `status-${value.toLowerCase().replace(/\s+/g, '-')}`;
                const iconClass = getStatusIcon(value);
                
                return `
                    <span class="status-badge ${statusClass}">
                        <i class="${iconClass}"></i>
                        ${value}
                    </span>
                `;
            }
        }
    ],
    theme: 'dark bordered'
});

function getStatusIcon(status) {
    const icons = {
        'connected': 'icon-check-circle',
        'connecting': 'icon-clock',
        'error': 'icon-exclamation',
        'offline': 'icon-x-circle'
    };
    return icons[status.toLowerCase()] || 'icon-question';
}
```

## Framework Integration

### Flask

sb-datagrid works seamlessly with Flask applications:

```python
# Flask route
@app.route('/data')
def get_data():
    data = fetch_from_database()
    return render_template('grid.html', data=json.dumps(data))
```

```html
<!-- Flask template -->
<div id="my-grid"></div>

<script>
const grid = new DataGrid('#my-grid', {
    columns: [...],
    data: {{ data|safe }},
    theme: 'bordered'
});
</script>
```

### React

```jsx
import { useEffect, useRef } from 'react';

function DataGridComponent({ data, columns }) {
    const gridRef = useRef(null);
    const gridInstance = useRef(null);
    
    useEffect(() => {
        gridInstance.current = new DataGrid(gridRef.current, {
            columns,
            data,
            theme: 'bordered'
        });
        
        return () => {
            if (gridInstance.current) {
                gridInstance.current.destroy();
            }
        };
    }, []);
    
    useEffect(() => {
        if (gridInstance.current) {
            gridInstance.current.setData(data);
        }
    }, [data]);
    
    return <div ref={gridRef}></div>;
}
```

### Vue

```vue
<template>
    <div ref="grid"></div>
</template>

<script>
export default {
    props: ['data', 'columns'],
    mounted() {
        this.gridInstance = new DataGrid(this.$refs.grid, {
            columns: this.columns,
            data: this.data,
            theme: 'bordered'
        });
    },
    watch: {
        data(newData) {
            this.gridInstance.setData(newData);
        }
    },
    beforeUnmount() {
        if (this.gridInstance) {
            this.gridInstance.destroy();
        }
    }
}
</script>
```

## Column Configuration

### Width Units

sb-datagrid supports multiple unit types for column widths:

- **Pixels (`px`)**: Fixed width columns
- **Fractional units (`fr`)**: Flexible columns that share available space
- **Percentages (`%`)**: Percentage of container width

```javascript
columns: [
    { field: 'id', header: 'ID', width: '80px' },      // Fixed 80px
    { field: 'name', header: 'Name', width: '2fr' },   // Takes 2 parts of available space
    { field: 'email', header: 'Email', width: '3fr' }, // Takes 3 parts of available space
    { field: 'actions', header: 'Actions', width: '15%' } // 15% of container
]
```

## API Reference

### Constructor Options

```javascript
new DataGrid(selector, options)
```

- `selector`: CSS selector or DOM element
- `options`: Configuration object
  - `columns`: Array of column definitions
  - `data`: Array of data objects
  - `theme`: Theme string (e.g., 'dark bordered')
  - `sortable`: Enable sorting (default: true)
  - `resizable`: Enable column resizing (default: true)
  - `reorderable`: Enable column reordering (default: true)
  - `selectable`: Enable row selection (default: false)

### Methods

- `setData(data)`: Update grid data
- `getData()`: Get current data
- `setTheme(theme)`: Change grid theme
- `sort(field, direction)`: Sort by field ('asc' or 'desc')
- `refresh()`: Refresh the grid display
- `destroy()`: Clean up and remove the grid

### Events

```javascript
const grid = new DataGrid('#my-grid', {
    onSort: function(column, direction) {
        console.log('Sorted:', column.field, direction);
    },
    onResize: function(columnIndex, newWidth) {
        console.log('Resized column:', columnIndex, newWidth);
    },
    onReorder: function(fromIndex, toIndex, columns) {
        console.log('Reordered:', fromIndex, 'to', toIndex);
    },
    onCellClick: function(row, column, cell) {
        console.log('Cell clicked:', row, column.field);
    }
});
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - see LICENSE file for details