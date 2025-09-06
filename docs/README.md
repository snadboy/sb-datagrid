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

## 📦 Files

- `js/datagrid.js` - Main JavaScript library
- `css/datagrid.css` - Stylesheet with themes  
- `docs/index.html` - Live demo and documentation
- `docs/README.md` - This documentation

## 📄 License

MIT License - feel free to use in your projects!

## 🤝 Contributing

Issues and pull requests are welcome!