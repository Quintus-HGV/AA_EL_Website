document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('timeComplexityChart').getContext('2d');
    const tableForm = document.getElementById('tableForm');
    const tableContainer = document.getElementById('tableContainer');
    const speedSelect = document.getElementById('speed');

    let speed = 500; // Initial speed in milliseconds

    // Generate initial static graph
    const labels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const timeComplexityData = {
        labels: labels,
        datasets: [
            {
                label: 'Recursive (O(2^n))',
                data: [0.1, 0.3, 0.7, 2, 4.5, 10, 22, 50, 120, 300, 750],
                backgroundColor: 'rgba(231, 76, 60, 0.2)',
                borderColor: 'rgba(231, 76, 60, 1)',
                borderWidth: 1,
                fill: false,
            },
            {
                label: 'Dynamic Programming (O(n*k))',
                data: [0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.7, 0.9, 1.1, 1.4, 1.7],
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 1,
                fill: false,
            }
        ]
    };

    new Chart(ctx, {
        type: 'line',
        data: timeComplexityData,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#e0e0e0'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#e0e0e0'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#e0e0e0'
                    }
                }
            }
        }
    });

    tableForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const n = parseInt(document.getElementById('n').value);
        const k = parseInt(document.getElementById('k').value);

        if (isNaN(n) || isNaN(k) || n < 0 || k < 0 || k > n) {
            alert('Please enter valid positive integers for n and k where k <= n.');
            return;
        }

        generateTable(n, k);
    });

    speedSelect.addEventListener('change', function() {
        speed = parseInt(this.value);
    });

    function generateTable(n, k) {
        tableContainer.innerHTML = ''; // Clear previous table

        const C = Array.from({ length: n + 1 }, () => Array(k + 1).fill(0));

        const tableWrapper = document.createElement('div');
        tableWrapper.className = 'table-container';

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        const headerRow = document.createElement('tr');
        headerRow.appendChild(document.createElement('th'));
        for (let j = 0; j <= k; j++) {
            const headerCell = document.createElement('th');
            headerCell.textContent = "k = " + j;
            headerRow.appendChild(headerCell);

            const colLabel = document.createElement('div');
            colLabel.className = 'col-label';
            colLabel.textContent = `k=${j}`;
            colLabel.style.left = `${(j + 1) * 100 / (k + 2)}%`;
            tableWrapper.appendChild(colLabel);
        }
        thead.appendChild(headerRow);

        for (let i = 0; i <= n; i++) {
            const row = document.createElement('tr');
            const headerCell = document.createElement('th');
            headerCell.textContent = "n = " + i;
            row.appendChild(headerCell);
            for (let j = 0; j <= k; j++) {
                const cell = document.createElement('td');
                cell.id = `cell-${i}-${j}`;
                row.appendChild(cell);
            }
            tbody.appendChild(row);

            const rowLabel = document.createElement('div');
            rowLabel.className = 'row-label';
            rowLabel.textContent = `n=${i}`;
            rowLabel.style.top = `${(i + 1) * 100 / (n + 2)}%`;
            tableWrapper.appendChild(rowLabel);
        }

        table.appendChild(thead);
        table.appendChild(tbody);
        tableWrapper.appendChild(table);
        tableContainer.appendChild(tableWrapper);

        fillTable(C, n, k);
    }

    function fillTable(C, n, k) {
        let delay = 0;

        for (let i = 0; i <= n; i++) {
            for (let j = 0; j <= Math.min(i, k); j++) {
                setTimeout(() => {
                    if (j === 0 || j === i) {
                        C[i][j] = 1;
                    } else {
                        C[i][j] = C[i - 1][j - 1] + C[i - 1][j];
                        highlightCells(i, j, 'highlight');
                    }

                    const cell = document.getElementById(`cell-${i}-${j}`);
                    cell.textContent = C[i][j];
                    cell.classList.add('highlight');
                    setTimeout(() => {
                        cell.classList.remove('highlight');
                        if (i === n && j === k) {
                            cell.classList.add('final-answer');
                            const label = document.createElement('div');
                            label.className = 'final-answer-label';
                            label.textContent = 'Final Answer';
                            cell.appendChild(label);
                        }
                    }, speed);

                }, delay);
                delay += speed;
            }
        }
    }

    function highlightCells(i, j, className) {
        const cellAbove = document.getElementById(`cell-${i - 1}-${j}`);
        const cellAboveLeft = document.getElementById(`cell-${i - 1}-${j - 1}`);
        if (cellAbove) cellAbove.classList.add(className);
        if (cellAboveLeft) cellAboveLeft.classList.add(className);
        setTimeout(() => {
            if (cellAbove) cellAbove.classList.remove(className);
            if (cellAboveLeft) cellAboveLeft.classList.remove(className);
        }, speed);
    }
});