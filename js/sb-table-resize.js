(function () {
    let initCnt = 0;

    function initializeTable(table) {
        console.log('Initializing table, count: ', ++initCnt);
        console.trace();

        if (!table) {
            console.error('Table element not found.');
            return;
        }

        const headers = table.querySelectorAll('th');
        const tbody = table.querySelector('tbody');
        const tableContainer = table.parentElement;

        let clickTimer = null;
        let isResizing = false;

        function updateHeaderPositions() {
            headers.forEach(header => {
                const rect = header.getBoundingClientRect();
                header.setAttribute('data-x-position', Math.round(rect.left));
            });
        }

        headers.forEach((header, index) => {
            console.log('Header index: ', index);
            
            if (index < headers.length - 1) {
                console.log('Adding resizer to header index: ', index);

                const resizer = document.createElement('div');
                resizer.className = 'resizer';
                header.appendChild(resizer);

                let startX;
                let startWidth;
                let totalTableWidth;

                resizer.addEventListener('mousedown', (e) => {
                    console.log('Mouse Down - Target: ', e.target);

                    isResizing = true;
                    startX = e.clientX;
                    startWidth = header.offsetWidth;
                    totalTableWidth = table.offsetWidth;

                    headers.forEach(h => {
                        h.style.width = `${h.offsetWidth}px`;
                    });

                    document.addEventListener('mousemove', onMouseMove);
                    document.addEventListener('mouseup', onMouseUp);
                    document.body.style.cursor = 'col-resize';
                    e.stopPropagation();
                });

                const onMouseMove = (e) => {
                    console.log('Mouse Move - Target: ', e.target);

                    if (!isResizing) return;
                    const deltaX = e.clientX - startX;
                    const newColWidth = startWidth + deltaX;

                    if (newColWidth > 50) {
                        header.style.width = `${newColWidth}px`;
                        const newTableWidth = totalTableWidth + deltaX;
                        table.style.width = `${newTableWidth}px`;
                        updateHeaderPositions(); // Update positions during drag
                    }
                };

                const onMouseUp = () => {
                    isResizing = false;
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    document.body.style.cursor = '';
                };
            }

            header.addEventListener('click', () => {
                if (isResizing) return;

                if (clickTimer) {
                    clearTimeout(clickTimer);
                    clickTimer = null;
                    autoSizeColumn(index);
                    updateHeaderPositions(); // Update positions after autosize
                } else {
                    clickTimer = setTimeout(() => {
                        const sortDirection = header.getAttribute('data-sort-dir') === 'asc' ? 'desc' : 'asc';

                        headers.forEach(h => h.removeAttribute('data-sort-dir'));

                        header.setAttribute('data-sort-dir', sortDirection);

                        sortTable(index, sortDirection);
                        clickTimer = null;
                    }, 250);
                }
            });

            // Add mouseenter listener to show x-position
            header.addEventListener('mouseenter', () => {
                const xPos = header.getAttribute('data-x-position');
                if (xPos) {
                    header.title = `X-Position: ${xPos}px`;
                }
            });

            header.addEventListener('mouseleave', () => {
                header.title = '';
            });
        });

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

        function autoSizeColumn(colIndex) {
            const tempDiv = document.createElement('div');
            tempDiv.style.position = 'absolute';
            tempDiv.style.visibility = 'hidden';
            tempDiv.style.whiteSpace = 'nowrap';
            document.body.appendChild(tempDiv);

            let maxWidth = 0;
            const cells = table.querySelectorAll(`td:nth-child(${colIndex + 1}), th:nth-child(${colIndex + 1})`);

            cells.forEach(cell => {
                tempDiv.innerHTML = cell.innerHTML;
                const cellWidth = tempDiv.offsetWidth;
                if (cellWidth > maxWidth) {
                    maxWidth = cellWidth;
                }
            });

            document.body.removeChild(tempDiv);

            const finalWidth = maxWidth + 30;
            const maxAllowedWidth = tableContainer.offsetWidth / 2;
            const newWidth = Math.min(finalWidth, maxAllowedWidth);

            headers[colIndex].style.width = `${newWidth}px`;

            let totalWidth = 0;
            headers.forEach(h => {
                totalWidth += h.offsetWidth;
            });
            table.style.width = `${totalWidth}px`;
        }
    }

    window.initializeResizableTable = initializeTable;

    // Initial call to set positions on page load
    // const myTable = document.getElementById('myTable');
    // if (myTable) {
    //     initializeResizableTable(myTable);
    //     myTable.querySelectorAll('th').forEach(header => {
    //         const rect = header.getBoundingClientRect();
    //         header.setAttribute('data-x-position', Math.round(rect.left));
    //     });
    // }

})();