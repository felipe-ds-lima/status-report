const loginForm = document.querySelector('#login-form');
const saveConfigCheckbox = document.querySelector('#save-config');
const projectNameInput = document.querySelector('#project-name');
const subdomainInput = document.querySelector('#subdomain');
const usernameInput = document.querySelector('#username');
const apiTokenInput = document.querySelector('#api-token');
const boardIdInput = document.querySelector('#board-id');
const projectKeyInput = document.querySelector('#project-key');
const appBackColorInput = document.querySelector('#app-back-color');
const appTextColorInput = document.querySelector('#app-text-color');
const appPrimaryColorInput = document.querySelector('#app-primary-color');
const appSecondaryColorInput = document.querySelector('#app-secondary-color');
const menuBackColorInput = document.querySelector('#menu-back-color');
const menuTextColorInput = document.querySelector('#menu-text-color');
const logoImageInput = document.querySelector('#logo-image');

window.onload = () => {
    if (localStorage.getItem("saveConfig") === "true" && localStorage.getItem('apiToken')) {
        location.href = './report.html';
    }
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const projectName = projectNameInput.value;
    const subdomain = subdomainInput.value;
    const username = usernameInput.value;
    const apiToken = apiTokenInput.value;
    const boardId = boardIdInput.value;
    const projectKey = projectKeyInput.value;
    const appBackColor = appBackColorInput.value;
    const appTextColor = appTextColorInput.value;
    const appPrimaryColor = appPrimaryColorInput.value;
    const appSecondaryColor = appSecondaryColorInput.value;
    const menuBackColor = menuBackColorInput.value;
    const menuTextColor = menuTextColorInput.value;
    const logoImageRaw = logoImageInput.files[0];
    let logoImage = null;
    if (logoImageRaw) {
        await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                logoImage = e.target.result;
                resolve();
            }
            reader.readAsDataURL(logoImageRaw);
        })
    }


    const saveTech = saveConfigCheckbox.checked ? localStorage : sessionStorage;

    localStorage.setItem('saveConfig', saveConfigCheckbox.checked)
    saveTech.setItem('projectName', projectName);
    saveTech.setItem('subdomain', subdomain);
    saveTech.setItem('username', username);
    saveTech.setItem('apiToken', apiToken);
    saveTech.setItem('boardId', boardId);
    saveTech.setItem('projectKey', projectKey);
    saveTech.setItem('logoImage', logoImage);
    saveTech.setItem('appBackColor', appBackColor);
    saveTech.setItem('appTextColor', appTextColor);
    saveTech.setItem('appPrimaryColor', appPrimaryColor);
    saveTech.setItem('appSecondaryColor', appSecondaryColor);
    saveTech.setItem('menuBackColor', menuBackColor);
    saveTech.setItem('menuTextColor', menuTextColor);
    location.href = './report.html';
});