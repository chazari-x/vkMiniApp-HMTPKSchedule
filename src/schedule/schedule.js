import React, {Component} from "react";
import {Button, CardGrid, ContentCard, Div, Epic, FormStatus, Group, Link, Spinner,} from "@vkontakte/vkui";
import ReactDOM from "react-dom/client";
import {Icon24CalendarOutline, Icon24ExternalLinkOutline, Icon28User, Icon28Users} from "@vkontakte/icons";
import {Dates} from "../utils/utils";
import config from '../etc/config.json';
import {fetchGroupOrTeacher, fetchSchedule, subgroups} from "../api/api";
import bridge from "@vkontakte/vk-bridge";

export const GetGroupSchedule = ({group, date, activePanel, week, year}) => {
    if (group === '' || group === undefined) {
        return <Epic activeStory={activePanel}>
            {Dates.map(item => {
                return <Group id={`group-schedule`+item.id.toString()} key={`group-schedule`+item.id.toString()} separator='hide' mode='plain'>
                    <FormStatus mode='default' style={{
                        margin: 'var(--vkui--size_base_padding_vertical--regular) var(--vkui--size_base_padding_horizontal--regular)', padding: '0',
                        justifyContent: 'center', alignItems: 'center', flex: '1'
                    }}>{config.errors.GroupIsNull}</FormStatus>
                </Group>
            })}
        </Epic>
    }

    let href = '/get?key=VK&group=' + group
    const type = '&group=' + group
    if (date != null) {
        href += `&date=${date}`
    }

    fetchSchedule(href, activePanel, week, type, year).then(res => {
        renderBlock(res, "group-schedule")
    }).catch(err => {
        console.error(err)
        renderBlock([null, config.errors.APINotWorking, activePanel], "group-schedule")
    })

    return <Epic activeStory={activePanel}>
        {Dates.map(item => {
            return <Group id={`group-schedule`+item.id.toString()} key={`group-schedule`+item.id.toString()} separator='hide' mode='plain'>
                <Spinner size="large" style={{padding: '10px 0'}}/>
            </Group>
        })}
    </Epic>
}

export const GetTeacherSchedule = ({teacher, date, activePanel, week, year}) => {
    if (teacher === '' || teacher === undefined) {
        return <Epic activeStory={activePanel}>
            {Dates.map(item => {
                return <Group id={`teacher-schedule`+item.id.toString()} key={`teacher-schedule`+item.id.toString()} separator='hide' mode='plain'>
                    <FormStatus mode='default' style={{
                        margin: 'var(--vkui--size_base_padding_vertical--regular) var(--vkui--size_base_padding_horizontal--regular)', padding: '0',
                        justifyContent: 'center', alignItems: 'center', flex: '1'
                    }}>{config.errors.TeacherIsNull}</FormStatus>
                </Group>
            })}
        </Epic>
    }

    let href = '/get?key=VK&teacher=' + teacher
    const type = '&teacher=' + teacher
    if (date != null) {
        href += `&date=${date}`
    }

    fetchSchedule(href, activePanel, week, type, year).then(res => {
        renderBlock(res, "teacher-schedule")
    }).catch(err => {
        console.error(err)
        renderBlock([null, config.errors.APINotWorking, activePanel], "teacher-schedule")
    })

    return <Epic activeStory={activePanel}>
        {Dates.map(item => {
            return <Group id={`teacher-schedule`+item.id.toString()} key={`teacher-schedule`+item.id.toString()} separator='hide' mode='plain'>
                <Spinner size="large" style={{margin: '10px 0'}}/>
            </Group>
        })}
    </Epic>
}

export const GetMySchedule = ({date, activePanel, week, year}) => {
    fetchGroupOrTeacher().then(_ => {
        if (window['groupOrTeacher'] === null) {
            throw config.errors.GroupAndTeacherIsNull
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
            throw config.errors.GroupAndTeacherIsNull
        }

        if (date != null) {
            href += `&date=${date}`
        }

        fetchSchedule(href, activePanel, week, type, year).then(res => {
            renderBlock(res, "my-schedule")
        }).catch(err => {
            console.error(err)
            renderBlock([null, config.errors.APINotWorking, activePanel], "my-schedule")
        })

    }).catch(err => {
        let message = config.errors.GroupAndTeacherIsNull
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
            }}>{config.errors.FetchGroupErr}</FormStatus>)
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
    try {
        ReactDOM.createRoot(document.getElementById(res[2])).render(<Block res={res} elementID={elementID}/>)
    } catch {}
}

class Block extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        try {
            const margin = parseInt(getComputedStyle(document.getElementById("pageSchedule"))
                .getPropertyValue("margin-top").replaceAll("px", ''), 10)
            const height = document.getElementById("pageSchedule").clientHeight;
            const headerHeight = document.getElementsByClassName("vkuiPanelHeader").item(0).clientHeight;
            if (bridge.supports("VKWebAppResizeWindow")) {
                bridge.send("VKWebAppResizeWindow", {"height": height+headerHeight+margin*2+2}).then().catch(e => {});
            }
        } catch (e) {}
    }

    render() {
        const { res, elementID } = this.props;
        const dayNum = parseInt(res[2].replaceAll(elementID, ''), 10)
        return (
            <CardGrid size='l' style={{padding: '0', margin: '0'}}>
                <RenderSchedule json={res[0]} dayNum={dayNum} err={res[1]}/>
                {res[1] === null ? (res[0] !== null
                    ? <Link
                        href={res[0][dayNum]['href']}
                        target="_blank"
                        style={{
                            flex: '1', margin: '0 var(--vkui--size_base_padding_horizontal--regular)',
                            padding: 'var(--vkui--size_base_padding_vertical--regular) 0'
                        }}>
                        <Button appearance='accent-invariable' align="center" mode="outline" stretched={true}
                                after={<Icon24ExternalLinkOutline width={16} height={16} />}
                                before={<Icon24CalendarOutline width={16} height={16} />}
                        >{config.texts.CheckSchedule.replace(/&amp;/g, '&')}</Button>
                    </Link> : null) : null}
            </CardGrid>
        )
    }
}

