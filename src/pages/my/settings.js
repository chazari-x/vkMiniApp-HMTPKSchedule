import {
    Button, Card,
    CardGrid,
    CustomSelect,
    Epic,
    FormItem,
    FormStatus,
    Group, Link, Panel, Paragraph,
    Tooltip, TooltipContainer
} from "@vkontakte/vkui";
import React, {useEffect} from "react";
import ReactDOM from "react-dom";
import {Icon24ExternalLinkOutline} from "@vkontakte/icons";
import config from "../../etc/config.json";
import {fetchGroupOrTeacher, fetchGroups, fetchTeachers, updateTooltips} from "../../api/api";
import {update} from "../../utils/utils";

export const Settings = ({setDisabledExitButton}) => {
    useEffect(() => {
        window['groupOrTeacherTemp'] = window['groupOrTeacher']
    }, [])

    const [groupOrTeacherTemp, setGroupOrTeacherTemp] = React.useState(() => window['groupOrTeacher'])
    const [tooltip1, setTooltip1] = React.useState( () => window["tooltips"][1]);
    const [tooltip2, setTooltip2] = React.useState(() => window["tooltips"][2]);
    const [tooltip3, setTooltip3] = React.useState(() => window["tooltips"][3]);

    const updateGroupOrTeacherTemp = (e) => {
        window['groupOrTeacherTemp'] = e
        setGroupOrTeacherTemp(e)
        setTimeout(() => {
            if (window['groupOrTeacherTemp']['group'] !== "" || window['groupOrTeacherTemp']['teacher'] !== "") {
                setDisabledExitButton(false)
            }
        }, 100)

    };

    let [group, setGroup] = React.useState("")
    const onGroupChange = (e) => {
        setDisabledExitButton(true)
        updateGroupOrTeacherTemp({"group": e.target.value, "teacher": ""})
        setGroup(e.target.value);
        setTeacher(undefined);
    };

    const [groupFetching, setGroupFetching] = React.useState(false);
    const [groupOptions, setGroupOptions] = React.useState([]);
    const updateGroups = () => {
        if (window['groups'] !== undefined) {
            if (Array.isArray(window['groups'])) {
                if (window['groups'].length > 0) {
                    setGroupOptions(window['groups']);
                    return
                }
            } else {
                setActive("error")
            }

        }

        setGroupFetching(true);
        fetchGroups()
            .then(res => {
                if (Array.isArray(window['groups'])) {
                    setGroupOptions(window['groups'])
                } else {
                    setError(res[1])
                    setActive("error")
                }
                setGroupFetching(false)
            })
            .catch((error) => {
                setGroupOptions(window['groups'])
                setGroupFetching(false)
                setError(config.errors.FetchGroupsOrTeachersErr)
                setActive("error")
                console.log(error)
            });
    };

    let [teacher, setTeacher] = React.useState("");
    const onTeacherChange = (e) => {
        setDisabledExitButton(true)
        updateGroupOrTeacherTemp({"group": "", "teacher": e.target.value})
        setTeacher(e.target.value);
        setGroup(undefined);
    };

    const [teacherFetching, setTeacherFetching] = React.useState(false);
    const [teacherOptions, setTeacherOptions] = React.useState([]);
    const updateTeachers = () => {
        if (window['teachers'] !== undefined) {
            if (Array.isArray(window['teachers'])) {
                if (window['teachers'].length > 0) {
                    setTeacherOptions(window['teachers']);
                    return
                }
            } else {
                setActive("error")
            }
        }

        setTeacherFetching(true);
        fetchTeachers()
            .then(res => {
                if (Array.isArray(window['teachers'])) {
                    setTeacherOptions(window['teachers'])
                } else {
                    setError(res[1])
                    setActive("error")
                }
                setTeacherFetching(false)
            })
            .catch((error) => {
                setTeacherOptions(window['teachers'])
                setTeacherFetching(false)
                setError(config.errors.FetchGroupsOrTeachersErr)
                setActive("error")
                console.log(error)
            })
    };

    let [menu, setMenu] = React.useState("none")
    const onMenuChange = (e) => {
        setMenu(e.target.value)
        updateGroupOrTeacherTemp({"group": "", "teacher": ""})
        setGroup("")
        setTeacher("")
        setDisabledExitButton(true)
    }

    useEffect(() => {
        if (window['groupOrTeacher'] !== undefined) {
            if (window['groupOrTeacher']['group'] !== undefined && window['groupOrTeacher']['teacher'] !== undefined) {
                window['groupOrTeacherTemp'] = window['groupOrTeacher']
                if (window['groupOrTeacherTemp']['group'] !== "") {
                    setGroup(window['groupOrTeacherTemp']['group'])
                    setMenu(groupName)
                    updateGroups()
                } else if (window['groupOrTeacherTemp']['teacher'] !== "") {
                    setTeacher(window['groupOrTeacherTemp']['teacher'])
                    setMenu(teacherName)
                    updateTeachers()
                }
                return
            }
        }

        fetchGroupOrTeacher().then(_ => {
            setGroupOrTeacherTemp(window['groupOrTeacherTemp'])
            if (window['groupOrTeacherTemp'] !== null) {
                if (window['groupOrTeacherTemp']['group'] !== "") {
                    setGroup(window['groupOrTeacherTemp']['group'])
                    setMenu(groupName)
                    updateGroups()
                } else if (window['groupOrTeacherTemp']['teacher'] !== "") {
                    setTeacher(window['groupOrTeacherTemp']['teacher'])
                    setMenu(teacherName)
                    updateTeachers()
                }
            }
        }).catch(err => {
            console.log(err)
            ReactDOM.render(<FormStatus mode='error' header='Произошла ошибка' style={{
                margin: '2px 4px', padding: '5px', justifyContent: 'center', alignItems: 'center',
            }}>{config.errors.FetchGroupOrTeacherErr}
            </FormStatus>, document.getElementById('settings-menu'))
        })
    }, []);

    const teacherName = "Преподаватель"
    const groupName = "Студент"

    const [error, setError] = React.useState(config.errors.FetchGroupsOrTeachersErr)
    const [active, setActive] = React.useState("main");
    return <Group id='settings-menu' separator='hide' mode='plain' style={{height: 'calc(100vh - var(--vkui--size_panel_header_height--regular)*4)'}}>
        <CardGrid size="l" style={{height: '100%', display: 'flex', margin: '0', padding: '0'}}>
            <Epic activeStory={active} style={{padding: 0, margin: 0}}>
                <Panel id="error" style={{padding: 0, margin: 0}}>
                    <FormStatus mode='error' header='Произошла ошибка' style={{
                        margin: 'var(--vkui--size_base_padding_vertical--regular) var(--vkui--size_base_padding_horizontal--regular)', padding: '0',
                        justifyContent: 'center', alignItems: 'center', flex: '1'
                    }}>{error}</FormStatus>
                </Panel>
                <Panel id="main" style={{padding: 0, margin: 0}}>
                    <TooltipContainer
                        fixed
                        style={{
                            flex: '1',
                            padding: '0 var(--vkui--size_base_padding_horizontal--regular)'
                        }}>
                        <Tooltip
                            style={{textAlign: 'center'}}
                            text={config.tooltips.tooltip1}
                            isShown={tooltip1} onClose={() => update(1, setTooltip1)}
                        >
                            <FormItem style={{padding: '0'}}>
                                <CustomSelect
                                    placeholder="Выберите тип пользователя" value={menu} onChange={onMenuChange}
                                    options={[{label: groupName, value: groupName}, {label: teacherName, value: teacherName}]}
                                />
                            </FormItem>
                        </Tooltip>
                        <Epic activeStory={menu} style={{padding: 'var(--vkui--size_base_padding_vertical--regular) 0 0'}}>
                            <Group id='none' separator="hide" mode='plain'>
                                <FormItem style={{flex: '1', padding: '0'}}>
                                    <CustomSelect disabled
                                                  placeholder="" searchable options={groupOptions} onChange={onGroupChange}
                                                  value={group} onOpen={groupOptions.length === 0 && updateGroups}
                                                  fetching={groupFetching}
                                    />
                                </FormItem>
                            </Group>
                            <Group id={groupName} separator="hide" mode='plain'>
                                <Tooltip
                                    style={{textAlign: 'center'}}
                                    text={config.tooltips.tooltip2}
                                    isShown={tooltip2 && !tooltip1} onClose={() => {
                                    update(2, setTooltip2)
                                    if (groupOrTeacherTemp['group'] !== "" || groupOrTeacherTemp['teacher'] !== "") {
                                        setDisabledExitButton(false)
                                    }
                                }}
                                >
                                    <FormItem style={{padding: '0'}}>
                                        <CustomSelect
                                            placeholder="Выберите группу" searchable options={groupOptions}
                                            onChange={onGroupChange}
                                            value={group} onOpen={groupOptions.length === 0 && updateGroups}
                                            fetching={groupFetching}
                                        />
                                    </FormItem>
                                </Tooltip>
                            </Group>
                            <Group id={teacherName} separator="hide" mode='plain'>
                                <Tooltip
                                    style={{textAlign: 'center'}}
                                    text={config.tooltips.tooltip3}
                                    isShown={tooltip3 && !tooltip1} onClose={() => {
                                    update(3, setTooltip3)
                                    if (groupOrTeacherTemp['group'] !== "" || groupOrTeacherTemp['teacher'] !== "") {
                                        setDisabledExitButton(false)
                                    }
                                }}
                                >
                                    <FormItem style={{padding: '0'}}>
                                        <CustomSelect
                                            placeholder="Выберите преподавателя" searchable options={teacherOptions}
                                            onChange={onTeacherChange}
                                            value={teacher} onOpen={teacherOptions.length === 0 && updateTeachers}
                                            fetching={teacherFetching}
                                        />
                                    </FormItem>
                                </Tooltip>
                            </Group>
                        </Epic>
                        <CardGrid size="l" style={{margin: '0', padding: '0'}}>
                            <Card mode="outline-tint" style={{
                                margin: 'var(--vkui--size_base_padding_vertical--regular) 0 0',
                                padding: 'var(--vkui--size_base_padding_vertical--regular) var(--vkui--size_base_padding_horizontal--regular) '
                            }}>
                                <div style={{marginBottom: '10px'}}>
                                    <Paragraph>
                                        {config.texts.Paragraph1} <Link href={window['app'] === 'ok' ? config.group.hrefs.ok : config.group.hrefs.vk} target="_blank">{config.group.name}
                                        <Icon24ExternalLinkOutline width={16} height={16}/></Link>.
                                    </Paragraph>
                                </div>
                                <div>
                                    <Paragraph>
                                        {config.texts.Paragraph2}
                                    </Paragraph>
                                </div>
                            </Card>
                        </CardGrid>
                        <div hidden={window['userID'] !== 390295814}>
                            <Button appearance='negative' align="center" mode="outline" stretched={true} onClick={() => {
                                updateGroupOrTeacherTemp({"group": "", "teacher": ""})
                                window['tooltips'] = [true]
                                while (window['tooltips'].length < 10 + 1) {
                                    window['tooltips'].push(true)
                                }

                                updateTooltips().then().catch()
                            }}
                                    style={{margin: 'calc(var(--vkui--size_base_padding_vertical--regular)*1) 0 0'}}
                                    disabled={groupOrTeacherTemp['group'] === "" && groupOrTeacherTemp['teacher'] === ""}
                            >{config.buttons.clear}</Button>
                        </div>
                    </TooltipContainer>
                </Panel>
            </Epic>
        </CardGrid>
    </Group>
};