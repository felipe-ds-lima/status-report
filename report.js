let sprints = []
let currentSprintId = 0;
let currentSprint = null;
let sprintTasks = [];
let allTasks = [];
let sprintStatusChart = null;
let totalStatusChart = null;
let sprintTaskForDev = null;
let totalTaskForEnv = null;

onStart = () => {
    if (localStorage.getItem("saveConfig") === "true" && !localStorage.getItem('apiToken')) {
        location.href = './index.html';
    } else if (localStorage.getItem("saveConfig") === "false" && !sessionStorage.getItem('apiToken')) {
        location.href = './index.html';
    }

    const logoEl = document.querySelector(".logo");
    if (logoImage) {
        const image = document.createElement("img");
        image.src = logoImage;
        logoEl.appendChild(image);
    } else {
        logoEl.innerHTML = projectName
    }
    if (appBackColor && appTextColor && appPrimaryColor && appSecondaryColor && menuBackColor && menuTextColor) {
        const style = `--app-back-color: ${appBackColor}; --app-text-color: ${appTextColor}; --primary-color: ${appPrimaryColor}; --secondary-color: ${appSecondaryColor}; --menu-back-color: ${menuBackColor}; --menu-text-color: ${menuTextColor};`
        document.body.style = style;
    }
}
window.onresize = () => {
    updateCharts();
}

function mountSprintStatusChart() {
    const data = {}

    for (let i = 0; i < sprintTasks.length; i++) {
        const task = sprintTasks[i];
        if (!data[task.fields.status.name]) {
            data[task.fields.status.name] = 1;
        } else {
            data[task.fields.status.name] += 1;
        }
    }


    const sprintStatusChartCtx = document.getElementById("sprint-status-chart");

    sprintStatusChart && sprintStatusChart.destroy && sprintStatusChart.destroy();

    sprintStatusChart = new Chart(sprintStatusChartCtx, {
        type: "pie",
        data: {
            labels: Object.keys(data),
            datasets: [
                {
                    data: Object.values(data),
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                },
                title: {
                    display: true,
                    text: "Status da Sprint",
                },
            },
        },
    });
}

function mountTotalStatusChart() {
    const data = {}

    for (let i = 0; i < allTasks.length; i++) {
        const task = allTasks[i];
        if (!data[task.fields.status.name]) {
            data[task.fields.status.name] = 1;
        } else {
            data[task.fields.status.name] += 1;
        }
    }


    const totalStatusChartCtx = document.getElementById("total-status-chart");

    totalStatusChart && totalStatusChart.destroy && totalStatusChart.destroy();

    totalStatusChart = new Chart(totalStatusChartCtx, {
        type: "pie",
        data: {
            labels: Object.keys(data),
            datasets: [
                {
                    data: Object.values(data),
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                },
                title: {
                    display: true,
                    text: "Status total do projeto",
                },
            },
        },
    });
}

function mountSprintTaskForDev() {
    const data = {}
    for (let i = 0; i < sprintTasks.length; i++) {
        const task = sprintTasks[i];
        const name = task.fields.assignee.displayName.split(' ')[0];
        if (!data[name]) {
            data[name] = {};
        }
    }
    for (let i = 0; i < sprintTasks.length; i++) {
        const task = sprintTasks[i];
        const name = task.fields.assignee.displayName.split(' ')[0];
        if (!data[name][task.fields.status.name]) {
            data[name][task.fields.status.name] = 1;
        } else {
            data[name][task.fields.status.name] += 1;
        }
    }
    const statusesData = {}
    for (let i = 0; i < Object.keys(data).length; i++) {
        const userKey = Object.keys(data)[i];
        const statuses = Object.keys(data[userKey])
        for (let j = 0; j < statuses.length; j++) {
            if (!statusesData[statuses[j]]) {
                statusesData[statuses[j]] = {}
            }
        }
    }
    for (let i = 0; i < Object.keys(data).length; i++) {
        const userKey = Object.keys(data)[i];
        for (let j = 0; j < Object.keys(statusesData).length; j++) {
            const statusKey = Object.keys(statusesData)[j];
            statusesData[statusKey][i] = data[userKey][statusKey] || 0;
        }

    }

    const sprintTaskForDevCtx = document.getElementById(
        "sprint-task-for-dev"
    );

    sprintTaskForDev && sprintTaskForDev.destroy && sprintTaskForDev.destroy();

    sprintTaskForDev = new Chart(sprintTaskForDevCtx, {
        type: "bar",
        data: {
            labels: Object.keys(data),
            datasets: Object.keys(statusesData).map((status, index) => {
                return {
                    label: status,
                    data: Object.values(statusesData[status]),
                }
            }),
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Tarefas por usuário",
                },
            },
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                },
            },
        },
    });
}

