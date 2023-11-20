import {
    Badge,
    Button,
    CardGrid, Checkbox, Counter, CustomSelect, CustomSelectOption, Div, Epic, FormItem,
    Group, HorizontalScroll, InfoRow, Panel,
    Placeholder,
    PullToRefresh,
    Separator, Spinner,
    Tabs,
    TabsItem,
    usePlatform, View
} from "@vkontakte/vkui";
import React, {useState} from "react";
import {GetGroupSchedule} from "../../schedule/schedule";
import {
    Icon16Dropdown,
    Icon20NewsfeedOutline, Icon20PictureOutline,
    Icon20ThumbsUpOutline, Icon20UsersOutline,
    Icon24NewsfeedOutline, Icon24PictureOutline,
    Icon24ThumbsUpOutline, Icon24UsersOutline
} from "@vkontakte/icons";
import {Dates} from "../panels";
import {array} from "prop-types";
import ReactDOM from "react-dom";

const GroupSch = ({update, fetching}) => {
    const date = new Date()
    let dayNum = date.getDay()-1
    if (dayNum === -1) {
        dayNum = 6
    }

    const [selected, setSelected] = React.useState(`group-schedule${dayNum.toString()}`);
    const [disabled, setDisabled] = React.useState(false);

    const Scrollable = () => {
        return (
            <Group separator="hide" mode='plain'>
                <Tabs mode='accent'>
                    <HorizontalScroll arrowSize="m">
                        {Dates.map(item => (
                            <TabsItem
                                key={`group-schedule${item.id.toString()}`}
                                selected={selected === `group-schedule${item.id.toString()}`}
                                disabled={disabled}
                                onClick={() => setSelected(`group-schedule${item.id.toString()}`)}
                                style={{
                                    textAlign: "center",
                                    minWidth: '3em'
                                }}
                            >
                                <InfoRow header={item.value}>{date.getDate()-Dates[dayNum].id+item.id}</InfoRow>
                            </TabsItem>
                        ))}
                    </HorizontalScroll>
                </Tabs>
            </Group>
        );
    };

    const options = [
        {label: 'ИСП-Б-231-2021', value: 'ИСП-Б-231-2021'},
        {label: 'ИСП-Б-231а-2021', value: 'ИСП-Б-231а-2021'},
        {label: 'ИСП-Б-231и-2021', value: 'ИСП-Б-231и-2021'},
    ];
    const [group, setGroup] = React.useState('ИСП-Б-231-2021');
    const [isVisible, setIsVisible] = useState(true);

    const onChange = (e) => {
        setGroup(e.target.value);
        setIsVisible(false);

        setTimeout(() => {
            setIsVisible(true);
        }, 100);
    };

    if (update && !fetching) {
        return (
            <Group separator="hide" mode='plain'>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <Div separator="hide" mode='plain'>
                        {`${date.toLocaleDateString("ru", {
                            month: "long",
                        })}, ${date.getFullYear()}`}
                    </Div>
                    <FormItem style={{flex: '1'}}>
                        <CustomSelect placeholder="Выберите группу" searchable options={options} selectType='plain' value={group} onChange={onChange}/>
                    </FormItem>
                </div>
                <Scrollable/>
                {isVisible && <GetGroupSchedule group={group} activePanel={selected}/>}
            </Group>
        )
    }

    return (
        <Group separator="hide" mode='plain'>
            <Scrollable/>
        </Group>
    )
};

export default GroupSch;