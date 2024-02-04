import React from "react";
import config from "../etc/config.json";
import {Group, HorizontalScroll, Snackbar, Tabs, TabsItem, Tooltip, TooltipContainer} from "@vkontakte/vkui";
import {Icon28ErrorCircleOutline} from "@vkontakte/icons";
import {format} from "@vkontakte/vkui/dist/lib/date";
import {updateTooltips} from "../api/api";

export function toDataURL(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
        const reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

export const capitalizeFirstLetter = (str) => {
    let chars = str.split('');
    chars[0] = chars[0].toUpperCase();
    return chars.join('');
}

export const openAnyError = (snackbar, setSnackbar) => {
    if (snackbar) return;
    setSnackbar(<Snackbar onClose={() => setSnackbar(null)}
                          before={<Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)"/>}
        >Произошла ошибка</Snackbar>,
    );
};

export const Dates = [
    {id: 0, value: 'ПН'},
    {id: 1, value: 'ВТ'},
    {id: 2, value: 'СР'},
    {id: 3, value: 'ЧТ'},
    {id: 4, value: 'ПТ'},
    {id: 5, value: 'СБ'},
    {id: 6, value: 'ВС'}
]

export const Scrollable = ({selectedDate, setSelected, setSelectedDate, selected, type, tooltip}) => {
    const [tooltip7, setTooltip7] = React.useState(() => window["tooltips"][7]);

    const addDays = (date, days) => {
        let result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    return (
        <Group separator="hide" mode='plain'>
            <Tabs mode='accent' style={{display: 'flex', justifyContent: 'center'}}>
                <TooltipContainer style={{
                    position: 'relative', zIndex: tooltip ? (window["tooltips"][6]||window["tooltips"][5]) ? 0 : 1 : 0
                }}>
                    <Tooltip style={{display: 'flex', justifyContent: 'center', textAlign: 'center'}}
                             text={config.tooltips.tooltip7}
                             isShown={tooltip7&&!(window["tooltips"][6]||window["tooltips"][5])&&tooltip}
                             onClose={() => update(7, setTooltip7)}
                    >
                        <HorizontalScroll arrowSize="m" >
                            {[-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13].map(i => {
                                let dayNum = selectedDate.getDay() - 1
                                if (dayNum === -1) {
                                    dayNum = 6
                                }
                                let ii = i
                                if (ii > 6) {ii -= 7} else if (ii < 0) {ii += 7}
                                setSelected(`${type}${dayNum.toString()}`)
                                let d = addDays(selectedDate, -dayNum + i)
                                return <TabsItem
                                    id={`tabsItem-${type}${i.toString()}`}
                                    aria-controls={`tabsItem-${type}${i.toString()}`}
                                    key={`${type}${i.toString()}`}
                                    selected={selected === `${type}${i.toString()}`}
                                    onClick={() => {
                                        setSelectedDate(addDays(selectedDate, -dayNum + i))
                                        setSelected(`${type}${ii.toString()}`)
                                    }}
                                    style={{textAlign: "center", minWidth: '2.5em', marginLeft: '1px', marginRight: '1px'}}
                                >
                                    <div style={i < 0 || i > 6
                                        ? {display: 'flex', flexDirection: 'column', fontWeight: '200'}
                                        : {color: 'var(--vkui--color_text_primary)', display: 'flex', flexDirection: 'column'}}>
                                        <div>{d.toLocaleDateString("ru", {weekday: "short"}).toUpperCase()}</div>
                                        {format(d, 'DD.MM.YYYY') === format(new Date(), 'DD.MM.YYYY')
                                            ? <div style={{borderTop: "solid 1px var(--vkui--color_text_primary)"}}>{d.getDate()}</div>
                                            : <div style={{borderTop: "solid 1px #00000000"}}>{d.getDate()}</div>}
                                    </div>
                                </TabsItem>
                            })}
                        </HorizontalScroll>
                    </Tooltip>
                </TooltipContainer>
            </Tabs>
        </Group>
    );
};

export function formatName(inputName) {
    const parts = inputName.split(" ");

    if (parts.length === 1) {
        return parts[0]
    } else if (parts.length === 2) {
        let [surname, name] = parts
        return `${surname} ${name[0]}.`
    } else if (parts.length === 3) {
        let [surname, name, patronymic] = parts
        return `${surname} ${name[0]}. ${patronymic[0]}.`
    } else {
        let [surname, name, patronymic] = parts.slice(0, 3)
        return `${surname} ${name[0]}. ${patronymic[0]}. ...`
    }
}

Date.prototype.getWeek = function() {
    const onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()-1)/7);
}

export const update = (tooltip, setTooltip) => {
    window["tooltips"][tooltip] = false
    if (setTooltip !== undefined) {
        setTooltip(false)
    }
    updateTooltips().then().catch()
}