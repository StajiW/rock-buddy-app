export function logMessage(message: any) {
    console.log(message);

    let text = message;
    if (typeof message !== "string") {
        text = JSON.stringify(message);
    }

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    window.api.appendFile('rock-buddy-log.txt', formattedDate + ': ' + text + "\n");
}

export function approxEqual(a: number, b: number, tolerance = 0.0001): boolean {
    return Math.abs(a - b) <= tolerance;
}

//Convert a number to a duration "hh:mm:ss"
export function durationString(tSeconds: number) {
    let hh = Math.floor(tSeconds / 3600);
    let mm = Math.floor((tSeconds - (hh * 3600)) / 60);
    let ss = Math.floor(tSeconds % 60);

    let hhStr = hh.toString();
    let mmStr = mm.toString();
    let ssStr = ss.toString();
    if (hh < 10) { hhStr = "0" + hhStr; }
    if (mm < 10) { mmStr = "0" + mmStr; }
    if (ss < 10) { ssStr = "0" + ssStr; }

    if (hh > 0) {
        return hhStr + ":" + mmStr + ":" + ssStr;
    } else {
        return mmStr + ":" + ssStr;
    }
}

// Get all available paths in the provided song
export function getAvailablePaths(arrangementData: any) {
    let pathGroups: { [key: string]: Array<any> } = {
        lead: [],
        altLead: [],
        bonusLead: [],
        rhythm: [],
        altRhythm: [],
        bonusRhythm: [],
        bass: [],
        altBass: [],
        bonusBass: [],
    };

    arrangementData.forEach((arrangement: any) => {
        const hash = arrangement['arrangementID'];
        const type = arrangement['type'];
        const isAlt = arrangement['isAlternateArrangement'];
        const isBonus = arrangement['isBonusArrangement'];

        if (type === 'Lead') {
            if (isBonus) {
                pathGroups.bonusLead.push({
                    name: 'Bonus ' + type,
                    hash: hash
                });
            }
            else if (isAlt) {
                pathGroups.altLead.push({
                    name: 'Alternate ' + type,
                    hash: hash
                });
            }
            else {
                pathGroups.lead.push({
                    name: type,
                    hash: hash
                });
            }
        }
        else if (type === 'Rhythm') {
            if (isBonus) {
                pathGroups.bonusRhythm.push({
                    name: 'Bonus ' + type,
                    hash: hash
                });
            }
            else if (isAlt) {
                pathGroups.altRhythm.push({
                    name: 'Alternate ' + type,
                    hash: hash
                });
            }
            else {
                pathGroups.rhythm.push({
                    name: type,
                    hash: hash
                });
            }
        }
        else if (type === 'Bass') {
            if (isBonus) {
                pathGroups.bonusBass.push({
                    name: 'Bonus ' + type,
                    hash: hash
                });
            }
            else if (isAlt) {
                pathGroups.altBass.push({
                    name: 'Alternate ' + type,
                    hash: hash
                });
            }
            else {
                pathGroups.bass.push({
                    name: type,
                    hash: hash
                });
            }
        }
    });

    // Update names to include numbers if there is more than one of a path
    if (pathGroups.lead.length > 1) {
        let index = 1;
        pathGroups.lead.forEach((path) => {
            if (index > 1) {
                path.name += ' ' + index;
            }
            index++;
        });
    }

    if (pathGroups.altLead.length > 1) {
        let index = 1;
        pathGroups.altLead.forEach((path) => {
            path.name += ' ' + index;
            index++;
        });
    }

    if (pathGroups.bonusLead.length > 1) {
        let index = 1;
        pathGroups.bonusLead.forEach((path) => {
            path.name += ' ' + index;
            index++;
        });
    }

    if (pathGroups.rhythm.length > 1) {
        let index = 1;
        pathGroups.rhythm.forEach((path) => {
            if (index > 1) {
                path.name += ' ' + index;
            }
            index++;
        });
    }

    if (pathGroups.altRhythm.length > 1) {
        let altRhythmIndex = 1;
        pathGroups.altRhythm.forEach((path) => {
            path.name += ' ' + altRhythmIndex;
            altRhythmIndex++;
        });
    }

    if (pathGroups.bonusRhythm.length > 1) {
        let index = 1;
        pathGroups.bonusRhythm.forEach((path) => {
            path.name += ' ' + index;
            index++;
        });
    }

    if (pathGroups.bass.length > 1) {
        let index = 1;
        pathGroups.bass.forEach((path) => {
            if (index > 1) {
                path.name += ' ' + index;
            }
            index++;
        });
    }

    if (pathGroups.altBass.length > 1) {
        let index = 1;
        pathGroups.altBass.forEach((path) => {
            path.name += ' ' + index;
            index++;
        });
    }

    if (pathGroups.bonusBass.length > 1) {
        let index = 1;
        pathGroups.bonusBass.forEach((path) => {
            path.name += ' ' + index;
            index++;
        });
    }

    // Add paths to the array in the proper order for display
    let paths: any[] = [];
    pathGroups.lead.forEach((path) => {
        paths.push(path);
    });
    pathGroups.altLead.forEach((path) => {
        paths.push(path);
    });
    pathGroups.bonusLead.forEach((path) => {
        paths.push(path);
    });
    pathGroups.rhythm.forEach((path) => {
        paths.push(path);
    });
    pathGroups.altRhythm.forEach((path) => {
        paths.push(path);
    });
    pathGroups.bonusRhythm.forEach((path) => {
        paths.push(path);
    });
    pathGroups.bass.forEach((path) => {
        paths.push(path);
    });
    pathGroups.altBass.forEach((path) => {
        paths.push(path);
    });
    pathGroups.bonusBass.forEach((path) => {
        paths.push(path);
    });

    return paths;
}

export async function getVersion(): Promise<string | null> {
    let version = sessionStorage.getItem('version');
    if (version === null) {
        version = await window.api.getVersion();

        if (version !== null) {
            sessionStorage.setItem('version', version);
        }
    }

    return version;
}

export async function post(url: string, data: any) {
    // Add version number to the data
    data['version'] = await getVersion();

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    // If the response is not OK log the response text
    if (!response.ok) {
        console.error(response.status + ': ' + response.statusText);
        console.error(await response.text());

        // Cloudflare returns a status of 530 when communication with the server is lost
        if (response.status === 530) {
            window.api.error("Communication with server lost.");
        }
        else {
            window.api.error("Bad response returned from server. See console for details.");
        }
    }

    const responseJson = await response.json();
    if (responseJson.hasOwnProperty('error') && responseJson['error'] === 'Invalid API key.') {
        window.api.error("Your API key has expired.\n\nPlease log back in to verify your identity.");
        window.location.href = './logout.html';
    }

    return responseJson;
}