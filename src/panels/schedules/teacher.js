import {
    Button,
    Calendar, Cell,
    Epic, Footer,
    Group,
    LocaleProvider, PullToRefresh, Search,
    Spinner,
    Tooltip
} from "@vkontakte/vkui";
import {Icon16CalendarOutline, Icon16CancelCircleOutline, Icon16UserOutline, Icon24Done,} from "@vkontakte/icons";
import React, {useEffect, useState} from "react";
import {GetTeacherSchedule} from "../../schedule/schedule";
import bridge from "@vkontakte/vk-bridge";
import {capitalizeFirstLetter, formatName, openAnyError, Scrollable, update} from "../../other/other";
import {format} from "@vkontakte/vkui/dist/lib/date";
import {Popover} from "@vkontakte/vkui/dist/components/Popover/Popover";
import config from "../../other/config.json";

export const TeacherSch = () => {
    const [tooltip10, setTooltip10] = React.useState(() => window["tooltips"][10]);

    const [snackbar, setSnackbar] = React.useState(null);

    const date = new Date()
    let dayNum = date.getDay()-1
    if (dayNum === -1) {
        dayNum = 6
    }

    const [selected, setSelected] = React.useState(`teacher-schedule${dayNum.toString()}`);
    const [selectedDate, setSelectedDate] = useState(() => date);
    const [resultStory, setResultStory] = React.useState('load');
    const change = (date) => {
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
        bridge.send(
            "VKWebAppCallAPIMethod",
            {"method": "execute.getTeachers", "params": {"v": "5.154", "access_token": config.token}}
        ).then((data) => {
            setOptions(data.response);
        }).catch((error) => {
            openAnyError(snackbar, setSnackbar)
            console.log(error)
        });
    }, [])

    const [result, setResult] = React.useState(<div></div>);
    useEffect(() => {
        setResultStory('schedule')
        setResult(<GetTeacherSchedule teacher={teacher} activePanel={selected} date={format(selectedDate, 'DD.MM.YYYY')} week={selectedDate.getWeek()}/>);
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
        setTimeout(() => {
            setResultStory("schedule")
            setResult(<GetTeacherSchedule teacher={teacher} activePanel={selected} date={format(selectedDate, 'DD.MM.YYYY')} week={selectedDate.getWeek()}/>);
            setFetching(false);
        }, 100);
    }

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
                    <Search value={search} onChange={onChange} after={null} />
                    {thematicsFiltered.length > 0 &&
                        thematicsFiltered.map((option) =>
                            <Cell
                                style={{padding: '0 var(--vkui--size_base_padding_horizontal--regular)'}}
                                key={option.value}
                                onClick={() => {
                                    setTeacher(option.value)
                                    setTeacherName(formatName(option.label))
                                    setResultStory("load")
                                    setActiveView('main')
                                }}
                                after={
                                    option.value === teacher ? <Icon24Done fill="var(--vkui--color_icon_accent)" /> : null
                                }
                            >{option.label}</Cell>
                        )
                    }
                    {thematicsFiltered.length === 0 && <Footer>Ничего не найдено</Footer>}
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
                                     <Calendar size='m' value={selectedDate} onChange={change} disablePickers={true}
                                               showNeighboringMonth={true}/>
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
                                text="Выберите преподавателя из списка, чтобы просмотреть его расписание."
                                isShown={tooltip10} onClose={() => update(10, setTooltip10)}
                            >
                                <Icon16UserOutline/>
                            </Tooltip>}>
                                {teacherName || "Преподаватель"}
                            </Button>
                        </div>
                    </div>
                    <Scrollable setSelected={setSelected} selectedDate={selectedDate} setSelectedDate={change}
                                selected={selected} type='teacher-schedule' tooltip={false}/>
                    <Epic activeStory={resultStory}>
                        <Group id="schedule" separator="hide" mode='plain'>
                            {result}
                        </Group>
                        <Group id="load" separator="hide" mode='plain'>
                            <Spinner size="large" style={{margin: '10px 0'}}/>
                        </Group>
                    </Epic>
                    {snackbar}
                </Group>
            </Epic>
        </PullToRefresh>
    )
};