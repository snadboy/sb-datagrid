/**
 * DataGrid JavaScript Library
 * A reusable, customizable data grid with resizable columns, sorting, and more
 * Version: 1.0.0
 */

class DataGrid {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' 
            ? document.querySelector(container) 
            : container;
        
        if (!this.container) {
            throw new Error('DataGrid: Container element not found');
        }

        this.options = {
            columns: [],
            data: [],
            resizable: true,
            sortable: true,
            selectable: false,
            reorderable: true,
            theme: '',
            minColumnWidth: 50,
            maxColumnWidth: null,
            onSort: null,
            onSelect: null,
            onResize: null,
            onReorder: null,
            onCellClick: null,
            onCellDoubleClick: null,
            ...options
        };

        this.state = {
            sortColumn: null,
            sortDirection: null,
            selectedRows: new Set(),
            columnWidths: {},
            isFiltered: false,
            filteredData: null,
            lastSelectedRow: null
        };

        this.elements = {};
        this.isResizing = false;
        this.isDragging = false;
        this.isReordering = false;
        this.dragState = {
            sourceIndex: null,
            targetIndex: null,
            ghost: null
        };
        this.eventHandlers = {};
        
        this.init();
    }

    init() {
        this.setupContainer();
        this.render();
        this.attachEventListeners();
    }

    setupContainer() {
        this.container.classList.add('datagrid-container');
        if (this.options.theme) {
            this.container.classList.add(this.options.theme);
        }
        this.container.innerHTML = '';
    }

    render() {
        // Clear the container completely before re-rendering
        this.container.innerHTML = '';
        
        // Create wrapper for proper scrolling
        const wrapper = document.createElement('div');
        wrapper.className = 'datagrid-wrapper';
        this.elements.wrapper = wrapper;
        this.container.appendChild(wrapper);
        
        this.renderHeader();
        this.renderBody();
        this.updateGridColumns();
        
        // Update wrapper width after rendering with more robust timing
        // Handle potential CSS conflicts by doing multiple passes
        setTimeout(() => {
            this.updateGridColumns(); // Recalculate after CSS fully applied
            this.updateWrapperWidth();
        }, 0);
        
        // Additional pass to handle CSS conflicts from external stylesheets
        setTimeout(() => {
            this.updateGridColumns();
            this.updateWrapperWidth();
        }, 50);
    }

    renderHeader() {
        const header = document.createElement('div');
        header.className = 'datagrid-header';
        
        this.options.columns.forEach((column, index) => {
            const cell = document.createElement('div');
            cell.className = 'datagrid-cell';
            cell.dataset.column = column.field || index;
            cell.innerHTML = column.header || column.field || `Column ${index + 1}`;
            
            if (this.options.sortable && column.sortable !== false) {
                cell.style.cursor = 'pointer';
                if (this.state.sortColumn === column.field) {
                    cell.dataset.sortDir = this.state.sortDirection;
                }
            }
            
            if (this.options.resizable && column.resizable !== false && index < this.options.columns.length - 1) {
                const resizer = document.createElement('div');
                resizer.className = 'datagrid-resizer';
                resizer.dataset.column = index;
                cell.appendChild(resizer);
            }
            
            header.appendChild(cell);
        });
        
        this.elements.header = header;
        this.elements.wrapper.appendChild(header);
    }

    renderBody() {
        // Remove existing body if it exists
        if (this.elements.body) {
            this.elements.body.remove();
        }
        
        const body = document.createElement('div');
        body.className = 'datagrid-body';
        
        if (this.options.data.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'datagrid-empty';
            emptyMessage.textContent = 'No data available';
            body.appendChild(emptyMessage);
        } else {
            const sortedData = this.getSortedData();
            
            sortedData.forEach((row, rowIndex) => {
                const rowElement = document.createElement('div');
                rowElement.className = 'datagrid-row';
                rowElement.dataset.rowIndex = rowIndex;
                
                if (this.state.selectedRows.has(rowIndex)) {
                    rowElement.classList.add('selected');
                }
                
                this.options.columns.forEach((column, colIndex) => {
                    const cell = document.createElement('div');
                    cell.className = 'datagrid-cell';
                    cell.dataset.column = column.field || colIndex;
                    cell.dataset.row = rowIndex;
                    
                    const value = this.getCellValue(row, column);
                    if (column.renderer) {
                        cell.innerHTML = column.renderer(value, row, column);
                    } else {
                        cell.textContent = value;
                    }
                    
                    rowElement.appendChild(cell);
                });
                
                body.appendChild(rowElement);
            });
        }
        
        this.elements.body = body;
        this.elements.wrapper.appendChild(body);
    }

    getCellValue(row, column) {
        if (column.field) {
            return column.field.split('.').reduce((obj, key) => obj?.[key], row);
        }
        return '';
    }

    getSortedData() {
        // Use filtered data if filter is active
        const baseData = this.state.isFiltered && this.state.filteredData 
            ? this.state.filteredData 
            : this.options.data;
        
        if (!this.state.sortColumn || !this.state.sortDirection) {
            return baseData;
        }
        
        const column = this.options.columns.find(col => col.field === this.state.sortColumn);
        if (!column) return baseData;
        
        return [...baseData].sort((a, b) => {
            let valA = this.getCellValue(a, column);
            let valB = this.getCellValue(b, column);
            
            if (column.sorter) {
                return column.sorter(valA, valB, this.state.sortDirection);
            }
            
            if (typeof valA === 'number' && typeof valB === 'number') {
                return this.state.sortDirection === 'asc' ? valA - valB : valB - valA;
            }
            
            valA = String(valA).toLowerCase();
            valB = String(valB).toLowerCase();
            
            if (valA < valB) return this.state.sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return this.state.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }

    updateGridColumns() {
        const columnWidths = this.options.columns.map((col, index) => {
            if (this.state.columnWidths[index]) {
                return `${this.state.columnWidths[index]}px`;
            }
            return col.width || '150px'; // Default to fixed width instead of 1fr for proper scrolling
        });
        
        const gridTemplateColumns = columnWidths.join(' ');
        this.elements.header.style.gridTemplateColumns = gridTemplateColumns;
        this.elements.body.style.gridTemplateColumns = gridTemplateColumns;
        
        this.updateWrapperWidth();
    }
    
    updateWrapperWidth() {
        if (!this.elements.wrapper || !this.elements.header) return;
        
        // Calculate actual total width from rendered columns
        const headerCells = this.elements.header.querySelectorAll('.datagrid-cell');
        let totalWidth = 0;
        
        headerCells.forEach(cell => {
            totalWidth += cell.offsetWidth;
        });
        
        // Add a small buffer to ensure scrollbar appears for partial visibility
        totalWidth += 2; // Account for borders
        
        // Set the width on wrapper to trigger scrollbar appropriately
        this.elements.wrapper.style.width = `${totalWidth}px`;
    }

    attachEventListeners() {
        if (this.options.resizable) {
            this.attachResizeListeners();
        }
        
        if (this.options.sortable) {
            this.attachSortListeners();
        }
        
        if (this.options.reorderable) {
            this.attachReorderListeners();
        }
        
        if (this.options.selectable) {
            this.attachSelectionListeners();
        }
        
        this.attachCellListeners();
    }

    attachResizeListeners() {
        const resizers = this.container.querySelectorAll('.datagrid-resizer');
        
        resizers.forEach(resizer => {
            let startX, startWidth, columnIndex;
            
            const onMouseDown = (e) => {
                this.isResizing = true;
                columnIndex = parseInt(resizer.dataset.column);
                startX = e.clientX;
                
                const headerCells = this.elements.header.querySelectorAll('.datagrid-cell');
                startWidth = headerCells[columnIndex].offsetWidth;
                
                resizer.classList.add('resizing');
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
                document.body.style.cursor = 'col-resize';
                e.preventDefault();
                e.stopPropagation();
            };
            
            const onMouseMove = (e) => {
                if (!this.isResizing) return;
                
                const deltaX = e.clientX - startX;
                let newWidth = startWidth + deltaX;
                
                if (this.options.minColumnWidth) {
                    newWidth = Math.max(newWidth, this.options.minColumnWidth);
                }
                if (this.options.maxColumnWidth) {
                    newWidth = Math.min(newWidth, this.options.maxColumnWidth);
                }
                
                this.state.columnWidths[columnIndex] = newWidth;
                this.updateGridColumns();
                
                // Update wrapper width after resize
                this.updateWrapperWidth();
                
                if (this.options.onResize) {
                    this.options.onResize(columnIndex, newWidth);
                }
            };
            
            const onMouseUp = () => {
                this.isResizing = false;
                resizer.classList.remove('resizing');
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                document.body.style.cursor = '';
            };
            
            resizer.addEventListener('mousedown', onMouseDown);
            
            // Double-click resizer to auto-size
            resizer.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                e.preventDefault();
                this.autoSizeColumn(columnIndex);
            });
        });
    }

    attachSortListeners() {
        const headerCells = this.elements.header.querySelectorAll('.datagrid-cell');
        
        headerCells.forEach((cell, index) => {
            const column = this.options.columns[index];
            let clickTimer = null;
            let clickCount = 0;
            
            // Handle both click and double-click
            cell.addEventListener('click', (e) => {
                if (this.isResizing || e.target.classList.contains('datagrid-resizer')) return;
                
                clickCount++;
                
                if (clickCount === 1) {
                    // Wait to see if it's a double-click
                    clickTimer = setTimeout(() => {
                        // Single click - sort
                        if (column.sortable !== false) {
                            const field = column.field;
                            if (!field) {
                                clickCount = 0;
                                return;
                            }
                            
                            if (this.state.sortColumn === field) {
                                this.state.sortDirection = this.state.sortDirection === 'asc' ? 'desc' : 'asc';
                            } else {
                                this.state.sortColumn = field;
                                this.state.sortDirection = 'asc';
                            }
                            
                            this.renderBody();
                            this.updateSortIndicators();
                            this.updateGridColumns();
                            
                            // Re-attach selection and cell listeners for the new body
                            if (this.options.selectable) {
                                this.attachSelectionListeners();
                            }
                            this.attachCellListeners();
                            
                            if (this.options.onSort) {
                                this.options.onSort(this.state.sortColumn, this.state.sortDirection);
                            }
                        }
                        clickCount = 0;
                    }, 250);
                } else if (clickCount === 2) {
                    // Double click - auto-size
                    clearTimeout(clickTimer);
                    clickCount = 0;
                    this.autoSizeColumn(index);
                }
            });
        });
    }

    attachReorderListeners() {
        const headerCells = this.elements.header.querySelectorAll('.datagrid-cell');
        
        headerCells.forEach((cell, index) => {
            // Make header draggable only if not a resizer
            cell.draggable = true;
            
            // Prevent drag on resizers
            const resizer = cell.querySelector('.datagrid-resizer');
            if (resizer) {
                resizer.draggable = false;
                resizer.addEventListener('dragstart', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                });
            }
            
            cell.addEventListener('dragstart', (e) => {
                // Check if the drag started on a resizer
                if (this.isResizing || e.target.classList.contains('datagrid-resizer')) {
                    e.preventDefault();
                    return;
                }
                
                // Prevent multiple drag operations
                if (this.isDragging) {
                    e.preventDefault();
                    return;
                }
                
                // Prevent text selection during drag
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', index.toString());
                
                this.isDragging = true;
                this.dragState.sourceIndex = index;
                this.container.classList.add('dragging-column');
                cell.classList.add('dragging');
                
                // Create a custom drag image
                const ghost = document.createElement('div');
                ghost.className = 'datagrid-drag-ghost';
                ghost.textContent = this.options.columns[index].header || this.options.columns[index].field;
                ghost.style.position = 'absolute';
                ghost.style.top = '-1000px';
                ghost.style.left = '-1000px';
                document.body.appendChild(ghost);
                e.dataTransfer.setDragImage(ghost, 50, 20);
                
                // Clean up ghost after a moment
                setTimeout(() => {
                    if (document.body.contains(ghost)) {
                        document.body.removeChild(ghost);
                    }
                }, 0);
            });
            
            cell.addEventListener('dragenter', (e) => {
                if (!this.isDragging || index === this.dragState.sourceIndex) return;
                e.preventDefault();
                
                // Remove all existing drag-over classes
                headerCells.forEach(c => {
                    c.classList.remove('drag-over', 'drag-over-right');
                });
                
                // Determine if we're on the left or right half of the cell
                const rect = cell.getBoundingClientRect();
                const midpoint = rect.left + rect.width / 2;
                
                if (e.clientX < midpoint) {
                    cell.classList.add('drag-over');
                } else {
                    cell.classList.add('drag-over-right');
                }
                
                this.dragState.targetIndex = index;
            });
            
            cell.addEventListener('dragover', (e) => {
                if (!this.isDragging) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                
                // Update drop indicator position
                const rect = cell.getBoundingClientRect();
                const midpoint = rect.left + rect.width / 2;
                
                cell.classList.remove('drag-over', 'drag-over-right');
                if (e.clientX < midpoint) {
                    cell.classList.add('drag-over');
                } else {
                    cell.classList.add('drag-over-right');
                }
            });
            
            cell.addEventListener('dragleave', (e) => {
                if (!this.isDragging) return;
                cell.classList.remove('drag-over', 'drag-over-right');
            });
            
            cell.addEventListener('drop', (e) => {
                if (!this.isDragging) return;
                e.preventDefault();
                e.stopPropagation();
                
                const sourceIndex = this.dragState.sourceIndex;
                if (sourceIndex === null || sourceIndex === index) {
                    this.cleanupDrag();
                    return;
                }
                
                let targetIndex = index;
                
                // Adjust target index based on drop position
                const rect = cell.getBoundingClientRect();
                const midpoint = rect.left + rect.width / 2;
                
                // Determine insertion point
                if (e.clientX > midpoint) {
                    // Dropping on right half
                    targetIndex = index + 1;
                } else {
                    // Dropping on left half
                    targetIndex = index;
                }
                
                // Adjust for moving right to left
                if (sourceIndex < targetIndex) {
                    targetIndex--;
                }
                
                if (sourceIndex !== targetIndex) {
                    this.reorderColumns(sourceIndex, targetIndex);
                }
                
                this.cleanupDrag();
            });
            
            cell.addEventListener('dragend', (e) => {
                // Always cleanup on dragend, even if drop didn't fire
                setTimeout(() => {
                    this.cleanupDrag();
                }, 0);
            });
        });
    }
    
    cleanupDrag() {
        this.isDragging = false;
        this.dragState.sourceIndex = null;
        this.dragState.targetIndex = null;
        this.container.classList.remove('dragging-column');
        
        const headerCells = this.elements.header.querySelectorAll('.datagrid-cell');
        headerCells.forEach(cell => {
            cell.classList.remove('dragging', 'drag-over', 'drag-over-right');
        });
    }
    
    reorderColumns(fromIndex, toIndex) {
        // Prevent concurrent reorders
        if (this.isReordering) return;
        this.isReordering = true;
        
        // Save current column widths
        const oldWidths = {};
        this.options.columns.forEach((col, idx) => {
            if (this.state.columnWidths[idx]) {
                oldWidths[col.field || idx] = this.state.columnWidths[idx];
            }
        });
        
        // Reorder columns array
        const columns = [...this.options.columns];
        const [movedColumn] = columns.splice(fromIndex, 1);
        columns.splice(toIndex, 0, movedColumn);
        this.options.columns = columns;
        
        // Restore column widths based on field names
        const newWidths = {};
        this.options.columns.forEach((col, idx) => {
            const key = col.field || idx;
            if (oldWidths[key]) {
                newWidths[idx] = oldWidths[key];
            }
        });
        this.state.columnWidths = newWidths;
        
        // Re-render the grid
        this.render();
        this.attachEventListeners();
        
        // Trigger callback
        if (this.options.onReorder) {
            this.options.onReorder(fromIndex, toIndex, this.options.columns);
        }
        
        // Reset flag
        this.isReordering = false;
    }
    
    updateSortIndicators() {
        const headerCells = this.elements.header.querySelectorAll('.datagrid-cell');
        headerCells.forEach(cell => {
            delete cell.dataset.sortDir;
        });
        
        if (this.state.sortColumn) {
            const sortedCell = Array.from(headerCells).find(cell => 
                this.options.columns[Array.from(headerCells).indexOf(cell)]?.field === this.state.sortColumn
            );
            if (sortedCell) {
                sortedCell.dataset.sortDir = this.state.sortDirection;
            }
        }
    }

    attachSelectionListeners() {
        // Remove old listener if exists
        if (this.eventHandlers.selection) {
            this.elements.body.removeEventListener('click', this.eventHandlers.selection);
        }
        
        // Create and store new handler that works with CSS Grid layout
        this.eventHandlers.selection = (e) => {
            // Find the clicked cell
            const cell = e.target.closest('.datagrid-cell');
            if (!cell) return;
            
            // Skip header cells
            if (this.elements.header.contains(cell)) return;
            
            // Get the row index from the cell
            const rowIndex = parseInt(cell.dataset.row);
            if (isNaN(rowIndex)) return;
            
            // Skip if clicking on interactive elements
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.tagName === 'INPUT') {
                return;
            }
            
            // Handle different selection modes
            if (e.shiftKey && this.state.lastSelectedRow !== null) {
                // Prevent text selection during Shift+Click
                e.preventDefault();
                window.getSelection().removeAllRanges();
                
                // Shift+Click: Select range
                const start = Math.min(this.state.lastSelectedRow, rowIndex);
                const end = Math.max(this.state.lastSelectedRow, rowIndex);
                
                // Clear previous selections unless Ctrl is also held
                if (!e.ctrlKey && !e.metaKey) {
                    this.clearSelection();
                }
                
                // Select all rows in range
                for (let i = start; i <= end; i++) {
                    this.state.selectedRows.add(i);
                    const cellsInRow = this.elements.body.querySelectorAll(`.datagrid-cell[data-row="${i}"]`);
                    cellsInRow.forEach(c => c.classList.add('selected'));
                }
            } else if (e.ctrlKey || e.metaKey) {
                // Ctrl/Cmd+Click: Toggle single row
                const allCellsInRow = this.elements.body.querySelectorAll(`.datagrid-cell[data-row="${rowIndex}"]`);
                
                if (this.state.selectedRows.has(rowIndex)) {
                    // Deselect
                    this.state.selectedRows.delete(rowIndex);
                    allCellsInRow.forEach(c => c.classList.remove('selected'));
                } else {
                    // Select
                    this.state.selectedRows.add(rowIndex);
                    allCellsInRow.forEach(c => c.classList.add('selected'));
                }
                
                this.state.lastSelectedRow = rowIndex;
            } else {
                // Regular click: Select only this row
                this.clearSelection();
                this.state.selectedRows.add(rowIndex);
                const allCellsInRow = this.elements.body.querySelectorAll(`.datagrid-cell[data-row="${rowIndex}"]`);
                allCellsInRow.forEach(c => c.classList.add('selected'));
                this.state.lastSelectedRow = rowIndex;
            }
            
            // Trigger callback with actual data
            if (this.options.onSelect) {
                const selectedData = this.getSelectedRows();
                this.options.onSelect(selectedData);
            }
        };
        
        // Attach to body to catch all cell clicks
        this.elements.body.addEventListener('click', this.eventHandlers.selection);
    }

    attachCellListeners() {
        // Remove old listeners if they exist
        if (this.eventHandlers.cellClick) {
            this.elements.body.removeEventListener('click', this.eventHandlers.cellClick);
        }
        if (this.eventHandlers.cellDblClick) {
            this.elements.body.removeEventListener('dblclick', this.eventHandlers.cellDblClick);
        }
        
        // Create and store new handlers
        this.eventHandlers.cellClick = (e) => {
            const cell = e.target.closest('.datagrid-cell');
            if (!cell) return;
            
            const row = parseInt(cell.dataset.row);
            const column = cell.dataset.column;
            
            if (this.options.onCellClick) {
                this.options.onCellClick(this.options.data[row], column, cell);
            }
        };
        
        this.eventHandlers.cellDblClick = (e) => {
            const cell = e.target.closest('.datagrid-cell');
            if (!cell) return;
            
            const row = parseInt(cell.dataset.row);
            const column = cell.dataset.column;
            
            if (this.options.onCellDoubleClick) {
                this.options.onCellDoubleClick(this.options.data[row], column, cell);
            }
        };
        
        this.elements.body.addEventListener('click', this.eventHandlers.cellClick);
        this.elements.body.addEventListener('dblclick', this.eventHandlers.cellDblClick);
    }

    clearSelection() {
        this.state.selectedRows.clear();
        this.state.lastSelectedRow = null;
        // Remove selected class from all cells
        this.container.querySelectorAll('.datagrid-cell.selected').forEach(cell => {
            cell.classList.remove('selected');
        });
    }
    
    autoSizeColumn(columnIndex) {
        const column = this.options.columns[columnIndex];
        if (!column) return;
        
        // Create a temporary element to measure text width
        const measurer = document.createElement('div');
        measurer.style.position = 'absolute';
        measurer.style.visibility = 'hidden';
        measurer.style.whiteSpace = 'nowrap';
        measurer.style.font = window.getComputedStyle(this.container).font;
        measurer.style.padding = '8px 12px'; // Match cell padding
        document.body.appendChild(measurer);
        
        let maxWidth = 0;
        
        // Measure header width
        const headerCell = this.elements.header.querySelectorAll('.datagrid-cell')[columnIndex];
        if (headerCell) {
            measurer.innerHTML = column.header || column.field || `Column ${columnIndex + 1}`;
            maxWidth = Math.max(maxWidth, measurer.offsetWidth + 20); // Add space for sort indicator
        }
        
        // Measure all cell widths in this column
        this.options.data.forEach(row => {
            const value = this.getCellValue(row, column);
            if (column.renderer) {
                measurer.innerHTML = column.renderer(value, row, column);
            } else {
                measurer.textContent = value;
            }
            maxWidth = Math.max(maxWidth, measurer.offsetWidth);
        });
        
        document.body.removeChild(measurer);
        
        // Apply min/max constraints
        if (this.options.minColumnWidth) {
            maxWidth = Math.max(maxWidth, this.options.minColumnWidth);
        }
        if (this.options.maxColumnWidth) {
            maxWidth = Math.min(maxWidth, this.options.maxColumnWidth);
        }
        
        // Add some padding for comfort
        maxWidth += 20;
        
        // Update column width
        this.state.columnWidths[columnIndex] = maxWidth;
        this.updateGridColumns();
        
        // Update wrapper width after auto-size
        this.updateWrapperWidth();
        
        if (this.options.onResize) {
            this.options.onResize(columnIndex, maxWidth);
        }
    }

    setData(data) {
        this.options.data = data;
        this.state.selectedRows.clear();
        this.renderBody();
        this.updateGridColumns();
        // Re-attach listeners after re-render
        if (this.options.selectable) {
            this.attachSelectionListeners();
        }
        this.attachCellListeners();
    }

    addRow(row) {
        this.options.data.push(row);
        this.renderBody();
        this.updateGridColumns();
        // Re-attach listeners after re-render
        if (this.options.selectable) {
            this.attachSelectionListeners();
        }
        this.attachCellListeners();
    }

    removeRow(index) {
        this.options.data.splice(index, 1);
        // Clear selection state since indices have changed
        this.state.selectedRows.clear();
        this.renderBody();
        this.updateGridColumns();
        // Re-attach listeners after re-render
        if (this.options.selectable) {
            this.attachSelectionListeners();
        }
        this.attachCellListeners();
    }

    updateRow(index, row) {
        this.options.data[index] = row;
        this.renderBody();
        this.updateGridColumns();
    }

    getSelectedRows() {
        if (this.state.isFiltered && this.state.filteredData) {
            // When filtered, use filtered data indices
            return Array.from(this.state.selectedRows).map(i => this.state.filteredData[i]);
        } else {
            // When not filtered, use original data indices
            return Array.from(this.state.selectedRows).map(i => this.options.data[i]);
        }
    }

    refresh() {
        this.render();
        this.attachEventListeners();
    }

    setTheme(theme) {
        // Remove old theme class
        if (this.options.theme) {
            this.container.classList.remove(this.options.theme);
        }
        
        // Set new theme
        this.options.theme = theme;
        
        // Add new theme class
        if (theme) {
            this.container.classList.add(theme);
        }
    }
    
    showSelectedOnly() {
        // Get the selected rows' data
        const selectedData = this.getSelectedRows();
        
        if (selectedData.length === 0) {
            return false; // No rows selected
        }
        
        // Store the filtered data
        this.state.isFiltered = true;
        this.state.filteredData = selectedData;
        
        // Keep selection (don't clear it)
        // Map old indices to new indices in filtered view
        const oldSelectedRows = new Set(this.state.selectedRows);
        this.state.selectedRows.clear();
        
        // Re-render with filtered data
        this.renderBody();
        
        // Re-select the rows in the filtered view
        selectedData.forEach((data, newIndex) => {
            this.state.selectedRows.add(newIndex);
            const cellsInRow = this.elements.body.querySelectorAll(`.datagrid-cell[data-row="${newIndex}"]`);
            cellsInRow.forEach(c => c.classList.add('selected'));
        });
        
        this.updateGridColumns();
        
        // Re-attach listeners
        if (this.options.selectable) {
            this.attachSelectionListeners();
        }
        this.attachCellListeners();
        
        return true; // Successfully filtered
    }
    
    showAll() {
        // Store current selection before clearing filter
        const wasFiltered = this.state.isFiltered;
        const selectedRowsData = wasFiltered ? this.getSelectedRows() : [];
        
        // Clear filter
        this.state.isFiltered = false;
        this.state.filteredData = null;
        
        // Re-render with all data
        this.renderBody();
        this.updateGridColumns();
        
        // Re-attach listeners
        if (this.options.selectable) {
            this.attachSelectionListeners();
        }
        this.attachCellListeners();
        
        // If we were filtered and had selections, restore them
        if (wasFiltered && selectedRowsData.length > 0) {
            console.log('Restoring selection. Selected data was:', selectedRowsData.map(d => ({id: d.id, name: d.name})));
            
            // Clear current selection state
            this.state.selectedRows.clear();
            
            // Find and re-select the rows based on their original data using ID field
            selectedRowsData.forEach(rowData => {
                const rowIndex = this.options.data.findIndex(data => {
                    // Try to match by ID first (most reliable)
                    if (data.id !== undefined && rowData.id !== undefined) {
                        return data.id === rowData.id;
                    }
                    // Fallback to full object comparison if no ID field
                    return JSON.stringify(data) === JSON.stringify(rowData);
                });
                console.log(`Looking for ID ${rowData.id} (${rowData.name}), found at index: ${rowIndex}`);
                if (rowIndex !== -1) {
                    this.state.selectedRows.add(rowIndex);
                    const cellsInRow = this.elements.body.querySelectorAll(`.datagrid-cell[data-row="${rowIndex}"]`);
                    console.log(`Selecting row ${rowIndex}, found ${cellsInRow.length} cells`);
                    cellsInRow.forEach(c => c.classList.add('selected'));
                }
            });
            
            console.log('Final selected row indices:', Array.from(this.state.selectedRows));
            
            // Update lastSelectedRow for proper range selection
            if (this.state.selectedRows.size > 0) {
                const selectedIndices = Array.from(this.state.selectedRows);
                this.state.lastSelectedRow = Math.max(...selectedIndices);
            }
            
            // Trigger selection callback
            if (this.options.onSelect) {
                this.options.onSelect(selectedRowsData);
            }
        }
    }
    
    isFiltered() {
        return this.state.isFiltered;
    }
    
    destroy() {
        this.container.innerHTML = '';
        this.container.classList.remove('datagrid-container', this.options.theme);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataGrid;
}