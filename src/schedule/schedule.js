import React from "react";
import {CardGrid, Cell, ContentCard, Div, Epic, Group, Header, Paragraph, Spinner} from "@vkontakte/vkui";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import {Dates} from "../panels/panels";
import {Icon28User, Icon28Users} from "@vkontakte/icons";

async function fetchMoviesJSON(href, activePanel)  {
    console.log('https://hmtpksch.chazari.ru'+href)

    const response = await fetch('https://hmtpksch.chazari.ru'+href, {
        method: "POST",
    });

    if (!response.ok) {
        return [null, 'Возникла непредвиденная ошибка: статус код = '+response.status, activePanel]
    }

    switch (response.status) {
        case 200:
            return [await response.json(), null, activePanel]
        case 204:
            return [null, 'За пользователем не закреплена группа/преподаватель', activePanel]
        default:
            return [null, 'Возникла непредвиденная ошибка: статус код = '+response.status, activePanel]
    }
}

const GetGroupSchedule = ({group, week, activePanel}) => {
    let href = '/get?key=VK&group=' + group;

    if (week != null) {
        href += "&week=next"
    }

    fetchMoviesJSON(href, activePanel).then(res => {
        renderBlock(res, "group-schedule")
    })

    return <Epic activeStory={activePanel}>
        {Dates.map(item => {
            return <Group id={`group-schedule`+item.id.toString()} key={`group-schedule`+item.id.toString()} separator='hide' mode='plain'>
                <Spinner size="large" style={{padding: '10px 0'}}/>
            </Group>
        })}
    </Epic>
}

const GetTeacherSchedule = ({teacher, week, activePanel}) => {
    let href = '/get?key=VK&teacher=' + teacher;

    if (week != null) {
        href += "&week=next"
    }

    fetchMoviesJSON(href, activePanel).then(res => {
        renderBlock(res, "teacher-schedule")
    })

    return <Epic activeStory={activePanel}>
        {Dates.map(item => {
            return <Group id={`teacher-schedule`+item.id.toString()} key={`teacher-schedule`+item.id.toString()} separator='hide' mode='plain'>
                <Spinner size="large" style={{margin: '10px 0'}}/>
            </Group>
        })}
    </Epic>
}

