import {
    Button,
    Calendar, Cell,
    Epic, Footer,
    Group,
    LocaleProvider, PullToRefresh, Search,
    Spinner,
    Tooltip,
} from "@vkontakte/vkui";
import React, {useEffect, useState} from "react";
import {GetGroupSchedule} from "../schedule/schedule";
import {capitalizeFirstLetter, openAnyError, Scrollable, update} from "../utils/utils";
import {format} from "@vkontakte/vkui/dist/lib/date";
import {Popover} from "@vkontakte/vkui/dist/components/Popover/Popover";
import {Icon16CalendarOutline, Icon16CancelCircleOutline, Icon20Users3Outline, Icon24Done} from "@vkontakte/icons";
import config from "../etc/config.json"
import {fetchGroups} from "../api/api";

export const GroupSch = () => {
    const [tooltip9, setTooltip9] = React.useState(() => window["tooltips"][9]);

    const [snackbar, setSnackbar] = React.useState(null);

    const date = new Date()
    let dayNum = date.getDay()-1
    if (dayNum === -1) {
        dayNum = 6
    }

    const [selected, setSelected] = React.useState(`group-schedule${dayNum.toString()}`);
    const [selectedDate, setSelectedDate] = useState(() => date);
    const [resultStory, setResultStory] = React.useState('load');
    const change = (date) => {
        setSelectedDate(date)
        let dayNum = date.getDay() - 1
        if (dayNum === -1) {
            dayNum = 6
        }
        setSelected(`group-schedule${dayNum.toString()}`)
        setResultStory("load")
    }

    const [group, setGroup] = React.useState();
    const [groupName, setGroupName] = React.useState();

    const [options, setOptions] = React.useState([]);
    useEffect(() => {
        if (window['groups'] !== undefined) {
            if (window['groups'].length > 0) {
                setOptions(window['groups'])
                return
            }
        }

        fetchGroups()
            .then(async (data) => {
                window['groups'] = ((await data.json())['response'])
                setOptions(window['groups']);
            })
            .catch((error) => {
                openAnyError(snackbar, setSnackbar)
                console.log(error)
            });
    }, [])

    const [result, setResult] = React.useState(<div></div>);
    useEffect(() => {
        setResultStory('load')
        setResult(<GetGroupSchedule group={group} activePanel={selected} date={format(selectedDate, 'DD.MM.YYYY')} week={selectedDate.getWeek()}/>);
    }, [selectedDate || selected, group]);

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
        setResult(<GetGroupSchedule group={group} activePanel={selected} date={format(selectedDate, 'DD.MM.YYYY')} week={selectedDate.getWeek()}/>);
    }

    useEffect(() => {
        setResultStory("schedule")
        setFetching(false);
    }, [result])

    return (
        <PullToRefresh onRefresh={onRefresh} isFetching={fetching} style={{height: '100%'}}>
            <Epic activeStory={activeView} style={{padding: '0'}}>
                <Group id='groupSelector' separator='hide' mode='plain'>
                    <div style={{flex: '1', display: 'flex', justifyContent: 'right'}}>
                        <Button appearance='negative' align="center" mode="outline"
                                onClick={() => {setActiveView('main')}}
                                style={{margin: '0 var(--vkui--size_base_padding_horizontal--regular) calc(var(--vkui--size_base_padding_vertical--regular)/2)'}}
                                before={<Icon16CancelCircleOutline/>}
                        >{config.buttons.close}</Button>
                    </div>
                    <Search value={search} onChange={onChange} after={null} />
                    {thematicsFiltered.length > 0 &&
                        thematicsFiltered.map((option) =>
                            <Cell
                                style={{padding: '0 var(--vkui--size_base_padding_horizontal--regular)'}}
                                key={option.value}
                                onClick={() => {
                                    setGroup(option.value)
                                    setGroupName(option.label)
                                    setActiveView('main')
                                }}
                                after={
                                    option.value === group ? <Icon24Done fill="var(--vkui--color_icon_accent)" /> : null
                                }
                            >{option.label}</Cell>
                        )
                    }
                    {thematicsFiltered.length === 0 && <Footer>{config.texts.NotFound}</Footer>}
                </Group>
                <Group id='main' separator='hide' mode='plain'>
                    <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Popover action="click" shown={shown} onShownChange={setShown} style={{display: 'flex', justifyContent: 'center', background: 'none'}}
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
                                    onClick={() => setActiveView('groupSelector')}
                                    style={{
                                        margin: '0 var(--vkui--size_base_padding_horizontal--regular)',
                                        width: 'max-content'
                                    }} before={<Tooltip
                                style={{textAlign: 'center'}}
                                text={config.tooltips.tooltip9}
                                isShown={tooltip9} onClose={() => update(9, setTooltip9)}
                            >
                                <Icon20Users3Outline/>
                            </Tooltip>}>
                                {groupName || config.buttons.selectGroup}
                            </Button>
                        </div>
                    </div>
                    <Scrollable setSelected={setSelected} selectedDate={selectedDate} setSelectedDate={change} selected={selected} type='group-schedule' tooltip={false}/>
                    <Epic activeStory={resultStory}>
                        <Group id="schedule" separator="hide" mode='plain' style={{minHeight: 'calc(100vh/2)'}}>
                            {result}
                        </Group>
                        <Group id="load" separator="hide" mode='plain' style={{minHeight: 'calc(100vh/2)'}}>
                            <Spinner size="large" style={{margin: '10px 0'}}/>
                        </Group>
                    </Epic>
                    {snackbar}
                </Group>
            </Epic>
        </PullToRefresh>
    )
};