import React from "react";
import {
    Button,
    CardGrid,
    ContentCard,
    Div,
    Epic,
    FormStatus,
    Group,
    Link,
    Spinner,
} from "@vkontakte/vkui";
import ReactDOM from "react-dom/client";
import {
    Icon24CalendarOutline,
    Icon24ExternalLinkOutline,
    Icon28User,
    Icon28Users
} from "@vkontakte/icons";
import {Dates, fetchGroupOrTeacher} from "../other/other";
import config from "../other/config.json";

const crypto = require('crypto-browserify');
const Buffer = require('buffer/').Buffer;  // note: the trailing slash is important!

function rsaEncrypt(data, publicKey) {
    return crypto.publicEncrypt({
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING
    }, data);
}
async function fetchSchedule(href, activePanel, week, type)  {
    if (window["result"] !== undefined) {
        if (window["result"]["week"] !== undefined
            && window["result"]["type"] !== undefined
            && window["result"]["time"] !== undefined) {
            if (window["result"]["week"] === week
                && window["result"]["type"] === type) {
                const now = Math.floor(Date.now() / 1000)
                if (now-window["result"]["time"] < 60) {
                    return [window["result"]["schedule"], null, activePanel]
                }
            }
        }
    }

    const token = rsaEncrypt(Buffer.from(config.api.secretKey+Math.floor(Date.now() / 1000)), config.api.publicKey).toString('hex')

    if (token !== undefined) {
        window['apiToken'] = `Bearer ${String(token)}`
    }

    if (window['apiToken'] === "") {
        window['apiToken'] = "Bearer "
    }

    const response = await fetch(config.api.href+href, {
        method: "POST",
        body: window['apiToken'],
    })

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
            return [null, "Ошибка выполнения запроса к ХМТПК API: превышено время ожидания ответа от https://hmtpk.ru. Повторите попытку позже, если проблема не решится, сообщите разработчикам.", activePanel]
        default:
            return [null, "Ошибка выполнения запроса к ХМТПК API. Повторите попытку позже, если проблема не решится, сообщите разработчикам.", activePanel]
    }
}

const GetGroupSchedule = ({group, date, activePanel, week}) => {
    if (group === '' || group === undefined) {
        return <Epic activeStory={activePanel}>
            {Dates.map(item => {
                return <Group id={`group-schedule`+item.id.toString()} key={`group-schedule`+item.id.toString()} separator='hide' mode='plain'>
                    <FormStatus mode='default' style={{
                        margin: 'var(--vkui--size_base_padding_vertical--regular) var(--vkui--size_base_padding_horizontal--regular)', padding: '0',
                        justifyContent: 'center', alignItems: 'center', flex: '1'
                    }}>Вы не выбрали группу.</FormStatus>
                </Group>
            })}
        </Epic>
    }

    let href = '/get?key=VK&group=' + group
    const type = '&group=' + group
    if (date != null) {
        href += `&date=${date}`
    }

    fetchSchedule(href, activePanel, week, type).then(res => {
        renderBlock(res, "group-schedule")
    }).catch(err => {
        console.error(err)
        renderBlock([null, "Ошибка выполнения запроса к ХМТПК API. Повторите попытку позже, если проблема не решится, сообщите разработчикам.", activePanel], "group-schedule")
    })

    return <Epic activeStory={activePanel}>
        {Dates.map(item => {
            return <Group id={`group-schedule`+item.id.toString()} key={`group-schedule`+item.id.toString()} separator='hide' mode='plain'>
                <Spinner size="large" style={{padding: '10px 0'}}/>
            </Group>
        })}
    </Epic>
}

