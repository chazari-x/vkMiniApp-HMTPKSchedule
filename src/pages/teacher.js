import {
    Button,
    Calendar, Cell,
    Epic, Footer, FormStatus,
    Group,
    LocaleProvider, Panel, PullToRefresh, Search,
    Spinner,
    Tooltip
} from "@vkontakte/vkui";
import {Icon16CalendarOutline, Icon16CancelCircleOutline, Icon16UserOutline, Icon24Done,} from "@vkontakte/icons";
import React, {useEffect, useState} from "react";
import {GetTeacherSchedule} from "../schedule/schedule";
import {capitalizeFirstLetter, formatName, Scrollable, update} from "../utils/utils";
import {format} from "@vkontakte/vkui/dist/lib/date";
import {Popover} from "@vkontakte/vkui/dist/components/Popover/Popover";
import config from "../etc/config.json";
import {fetchTeachers} from "../api/api";

export const TeacherSch = () => {
    const [tooltip10, setTooltip10] = React.useState(() => window["tooltips"][10]);

    const date = new Date()
    let dayNum = date.getDay()-1
    if (dayNum === -1) {
        dayNum = 6
    }

    const [selected, setSelected] = React.useState(`teacher-schedule${dayNum.toString()}`);
    const [selectedDate, setSelectedDate] = useState(() => date);
    const [resultStory, setResultStory] = React.useState('load');
    const change = (date) => {
        date = new Date(format(date, "YYYY-MM-DD"))
        setSelectedDate(date)
        let dayNum = date.getDay() - 1
        if (dayNum === -1) {
            dayNum = 6
        }
        setSelected(`teacher-schedule${dayNum.toString()}`)
        setResultStory("load")
    }

    const [teacher, setTeacher] = React.useState();
    const [teacherName, setTeacherName] = React.useState();

    const [options, setOptions] = React.useState([]);
    useEffect(() => {
        if (window['teachers'] !== undefined) {
            if (Array.isArray(window['teachers'])) {
                if (window['teachers'].length > 0) {
                    setOptions(window['teachers']);
                    return
                }
            }
        }

        fetchTeachers()
            .then(async (data) => {
                window['teachers'] = (await data.json())['response']
                if (Array.isArray(window['teachers'])) {
                    setOptions(window['teachers']);
                } else {
                    setActive("error")
                }
            }).catch((error) => {
                setOptions(window['teachers'])
                setActive("error")
                console.log(error)
            });
    }, [])

    const [result, setResult] = React.useState(<div></div>);
    useEffect(() => {
        setResultStory('load')
        setResult(<GetTeacherSchedule teacher={teacher} activePanel={selected} date={format(selectedDate, 'DD.MM.YYYY')} week={selectedDate.getWeek()} year={selectedDate.getFullYear()}/>);
    }, [selectedDate || selected, teacher]);

    const [shown, setShown] = React.useState(false);
    const [activeView, setActiveView] = React.useState('main');
    const [search, setSearch] = React.useState('');
    const onChange = (e) => {
        setSearch(e.target.value);
    };

    const thematicsFiltered = options.filter(
        ({ label }) => label.toLowerCase().indexOf(search.toLowerCase()) > -1,
    );

    const [fetching, setFetching] = React.useState(false);
    const onRefresh = () => {
        setFetching(true);
        setResultStory("load")
        setResult(<GetTeacherSchedule teacher={teacher} activePanel={selected} date={format(selectedDate, 'DD.MM.YYYY')} week={selectedDate.getWeek()} year={selectedDate.getFullYear()}/>);
    }

    useEffect(() => {
        setResultStory('schedule')
        setFetching(false);
    }, [result])

    const [active, setActive] = React.useState("main");
    return (
        <PullToRefresh onRefresh={onRefresh} isFetching={fetching} style={{height: '100%'}}>
            <Epic activeStory={activeView} style={{padding: '0'}}>
                <Group id='teacherSelector' separator='hide' mode='plain'>
                    <div style={{flex: '1', display: 'flex', justifyContent: 'right'}}>
                        <Button appearance='negative' align="center" mode="outline"
                                onClick={() => {setActiveView('main')}}
                                style={{margin: '0 var(--vkui--size_base_padding_horizontal--regular) calc(var(--vkui--size_base_padding_vertical--regular)/2)'}}
                                before={<Icon16CancelCircleOutline/>}
                        >Закрыть</Button>
                    </div>
                    <Epic activeStory={active}>
                        <Panel id="error">
                            <FormStatus mode='error' header='Произошла ошибка' style={{
                                margin: 'var(--vkui--size_base_padding_vertical--regular) var(--vkui--size_base_padding_horizontal--regular)', padding: '0',
                                justifyContent: 'center', alignItems: 'center', flex: '1'
                            }}>{config.errors.FetchGroupsOrTeachersErr}</FormStatus>
                        </Panel>
                        <Panel id="main">
                            <Search value={search} onChange={onChange} after={null} />
                            {thematicsFiltered.length > 0 &&
                                thematicsFiltered.map((option) =>
                                    <Cell
                                        style={{padding: '0 var(--vkui--size_base_padding_horizontal--regular)'}}
                                        key={option.value}
                                        onClick={() => {
                                            setTeacher(option.value)
                                            setTeacherName(formatName(option.label))
                                            setActiveView('main')
                                        }}
                                        after={
                                            option.value === teacher ? <Icon24Done fill="var(--vkui--color_icon_accent)" /> : null
                                        }
                                    >{option.label}</Cell>
                                )
                            }
                            {thematicsFiltered.length === 0 && <Footer>{config.texts.NotFound}</Footer>}
                        </Panel>
                    </Epic>
                </Group>
                <Group id='main' separator='hide' mode='plain'>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'nowrap',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Popover action="click" shown={shown} onShownChange={setShown}
                                 style={{display: 'flex', justifyContent: 'center', background: 'none'}}
                                 content={<LocaleProvider value='ru'>
                                     <Calendar
                                         size='m' value={selectedDate} onChange={change}
                                         disablePickers={true} showNeighboringMonth={true}
                                         maxDateTime={(new Date()).setMonth((new Date()).getMonth() + 1)}
                                         minDateTime={(new Date()).setFullYear((new Date()).getFullYear() - 10)}
                                     />
                                 </LocaleProvider>}>
                            <Button appearance='accent-invariable' mode='outline' style={{
                                margin: '0 var(--vkui--size_base_padding_horizontal--regular)',
                                width: 'max-content'
                            }} before={<Icon16CalendarOutline/>}>
                                {`${capitalizeFirstLetter(selectedDate.toLocaleDateString('ru',
                                    {month: 'short', year: '2-digit'}
                                ))}`}
                            </Button>
                        </Popover>
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <Button appearance='accent-invariable' mode='outline'
                                    onClick={() => setActiveView('teacherSelector')}
                                    style={{
                                        margin: '0 var(--vkui--size_base_padding_horizontal--regular)',
                                        width: 'max-content'
                                    }} before={<Tooltip
                                style={{textAlign: 'center'}}
                                text={config.tooltips.tooltip10}
                                isShown={tooltip10} onClose={() => update(10, setTooltip10)}
                            >
                                <Icon16UserOutline/>
                            </Tooltip>}>
                                {teacherName || config.buttons.selectTeacher}
                            </Button>
                        </div>
                    </div>
                    <Scrollable setSelected={setSelected} selectedDate={selectedDate} setSelectedDate={change}
                                selected={selected} type='teacher-schedule' tooltip={false}/>
                    <Epic activeStory={resultStory}>
                        <Group id="schedule" separator="hide" mode='plain' style={{minHeight: 'calc(100vh/2)'}}>
                            {result}
                        </Group>
                        <Group id="load" separator="hide" mode='plain' style={{minHeight: 'calc(100vh/2)'}}>
                            <Spinner size="large" style={{margin: '10px 0'}}/>
                        </Group>
                    </Epic>
                </Group>
            </Epic>
        </PullToRefresh>
    )
};