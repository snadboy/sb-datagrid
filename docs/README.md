# 📊 sb-datagrid

A lightweight, customizable, and feature-rich JavaScript data grid component with resizable columns, sorting, drag-and-drop column reordering, and more.

## ✨ Features

- ✅ **Resizable columns** with drag-and-drop
- ✅ **Reorderable columns** (drag headers to rearrange)
- ✅ **Auto-size columns** (double-click headers or borders)
- ✅ **Column sorting** (ascending/descending)
- ✅ **Row selection** (single, multi, and range selection)
- ✅ **Custom cell renderers**
- ✅ **Theming support** (light, dark, compact, bordered)
- ✅ **Responsive design**
- ✅ **Event callbacks** for interaction
- ✅ **Dynamic data updates**
- ✅ **Lightweight and performant**

## 🚀 Quick Start

### CDN

```html
<!-- CSS -->
<link rel="stylesheet" href="https://snadboy.github.io/sb-datagrid/css/datagrid.css">

<!-- JavaScript -->
<script src="https://snadboy.github.io/sb-datagrid/js/datagrid.js"></script>
```

### Basic Usage

```html
<div id="my-grid"></div>

<script>
const data = [
    { id: 1, name: 'John Smith', position: 'Software Engineer', department: 'Engineering', salary: '$95,000' },
    { id: 2, name: 'Sarah Johnson', position: 'Product Manager', department: 'Product', salary: '$110,000' },
    { id: 3, name: 'Michael Chen', position: 'UX Designer', department: 'Design', salary: '$85,000' }
];

const grid = new DataGrid('#my-grid', {
    columns: [
        { field: 'id', header: 'ID', width: '80px' },
        { field: 'name', header: 'Name' },
        { field: 'position', header: 'Position' },
        { field: 'department', header: 'Department' },
        { field: 'salary', header: 'Salary' }
    ],
    data: data
});
</script>
```

## 📖 Documentation & Examples

