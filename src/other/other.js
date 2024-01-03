import bridge from "@vkontakte/vk-bridge";
import React from "react";
import {token} from "./config";
import {Snackbar} from "@vkontakte/vkui";
import {Icon28ErrorCircleOutline} from "@vkontakte/icons";

const capitalizeFirstLetter = (str) => {
    let chars = str.split('');
    chars[0] = chars[0].toUpperCase();
    return chars.join('');
}

const addDays = (date, days) => {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

const getStatusText = (statusCode) => {
    switch (statusCode) {
        case 100: return 'Continue';
        case 101: return 'Switching Protocols';
        case 102: return 'Processing';
        case 103: return 'Early Hints';
        case 200: return 'OK';
        case 201: return 'Created';
        case 202: return 'Accepted';
        case 203: return 'Non-Authoritative Information';
        case 204: return 'No Content';
        case 205: return 'Reset Content';
        case 206: return 'Partial Content';
        case 300: return 'Multiple Choices';
        case 301: return 'Moved Permanently';
        case 302: return 'Found';
        case 303: return 'See Other';
        case 304: return 'Not Modified';
        case 305: return 'Use Proxy';
        case 307: return 'Temporary Redirect';
        case 400: return 'Bad Request';
        case 401: return 'Unauthorized';
        case 402: return 'Payment Required';
        case 403: return 'Forbidden';
        case 404: return 'Not Found';
        case 405: return 'Method Not Allowed';
        case 406: return 'Not Acceptable';
        case 407: return 'Proxy Authentication Required';
        case 408: return 'Request Timeout';
        case 409: return 'Conflict';
        case 410: return 'Gone';
        case 411: return 'Length Required';
        case 412: return 'Precondition Failed';
        case 413: return 'Payload Too Large';
        case 414: return 'URI Too Long';
        case 415: return 'Unsupported Media Type';
        case 416: return 'Range Not Satisfiable';
        case 417: return 'Expectation Failed';
        case 418: return "I'm a teapot";
        case 421: return 'Misdirected Request';
        case 426: return 'Upgrade Required';
        case 428: return 'Precondition Required';
        case 429: return 'Too Many Requests';
        case 431: return 'Request Header Fields Too Large';
        case 451: return 'Unavailable For Legal Reasons';
        case 500: return 'Internal Server Error';
        case 501: return 'Not Implemented';
        case 502: return 'Bad Gateway';
        case 503: return 'Service Unavailable';
        case 504: return 'Gateway Timeout';
        case 505: return 'HTTP Version Not Supported';
        case 511: return 'Network Authentication Required';
        default: return 'Unknown';
    }
}

async function fetchSchedule() {
    if (window['userID'] === 0 || window['userID'] === undefined || window['userID'] === null) {
        window['userID'] = (await bridge.send('VKWebAppGetUserInfo')).id
    }

    if (window['groupOrTeacher'] !== null && window['groupOrTeacher'] !== undefined) {
        return null
    }

    const response = await bridge.send(
        "VKWebAppCallAPIMethod",
        {
            "method": "storage.get",
            "params": {
                "v": "5.154",
                "access_token": token,
                "key": "schedule",
                "user_id": window['userID']
            }
        }
    )

    window['groupOrTeacher'] = JSON.parse(await response.response[0].value)
}

const openAnyError = (snackbar, setSnackbar) => {
    if (snackbar) return;
    setSnackbar(<Snackbar onClose={() => setSnackbar(null)}
                          before={<Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)"/>}
        >Произошла ошибка</Snackbar>,
    );
};

export {capitalizeFirstLetter, addDays, getStatusText, fetchSchedule, openAnyError};