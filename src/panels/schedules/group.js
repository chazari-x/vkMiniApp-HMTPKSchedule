import {Button, Calendar, CustomSelect, FormItem, Group, LocaleProvider} from "@vkontakte/vkui";
import React, {useEffect, useState} from "react";
import {GetGroupSchedule} from "../../schedule/schedule";
import bridge from "@vkontakte/vk-bridge";
import {capitalizeFirstLetter, openAnyError, Scrollable} from "../../other/other";
import {format} from "@vkontakte/vkui/dist/lib/date";
import {Popover} from "@vkontakte/vkui/dist/components/Popover/Popover";
import {Icon16CalendarOutline} from "@vkontakte/icons";
import {token} from "../../other/config";

export const GroupSch = () => {
    const [snackbar, setSnackbar] = React.useState(null);

    const date = new Date()
    let dayNum = date.getDay()-1
    if (dayNum === -1) {
        dayNum = 6
    }

    const [selected, setSelected] = React.useState(`group-schedule${dayNum.toString()}`);
    const [selectedDate, setSelectedDate] = useState(() => date);

    const [group, setGroup] = React.useState();
    const onChange = (e) => {
        setGroup(e.target.value);
    };

    const [fetching, setFetching] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const fetchOptions = () => {
        setFetching(true);
        bridge.send(
            "VKWebAppCallAPIMethod",
            {"method": "execute.getGroups", "params": {"v": "5.154", "access_token": token}}
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
        setResult(<GetGroupSchedule group={group} activePanel={selected} date={format(selectedDate, 'DD.MM.YYYY')}/>);
    }, [selectedDate || selected, group]);

    const [shown, setShown] = React.useState(false);
    return (
        <Group separator="hide" mode='plain' style={{paddingTop: 'var(--vkui--size_panel_header_height--regular)'}}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <Popover action="click" shown={shown} onShownChange={setShown} style={{display: 'flex', justifyContent: 'center', background: 'none'}}
                    content={<LocaleProvider value='ru'>
                            <Calendar size='m' value={selectedDate} onChange={setSelectedDate} showNeighboringMonth={true}/>
                        </LocaleProvider>}>
                    <Button appearance='accent-invariable' mode='outline' style={{
                        margin: '0 var(--vkui--size_base_padding_horizontal--regular) var(--vkui--size_base_padding_vertical--regular)',
                        width: 'max-content'
                    }} before={<Icon16CalendarOutline/>}>
                        {`${capitalizeFirstLetter(
                            selectedDate.toLocaleDateString('ru', {month: 'long', year: 'numeric'}))}`}
                    </Button>
                </Popover>
                <FormItem style={{padding: '0 var(--vkui--size_base_padding_horizontal--regular)'}}>
                    <CustomSelect placeholder="Выберите группу" searchable options={options} selectType='default' onChange={onChange}
                                  value={group} onOpen={options.length === 0 && fetchOptions} fetching={fetching}/>
                </FormItem>
            </div>
            <Scrollable setSelected={setSelected} selectedDate={selectedDate} setSelectedDate={setSelectedDate} selected={selected} type='group-schedule'/>
            {result}
            {snackbar}
        </Group>
    )
};