Visit the [live demo and documentation](https://snadboy.github.io/sb-datagrid/) to see all features in action.

## 🎛️ Configuration Options

```javascript
new DataGrid(container, {
    columns: [],           // Array of column definitions
    data: [],             // Array of data objects
    resizable: true,      // Enable column resizing
    sortable: true,       // Enable column sorting
    selectable: false,    // Enable row selection
    reorderable: true,    // Enable column reordering
    theme: '',           // Theme class (dark, compact, bordered)
    minColumnWidth: 50,   // Minimum column width in pixels
    maxColumnWidth: null, // Maximum column width in pixels
    onSort: function(column, direction) {},      // Sort callback
    onSelect: function(selectedRows) {},         // Selection callback
    onResize: function(columnIndex, newWidth) {}, // Resize callback
    onReorder: function(fromIndex, toIndex, columns) {}, // Reorder callback
    onCellClick: function(row, column, cell) {},  // Cell click callback
    onCellDoubleClick: function(row, column, cell) {} // Cell double-click callback
});
```

## 📋 Column Definition

```javascript
{
    field: 'fieldName',        // Data field name
    header: 'Column Header',   // Display header text
    width: '150px',           // Initial width (px or fr)
    sortable: true,           // Enable sorting for this column
    resizable: true,          // Enable resizing for this column
    renderer: function(value, row, column) {}, // Custom cell renderer
    sorter: function(a, b, direction) {}      // Custom sort function
}
```

## 🎯 API Methods

```javascript
grid.setData(data)           // Update grid data
grid.addRow(row)            // Add a new row
grid.removeRow(index)        // Remove row by index
grid.updateRow(index, row)   // Update row data
grid.getSelectedRows()       // Get selected row data
grid.clearSelection()        // Clear all selections
grid.autoSizeColumn(index)   // Auto-size a specific column
grid.setTheme(theme)        // Change grid theme dynamically
grid.showSelectedOnly()     // Filter to show only selected rows
grid.showAll()              // Show all rows (clear filter)
grid.isFiltered()           // Check if grid is filtered
grid.refresh()              // Refresh the grid
grid.destroy()              // Destroy the grid instance
```

## 🔧 Framework Integration

sb-datagrid is a framework-agnostic JavaScript library that works seamlessly with any backend or frontend framework. Since it's a pure client-side component, you can integrate it into any web application regardless of your technology stack.

### Compatibility Overview

- ✅ **Backend Frameworks**: Flask, Django, Express.js, Rails, Spring Boot, ASP.NET, etc.
- ✅ **Frontend Frameworks**: React, Vue.js, Angular, Svelte, etc.  
- ✅ **Static Sites**: Plain HTML, Jekyll, Hugo, etc.
- ✅ **Build Tools**: Webpack, Vite, Parcel, Rollup, etc.
- ✅ **Module Systems**: ES6 modules, CommonJS, AMD, UMD

### Backend Integration

#### Flask (Python)

Perfect for Python web applications using Flask:

```python
# app.py
from flask import Flask, jsonify, render_template
import json

app = Flask(__name__)

@app.route('/')
def dashboard():
    return render_template('dashboard.html')

@app.route('/api/employees')
def get_employees():
    # Your data logic here
    employees = [
        {"id": 1, "name": "John Smith", "position": "Engineer", "salary": 95000},
        {"id": 2, "name": "Sarah Johnson", "position": "Manager", "salary": 110000},
    ]
    return jsonify(employees)

@app.route('/api/employees', methods=['POST'])
def add_employee():
    # Handle POST request for adding new employees
    employee_data = request.get_json()
    # Process and save employee_data
    return jsonify({"success": True, "id": new_employee_id})
```

```html
<!-- templates/dashboard.html -->
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="https://snadboy.github.io/sb-datagrid/css/datagrid.css">
</head>
<body>
    <div id="employee-grid"></div>
    
    <script src="https://snadboy.github.io/sb-datagrid/js/datagrid.js"></script>
    <script>
        let employeeGrid;
        
        async function loadEmployees() {
            try {
                const response = await fetch('/api/employees');
                const employees = await response.json();
                
                employeeGrid = new DataGrid('#employee-grid', {
                    columns: [
                        { field: 'id', header: 'ID', width: '80px' },
                        { field: 'name', header: 'Name', sortable: true },
                        { field: 'position', header: 'Position', sortable: true },
                        { field: 'salary', header: 'Salary', sortable: true,
                          renderer: (value) => `$${value.toLocaleString()}`
                        }
                    ],
                    data: employees,
                    selectable: true,
                    onCellClick: (row, column, cell) => {
                        console.log('Employee clicked:', row);
                    }
                });
            } catch (error) {
                console.error('Failed to load employees:', error);
            }
        }
        
        // Load data when page loads
        document.addEventListener('DOMContentLoaded', loadEmployees);
    </script>
</body>
</html>
```

#### Django (Python)

Integration with Django follows similar patterns:

```python
# views.py
from django.http import JsonResponse
from django.shortcuts import render
from .models import Employee

def dashboard(request):
    return render(request, 'dashboard.html')

def employee_api(request):
    if request.method == 'GET':
        employees = list(Employee.objects.values(
            'id', 'name', 'position', 'salary'
        ))
        return JsonResponse(employees, safe=False)
    
    elif request.method == 'POST':
        # Handle employee creation
        data = json.loads(request.body)
        employee = Employee.objects.create(**data)
        return JsonResponse({'success': True, 'id': employee.id})
```

```python
# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('api/employees/', views.employee_api, name='employee_api'),
]
```

#### Express.js (Node.js)

For Node.js applications:

```javascript
// server.js
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(express.json());

// Sample data (replace with database)
let employees = [
    { id: 1, name: "John Smith", position: "Engineer", salary: 95000 },
    { id: 2, name: "Sarah Johnson", position: "Manager", salary: 110000 }
];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/employees', (req, res) => {
    res.json(employees);
});

app.post('/api/employees', (req, res) => {
    const newEmployee = {
        id: employees.length + 1,
        ...req.body
    };
    employees.push(newEmployee);
    res.json({ success: true, employee: newEmployee });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```

### Frontend Framework Integration

#### React

```jsx
import React, { useEffect, useRef, useState } from 'react';

const DataGridComponent = ({ data, onSelectionChange }) => {
    const gridRef = useRef(null);
    const [grid, setGrid] = useState(null);
    
    useEffect(() => {
        // Load CSS dynamically if not already loaded
        if (!document.querySelector('link[href*="datagrid.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://snadboy.github.io/sb-datagrid/css/datagrid.css';
            document.head.appendChild(link);
        }
        
        // Initialize grid
        const newGrid = new DataGrid(gridRef.current, {
            columns: [
                { field: 'id', header: 'ID', width: '80px' },
                { field: 'name', header: 'Name', sortable: true },
                { field: 'position', header: 'Position', sortable: true }
            ],
            data: data,
            selectable: true,
            onSelect: (selectedRows) => {
                if (onSelectionChange) {
                    onSelectionChange(selectedRows);
                }
            }
        });
        
        setGrid(newGrid);
        
        // Cleanup
        return () => {
            if (newGrid) {
                newGrid.destroy();
            }
        };
    }, []);
    
    useEffect(() => {
        if (grid && data) {
            grid.setData(data);
        }
    }, [grid, data]);
    
    return <div ref={gridRef} style={{ height: '400px' }}></div>;
};

// Usage in a React component
const EmployeeDashboard = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    
    useEffect(() => {
        fetch('/api/employees')
            .then(res => res.json())
            .then(setEmployees)
            .catch(console.error);
    }, []);
    
    return (
        <div>
            <h1>Employee Dashboard</h1>
            <DataGridComponent 
                data={employees}
                onSelectionChange={setSelectedEmployees}
            />
            {selectedEmployees.length > 0 && (
                <p>Selected: {selectedEmployees.map(emp => emp.name).join(', ')}</p>
            )}
        </div>
    );
};

export default EmployeeDashboard;
```

#### Vue.js

```vue
<template>
  <div>
    <div ref="gridContainer" class="grid-container"></div>
    <div v-if="selectedRows.length" class="selection-info">
      Selected: {{ selectedRows.map(r => r.name).join(', ') }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataGridComponent',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      grid: null,
      selectedRows: []
    };
  },
  async mounted() {
    // Load CSS if not present
    if (!document.querySelector('link[href*="datagrid.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://snadboy.github.io/sb-datagrid/css/datagrid.css';
      document.head.appendChild(link);
    }
    
    // Wait for CSS to load, then initialize grid
    await new Promise(resolve => setTimeout(resolve, 100));
    
    this.grid = new DataGrid(this.$refs.gridContainer, {
      columns: this.columns,
      data: this.data,
      selectable: true,
      onSelect: (selectedRows) => {
        this.selectedRows = selectedRows;
        this.$emit('selection-change', selectedRows);
      }
    });
  },
  beforeDestroy() {
    if (this.grid) {
      this.grid.destroy();
    }
  },
  watch: {
    data: {
      handler(newData) {
        if (this.grid) {
          this.grid.setData(newData);
        }
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.grid-container {
  height: 400px;
}
.selection-info {
  margin-top: 10px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
}
</style>
```

#### Angular

```typescript
// data-grid.component.ts
import { Component, ElementRef, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges } from '@angular/core';

declare var DataGrid: any;

@Component({
  selector: 'app-data-grid',
  template: '<div #gridContainer class="data-grid-container"></div>',
  styleUrls: ['./data-grid.component.css']
})
export class DataGridComponent implements OnInit, OnDestroy, OnChanges {
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Input() selectable: boolean = false;
  @Output() selectionChange = new EventEmitter<any[]>();
  
  private grid: any;
  
  constructor(private elementRef: ElementRef) {}
  
  ngOnInit() {
    this.loadCssAndInitialize();
  }
  
  ngOnChanges(changes: any) {
    if (changes.data && this.grid) {
      this.grid.setData(this.data);
    }
  }
  
  ngOnDestroy() {
    if (this.grid) {
      this.grid.destroy();
    }
  }
  
  private async loadCssAndInitialize() {
    // Load CSS if not present
    if (!document.querySelector('link[href*="datagrid.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://snadboy.github.io/sb-datagrid/css/datagrid.css';
      document.head.appendChild(link);
      
      // Wait for CSS to load
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const container = this.elementRef.nativeElement.querySelector('.data-grid-container');
    this.grid = new DataGrid(container, {
      columns: this.columns,
      data: this.data,
      selectable: this.selectable,
      onSelect: (selectedRows: any[]) => {
        this.selectionChange.emit(selectedRows);
      }
    });
  }
}
```

```typescript
// employee.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = '/api/employees';
  
  constructor(private http: HttpClient) {}
  
  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
```

### Static HTML Integration

For simple static websites:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Static Data Grid Example</title>
    <link rel="stylesheet" href="https://snadboy.github.io/sb-datagrid/css/datagrid.css">
</head>
<body>
    <h1>My Data Grid</h1>
    <div id="static-grid"></div>
    
    <script src="https://snadboy.github.io/sb-datagrid/js/datagrid.js"></script>
    <script>
        // Static data
        const staticData = [
            { id: 1, name: 'John Smith', position: 'Software Engineer', salary: 95000 },
            { id: 2, name: 'Sarah Johnson', position: 'Product Manager', salary: 110000 },
            { id: 3, name: 'Michael Chen', position: 'UX Designer', salary: 85000 }
        ];
        
        // Initialize grid with static data
        const grid = new DataGrid('#static-grid', {
            columns: [
                { field: 'id', header: 'ID', width: '80px' },
                { field: 'name', header: 'Name', sortable: true },
                { field: 'position', header: 'Position', sortable: true },
                { field: 'salary', header: 'Salary', sortable: true,
                  renderer: (value) => `$${value.toLocaleString()}`
                }
            ],
            data: staticData,
            theme: 'bordered',
            selectable: true
        });
    </script>
</body>
</html>
```

## 🎨 Themes

Apply themes by adding a class to the theme option:

```javascript
// Dark theme
new DataGrid('#grid', { theme: 'dark', ... });

// Compact theme
new DataGrid('#grid', { theme: 'compact', ... });

// Bordered theme
new DataGrid('#grid', { theme: 'bordered', ... });

// Multiple themes
new DataGrid('#grid', { theme: 'dark compact', ... });
```

## 🖱️ Selection Modes

- **Click**: Select a single row
- **Ctrl/Cmd+Click**: Add/remove individual rows to selection
- **Shift+Click**: Select a range of rows
- **Ctrl/Cmd+Shift+Click**: Add a range to existing selection

## ⚠️ Gotchas & Best Practices

### Common Integration Issues

#### 1. CSS Loading Order
**Problem**: Grid appears unstyled or has layout issues.

```javascript
// ❌ BAD - Initializing grid immediately
const grid = new DataGrid('#container', options);

// ✅ GOOD - Wait for CSS to load
document.addEventListener('DOMContentLoaded', () => {
    // Ensure CSS is loaded before initializing
    const grid = new DataGrid('#container', options);
});

// ✅ GOOD - For dynamic loading
function loadGridCSS() {
    return new Promise((resolve) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'path/to/datagrid.css';
        link.onload = resolve;
        document.head.appendChild(link);
    });
}

