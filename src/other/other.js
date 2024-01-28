import bridge from "@vkontakte/vk-bridge";
import React from "react";
import config from "./config.json";
import {Group, HorizontalScroll, Snackbar, Tabs, TabsItem, Tooltip, TooltipContainer} from "@vkontakte/vkui";
import {Icon28ErrorCircleOutline} from "@vkontakte/icons";
import {format} from "@vkontakte/vkui/dist/lib/date";

const capitalizeFirstLetter = (str) => {
    let chars = str.split('');
    chars[0] = chars[0].toUpperCase();
    return chars.join('');
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

const update = (tooltip, setTooltip) => {
    window["tooltips"][tooltip] = false
    setTooltip(false)
    updateTooltips().then().catch()
}

async function updateTooltips() {
    if (window['userID'] === 0 || window['userID'] === undefined || window['userID'] === null) {
        window['userID'] = (await bridge.send('VKWebAppGetUserInfo')).id
    }

    if (window['tooltips'] === null && window['tooltips'] === undefined) {
        return null
    }

    await bridge.send(
        "VKWebAppCallAPIMethod",
        {
            "method": "storage.set",
            "params": {
                "v": "5.154",
                "access_token": config.token,
                "key": "tooltips",
                "user_id": window['userID'],
                "value": JSON.stringify(window['tooltips'])
            }
        }
    ).then().catch()
}

async function fetchTooltips() {
    if (window['userID'] === 0 || window['userID'] === undefined || window['userID'] === null) {
        window['userID'] = (await bridge.send('VKWebAppGetUserInfo')).id
    }

    if (window['tooltips'] !== null && window['tooltips'] !== undefined) {
        return null
    }

    const response = await bridge.send(
        "VKWebAppCallAPIMethod",
        {
            "method": "storage.get",
            "params": {
                "v": "5.154",
                "access_token": config.token,
                "key": "tooltips",
                "user_id": window['userID']
            }
        }
    )

    const tooltips = await response.response[0].value
    if (tooltips !== "") {
        window['tooltips'] = JSON.parse(tooltips)
    }

    if (window['tooltips'] === undefined) {
        window['tooltips'] = [true]
    }

    if (!Array.isArray(window['tooltips'])) {
        window['tooltips'] = [true]
    }

    while (window['tooltips'].length < 10+1) {
        window['tooltips'].push(true)
    }
}

async function updateGroupOrTeacher(openSuccess, openError) {
    window['groupOrTeacher'] = window['groupOrTeacherTemp']

    await bridge.send(
        "VKWebAppCallAPIMethod",
        {
            "method": "storage.set",
            "params": {
                "v": "5.154",
                "access_token": config.token,
                "key": "schedule",
                "user_id": window['userID'],
                "value": JSON.stringify(window['groupOrTeacher'])
            }
        }
    ).then(() => {
        openSuccess()
    }).catch((error) => {
        console.log(error)
        openError()
    });
}

async function fetchGroupOrTeacher() {
    if (window['userID'] === 0 || window['userID'] === undefined || window['userID'] === null) {
        window['userID'] = (await bridge.send('VKWebAppGetUserInfo')).id
    }

    await fetchTooltips()

    if (window['groupOrTeacher'] !== null && window['groupOrTeacher'] !== undefined) {
        return null
    }

    const response = await bridge.send(
        "VKWebAppCallAPIMethod",
        {
            "method": "storage.get",
            "params": {
                "v": "5.154",
                "access_token": config.token,
                "key": "schedule",
                "user_id": window['userID']
            }
        }
    )

    const groupOrTeacher = await response.response[0].value
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

const openAnyError = (snackbar, setSnackbar) => {
    if (snackbar) return;
    setSnackbar(<Snackbar onClose={() => setSnackbar(null)}
                          before={<Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)"/>}
        >Произошла ошибка</Snackbar>,
    );
};

const Dates = [
    {id: 0, value: 'ПН'},
    {id: 1, value: 'ВТ'},
    {id: 2, value: 'СР'},
    {id: 3, value: 'ЧТ'},
    {id: 4, value: 'ПТ'},
    {id: 5, value: 'СБ'},
    {id: 6, value: 'ВС'}
]

const Scrollable = ({selectedDate, setSelected, setSelectedDate, selected, type, tooltip}) => {
    const [tooltip7, setTooltip7] = React.useState(() => window["tooltips"][7]);

    const addDays = (date, days) => {
        let result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    return (
        <Group separator="hide" mode='plain'>
            <Tabs mode='accent' style={{display: 'flex', justifyContent: 'center'}}>
                <TooltipContainer style={{
                    position: 'relative', zIndex: tooltip ? (window["tooltips"][6]||window["tooltips"][5]) ? 0 : 1 : 0
                }}>
                    <Tooltip style={{display: 'flex', justifyContent: 'center', textAlign: 'center'}}
                             text="Кликните по нужному дню, чтобы мгновенно просмотреть расписание."
                             isShown={tooltip7&&!(window["tooltips"][6]||window["tooltips"][5])&&tooltip}
                             onClose={() => update(7, setTooltip7)}
                    >
                        <HorizontalScroll arrowSize="m" >
                            {[-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13].map(i => {
                                let dayNum = selectedDate.getDay() - 1
                                if (dayNum === -1) {
                                    dayNum = 6
                                }
                                let ii = i
                                if (ii > 6) {ii -= 7} else if (ii < 0) {ii += 7}
                                setSelected(`${type}${dayNum.toString()}`)
                                let d = addDays(selectedDate, -dayNum + i)
                                return <TabsItem
                                    key={`${type}${i.toString()}`}
                                    selected={selected === `${type}${i.toString()}`}
                                    onClick={() => {
                                        setSelectedDate(addDays(selectedDate, -dayNum + i))
                                        setSelected(`${type}${ii.toString()}`)
                                    }}
                                    style={{textAlign: "center", minWidth: '2.5em', marginLeft: '1px', marginRight: '1px'}}
                                >
                                    <div style={i < 0 || i > 6
                                        ? {display: 'flex', flexDirection: 'column', fontWeight: '200'}
                                        : {color: 'var(--vkui--color_text_primary)', display: 'flex', flexDirection: 'column'}}>
                                        <div>{d.toLocaleDateString("ru", {weekday: "short"}).toUpperCase()}</div>
                                        {format(d, 'DD.MM.YYYY') === format(new Date(), 'DD.MM.YYYY')
                                            ? <div style={{borderTop: "solid 1px var(--vkui--color_text_primary)"}}>{d.getDate()}</div>
                                            : <div style={{borderTop: "solid 1px #00000000"}}>{d.getDate()}</div>}
                                    </div>
                                </TabsItem>
                            })}
                        </HorizontalScroll>
                    </Tooltip>
                </TooltipContainer>
            </Tabs>
        </Group>
    );
};

function formatName(inputName) {
    const parts = inputName.split(" ");

    if (parts.length === 1) {
        return parts[0]
    } else if (parts.length === 2) {
        let [surname, name] = parts
        return `${surname} ${name[0]}.`
    } else if (parts.length === 3) {
        let [surname, name, patronymic] = parts
        return `${surname} ${name[0]}. ${patronymic[0]}.`
    } else {
        let [surname, name, patronymic] = parts.slice(0, 3)
        return `${surname} ${name[0]}. ${patronymic[0]}. ...`
    }
}

Date.prototype.getWeek = function() {
    const onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()-1)/7);
}

export {
    capitalizeFirstLetter, getStatusText, fetchGroupOrTeacher,
    openAnyError, Dates, Scrollable, updateTooltips, updateGroupOrTeacher, update, formatName
};