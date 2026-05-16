const analogNames = [
    "rajitha",
    "reshma",
    "ajeeshna",
    "cinju",
    "selbin",
    "aksa"
];

const techNames = [
    "ambily",
    "hari",
    "manu",
    "radha",
    "josna",
    "akshara",
    "haritha",
    "jishnu",
    "adarsh",
    "vincy",
    "elmy",
    "ashna",
    "anju",
    "navya"
];

let charts = {};

function createStaff() {

    const analogGrid = document.getElementById("analogGrid");
    const techGrid = document.getElementById("techGrid");

    analogNames.forEach(name => {
        analogGrid.innerHTML += `
            <label class="staff-item">
                <input type="checkbox" class="a-check" value="${name}">
                ${name}
            </label>
        `;
    });

    techNames.forEach(name => {
        techGrid.innerHTML += `
            <label class="staff-item">
                <input type="checkbox" class="t-check" value="${name}">
                ${name}
            </label>
        `;
    });
}

function buildDashboard() {

    const aChecked = document.querySelectorAll('.a-check:checked');
    const tChecked = document.querySelectorAll('.t-check:checked');

    setupTable(aChecked, 'analogBody');
    setupTable(tChecked, 'techBody');

    document.getElementById('analogSec').style.display =
        aChecked.length ? 'block' : 'none';

    document.getElementById('techSec').style.display =
        tChecked.length ? 'block' : 'none';

    refresh();
}

function setupTable(checks, bodyId) {

    const body = document.getElementById(bodyId);

    body.innerHTML = '';

    checks.forEach(c => {

        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td style="text-transform:capitalize">${c.value}</td>

            <td>
                <input type="number" class="edit-in tgt" oninput="refresh()">
            </td>

            <td>
                <input type="number" class="edit-in ach" oninput="refresh()">
            </td>

            <td>
                <input type="number" class="edit-in m" oninput="refresh()">
            </td>

            <td>
                <input type="number" class="edit-in d" oninput="refresh()">
            </td>

            <td>
                <input type="number" class="edit-in c" oninput="refresh()">
            </td>
        `;

        body.appendChild(tr);
    });
}

function refresh() {

    const analogData = process('analogBody');
    const techData = process('techBody');

    renderGroup('analog', analogData, '#ff5252');
    renderGroup('tech', techData, '#bb86fc');
}

function process(bodyId) {

    const data = {
        labels: [],
        tgts: [],
        achs: [],
        items: []
    };

    document.querySelectorAll(`#${bodyId} tr`).forEach(row => {

        const name = row.cells[0].innerText;

        const tgt = parseFloat(row.querySelector('.tgt').value) || 0;
        const ach = parseFloat(row.querySelector('.ach').value) || 0;

        const m = parseFloat(row.querySelector('.m').value) || 0;
        const d = parseFloat(row.querySelector('.d').value) || 0;
        const c = parseFloat(row.querySelector('.c').value) || 0;

        data.labels.push(name);
        data.tgts.push(tgt);
        data.achs.push(ach);

        data.items.push({
            name,
            vals: [m, d, c],
            perc: tgt > 0
                ? Math.round((ach / tgt) * 100)
                : 0
        });
    });

    return data;
}

function renderGroup(id, data, color) {

    const bCtx = document
        .getElementById(id + 'Bar')
        .getContext('2d');

    if (charts[id + 'Bar']) {
        charts[id + 'Bar'].destroy();
    }

    charts[id + 'Bar'] = new Chart(bCtx, {

        type: 'bar',

        data: {
            labels: data.labels,

            datasets: [
                {
                    label: 'Target',
                    data: data.tgts,
                    backgroundColor: '#1e293b',
                    barPercentage: 0.6
                },
                {
                    label: 'Achieved',
                    data: data.achs,
                    backgroundColor: color,
                    barPercentage: 0.6
                }
            ]
        },

        options: {
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    const gall = document.getElementById(id + 'Gallery');

    gall.innerHTML = '';

    data.items.forEach((item, i) => {

        const cid = `${id}_p_${i}`;

        const card = document.createElement('div');

        card.className = 'individual-pie-card';

        card.innerHTML = `
            <div class="pie-title">${item.name}</div>

            <div class="canvas-container">
                <canvas id="${cid}"></canvas>
            </div>

            <div class="perc-label" style="color:${color}">
                ${item.perc}%
            </div>
        `;

        gall.appendChild(card);

        new Chart(document.getElementById(cid), {

            type: 'doughnut',

            data: {
                labels: ['M', 'D', 'C'],

                datasets: [{
                    data: item.vals,

                    backgroundColor: [
                        color,
                        '#00e5ff',
                        '#ffeb3b'
                    ],

                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },

            options: {
                maintainAspectRatio: false,

                cutout: '80%',

                plugins: {
                    legend: {
                        display: true,
                        position: 'right',

                        labels: {
                            color: '#fff',
                            font: {
                                size: 9
                            },
                            boxWidth: 8
                        }
                    }
                }
            }
        });
    });
}

window.onload = () => {
    createStaff();
    buildDashboard();
};