const GetMySchedule = ({user, week, activePanel}) => {
    let href = '/get?key=VK&user=' + user;

    if (week != null) {
        href += "&week=next"
    }

    fetchMoviesJSON(href, activePanel).then(res => {
        renderBlock(res, "my-schedule")
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

    ReactDOM.render(<CardGrid size='l' style={{
        padding: '0',
        margin: '0'
    }}><RenderSchedule json={res[0]} dayNum={dayNum} err={res[1]}/></CardGrid>, document.getElementById(elementID+dayNum.toString()))
}

const RenderSchedule = ({json, dayNum, err}) => {
    if (err !== null) {
        return <CardGrid size='m' key='none' style={{
            // border: 'solid 1px',
            // borderRadius: '.5rem .5rem 0 0',
            // borderTopColor: 'var(--vkui--color_text_primary)',
            // borderLeftColor: 'var(--vkui--color_text_primary)',
            // borderRightColor: 'var(--vkui--color_text_primary)',
            margin: '2px 4px',
            padding: '5px',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
        }}>
            <ContentCard mode='outline-tint'
                         header={err}
                         style={{margin: '0', flex: '1', background: 'none'}}/>
        </CardGrid>
    }

    if (json[dayNum]['lesson'] === null) {
        return <CardGrid size='m' key='none' style={{
            // border: 'solid 1px',
            // borderRadius: '.5rem .5rem 0 0',
            // borderTopColor: 'var(--vkui--color_text_primary)',
            // borderLeftColor: 'var(--vkui--color_text_primary)',
            // borderRightColor: 'var(--vkui--color_text_primary)',
            margin: '2px 4px',
            padding: '5px',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            width: '100%',
        }}>
            <ContentCard mode='outline-tint'
                         header='Занятий нет'
                         style={{margin: '0', flex: '1', background: 'none'}}/>
        </CardGrid>
    }

    let i = 0
    const color = '#8a8a8a'
    return json[dayNum]['lesson'].map(lesson => {
        i++

        return (
            <CardGrid size='m' key={`lesson-${lesson['num']}-num-${i}`} style={{
                // border: 'solid 1px',
                // borderRadius: '.5rem .5rem 0 0',
                // borderTopColor: 'var(--vkui--color_text_primary)',
                // borderLeftColor: 'var(--vkui--color_text_primary)',
                // borderRightColor: 'var(--vkui--color_text_primary)',
                // borderBottomColor: 'var(--vkui--color_text_primary)',
                margin: '0px 4px',
                padding: '0px',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
            }}>
                <ContentCard mode='outline-tint'
                             text={lesson['time'].replaceAll('- ', '')}
                             style={{flex: '0 0 4em', textAlign: 'center', background: 'none'}}/>
                <Div style={{flex: '1', padding: 'var(--vkui--size_base_padding_vertical--regular) 0'}}>
                    <Div style={{
                        padding: '0 0 2px 0',
                        fontWeight: 'var(--vkui--font_weight_accent2)',
                        marginLeft: 'var(--vkui--size_base_padding_horizontal--regular)',
                        textOverflow: 'ellipsis'
                    }}>
                        {lesson['name']}
                    </Div>

                    {[
                        {id: 0, value: lesson['teacher'], ico: <Icon28User width={16} height={16}/>},
                        {id: 1, value: lesson['group'], ico: <Icon28Users width={16} height={16}/>}
                    ].map(element => {
                        if (element.value !== '') {
                            if (element.id === 1) {
                                const group = ` / подгр. ${lesson['subgroup']}`
                                lesson['subgroup'] = ''

                                return <Div style={{
                                    padding: '2px 0',
                                    marginLeft: 'var(--vkui--size_base_padding_horizontal--regular)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: 'var(--vkui--font_headline1--font_size--compact)',
                                }}>
                                    <div style={{color: color, marginRight: '4px'}}>{element.ico}</div>
                                    <div>{element.value}</div>
                                    <div style={{color: color, marginLeft: '4px'}}>{group}</div>
                                </Div>
                            }

                            return <Div style={{
                                padding: '2px 0',
                                marginLeft: 'var(--vkui--size_base_padding_horizontal--regular)',
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: 'var(--vkui--font_headline1--font_size--compact)'
                            }}>
                                {element.ico}{`${element.value}`}
                            </Div>
                        }
                    })}

                    {[lesson['subgroup']].map(subgroup => {
                        if (subgroup !== "") {
                            return <Div style={{
                                padding: '2px 0',
                                marginLeft: 'var(--vkui--size_base_padding_horizontal--regular)',
                                fontSize: 'var(--vkui--font_headline1--font_size--compact)',
                                color: color
                            }}>
                                {`подгр. ${subgroup}`}
                            </Div>
                        }
                    })}

                    {[{room: lesson['room'], location: lesson['location']}].map(item => {
                        if (item.room !== "" || item.location !== "") {
                            if (item.location !== "") {
                                item.location = ` / ${item.location}`
                            }
                            return <Div style={{
                                padding: '2px 0',
                                marginLeft: 'var(--vkui--size_base_padding_horizontal--regular)',
                                fontSize: 'var(--vkui--font_headline1--font_size--compact)',
                                display: 'flex',
                                color: color
                            }}>
                                {`ауд. ${item.room}${item.location}`}
                            </Div>
                        }
                    })}
                </Div>
            </CardGrid>
        )
    })
}

GetGroupSchedule.propTypes = {
    group: PropTypes.string.isRequired,
    week: PropTypes.string
};

GetTeacherSchedule.propTypes = {
    teacher: PropTypes.string.isRequired,
    week: PropTypes.string
};

GetMySchedule.propTypes = {
    user: PropTypes.string.isRequired,
    week: PropTypes.string
};

export {GetGroupSchedule, GetMySchedule, GetTeacherSchedule}