import {
    Button,
    Calendar,
    Epic,
    Group,
    LocaleProvider, Spinner,
} from "@vkontakte/vkui";
import {Icon16CalendarOutline, Icon16CancelCircleOutline, Icon16GearOutline} from "@vkontakte/icons";
import React, {useEffect, useState} from "react";
import "../../schedule/schedule";
import {GetMySchedule} from "../../schedule/schedule";
import {capitalizeFirstLetter, Scrollable} from "../../other/other";
import {format} from "@vkontakte/vkui/dist/lib/date";
import {Popover} from "@vkontakte/vkui/dist/components/Popover/Popover";
import {Settings} from "../settings";

export const MySch = () => {
    const date = new Date()
    let dayNum = date.getDay()-1
    if (dayNum === -1) {
        dayNum = 6
    }

    const [selected, setSelected] = React.useState(`my-schedule${dayNum.toString()}`);
    const [selectedDate, setSelectedDate] = useState(() => date);
    const [resultStory, setResultStory] = React.useState('load');
    const change = (date) => {
        setSelectedDate(date)
        let dayNum = date.getDay() - 1
        if (dayNum === -1) {
            dayNum = 6
        }
        setSelected(`my-schedule${dayNum.toString()}`)
        setResultStory("load")
    }

    const [result, setResult] = React.useState(<div></div>);
    useEffect(() => {
        setResultStory("schedule")
        setResult(<GetMySchedule activePanel={selected} date={format(selectedDate, 'DD.MM.YYYY')}/>)
    }, [selectedDate || selected]);

    const [activeStory, setActiveStory] = React.useState('main');
    const [calendar, setCalendar] = React.useState(false)
    return (
        <Group separator="hide" mode='plain' style={{paddingTop: 'var(--vkui--size_panel_header_height--regular)'}}>
            <Epic activeStory={activeStory}>
                <Group id="main" separator="hide" mode='plain'>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Popover action="click" shown={calendar} onShownChange={setCalendar} style={{display: 'flex', justifyContent: 'center', background: 'none'}}
                                 content={<LocaleProvider value='ru'>
                                     <Calendar size='m' value={selectedDate} onChange={change} showNeighboringMonth={true}/>
                                 </LocaleProvider>}>
                            <Button appearance='accent-invariable' mode='outline' style={{
                                margin: '0 var(--vkui--size_base_padding_horizontal--regular) var(--vkui--size_base_padding_vertical--regular)',
                                width: 'max-content'
                            }} before={<Icon16CalendarOutline/>}>
                                {`${capitalizeFirstLetter(selectedDate.toLocaleDateString('ru',
                                    {month: 'long', year: 'numeric'}
                                ))}`}
                            </Button>
                        </Popover>
                        <Button appearance='accent-invariable' mode='outline' style={{
                            margin: '0 var(--vkui--size_base_padding_horizontal--regular) var(--vkui--size_base_padding_vertical--regular)',
                            width: 'max-content'
                        }} before={<Icon16GearOutline/>} onClick={() => setActiveStory('settings')}>
                            Настройки
                        </Button>
                    </div>
                    <Scrollable setSelected={setSelected} selectedDate={selectedDate} setSelectedDate={change} selected={selected} type='my-schedule'/>
                    <Epic activeStory={resultStory}>
                        <Group id="schedule" separator="hide" mode='plain'>
                            {result}
                        </Group>
                        <Group id="load" separator="hide" mode='plain'>
                            <Spinner size="large" style={{margin: '10px 0'}}/>
                        </Group>
                    </Epic>
                </Group>
                <Group id="settings" separator="hide" mode='plain' >
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Popover action="click" shown={calendar} onShownChange={setCalendar}
                                 style={{display: 'flex', justifyContent: 'center', background: 'none'}}
                                 content={<LocaleProvider value='ru'>
                                     <Calendar size='m' value={selectedDate} onChange={change}
                                               showNeighboringMonth={true}/>
                                 </LocaleProvider>}>
                            <Button appearance='accent-invariable' mode='outline' style={{
                                margin: '0 var(--vkui--size_base_padding_horizontal--regular) var(--vkui--size_base_padding_vertical--regular)',
                                width: 'max-content'
                            }} before={<Icon16CalendarOutline/>}>
                                {`${capitalizeFirstLetter(selectedDate.toLocaleDateString('ru',
                                    {month: 'long', year: 'numeric'}
                                ))}`}
                            </Button>
                        </Popover>
                        <Button appearance='negative' mode='outline' style={{
                            margin: '0 var(--vkui--size_base_padding_horizontal--regular) var(--vkui--size_base_padding_vertical--regular)',
                            width: 'max-content'
                        }} before={<Icon16CancelCircleOutline/>} onClick={() => setActiveStory('main')}>
                            Закрыть
                        </Button>
                    </div>
                    <Settings/>
                </Group>
            </Epic>
        </Group>
    )
};