function mountTotalTaskForEnv() {
    const data = {}
    for (let i = 0; i < sprintTasks.length; i++) {
        const task = sprintTasks[i];
        for (let j = 0; j < task.fields.labels.length; j++) {
            const name = task.fields.labels[j];
            if (!data[name]) {
                data[name] = 1;
            } else {
                data[name] += 1;
            }
        }
    }

    const totalTaskForEnvtCtx = document.getElementById(
        "sprint-task-for-env"
    );

    totalTaskForEnv && totalTaskForEnv.destroy && totalTaskForEnv.destroy();

    totalTaskForEnv = new Chart(totalTaskForEnvtCtx, {
        type: "bar",
        data: {
            labels: ['Categorias'],
            datasets: Object.keys(data).map((category, index) => {
                return {
                    label: category,
                    data: [data[category]],
                }
            }),
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Tarefa por categoria",
                },
            },
            responsive: true,
        },
    });
}

function mountTasksTable() {
    const table = document.querySelector("#task-list-table");
    const tbody = table.querySelector("tbody");
    tbody.innerHTML = "";
    for (let i = 0; i < sprintTasks.length; i++) {
        const task = sprintTasks[i];
        const trEl = document.createElement("tr");
        trEl.innerHTML = `<td>${task.fields.summary}</td><td>${task.fields.assignee.displayName}</td><td>${task.fields.status.name}</td>`
        tbody.appendChild(trEl);
    }
}

function buildTopBar() {
    const sprintNameEl = document.querySelector(".sprint-name");
    sprintNameEl.innerHTML = currentSprint.name;

    const sprintTaskCount = sprintTasks.length;
    const totalTaskCount = allTasks.length;
    const sprintTaskConcluded = sprintTasks.reduce((acc, task) => {
        return acc + (task.fields.status.statusCategory.key.toLowerCase() === "done" ? 1 : 0);
    }, 0);
    const totalTaskConcluded = allTasks.reduce((acc, task) => {
        return acc + (task.fields.status.statusCategory.key.toLowerCase() === "done" ? 1 : 0);
    }, 0);
    const sprintTaskConcludedPercent = sprintTaskConcluded / sprintTaskCount * 100;
    const totalTaskConcludedPercent = totalTaskConcluded / totalTaskCount * 100;

    const sprintTaskCountEl = document.querySelector(".sprint-task-count");
    sprintTaskCountEl.innerHTML = sprintTaskCount;
    const sprintTaskConcludedEl = document.querySelector(".sprint-task-concluded");
    sprintTaskConcludedEl.innerHTML = sprintTaskConcludedPercent + "%";
    const totalTaskCountEl = document.querySelector(".total-task-count");
    totalTaskCountEl.innerHTML = totalTaskCount;
    const totalTaskConcludedEl = document.querySelector(".total-task-concluded");
    totalTaskConcludedEl.innerHTML = totalTaskConcludedPercent + "%";
}