const GetTeacherSchedule = ({teacher, date, activePanel, week}) => {
    if (teacher === '' || teacher === undefined) {
        return <Epic activeStory={activePanel}>
            {Dates.map(item => {
                return <Group id={`teacher-schedule`+item.id.toString()} key={`teacher-schedule`+item.id.toString()} separator='hide' mode='plain'>
                    <FormStatus mode='default' style={{
                        margin: 'var(--vkui--size_base_padding_vertical--regular) var(--vkui--size_base_padding_horizontal--regular)', padding: '0',
                        justifyContent: 'center', alignItems: 'center', flex: '1'
                    }}>Вы не выбрали преподавателя.</FormStatus>
                </Group>
            })}
        </Epic>
    }

    let href = '/get?key=VK&teacher=' + teacher
    const type = '&teacher=' + teacher
    if (date != null) {
        href += `&date=${date}`
    }

    fetchSchedule(href, activePanel, week, type).then(res => {
        renderBlock(res, "teacher-schedule")
    }).catch(err => {
        console.error(err)
        renderBlock([null, "Ошибка выполнения запроса к ХМТПК API. Повторите попытку позже, если проблема не решится, сообщите разработчикам.", activePanel], "teacher-schedule")
    })

    return <Epic activeStory={activePanel}>
        {Dates.map(item => {
            return <Group id={`teacher-schedule`+item.id.toString()} key={`teacher-schedule`+item.id.toString()} separator='hide' mode='plain'>
                <Spinner size="large" style={{margin: '10px 0'}}/>
            </Group>
        })}
    </Epic>
}

const GetMySchedule = ({date, activePanel, week}) => {
    fetchGroupOrTeacher().then(_ => {
        if (window['groupOrTeacher'] === null) {
            throw "За Вами не закреплены ни группа ни преподаватель. Измените настройки в меню \"Настройки\"."
        }

        let href = '/get?key=VK'
        let type = ''
        if (window['groupOrTeacher']['group'] !== "") {
            type = '&group=' + window['groupOrTeacher']['group']
            href += '&group=' + window['groupOrTeacher']['group']
        } else if (window['groupOrTeacher']['teacher'] !== "") {
            type = '&teacher=' + window['groupOrTeacher']['teacher']
            href += '&teacher=' + window['groupOrTeacher']['teacher']
        } else {
            throw "За Вами не закреплены ни группа ни преподаватель. Измените настройки в меню \"Настройки\"."
        }

        if (date != null) {
            href += `&date=${date}`
        }

        fetchSchedule(href, activePanel, week, type).then(res => {
            renderBlock(res, "my-schedule")
        }).catch(err => {
            console.error(err)
            renderBlock([null, "Ошибка выполнения запроса к ХМТПК API. Повторите попытку позже, если проблема не решится, сообщите разработчикам.", activePanel], "my-schedule")
        })

    }).catch(err => {
        let message = "За Вами не закреплены ни группа ни преподаватель. Измените настройки в меню \"Настройки\"."
        if (message === err) {
            ReactDOM.createRoot(document.getElementById(activePanel)).render(<FormStatus mode='default' header='' style={{
                margin: 'var(--vkui--size_base_padding_vertical--regular) var(--vkui--size_base_padding_horizontal--regular)', padding: '0',
                justifyContent: 'center', alignItems: 'center', flex: '1'
            }}>{message}</FormStatus>)
        } else {
            console.error(err)
            ReactDOM.createRoot(document.getElementById(activePanel)).render(<FormStatus mode='error' header='Произошла ошибка' style={{
                margin: 'var(--vkui--size_base_padding_vertical--regular) var(--vkui--size_base_padding_horizontal--regular)', padding: '0',
                justifyContent: 'center', alignItems: 'center', flex: '1'
            }}>Произошла ошибка при получении Ваше группы.</FormStatus>)
        }

    })

    return <Epic activeStory={activePanel}>
        {Dates.map(item => {
            return <Group id={`my-schedule`+item.id.toString()} key={`my-schedule`+item.id.toString()} separator='hide' mode='plain'>
                <Spinner size="large" style={{margin: '10px 0'}}/>
            </Group>
        })}
    </Epic>
}

const renderBlock = (res, elementID) => {
    const dayNum = parseInt(res[2].replaceAll(elementID, ''), 10)
    ReactDOM.createRoot(document.getElementById(res[2])).render(<CardGrid size='l' style={{padding: '0', margin: '0'}}>
        <RenderSchedule json={res[0]} dayNum={dayNum} err={res[1]}/>
        {res[1] === null ? (res[0] !== null
                ? <Link
                href={res[0][dayNum]['href']}
                target="_blank"
                style={{flex: '1', margin: '0 var(--vkui--size_base_padding_horizontal--regular)'}}>
                <Button appearance='accent-invariable' align="center" mode="outline" stretched={true}
                        after={<Icon24ExternalLinkOutline width={16} height={16} />}
                        before={<Icon24CalendarOutline width={16} height={16} />}
                >Проверить расписание на сайте</Button>
                </Link> : null) : null}
    </CardGrid>)
}

