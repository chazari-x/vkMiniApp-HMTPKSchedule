import {
    Button,
    Group,
    HorizontalScroll,
    InfoRow,
    Placeholder,
    PullToRefresh,
    Separator,
    Tabs,
    TabsItem
} from "@vkontakte/vkui";
import {Icon56MentionOutline, Icon56UsersOutline} from "@vkontakte/icons";
import React from "react";
import {GetGroupSchedule, GetTeacherSchedule} from "../../schedule/schedule";
import {Dates} from "../panels";

const TeacherSch = ({update, fetching}) => {
    const date = new Date()
    let dayNum = date.getDay()-1
    if (dayNum === -1) {
        dayNum = 6
    }

    const [selected, setSelected] = React.useState(`teacher-schedule${dayNum.toString()}`);
    const [disabled, setDisabled] = React.useState(false);

    const Scrollable = () => {
        return (
            <Group separator="hide" mode='plain'>
                <Tabs mode='accent'>
                    <HorizontalScroll arrowSize="m">
                        {Dates.map(item => (
                            <TabsItem
                                key={`teacher-schedule${item.id.toString()}`}
                                selected={selected === `teacher-schedule${item.id.toString()}`}
                                disabled={disabled}
                                onClick={() => setSelected(`teacher-schedule${item.id.toString()}`)}
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
                <GetTeacherSchedule teacher='Ярыгина' activePanel={selected}/>
            </Group>
        )
    }

    return (
        <Group separator="hide" mode='plain'>
            <Scrollable/>
        </Group>
    )
};

export default TeacherSch;