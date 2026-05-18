["rajitha", "reshma", "ajeeshna", "cinju", "selbin", "aksa"].forEach(n => {
                    document.write(`<label class="staff-item"><input type="checkbox" class="a-check" value="${n}"> ${n}</label>`);
                });


["ambily", "hari", "manu", "radha", "josna", "akshara", "haritha", "jishnu", "adarsh", "vincy", "elmy", "ashna", "anju", "navya"].forEach(n => {
                    document.write(`<label class="staff-item"><input type="checkbox" class="t-check" value="${n}"> ${n}</label>`);
                });

 let charts = {};

    function buildDashboard() {
        const aChecked = document.querySelectorAll('.a-check:checked');
        const tChecked = document.querySelectorAll('.t-check:checked');
        
        // Setup Analog Table
        const analogBody = document.getElementById('analogBody');
        analogBody.innerHTML = '';
        aChecked.forEach(c => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="text-transform:capitalize">${c.value}</td>
                <td><input type="number" class="edit-in tgt" oninput="refresh()"></td>
                <td><input type="number" class="edit-in ach" oninput="refresh()"></td>
                <td><input type="number" class="edit-in v1" oninput="refresh()"></td>
                <td><input type="number" class="edit-in v2" oninput="refresh()"></td>
                <td><input type="number" class="edit-in v3" oninput="refresh()"></td>
            `;
            analogBody.appendChild(tr);
        });

        // Setup Technician Table
        const techBody = document.getElementById('techBody');
        techBody.innerHTML = '';
        tChecked.forEach(c => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="text-transform:capitalize">${c.value}</td>
                <td><input type="number" class="edit-in tgt" oninput="refresh()"></td>
                <td><input type="number" class="edit-in ach" oninput="refresh()"></td>
                <td><input type="number" class="edit-in v1" oninput="refresh()"></td>
                <td><input type="number" class="edit-in v2" oninput="refresh()"></td>
                <td><input type="number" class="edit-in v3" oninput="refresh()"></td>
                <td><input type="number" class="edit-in v4" oninput="refresh()"></td>
            `;
            techBody.appendChild(tr);
        });

        document.getElementById('analogSec').style.display = aChecked.length ? 'block' : 'none';
        document.getElementById('techSec').style.display = tChecked.length ? 'block' : 'none';
        refresh();
    }

    function refresh() {
        const process = (bodyId, footId) => {
            const data = { labels: [], tgts: [], achs: [], items: [] };
            let sumTgt = 0, sumAch = 0;

            document.querySelectorAll(`#${bodyId} tr`).forEach(row => {
                const name = row.cells[0].innerText;
                const tgt = parseFloat(row.querySelector('.tgt').value) || 0;
                const ach = parseFloat(row.querySelector('.ach').value) || 0;
                
                const subVals = Array.from(row.querySelectorAll('.edit-in:not(.tgt):not(.ach)')).map(input => parseFloat(input.value) || 0);

                sumTgt += tgt;
                sumAch += ach;

                data.labels.push(name);
                data.tgts.push(tgt);
                data.achs.push(ach);
                data.items.push({ name, vals: subVals, perc: tgt > 0 ? Math.round((ach/tgt)*100) : 0 });
            });

            const foot = document.getElementById(footId);
            const totalPerc = sumTgt > 0 ? Math.round((sumAch / sumTgt) * 100) : 0;
            foot.innerHTML = `
                <tr>
                    <td style="color:var(--text-dim)">TOTAL</td>
                    <td>${sumTgt}</td>
                    <td>${sumAch}</td>
                    <td colspan="4" style="text-align:right; color:var(--accent)">${totalPerc}% Efficiency</td>
                </tr>
            `;

            return data;
        };

        renderGroup('analog', process('analogBody', 'analogFoot'), '#ff5252', ['AI', 'AR', 'OTH']);
        renderGroup('tech', process('techBody', 'techFoot'), '#bb86fc', ['MD', 'DSG', 'CRV', 'DPPS']);
    }

    function renderGroup(id, data, color, chartLabels) {
        // Bar Chart config
        const bCtx = document.getElementById(id + 'Bar').getContext('2d');
        if (charts[id + 'Bar']) charts[id + 'Bar'].destroy();
        charts[id + 'Bar'] = new Chart(bCtx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    { label: 'Target', data: data.tgts, backgroundColor: '#1e293b', barPercentage: 0.6 },
                    { label: 'Achieved', data: data.achs, backgroundColor: color, barPercentage: 0.6 }
                ]
            },
            options: { maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });

        // Gallery Container
        const gall = document.getElementById(id + 'Gallery');
        gall.innerHTML = '';
        data.items.forEach((item, i) => {
            const cid = `${id}_p_${i}`;
            const card = document.createElement('div');
            card.className = 'individual-pie-card';
            card.innerHTML = `
                <div class="pie-title">${item.name}</div>
                <div class="canvas-container"><canvas id="${cid}"></canvas></div>
                <div class="perc-label" style="color:${color}">Achieved: ${item.perc}%</div>
            `;
            gall.appendChild(card);

            // True Pie Chart Configuration (Matching standard full circles style)
            new Chart(document.getElementById(cid), {
                type: 'pie',
                data: {
                    labels: chartLabels,
                    datasets: [{
                        data: item.vals,
                        backgroundColor: [color, '#00e5ff', '#ffeb3b', '#4caf50'],
                        borderWidth: 1,
                        borderColor: '#111420'
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    plugins: { 
                        legend: { display: true, position: 'right', labels: { color: '#fff', font: { size: 9 }, boxWidth: 8 } } 
                    }
                }
            });
        });
    }

    window.onload = buildDashboard;