const RenderSchedule = ({json, dayNum, err}) => {
    if (err !== null) {
        return <FormStatus mode='error' header='Произошла ошибка' style={{
            margin: 'var(--vkui--size_base_padding_vertical--regular) var(--vkui--size_base_padding_horizontal--regular)', padding: '0',
            justifyContent: 'center', alignItems: 'center', flex: '1'
        }}>{err}</FormStatus>
    }

    if (json[dayNum]['lesson'] === null) {
        return <CardGrid size='m' key='none' style={{
            margin: 'var(--vkui--size_base_padding_vertical--regular) var(--vkui--size_base_padding_horizontal--regular)', padding: '0',
            justifyContent: 'center', alignItems: 'center', textAlign: 'center', width: '100%'
        }}><ContentCard mode='outline-tint' header='Занятий нет' style={{margin: '0', flex: '1', background: 'none'}}/></CardGrid>
    }

    let i = 0
    const color = '#8a8a8a'
    return json[dayNum]['lesson'].map(lesson => {
        i++

        return (
            <CardGrid size='m' key={`lesson-${lesson['num']}-num-${i}`} style={{
                margin: '0px 4px', padding: '0px', justifyContent: 'center', alignItems: 'center', width: '100%'
            }}>
                <Group separator="hide" mode="plain" style={{flex: '0 0 4em', textAlign: 'center', background: 'none'}}>
                    {lesson['time'].replaceAll('- ', '')}
                </Group>
                <Div style={{flex: '1', padding: 'var(--vkui--size_base_padding_vertical--regular) 0'}}>
                    <Div style={{
                        padding: '0 var(--vkui--size_base_padding_horizontal--regular) 2px 0',
                        textOverflow: 'ellipsis', fontWeight: 'var(--vkui--font_weight_accent2)',
                        marginLeft: 'var(--vkui--size_base_padding_horizontal--regular)'
                    }}>{lesson['name']}</Div>

                    {lesson['teacher'] !== '' && <Div style={{
                        padding: '2px 0', marginLeft: 'var(--vkui--size_base_padding_horizontal--regular)',
                        display: 'flex', alignItems: 'center', fontSize: 'var(--vkui--font_headline1--font_size--compact)'
                    }}><Icon28User width={16} height={16} fill={color}/>{`${lesson['teacher']}`}</Div>}

                    {lesson['group'] !== '' && <Div style={{
                        padding: '2px 0', marginLeft: 'var(--vkui--size_base_padding_horizontal--regular)',
                        display: 'flex', alignItems: 'center', fontSize: 'var(--vkui--font_headline1--font_size--compact)',
                    }}>
                        <div style={{marginRight: '4px'}}>{<Icon28Users width={16} height={16} fill={color}/>}</div>
                        <div>{lesson['group']}</div>
                        <div style={{color: color, marginLeft: '4px'}}>{lesson['subgroup'] !== '' && ` / подгр. ${lesson['subgroup']}`}</div>
                    </Div>}

                    {lesson['group'] === '' && lesson['subgroup'] !== "" &&
                        <Div style={{
                            padding: '2px 0', marginLeft: 'var(--vkui--size_base_padding_horizontal--regular)',
                            fontSize: 'var(--vkui--font_headline1--font_size--compact)', color: color
                        }}>{`подгр. ${lesson['subgroup']}`}</Div>
                    }

                    {(lesson['room'] !== "" || lesson['location'] !== "") &&
                        <Div style={{
                            padding: '2px 0', marginLeft: 'var(--vkui--size_base_padding_horizontal--regular)',
                            fontSize: 'var(--vkui--font_headline1--font_size--compact)', display: 'flex', color: color
                        }}>{`ауд. ${lesson['room']}`}{lesson['location'] !== "" && ` / ${lesson['location']}`}</Div>
                    }
                </Div>
            </CardGrid>
        )
    })
}

export {GetGroupSchedule, GetMySchedule, GetTeacherSchedule}