async function initGrid() {
    await loadGridCSS();
    const grid = new DataGrid('#container', options);
}
```

#### 2. Container Size Issues
**Problem**: Grid appears collapsed or doesn't size properly.

```css
/* ✅ GOOD - Ensure container has defined height */
.grid-container {
    height: 400px; /* or use vh, %, etc */
    width: 100%;
}
```

```javascript
// ❌ BAD - Container has no height
<div id="grid"></div>

// ✅ GOOD - Container with proper sizing
<div id="grid" style="height: 400px;"></div>
```

#### 3. Framework-Specific Memory Leaks
**Problem**: Grid instances persist after component unmounting.

```javascript
// ✅ React - Proper cleanup
useEffect(() => {
    const grid = new DataGrid(containerRef.current, options);
    return () => grid.destroy(); // Cleanup on unmount
}, []);

// ✅ Vue - Proper cleanup
beforeDestroy() {
    if (this.grid) {
        this.grid.destroy();
    }
}

// ✅ Angular - Proper cleanup
ngOnDestroy() {
    if (this.grid) {
        this.grid.destroy();
    }
}
```

### Security Considerations

#### 1. XSS Prevention with Custom Renderers
**Problem**: User data in custom renderers can execute malicious scripts.

```javascript
// ❌ BAD - Direct HTML insertion (XSS vulnerable)
{
    field: 'description',
    renderer: (value) => `<div>${value}</div>` // Dangerous!
}

