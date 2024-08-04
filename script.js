document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('timeComplexityChart').getContext('2d');
    const tableForm = document.getElementById('tableForm');
    const tableContainer = document.getElementById('tableContainer');
    const speedDownButton = document.getElementById('speedDown');
    const speedUpButton = document.getElementById('speedUp');

    let speed = 500; // Initial speed in milliseconds

    // Generate initial static graph
    const labels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const timeComplexityData = {
        labels: labels,
        datasets: [
            {
                label: 'Recursive (O(2^n))',
                data: [0.1, 0.3, 0.7, 2, 4.5, 10, 22, 50, 120, 300, 750],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                fill: false,
            },
            {
                label: 'Dynamic Programming (O(n*k))',
                data: [0.1, 0.2, 0.2, 0.3, 0.4, 0.5, 0.7, 0.9, 1.1, 1.4, 1.7],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                fill: false,
            }
        ]
    };

    new Chart(ctx, {
        type: 'line',
        data: timeComplexityData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
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

    speedDownButton.addEventListener('click', function() {
        speed = Math.min(speed + 100, 2000); // Increase speed by 100ms up to 2000ms
    });

    speedUpButton.addEventListener('click', function() {
        speed = Math.max(speed - 100, 100); // Decrease speed by 100ms down to 100ms
    });

    function generateTable(n, k) {
        tableContainer.innerHTML = ''; // Clear previous table

        const C = Array.from({ length: n + 1 }, () => Array(k + 1).fill(0));

        // Create table element
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // Add table headers
        const headerRow = document.createElement('tr');
        const emptyCell = document.createElement('th');
        headerRow.appendChild(emptyCell);
        for (let j = 0; j <= k; j++) {
            const headerCell = document.createElement('th');
            headerCell.textContent = j;
            headerRow.appendChild(headerCell);
        }
        thead.appendChild(headerRow);

        for (let i = 0; i <= n; i++) {
            const row = document.createElement('tr');
            const headerCell = document.createElement('th');
            headerCell.textContent = i;
            row.appendChild(headerCell);
            for (let j = 0; j <= k; j++) {
                const cell = document.createElement('td');
                cell.textContent = C[i][j];
                cell.id = `cell-${i}-${j}`;
                row.appendChild(cell);
            }
            tbody.appendChild(row);
        }

        table.appendChild(thead);
        table.appendChild(tbody);
        tableContainer.appendChild(table);

        fillTable(C, n, k);
    }

    function fillTable(C, n, k) {
        for (let i = 0; i <= n; i++) {
            for (let j = 0; j <= Math.min(i, k); j++) {
                setTimeout(() => {
                    if (j === 0 || j === i) {
                        C[i][j] = 1;
                    } else {
                        C[i][j] = C[i - 1][j - 1] + C[i - 1][j];
                        // Highlight cells being added
                        const cellAbove = document.getElementById(`cell-${i - 1}-${j}`);
                        const cellAboveLeft = document.getElementById(`cell-${i - 1}-${j - 1}`);
                        cellAbove.style.backgroundColor = 'lightblue';
                        cellAboveLeft.style.backgroundColor = 'lightblue';
                        setTimeout(() => {
                            cellAbove.style.backgroundColor = '';
                            cellAboveLeft.style.backgroundColor = '';
                        }, speed);
                    }

                    const cell = document.getElementById(`cell-${i}-${j}`);
                    cell.textContent = C[i][j];
                    cell.style.backgroundColor = 'yellow';
                    setTimeout(() => {
                        if (i === n && j === k) {
                            cell.style.backgroundColor = 'lightgreen';
                        } else {
                            cell.style.backgroundColor = '';
                        }
                    }, speed);

                }, speed * (i * (k + 1) + j));
            }
        }
    }
});
