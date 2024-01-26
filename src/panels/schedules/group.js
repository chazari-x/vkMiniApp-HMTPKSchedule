import {Button, Calendar, CustomSelect, Epic, FormItem, Group, LocaleProvider, Spinner} from "@vkontakte/vkui";
import React, {useEffect, useState} from "react";
import {GetGroupSchedule} from "../../schedule/schedule";
import bridge from "@vkontakte/vk-bridge";
import {capitalizeFirstLetter, openAnyError, Scrollable} from "../../other/other";
import {format} from "@vkontakte/vkui/dist/lib/date";
import {Popover} from "@vkontakte/vkui/dist/components/Popover/Popover";
import {Icon16CalendarOutline} from "@vkontakte/icons";
import config from "../../other/config.json";

export const GroupSch = () => {
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
    const onChange = (e) => {
        setGroup(e.target.value)
        setResultStory("load")
    };

    const [fetching, setFetching] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const fetchOptions = () => {
        setFetching(true);
        bridge.send(
            "VKWebAppCallAPIMethod",
            {"method": "execute.getGroups", "params": {"v": "5.154", "access_token": config.token}}
        ).then((data) => {
            setOptions(data.response);
            setFetching(false);
        }).catch((error) => {
            openAnyError(snackbar, setSnackbar)
            console.log(error)
        });
    };

    const [result, setResult] = React.useState(<div></div>);
    useEffect(() => {
        setResultStory('schedule')
        setResult(<GetGroupSchedule group={group} activePanel={selected} date={format(selectedDate, 'DD.MM.YYYY')} week={selectedDate.getWeek()}/>);
    }, [selectedDate || selected, group]);

    const [shown, setShown] = React.useState(false);
    return (
        <div>
            <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'space-between'}}>
                <Popover action="click" shown={shown} onShownChange={setShown} style={{display: 'flex', justifyContent: 'center', background: 'none'}}
                         content={<LocaleProvider value='ru'>
                             <Calendar size='m' value={selectedDate} onChange={change} disablePickers={true} showNeighboringMonth={true}/>
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
                <FormItem style={{padding: '0 var(--vkui--size_base_padding_horizontal--regular) 0 0', flex: '1'}}>
                    <CustomSelect placeholder="Группа" searchable options={options} selectType='default'
                                  onChange={onChange} value={group} onOpen={options.length === 0 && fetchOptions}
                                  fetching={fetching} style={{margin: 0}}/>
                </FormItem>
            </div>
            <Scrollable setSelected={setSelected} selectedDate={selectedDate} setSelectedDate={change} selected={selected} type='group-schedule'/>
            <Epic activeStory={resultStory}>
                <Group id="schedule" separator="hide" mode='plain'>
                    {result}
                </Group>
                <Group id="load" separator="hide" mode='plain'>
                    <Spinner size="large" style={{margin: '10px 0'}}/>
                </Group>
            </Epic>
            {snackbar}
        </div>
    )
};