// ✅ GOOD - Escape HTML content
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

{
    field: 'description',
    renderer: (value) => `<div>${escapeHtml(value)}</div>`
}

// ✅ BETTER - Use DOM methods instead of HTML strings
{
    field: 'description',
    renderer: (value, row, column) => {
        const div = document.createElement('div');
        div.textContent = value; // Automatically escapes
        return div.outerHTML;
    }
}
```

#### 2. Content Security Policy (CSP)
If your site uses CSP headers, you might need to adjust them:

```html
<!-- Add to CSP if using CDN -->
<meta http-equiv="Content-Security-Policy" 
      content="style-src 'self' https://snadboy.github.io; 
               script-src 'self' https://snadboy.github.io;">
```

### Performance Optimization

#### 1. Large Dataset Handling
```javascript
// ✅ For datasets > 1000 rows, consider pagination or virtual scrolling
const grid = new DataGrid('#grid', {
    data: largeDataset.slice(0, 100), // Show first 100 rows
    // Implement pagination controls separately
});

// ✅ Use efficient renderers for better performance
{
    field: 'status',
    renderer: (value) => {
        // Simple string operations are faster than complex DOM creation
        return value === 'active' 
            ? '<span style="color: green;">●</span>' 
            : '<span style="color: red;">●</span>';
    }
}
```

#### 2. Memory Management
```javascript
// ✅ Clear references when done
let grid = new DataGrid('#container', options);

