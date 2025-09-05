// File: resizable-sortable-table.js

(function () {
    /**
     * Initializes a table with resizing and sorting functionality.
     * @param {HTMLTableElement} table The table element to be enhanced.
     */
    function initializeTable(table) {
        if (!table) {
            console.error('Table element not found.');
            return;
        }

        const headers = table.querySelectorAll('th');
        const tbody = table.querySelector('tbody');

        // Add event listeners and resizers to headers
        headers.forEach((header, index) => {
            // --- Resizing functionality ---
            if (index < headers.length - 1) {
                const resizer = document.createElement('div');
                resizer.className = 'resizer';
                header.appendChild(resizer);

                let isResizing = false;
                let startX;
                let startWidth;
                let totalTableWidth;

                resizer.addEventListener('mousedown', (e) => {
                    isResizing = true;
                    startX = e.clientX;
                    startWidth = header.offsetWidth;
                    totalTableWidth = table.offsetWidth;

                    document.addEventListener('mousemove', onMouseMove);
                    document.addEventListener('mouseup', onMouseUp);
                    document.body.style.cursor = 'col-resize';
                    e.stopPropagation();
                });

                const onMouseMove = (e) => {
                    if (!isResizing) return;
                    const deltaX = e.clientX - startX;
                    const newColWidth = startWidth + deltaX;

                    if (newColWidth > 50) {
                        console.log('Resizing column to:', newColWidth, ' -- ', 'Table width to:', totalTableWidth + deltaX);
                        const newTableWidth = totalTableWidth + deltaX;
                        table.style.width = `${newTableWidth}px`;
                        header.style.width = `${newColWidth}px`;
                    }
                };

                const onMouseUp = () => {
                    isResizing = false;
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    document.body.style.cursor = '';
                };
            }

            // --- Sorting functionality ---
            header.addEventListener('click', () => {
                const sortDirection = header.getAttribute('data-sort-dir') === 'asc' ? 'desc' : 'asc';

                headers.forEach(h => h.removeAttribute('data-sort-dir'));

                header.setAttribute('data-sort-dir', sortDirection);

                sortTable(index, sortDirection);
            });
        });

        /**
         * Sorts the table by a specific column.
         * @param {number} colIndex The index of the column to sort by.
         * @param {string} direction The sorting direction ('asc' or 'desc').
         */
        function sortTable(colIndex, direction) {
            const rows = Array.from(tbody.querySelectorAll('tr'));

            rows.sort((rowA, rowB) => {
                const cellA = rowA.cells[colIndex].textContent.trim();
                const cellB = rowB.cells[colIndex].textContent.trim();

                let comparison = 0;
                if (cellA > cellB) {
                    comparison = 1;
                } else if (cellA < cellB) {
                    comparison = -1;
                }

                return direction === 'asc' ? comparison : comparison * -1;
            });

            rows.forEach(row => tbody.appendChild(row));
        }
    }

    // Public API: Expose the function to the global scope
    window.sbTableResize = initializeTable;

})();