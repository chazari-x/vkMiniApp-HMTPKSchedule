import crypto from "crypto-browserify";
import config from "../etc/config.json";
import {Buffer} from 'buffer/';
import bridge from "@vkontakte/vk-bridge";

function token() {
    return crypto.publicEncrypt({
        key: config.api.publicKey, padding: crypto.constants.RSA_PKCS1_PADDING
    }, Buffer.from(config.api.secretKey + Math.floor(Date.now() / 1000))).toString('hex')
}

export async function fetchSchedule(href, activePanel, week, type) {
    if (window["result"] !== undefined) {
        if (window["result"]["week"] !== undefined
            && window["result"]["type"] !== undefined
            && window["result"]["time"] !== undefined) {
            if (window["result"]["week"] === week
                && window["result"]["type"] === type) {
                const now = Math.floor(Date.now() / 1000)
                if (now - window["result"]["time"] < 60) {
                    return [window["result"]["schedule"], null, activePanel]
                }
            }
        }
    }

    const response = await fetch(config.api.href + href, {method: "POST", body: `Bearer ${String(token())}`})

    switch (response.status) {
        case 200:
            window["result"] = {
                "schedule": await response.json(),
                "time": Math.floor(Date.now() / 1000),
                "week": week,
                "type": type
            }

            return [window["result"]["schedule"], null, activePanel]
        case 204:
            return [null, config.errors.TimeoutExceeded, activePanel]
        default:
            return [null, config.errors.APINotWorking, activePanel]
    }
}

export async function fetchGroups() {
    return fetch(config.api.href + '/groups', {method: "POST", body: `Bearer ${String(token())}`})
}

export async function fetchTeachers() {
    return fetch(config.api.href + '/teachers', {method: "POST", body: `Bearer ${String(token())}`})
}

export async function updateTooltips() {
    if (window['userID'] === 0 || window['userID'] === undefined || window['userID'] === null) {
        window['userID'] = (await bridge.send('VKWebAppGetUserInfo')).id
    }

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

export async function fetchGroupOrTeacher() {
    if (window['userID'] === 0 || window['userID'] === undefined || window['userID'] === null) {
        window['userID'] = (await bridge.send('VKWebAppGetUserInfo')).id
    }

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

    while (window['tooltips'].length < 10 + 1) {
        window['tooltips'].push(true)
    }

    if (window['groupOrTeacher'] !== null && window['groupOrTeacher'] !== undefined) {
        return null
    }

    const groupOrTeacher = response.keys[1].value
    if (groupOrTeacher === "") {
        window['groupOrTeacher'] = {"group": "", "teacher": ""}
    } else {
        try {
            window['groupOrTeacher'] = JSON.parse(groupOrTeacher)
            if (window['groupOrTeacher'] === undefined) {
                window['groupOrTeacher'] = {"group": "", "teacher": ""}
            } else if (window['groupOrTeacher']['group'] === undefined || window['groupOrTeacher']['teacher'] === undefined) {
                window['groupOrTeacher'] = {"group": "", "teacher": ""}
            }
        } catch {
            window['groupOrTeacher'] = {"group": "", "teacher": ""}
        }
    }

    return window['groupOrTeacher']
}