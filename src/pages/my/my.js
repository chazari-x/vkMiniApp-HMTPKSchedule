import {
    Button,
    Calendar,
    Epic,
    Group,
    LocaleProvider, PullToRefresh, Snackbar, Spinner, Tooltip, TooltipContainer,
} from "@vkontakte/vkui";
import {
    Icon16CalendarOutline,
    Icon16DoneCircle,
    Icon16GearOutline,
    Icon28CheckCircleOutline, Icon28ErrorCircleOutline
} from "@vkontakte/icons";
import React, {useEffect} from "react";
import {GetMySchedule} from "../../schedule/schedule";
import {capitalizeFirstLetter, Scrollable, update} from "../../utils/utils";
import {format} from "@vkontakte/vkui/dist/lib/date";
import {Popover} from "@vkontakte/vkui/dist/components/Popover/Popover";
import {Settings} from "./settings";
import config from "../../etc/config.json";
import {updateGroupOrTeacher} from "../../api/api";

export const MySch = () => {
    const [tooltip4, setTooltip4] = React.useState( () => window["tooltips"][4]);
    const [tooltip5, setTooltip5] = React.useState(() => window["tooltips"][5]);
    const [tooltip6, setTooltip6] = React.useState(() => window["tooltips"][6]);

    const date = new Date()
    let dayNum = date.getDay()-1
    if (dayNum === -1) {
        dayNum = 6
    }

    let [selected, setSelected] = React.useState(`my-schedule${dayNum.toString()}`);
    const [selectedDate, setSelectedDate] = React.useState(() => date);
    const [resultStory, setResultStory] = React.useState('load');
    const change = (date) => {
        date = new Date(format(date, "YYYY-MM-DD"))
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
        setResultStory("load")
        setResult(<GetMySchedule activePanel={selected} date={format(selectedDate, 'DD.MM.YYYY')} week={selectedDate.getWeek()} year={selectedDate.getFullYear()}/>)
    }, [selectedDate || selected || resultStory]);

    useEffect(() => {
        setResultStory("schedule")
        setFetching(false);
    }, [result])

    const [activeStory, setActiveStory] = React.useState('main');
    const [disabledExitButton, setDisabledExitButton] = React.useState(() => tooltip4);
    useEffect(() => {
        if (window['groupOrTeacher']['group'] === undefined && window['groupOrTeacher']['teacher'] === undefined) {
            setActiveStory('settings')
            setDisabledExitButton(true)
        } else if (window['groupOrTeacher']['group'] === "" && window['groupOrTeacher']['teacher'] === "") {
            setActiveStory('settings')
            setDisabledExitButton(true)
        }
    }, [!activeStory]);

    const [snackbar, setSnackbar] = React.useState(<div></div>);
    const openSuccess = () => {
        if (snackbar) return;
        setSnackbar(<Snackbar onClose={() => setSnackbar(null)}
                              before={<Icon28CheckCircleOutline fill="var(--vkui--color_icon_positive)" />}
            >{config.texts.ChangeSuccess}</Snackbar>
        );
    }

    const openError = () => {
        if (snackbar) return;
        setSnackbar(<Snackbar onClose={() => setSnackbar(null)}
                              before={<Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)"/>}
            >{config.texts.ChangeFailure}</Snackbar>
        );
    };

    const [fetching, setFetching] = React.useState(false);
    const onRefresh = () => {
        setFetching(true);
        setResultStory("load")
        setResult(<GetMySchedule activePanel={selected} date={format(selectedDate, 'DD.MM.YYYY')} week={selectedDate.getWeek()} year={selectedDate.getFullYear()}/>)
    }

    const [calendar, setCalendar] = React.useState(false)
    return (
        <PullToRefresh onRefresh={onRefresh} isFetching={fetching} style={{height: '100%'}}>
            <Epic activeStory={activeStory} style={{height: '100%'}}>
                <Group id="main" separator="hide" mode='plain' style={{minHeight: '100%'}}>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Popover action="click" shown={calendar} onShownChange={setCalendar}
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
                            }} before={<Tooltip
                                style={{textAlign: 'center'}}
                                text={config.tooltips.tooltip6}
                                isShown={tooltip6&&!tooltip5} onClose={() => update(6, setTooltip6)}
                            >
                                <Icon16CalendarOutline/>
                            </Tooltip>}>
                                {`${capitalizeFirstLetter(selectedDate.toLocaleDateString('ru',
                                    {month: 'short', year: '2-digit'}
                                ))}`}
                            </Button>
                        </Popover>
                        <TooltipContainer fixed style={{position: 'relative', zIndex: 1,}}>
                            <Button appearance='accent-invariable' mode='outline' style={{
                                margin: '0 var(--vkui--size_base_padding_horizontal--regular)',
                                width: 'max-content'
                            }} before={<Tooltip
                                style={{textAlign: 'center'}}
                                text={config.tooltips.tooltip5}
                                isShown={tooltip5} onClose={() => update(5, setTooltip5)}
                            >
                                <Icon16GearOutline/>
                            </Tooltip>} onClick={() => setActiveStory('settings')}>
                                {config.buttons.settings}
                            </Button>
                        </TooltipContainer>
                    </div>
                    <Scrollable setSelected={setSelected} selectedDate={selectedDate} setSelectedDate={change} selected={selected} type='my-schedule' tooltip={true}/>
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
                <Group id="settings" separator="hide" mode='plain' style={{minHeight: 'calc(100vh - var(--vkui--size_panel_header_height--regular)*2)'}}>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <TooltipContainer fixed style={{zIndex: 1}}>
                            <Button appearance='positive' mode='outline' style={{
                                margin: '0 var(--vkui--size_base_padding_horizontal--regular)',
                                width: 'max-content'
                            }} before={<Tooltip
                                style={{textAlign: 'center'}}
                                text={config.tooltips.tooltip4}
                                isShown={tooltip4&&!disabledExitButton} onClose={() => update(4, setTooltip4)}
                            >
                                <Icon16DoneCircle/>
                            </Tooltip>} onClick={() => {
                                setActiveStory('main')
                                updateGroupOrTeacher(openSuccess, openError).then().catch()
                            }} disabled={disabledExitButton}>
                                {config.buttons.saveAndExit}
                            </Button>
                        </TooltipContainer>
                    </div>
                    <Settings setDisabledExitButton={setDisabledExitButton}/>
                    {snackbar}
                </Group>
            </Epic>
        </PullToRefresh>
    )
};