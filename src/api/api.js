import config from "../etc/config.json";
import {Buffer} from 'buffer/';
import bridge from "@vkontakte/vk-bridge";

async function token() {
    let data = await bridge.send('VKWebAppCreateHash', {payload: Buffer.from(window["queryParams"].substring(1)).toString('hex')})
    if (data.sign) {
        return JSON.stringify(data)
    }

    return ""
}

export async function fetchSchedule(href, activePanel, week, type, year) {
    if (window["result"] !== undefined) {
        if (window["result"]["week"] !== undefined
            && window["result"]["type"] !== undefined
            && window["result"]["time"] !== undefined) {
            if (window["result"]["week"] === week && window["result"]["year"] === year
                && window["result"]["type"] === type) {
                const now = Math.floor(Date.now() / 1000)
                if (now - window["result"]["time"] < 60) {
                    return [window["result"]["schedule"], null, activePanel]
                }
            }
        }
    }

    let t = await token()
    if (t === "") {
        return [null, config.errors.Token, activePanel]
    }

    const response = await fetch(config.api.href + href, {method: "POST", body: t})

    switch (response.status) {
        case 200:
            window["result"] = {
                "schedule": await response.json(),
                "time": Math.floor(Date.now() / 1000),
                "week": week,
                "type": type,
                "year": year
            }

            return [window["result"]["schedule"], null, activePanel]
        case 204:
            return [null, config.errors.TimeoutExceeded, activePanel]
        case 408:
            return [null, config.errors.RequestsTimeout, activePanel]
        default:
            return [null, config.errors.APINotWorking, activePanel]
    }
}

export async function fetchGroups() {
    let t = await token()
    if (t === "") {
        return [null, config.errors.Token]
    }

    const response = await fetch(config.api.href + '/groups', {method: "POST", body: t})

    switch (response.status) {
        case 200:
            window['groups'] = (await response.json())['response']
            return [window['groups'], null]
        case 204:
            return [null, config.errors.TimeoutExceeded]
        case 408:
            return [null, config.errors.RequestsTimeout]
        default:
            return [null, config.errors.APINotWorking]
    }
}

export async function fetchTeachers() {
    let t = await token()
    if (t === "") {
        return [null, config.errors.Token]
    }

    const response = await fetch(config.api.href + '/teachers', {method: "POST", body: t})

    switch (response.status) {
        case 200:
            window['teachers'] = (await response.json())['response']
            return [window['teachers'], null]
        case 204:
            return [null, config.errors.TimeoutExceeded]
        case 408:
            return [null, config.errors.RequestsTimeout]
        default:
            return [null, config.errors.APINotWorking]
    }
}

export async function updateTooltips() {
    if (window['tooltips'] === null && window['tooltips'] === undefined) {
        return null
    }

    bridge.send('VKWebAppStorageSet', {
        key: 'tooltips',
        value: JSON.stringify(window['tooltips'])
    }).then().catch();
}

export async function updateGroupOrTeacher(openSuccess, openError) {
    window['groupOrTeacher'] = window['groupOrTeacherTemp']

    bridge.send('VKWebAppStorageSet', {
        key: 'schedule',
        value: JSON.stringify(window['groupOrTeacher'])
    }).then(openSuccess()).catch(openError());
}

export function generateInfo() {
    if (window['tooltips'] === undefined) {
        window['tooltips'] = [true]
        while (window['tooltips'].length <= 12) {
            window['tooltips'].push(true)
        }
    }

    if (window['groupOrTeacher'] === undefined) {
        window['groupOrTeacher'] = {"group": "", "teacher": "", "subgroup": ""}
    } else {
        if (window['groupOrTeacher']['group'] === undefined) {
            window['groupOrTeacher']['group'] = ""
        }

        if (window['groupOrTeacher']['teacher'] === undefined) {
            window['groupOrTeacher']['teacher'] = ""
        }

        if (window['groupOrTeacher']['subgroup'] === undefined) {
            window['groupOrTeacher']['subgroup'] = ""
        }
    }

    window["groupOrTeacherTemp"] = {"group": "", "teacher": "", "subgroup": ""}
}

export async function fetchGroupOrTeacher() {
    try {
        if (window['userID'] === 0 || window['userID'] === undefined || window['userID'] === null) {
            window['userID'] = (await bridge.send('VKWebAppGetUserInfo')).id
        }
    } catch (e) {console.error(e)}

    const response = await bridge.send('VKWebAppStorageGet', {
        keys: ['tooltips', 'schedule'],
    })

    const tooltips = response.keys[0].value
    if (tooltips !== "") {
        window['tooltips'] = JSON.parse(tooltips)
    }

    if (window['tooltips'] === undefined) {
        window['tooltips'] = [true]
    }

    if (!Array.isArray(window['tooltips'])) {
        window['tooltips'] = [true]
    }

    while (window['tooltips'].length <= 12) {
        window['tooltips'].push(true)
    }

    if (window['groupOrTeacher'] !== null && window['groupOrTeacher'] !== undefined) {
        return null
    }

    const groupOrTeacher = response.keys[1].value
    if (groupOrTeacher === "") {
        window['groupOrTeacher'] = {"group": "", "teacher": "", "subgroup": ""}
    } else {
        try {
            window['groupOrTeacher'] = JSON.parse(groupOrTeacher)
            if (window['groupOrTeacher'] === undefined) {
                window['groupOrTeacher'] = {"group": "", "teacher": "", "subgroup": ""}
            } else {
                if (window['groupOrTeacher']['group'] === undefined) {
                    window['groupOrTeacher']['group'] = ""
                }

                if (window['groupOrTeacher']['teacher'] === undefined) {
                    window['groupOrTeacher']['teacher'] = ""
                }

                if (window['groupOrTeacher']['subgroup'] === undefined) {
                    window['groupOrTeacher']['subgroup'] = ""
                }
            }
        } catch {
            window['groupOrTeacher'] = {"group": "", "teacher": "", "subgroup": ""}
        }
    }

    window['groupOrTeacherTemp'] = window['groupOrTeacher']

    client()

    return window['groupOrTeacher']
}

function client() {
    bridge.send('VKWebAppGetClientVersion').then((data) => {
        if (data['app']) {
            window['app'] = data['app']
        } else if (data['environment']) {
            window['app'] = data['environment']
        } else {
            window['app'] = 'vk'
        }

        // if (window['app'] !== 'ok') {
        //     ad().then().catch((error) => console.log(error))
        // }
    }).catch(error => console.log(error));
}

// async function ad() {
//     setTimeout(() => {
//         bridge.send('VKWebAppShowBannerAd', {
//             banner_location: 'bottom',
//         }).then().catch((error) => console.log(error));
//     }, 3000)
// }

export const subgroups = [
    {'label': '1 подгруппа', 'value': '1'},
    {'label': '2 подгруппа', 'value': '2'},
    {'label': '1 и 2 подгруппы', 'value': '1 и 2'},
]