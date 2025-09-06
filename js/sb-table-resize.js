(function () {
    function initializeDataGrid(grid) {
        if (!grid || grid.getAttribute('data-initialized')) {
            console.error('Grid container not found or already initialized.');
            return;
        }
        grid.setAttribute('data-initialized', 'true');

        const headerCells = grid.querySelectorAll('.header-row .grid-cell');
        const bodyRows = grid.querySelectorAll('.grid-body .grid-row');
        const gridHeader = grid.querySelector('.grid-header');
        const gridBody = grid.querySelector('.grid-body');

        let clickTimer = null;
        let isResizing = false;

        headerCells.forEach((headerCell, index) => {
            // --- Resizing functionality ---
            if (index < headerCells.length - 1) {
                const resizer = document.createElement('div');
                resizer.className = 'resizer';
                headerCell.appendChild(resizer);

                let startX;
                let startWidth;

                resizer.addEventListener('mousedown', (e) => {
                    isResizing = true;
                    startX = e.clientX;
                    startWidth = headerCell.offsetWidth;
                    e.stopPropagation();

                    document.addEventListener('mousemove', onMouseMove);
                    document.addEventListener('mouseup', onMouseUp);
                    document.body.style.cursor = 'col-resize';
                });

                const onMouseMove = (e) => {
                    if (!isResizing) return;
                    const deltaX = e.clientX - startX;
                    const newCellWidth = startWidth + deltaX;

                    if (newCellWidth > 50) {
                        const currentColumns = Array.from(headerCells).map(h => `${h.offsetWidth}px`);
                        currentColumns[index] = `${newCellWidth}px`;

                        const newGridTemplateColumns = currentColumns.join(' ');
                        gridHeader.style.gridTemplateColumns = newGridTemplateColumns;
                        gridBody.style.gridTemplateColumns = newGridTemplateColumns;
                    }
                };

                const onMouseUp = () => {
                    isResizing = false;
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    document.body.style.cursor = '';
                };
            }

            // --- Sorting and Auto-sizing functionality ---
            headerCell.addEventListener('click', () => {
                if (isResizing) return;

                if (clickTimer) {
                    clearTimeout(clickTimer);
                    clickTimer = null;
                    autoSizeColumn(index);
                } else {
                    clickTimer = setTimeout(() => {
                        const sortDirection = headerCell.getAttribute('data-sort-dir') === 'asc' ? 'desc' : 'asc';

                        headerCells.forEach(h => h.removeAttribute('data-sort-dir'));

                        headerCell.setAttribute('data-sort-dir', sortDirection);

                        sortGrid(index, sortDirection);
                        clickTimer = null;
                    }, 250);
                }
            });
        });

        function sortGrid(colIndex, direction) {
            const rows = Array.from(bodyRows);

            rows.sort((rowA, rowB) => {
                const cellA = rowA.children[colIndex].textContent.trim();
                const cellB = rowB.children[colIndex].textContent.trim();

                let comparison = 0;
                if (cellA > cellB) comparison = 1;
                else if (cellA < cellB) comparison = -1;

                return direction === 'asc' ? comparison : comparison * -1;
            });

            rows.forEach(row => gridBody.appendChild(row));
        }

        function autoSizeColumn(colIndex) {
            const tempDiv = document.createElement('div');
            tempDiv.style.position = 'absolute';
            tempDiv.style.visibility = 'hidden';
            tempDiv.style.whiteSpace = 'nowrap';
            document.body.appendChild(tempDiv);

            let maxWidth = 0;
            const cells = Array.from(grid.querySelectorAll(`.grid-cell:nth-child(${colIndex + 1})`));

            cells.forEach(cell => {
                tempDiv.innerHTML = cell.innerHTML;
                if (tempDiv.offsetWidth > maxWidth) {
                    maxWidth = tempDiv.offsetWidth;
                }
            });

            document.body.removeChild(tempDiv);

            const newWidth = Math.min(maxWidth + 30, grid.offsetWidth / 2);

            const currentColumns = Array.from(headerCells).map(h => `${h.offsetWidth}px`);
            currentColumns[colIndex] = `${newWidth}px`;

            const newGridTemplateColumns = currentColumns.join(' ');
            gridHeader.style.gridTemplateColumns = newGridTemplateColumns;
            gridBody.style.gridTemplateColumns = newGridTemplateColumns;
        }
    }

    window.initializeDataGrid = initializeDataGrid;

    document.addEventListener('DOMContentLoaded', () => {
        const myGrid = document.querySelector('.grid-container');
        initializeDataGrid(myGrid);
    });

})();