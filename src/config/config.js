'use strict';

const userId = JSON.parse(sessionStorage.getItem('auth_data'))['user_id'];

// Globals (default settings)
let addonsEnabled = false;
let addonsHost = 'localhost';
let addonsPort = 9001;
let extraLogging = false;

api.windowResized((event, width, height) => {
    const windowWidthEntry = document.getElementById('window_width');
    const windowHeightEntry = document.getElementById('window_height');
    windowWidthEntry.value = width;
    windowHeightEntry.value = height;
    api.storeSet('user_data.' + userId + '.screen_width', width);
    api.storeSet('user_data.' + userId + '.screen_height', height);
});

async function getSteamUserDataPath() {
    const defaultPath = document.getElementById('steam_user_data_path').innerText;

    const steamUserDataPath = await api.getPath(defaultPath);
    if (steamUserDataPath !== null) {
        document.getElementById('steam_user_data_path').innerText = steamUserDataPath;
        await api.storeSet('user_data.' + userId + '.steam_user_data_path', steamUserDataPath);
        sessionStorage.setItem('steam_user_data_path', steamUserDataPath);
    }

    // Recall the main function to populate the rest of the display
    main();
}

async function getSteamProfiles() {
    const steamUserDataPath = document.getElementById('steam_user_data_path').innerText;

    // Get all Steam profiles on disk
    const steamProfiles = await api.getSteamProfiles(steamUserDataPath);
    const profileNames = Object.keys(steamProfiles);

    // If a profile is already saved, remember it
    let selectedProfile = await api.storeGet('user_data.' + userId + '.steam_profile');
    if (profileNames.length !== 0 && selectedProfile === null) {
        selectedProfile = steamProfiles[profileNames[0]];
        await api.storeSet('user_data.' + userId + '.steam_profile', selectedProfile);
        sessionStorage.setItem('steam_profile', selectedProfile);
    }

    // Build the combo box
    const comboBox = document.querySelector('#steam_profile');
    profileNames.forEach((profileName) => {
        const option = document.createElement('option');
        option.text = profileName;
        option.value = steamProfiles[profileName];

        // Set the selected profile to the saved profile if there is one
        if (steamProfiles[profileName] === selectedProfile) {
            option.selected = true;
        }

        comboBox.appendChild(option);
    });

    // Link the combo box selected option to the saved Steam profile
    comboBox.addEventListener('change', async () => {
        const selectedOption = comboBox.options[comboBox.selectedIndex];
        const selectedProfile = selectedOption.value;
        await api.storeSet('user_data.' + userId + '.steam_profile', selectedProfile);
        sessionStorage.setItem('steam_profile', selectedProfile);

        // Populate the combo box for Rocksmith profiles
        await getRocksmithProfiles();
    });
}

async function getRocksmithProfiles() {
    const steamUserDataPath = document.getElementById('steam_user_data_path').innerText;
    const steamProfile = await api.storeGet('user_data.' + userId + '.steam_profile');

    // Get all Rocksmith profiles on disk
    const rocksmithProfiles = await api.getRocksmithProfiles(steamUserDataPath, steamProfile);
    const profileNames = Object.keys(rocksmithProfiles);

    // If a profile is already saved, remember it
    let selectedProfile = await api.storeGet('user_data.' + userId + '.rocksmith_profile');
    if (profileNames.length !== 0 && selectedProfile === null) {
        selectedProfile = rocksmithProfiles[profileNames[0]];
        await api.storeSet('user_data.' + userId + '.rocksmith_profile', selectedProfile);
        sessionStorage.setItem('rocksmith_profile', selectedProfile);
    }

    // Build the combo box
    const comboBox = document.querySelector('#rocksmith_profile');
    profileNames.forEach((profileName) => {
        const option = document.createElement('option');
        option.text = profileName;
        option.value = rocksmithProfiles[profileName];

        // Set the selected profile to the saved profile if there is one
        if (rocksmithProfiles[profileName] === selectedProfile) {
            option.selected = true;
        }

        comboBox.appendChild(option);
    });

    // Link the combo box selected option to the saved Rocksmith profile
    comboBox.addEventListener('change', async () => {
        const selectedOption = comboBox.options[comboBox.selectedIndex];
        const selectedProfile = selectedOption.value;
        await api.storeSet('user_data.' + userId + '.rocksmith_profile', selectedProfile);
        sessionStorage.setItem('rocksmith_profile', selectedProfile);
    });
}