// When no longer needed:
grid.destroy();
grid = null; // Help garbage collection
```

#### 3. Efficient Data Updates
```javascript
// ❌ BAD - Recreating grid for data changes
grid.destroy();
grid = new DataGrid('#container', { ...options, data: newData });

// ✅ GOOD - Update existing grid
grid.setData(newData);

// ✅ GOOD - For single row changes
grid.updateRow(index, updatedRowData);
grid.addRow(newRowData);
grid.removeRow(index);
```

### CORS and API Integration

#### Common CORS Issues
```javascript
// ✅ Handle CORS properly in your backend
// Flask example:
from flask_cors import CORS
app = Flask(__name__)
CORS(app, origins=['https://yourdomain.com'])

// Express.js example:
const cors = require('cors');
app.use(cors({
    origin: 'https://yourdomain.com'
}));
```

#### Error Handling
```javascript
// ✅ Always handle API errors gracefully
async function loadData() {
    try {
        const response = await fetch('/api/data');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        grid.setData(data);
    } catch (error) {
        console.error('Failed to load data:', error);
        // Show user-friendly error message
        grid.setData([]);
    }
}
```

### Build Tool Integration

#### Webpack/Vite Configuration
```javascript
// ✅ If bundling the library:
// Install locally: npm install path/to/sb-datagrid

// webpack.config.js or vite.config.js
import DataGrid from './path/to/sb-datagrid/js/datagrid.js';
import './path/to/sb-datagrid/css/datagrid.css';

// Use as ES6 module
export { DataGrid };
```

#### CDN vs Local Hosting
```html
<!-- ✅ CDN - Good for prototyping -->
<link rel="stylesheet" href="https://snadboy.github.io/sb-datagrid/css/datagrid.css">
<script src="https://snadboy.github.io/sb-datagrid/js/datagrid.js"></script>

<!-- ✅ Local - Better for production (more control) -->
<link rel="stylesheet" href="/assets/css/datagrid.css">
<script src="/assets/js/datagrid.js"></script>
```

### Mobile and Responsive Considerations

#### Touch Interactions
```css
/* ✅ Improve touch targets for mobile */
.data-grid .column-header {
    min-height: 44px; /* iOS recommended touch target */
}
```

#### Responsive Layouts
```javascript
// ✅ Handle window resizing
window.addEventListener('resize', () => {
    grid.refresh(); // Recalculate layout
});

// ✅ Consider mobile-friendly column widths
const columns = [
    { field: 'id', header: 'ID', width: '60px' }, // Narrower on mobile
    { field: 'name', header: 'Name' }, // Flexible width
    { field: 'actions', header: '', width: '80px' } // Fixed action column
];
```

### Testing Considerations

#### Unit Testing
```javascript
// ✅ Mock DOM environment for testing
// Jest with jsdom example:
import { DataGrid } from './datagrid.js';

describe('DataGrid', () => {
    let container;
    
    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });
    
    afterEach(() => {
        document.body.removeChild(container);
    });
    
    test('should initialize with data', () => {
        const grid = new DataGrid(container, {
            columns: [{ field: 'name', header: 'Name' }],
            data: [{ name: 'Test' }]
        });
        
        expect(container.querySelector('.data-grid')).toBeTruthy();
        grid.destroy();
    });
});
```

### Common Troubleshooting

1. **Grid not appearing**: Check if CSS is loaded and container has height
2. **Styling issues**: Ensure CSS loads before grid initialization  
3. **Events not firing**: Verify event handler attachment and scope
4. **Performance issues**: Check data size and renderer complexity
5. **Mobile issues**: Test touch interactions and responsive breakpoints

## 📦 Files

- `js/datagrid.js` - Main JavaScript library
- `css/datagrid.css` - Stylesheet with themes  
- `docs/index.html` - Live demo and documentation
- `docs/README.md` - This documentation

## 📄 License

MIT License - feel free to use in your projects!

## 🤝 Contributing

Issues and pull requests are welcome!