import {
    Button, Calendar, Group, HorizontalScroll,
    InfoRow, LocaleProvider, Tabs, TabsItem
} from "@vkontakte/vkui";
import {Icon16CalendarOutline} from "@vkontakte/icons";
import React, {useEffect, useState} from "react";
import "../../schedule/schedule";
import {GetMySchedule} from "../../schedule/schedule";
import {addDays, capitalizeFirstLetter} from "../../other/other";
import {format} from "@vkontakte/vkui/dist/lib/date";
import {Popover} from "@vkontakte/vkui/dist/components/Popover/Popover";

export const MySch = () => {
    const date = new Date()
    let dayNum = date.getDay()-1
    if (dayNum === -1) {
        dayNum = 6
    }

    const [selected, setSelected] = React.useState(`my-schedule${dayNum.toString()}`);
    const [selectedDate, setSelectedDate] = useState(() => date);
    const Scrollable = () => {
        return (
            <Group separator="hide" mode='plain'>
                <Tabs mode='accent'>
                    <HorizontalScroll arrowSize="m">
                        {[0,1,2,3,4,5,6].map(i => {
                            let dayNum = selectedDate.getDay()-1
                            if (dayNum === -1) {
                                dayNum = 6
                            }
                            setSelected(`my-schedule${dayNum.toString()}`)
                            let d = addDays(selectedDate, -dayNum+i)
                            return <TabsItem
                                key={`my-schedule${i.toString()}`}
                                selected={selected === `my-schedule${i.toString()}`}
                                onClick={() => {
                                    setSelectedDate(addDays(selectedDate, -dayNum+i))
                                    setSelected(`my-schedule${i.toString()}`)
                                }}
                                style={{textAlign: "center", minWidth: '3em', marginLeft: '1px', marginRight: '1px'}}
                            >
                                <InfoRow header={d.toLocaleDateString("ru", {weekday: "short"})}>{d.getDate()}</InfoRow>
                            </TabsItem>
                        })}
                    </HorizontalScroll>
                </Tabs>
            </Group>
        );
    };

    const [result, setResult] = React.useState(<div></div>);
    useEffect(() => {
        setResult(<GetMySchedule activePanel={selected} date={format(selectedDate, 'DD.MM.YYYY')}/>);
    }, [selectedDate || selected]);

    const [shown, setShown] = React.useState(false)
    return (
        <Group separator="hide" mode='plain' style={{paddingTop: 'var(--vkui--size_panel_header_height--regular)'}}>
            <div style={{display: 'flex', flexDirection: 'column',}}>
                <Popover action="click" shown={shown} onShownChange={setShown} style={{display: 'flex', justifyContent: 'center', background: 'none'}}
                    content={<LocaleProvider value='ru'>
                            <Calendar size='m' value={selectedDate} onChange={setSelectedDate} showNeighboringMonth={true}/>
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
            </div>
            <Scrollable/>
            {result}
        </Group>
    )
};