async function getPreferences() {
    const preferredPath = await api.storeGet('user_data.' + userId + '.preferred_path');

    // Update the combo box
    const comboBox = document.querySelector('#preferred_path');

    // Link the combo box selected option to the user's preferred path
    comboBox.addEventListener('change', async () => {
        const selectedOption = comboBox.options[comboBox.selectedIndex];
        const selectedPath = selectedOption.value;
        await api.storeSet('user_data.' + userId + '.preferred_path', selectedPath);
        sessionStorage.setItem('preferred_path', selectedPath);
    });

    // Update the combo box with the preferred value
    if (preferredPath !== null) {
        comboBox.value = preferredPath;

        let event = new Event('change');
        comboBox.dispatchEvent(event);
    }

    const windowWidthEntry = document.getElementById('window_width');
    const windowHeightEntry = document.getElementById('window_height');

    const { width, height } = await api.getWindowSize();
    windowWidthEntry.value = width;
    windowHeightEntry.value = height;

    windowWidthEntry.addEventListener('change', async () => {
        let windowWidth = windowWidthEntry.value;
        let windowHeight = windowHeightEntry.value;
        api.setWindowSize(windowWidth, windowHeight);
        api.storeSet('user_data.' + userId + '.screen_width', width);
    });

    windowHeightEntry.addEventListener('change', async () => {
        let windowWidth = windowWidthEntry.value;
        let windowHeight = windowHeightEntry.value;
        api.setWindowSize(windowWidth, windowHeight);
        api.storeSet('user_data.' + userId + '.screen_height', height);
    });
}

// TODO wrap config into a class so when addon values are changed we can use
// the saved values to auto-restart the server with the new values
async function initAddonConfig() {
    const addonsEnabledCheckbox = document.querySelector('#addons_enabled');
    const addonsHostEntry = document.querySelector('#addons_host');
    const addonsPortEntry = document.querySelector('#addons_port');

    let savedAddonsEnabled = await api.storeGet('user_data.' + userId + '.addons_enabled');
    if (savedAddonsEnabled === null) {
        api.storeSet('user_data.' + userId + '.addons_enabled', addonsEnabled);
    }
    else {
        addonsEnabled = savedAddonsEnabled;
    }
    addonsEnabledCheckbox.checked = addonsEnabled;

    let savedAddonsHost = await api.storeGet('user_data.' + userId + '.addons_host');
    if (savedAddonsHost === null) {
        api.storeSet('user_data.' + userId + '.addons_host', addonsHost);
    }
    else {
        addonsHost = savedAddonsHost;
    }
    addonsHostEntry.value = addonsHost;

    let savedAddonsPort = await api.storeGet('user_data.' + userId + '.addons_port');
    if (savedAddonsPort === null) {
        api.storeSet('user_data.' + userId + '.addons_port', addonsPort);
    }
    else {
        addonsPort = savedAddonsPort;
    }
    addonsPortEntry.value = addonsPort;

    addonsEnabledCheckbox.addEventListener('change', async () => {
        if (addonsEnabledCheckbox.checked) {
            api.enableAddons(addonsHost, addonsPort);
        }
        else {
            api.disableAddons();
        }
        api.storeSet('user_data.' + userId + '.addons_enabled', addonsEnabledCheckbox.checked);
    });

    addonsHostEntry.addEventListener('change', async () => {
        addonsHost = addonsHostEntry.value;
        if (addonsEnabledCheckbox.checked) {
            api.disableAddons();
            api.enableAddons(addonsHost, addonsPort);
        }
        api.storeSet('user_data.' + userId + '.addons_host', addonsHost);
    });

    addonsPortEntry.addEventListener('change', async () => {
        addonsPort = addonsPortEntry.value;
        if (addonsEnabledCheckbox.checked) {
            api.disableAddons();
            api.enableAddons(addonsHost, addonsPort);
        }
        api.storeSet('user_data.' + userId + '.addons_port', addonsPort);
    });
}

async function initDebugConfig() {
    const extraLoggingCheckbox = document.querySelector('#extra_logging');

    let savedExtraLogging = await api.storeGet('user_data.' + userId + '.extra_logging');
    if (savedExtraLogging === null) {
        api.storeSet('user_data.' + userId + '.extra_logging', extraLogging);
    }
    else {
        extraLogging = savedExtraLogging;
    }
    extraLoggingCheckbox.checked = extraLogging;

    extraLoggingCheckbox.addEventListener('change', async () => {
        api.storeSet('user_data.' + userId + '.extra_logging', extraLoggingCheckbox.checked);
        sessionStorage.setItem('extra_logging', extraLoggingCheckbox.checked);
    });

    if (extraLogging !== null) {
        sessionStorage.setItem('extra_logging', extraLogging);
    }
}

async function main() {
    const version = await getVersion();
    document.title += ' v' + version;

    // Get preferences
    await getPreferences();

    // Populate Steam user data path if there is a default set
    let steamUserDataPath = await api.storeGet('user_data.' + userId + '.steam_user_data_path');
    if (steamUserDataPath === null) {
        steamUserDataPath = await api.storeGet('default_steam_user_data_path');
        api.storeSet('user_data.' + userId + '.steam_user_data_path', steamUserDataPath);
    }
    if (steamUserDataPath !== null) {
        document.getElementById('steam_user_data_path').innerText = steamUserDataPath;
        sessionStorage.setItem('steam_user_data_path', steamUserDataPath);
    }

    // Populate the combo box for Steam profiles
    await getSteamProfiles();

    // Populate the combo box for Rocksmith profiles
    await getRocksmithProfiles();

    await initAddonConfig();

    await initDebugConfig();
}

main();