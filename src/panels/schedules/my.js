import {
    Button,
    CardGrid,
    Group, HorizontalScroll,
    InfoRow,
    Panel,
    Placeholder,
    PullToRefresh,
    Separator,
    SimpleCell, Tabs, TabsItem
} from "@vkontakte/vkui";
import {Icon56MentionOutline, Icon56UsersOutline} from "@vkontakte/icons";
import React, {useState} from "react";
import "../../schedule/schedule";
import {GetGroupSchedule, GetMySchedule} from "../../schedule/schedule";
import {Dates} from "../panels";

const MySch = ({update, fetching}) => {
    const date = new Date()
    let dayNum = date.getDay()-1
    if (dayNum === -1) {
        dayNum = 6
    }

    const [selected, setSelected] = React.useState(`my-schedule${dayNum.toString()}`);
    const [disabled, setDisabled] = React.useState(false);

    const Scrollable = () => {
        return (
            <Group separator="hide" mode='plain'>
                <Tabs mode='accent'>
                    <HorizontalScroll arrowSize="m">
                        {Dates.map(item => (
                            <TabsItem
                                key={`my-schedule${item.id.toString()}`}
                                selected={selected === `my-schedule${item.id.toString()}`}
                                disabled={disabled}
                                onClick={() => setSelected(`my-schedule${item.id.toString()}`)}
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

    if (update && !fetching) {
        return (
            <Group separator="hide" mode='plain'>
                <Scrollable/>
                <GetMySchedule user='admin' activePanel={selected}/>
            </Group>
        )
    }

    return (
        <Group separator="hide" mode='plain'>
            <Scrollable/>
        </Group>
    )
};

export default MySch;