async function changeCurrentSprint(sprintId) {
    currentSprintId = sprintId;
    currentSprint = sprints.find(sprint => sprint.id === sprintId);

    for (let i = 0; i < allTasks.length; i++) {
        if (allTasks[i].fields.sprint?.id === sprintId || allTasks[i].fields.closedSprints && allTasks[i].fields.closedSprints[0] && allTasks[i].fields.closedSprints[0].id === sprintId) {
            sprintTasks.push(allTasks[i]);
        }
    }

    sprintTasks = []
    for (let i = 0; i < allTasks.length; i++) {
        const task = allTasks[i];

        if (task.fields.sprint?.id === sprintId) {
            sprintTasks.push(task);
        }
    }

    buildScreen()
}

async function getSprints() {
    if (localStorage.getItem('sprints')) {
        sprints = JSON.parse(localStorage.getItem('sprints'));
        for (let i = 0; i < sprints.length; i++) {
            if (sprints[i].state == "active") {
                currentSprintId = sprints[i].id;
                break;
            }
        }
        if (!currentSprintId) {
            for (let i = 0; i < sprints.length; i++) {
                if (sprints[i].state == "closed") {
                    currentSprintId = sprints[i].id;
                }
            }
        }
        if (!currentSprintId && sprints.length) {
            currentSprintId = sprints[0].id
        }
        return;
    }
    let response;
    try {
        response = await fetch(`${baseUrl}/agile/1.0/board/${boardId}/sprint`, {
            headers: {
                "Authorization": `Basic ${authKey}`,
                "Accept": "application/json",
                "Content-Type": "application/json;charset=UTF-8"
            },
        });
    } catch (error) {
        console.error(error);
        alert("Erro ao buscar sprints, tente acessar o site: https://cors-anywhere.herokuapp.com/corsdemo e solicite acesso.");
        return;
    }
    const data = await response.json();

    for (let i = 0; i < data.values.length; i++) {
        const sprint = data.values[i];
        if (sprint.state == "active") {
            currentSprintId = sprint.id;
        }
        sprints.push(data.values[i]);
    }
    if (!currentSprintId) {
        for (let i = 0; i < sprints.length; i++) {
            if (sprints[i].state == "closed") {
                currentSprintId = sprints[i].id;
            }
        }
    }
    if (!currentSprintId && sprints.length) {
        currentSprintId = sprints[0].id
    }

    localStorage.setItem('sprints', JSON.stringify(sprints));
}

async function getAllTasks() {
    if (localStorage.getItem('allTasks')) {
        allTasks = JSON.parse(localStorage.getItem('allTasks'));
        return;
    }

    const response = await fetch(`${baseUrl}/agile/1.0/board/${boardId}/issue?maxResults=200`, {
        headers: {
            "Authorization": `Basic ${authKey}`,
            "Accept": "application/json",
            "Content-Type": "application/json;charset=UTF-8"
        }
    });

    const data = await response.json();

    for (let i = 0; i < data.issues.length; i++) {
        if (['tarefa', 'task', 'tarefas', 'tasks'].includes(data.issues[i].fields.issuetype?.name.toLowerCase())) {
            allTasks.push(data.issues[i]);
        }
    }

    localStorage.setItem('allTasks', JSON.stringify(allTasks));
}

async function getApiData() {
    await getAllTasks();
    await getSprints();
}

function updateCharts() {
    mountSprintStatusChart();
    mountTotalStatusChart();
    mountSprintTaskForDev();
    mountTotalTaskForEnv();
}

function buildMenu() {
    const sprintButtons = document.querySelector(".sprint-buttons");
    sprintButtons.innerHTML = "";

    for (let i = 0; i < sprints.length; i++) {
        let sprint = sprints[i];
        const button = document.createElement("button");
        button.type = "button";
        button.id = "sprint-button-" + sprint.id;
        button.innerHTML = sprint.name;
        button.onclick = () => {
            changeCurrentSprint(sprint.id)
        };
        button.classList.add("update-button");
        if (sprint.id === currentSprintId) {
            button.classList.add("active");
        }
        sprintButtons.appendChild(button);
    }
}

function buildScreen() {
    buildMenu();
    buildTopBar();
    updateCharts();
    mountTasksTable();
}

async function main() {
    await getApiData();
    changeCurrentSprint(currentSprintId);
}

onStart();
main();