const RenderSchedule = ({ json, dayNum, err }) => {
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
        }}><ContentCard mode='outline-tint' header={config.texts.NoClasses} style={{ margin: '0', flex: '1', background: 'none' }} /></CardGrid>
    }

    const mergedLessons = json[dayNum]['lesson'].reduce((acc, lesson) => {
        const existingLesson = acc.find(item => item.num === lesson.num && item.name === lesson.name);
        if (existingLesson) {
            existingLesson.subgroups.push({
                teacher: lesson.teacher,
                room: lesson.room,
                location: lesson.location,
                group: lesson.group,
                subgroup: lesson.subgroup
            });
        } else {
            acc.push({
                num: lesson.num,
                name: lesson.name,
                time: lesson.time,
                subgroups: [{
                    teacher: lesson.teacher,
                    room: lesson.room,
                    location: lesson.location,
                    group: lesson.group,
                    subgroup: lesson.subgroup
                }]
            });
        }
        return acc;
    }, []);

    return mergedLessons.map((mergedLesson, index) => {
        let c = '#777'
        let color = '#555'
        if ((window['page'] === 'my'
                && mergedLesson['subgroups'].some(s => (
                    s.subgroup === window['groupOrTeacher']['subgroup']
                    || s.subgroup === ""
                    || window['groupOrTeacher']['subgroup'] === subgroups[2].value
                )))
            || (window['page'] === 'group'
                && mergedLesson['subgroups'].some(s => (
                    s.subgroup === window['subgroup']
                    || s.subgroup === ""
                    || window['subgroup'] === subgroups[2].value
                )))
            || window['page'] === 'teacher'
        ) {
                c = ''
                color = '#999'
        }

        return (
            <React.Fragment key={`lesson-${mergedLesson['num']}-num-${index}`}>
                <CardGrid size='m' style={{
                    margin: '0px 4px', padding: '0px', justifyContent: 'center', alignItems: 'flex-start', width: '100%',
                    color: c
                }}>
                    <Group separator="hide" mode="plain" style={{
                        flex: '0 0 4em', textAlign: 'center', background: 'none',
                        padding: 'var(--vkui--size_base_padding_vertical--regular) 0',
                        color: c
                    }}>
                        {mergedLesson['time'].replaceAll('- ', '')}
                    </Group>
                    <Div style={{ flex: '1', padding: 'var(--vkui--size_base_padding_vertical--regular) 0' }}>
                        <Div style={{
                            padding: '0 var(--vkui--size_base_padding_horizontal--regular) 2px 0',
                            textOverflow: 'ellipsis', fontWeight: 'var(--vkui--font_weight_accent2)',
                            marginLeft: 'var(--vkui--size_base_padding_horizontal--regular)'
                        }}>{mergedLesson['name']}</Div>

                        {mergedLesson.subgroups.map((subgroup, subIndex) => (
                            <React.Fragment key={`subgroup-${index}-${subIndex}`}>
                                {subgroup['teacher'] !== '' && <Div style={{
                                    padding: '6px 0 2px 0', marginLeft: 'var(--vkui--size_base_padding_horizontal--regular)',
                                    display: 'flex', alignItems: 'center', fontSize: 'var(--vkui--font_headline1--font_size--compact)'
                                }}><Icon28User width={16} height={16} fill={color} />{`${subgroup['teacher']}`}</Div>}

                                {subgroup['group'] !== '' && <Div style={{
                                    padding: '2px 0', marginLeft: 'var(--vkui--size_base_padding_horizontal--regular)',
                                    display: 'flex', alignItems: 'center', fontSize: 'var(--vkui--font_headline1--font_size--compact)',
                                }}>
                                    <div style={{ marginRight: '4px' }}>{<Icon28Users width={16} height={16} fill={color} />}</div>
                                    <div>{subgroup['group']}</div>
                                    <div style={{ color: color, marginLeft: '4px' }}>{subgroup['subgroup'] !== '' && ` / подгр. ${subgroup['subgroup']}`}</div>
                                </Div>}

                                {subgroup['group'] === '' && subgroup['subgroup'] !== "" &&
                                    <Div style={{
                                        padding: '2px 0', marginLeft: 'var(--vkui--size_base_padding_horizontal--regular)',
                                        fontSize: 'var(--vkui--font_headline1--font_size--compact)', color: color
                                    }}>{`подгр. ${subgroup['subgroup']}`}</Div>
                                }

                                {(subgroup['room'] !== "" || subgroup['location'] !== "") &&
                                    <Div style={{
                                        padding: '2px 0', marginLeft: 'var(--vkui--size_base_padding_horizontal--regular)',
                                        fontSize: 'var(--vkui--font_headline1--font_size--compact)', display: 'flex', color: color
                                    }}>{`ауд. ${subgroup['room']}`}{subgroup['location'] !== "" && ` / ${subgroup['location']}`}</Div>
                                }
                            </React.Fragment>
                        ))}
                    </Div>
                </CardGrid>
            </React.Fragment>
        )
    })
}