import {
    Button, Card,
    CardGrid,
    CustomSelect,
    Epic,
    FormItem,
    FormStatus,
    Group, Link, Paragraph,
    Snackbar, Tooltip, TooltipContainer
} from "@vkontakte/vkui";
import React, {useEffect} from "react";
import bridge from "@vkontakte/vk-bridge";
import ReactDOM from "react-dom";
import {fetchGroupOrTeacher, updateTooltips} from "../other/other";
import {Icon24ExternalLinkOutline, Icon28ErrorCircleOutline} from "@vkontakte/icons";
import config from "../other/config.json";

export const Settings = ({setDisabledExitButton}) => {
    useEffect(() => {
        window['groupOrTeacherTemp'] = window['groupOrTeacher']
    }, [])

    const [groupOrTeacherTemp, setGroupOrTeacherTemp] = React.useState(() => window['groupOrTeacher'])
    const [tooltip1, setTooltip1] = React.useState( () => window["tooltips"][1]);
    const [tooltip2, setTooltip2] = React.useState(() => window["tooltips"][2]);
    const [tooltip3, setTooltip3] = React.useState(() => window["tooltips"][3]);
    const update = (tooltip, setTooltip) => {
        window["tooltips"][tooltip] = false
        setTooltip(false)
        updateTooltips().then().catch(err => {console.error(err)})
    }

    const [snackbar, setSnackbar] = React.useState(<div></div>);
    const openError = () => {
        if (snackbar) return;
        setSnackbar(<Snackbar onClose={() => setSnackbar(null)}
                              before={<Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)"/>}
            >Не удалось применить изменения</Snackbar>
        );
    };

    const updateGroupOrTeacherTemp = (e) => {
        window['groupOrTeacherTemp'] = e
        setGroupOrTeacherTemp(e)
    };

    let [group, setGroup] = React.useState("")
    const onGroupChange = (e) => {
        updateGroupOrTeacherTemp({"group": e.target.value, "teacher": ""})
        setDisabledExitButton(false)
        setGroup(e.target.value);
        setTeacher(undefined);
    };

    const [groupFetching, setGroupFetching] = React.useState(false);
    const [groupOptions, setGroupOptions] = React.useState([]);
    const fetchGroups = () => {
        if (groupOptions.length === 0) {
            setGroupFetching(true);
            bridge.send(
                "VKWebAppCallAPIMethod",
                {"method": "execute.getGroups", "params": {"v": "5.154", "access_token": config.token}}
            ).then((data) => {
                setGroupOptions(data.response);
                setGroupFetching(false);
            }).catch((error) => {
                openError()
                console.log(error)
            });
        }
    };

    let [teacher, setTeacher] = React.useState("");
    const onTeacherChange = (e) => {
        updateGroupOrTeacherTemp({"group": "", "teacher": e.target.value})
        setDisabledExitButton(false)
        setTeacher(e.target.value);
        setGroup(undefined);
    };

    const [teacherFetching, setTeacherFetching] = React.useState(false);
    const [teacherOptions, setTeacherOptions] = React.useState([]);
    const fetchTeachers = () => {
        if (teacherOptions.length === 0) {
            setTeacherFetching(true);
            bridge.send(
                "VKWebAppCallAPIMethod",
                {"method": "execute.getTeachers", "params": {"v": "5.154", "access_token": config.token}}
            ).then((data) => {
                setTeacherOptions(data.response);
                setTeacherFetching(false);
            }).catch((error) => {
                openError()
                console.log(error)
            });
        }
    };

    let [menu, setMenu] = React.useState("none")
    const onMenuChange = (e) => {setMenu(e.target.value)}

    useEffect(() => {
        fetchGroupOrTeacher().then(_ => {
            window['groupOrTeacherTemp'] = window['groupOrTeacher']
            setGroupOrTeacherTemp(window['groupOrTeacherTemp'])
            if (window['groupOrTeacherTemp'] !== null) {
                if (window['groupOrTeacherTemp']['group'] !== "") {
                    setGroup(window['groupOrTeacherTemp']['group'])
                    setMenu(groupName)
                    fetchGroups()
                } else if (window['groupOrTeacherTemp']['teacher'] !== "") {
                    setTeacher(window['groupOrTeacherTemp']['teacher'])
                    setMenu(teacherName)
                    fetchTeachers()
                }
            }
        }).catch(err => {
            console.log(err)
            ReactDOM.render(<FormStatus mode='error' header='Произошла ошибка' style={{
                margin: '2px 4px', padding: '5px', justifyContent: 'center', alignItems: 'center',
            }}>Произошла ошибка при получении Вашей группы
            </FormStatus>, document.getElementById('settings-menu'))
        })
    }, []);

    const teacherName = "Преподаватель"
    const groupName = "Студент"

    return <Group id='settings-menu' separator='hide' mode='plain' style={{height: 'calc(100vh - var(--vkui--size_panel_header_height--regular)*4)'}}>
        <CardGrid size="l" style={{height: '100%', display: 'flex', margin: '0', padding: '0'}}>
            <TooltipContainer
                fixed
                style={{
                    flex: '1',
                    padding: '0 var(--vkui--size_base_padding_horizontal--regular)'
                }}>
                <Tooltip
                    style={{textAlign: 'center'}}
                    text='Добро пожаловать в раздел настройки расписания! Здесь вы можете настроить ваш опыт использования, выбрав тип пользователя: "Студент" или "Преподаватель".'
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
                                          value={group} onOpen={groupOptions.length === 0 && fetchGroups}
                                          fetching={groupFetching}
                            />
                        </FormItem>
                    </Group>
                    <Group id={groupName} separator="hide" mode='plain'>
                        <Tooltip
                            style={{textAlign: 'center'}}
                            text="Укажите свою группу из предложенного списка. Это позволит вам видеть расписание, соответствующее вашей программе обучения."
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
                                    value={group} onOpen={groupOptions.length === 0 && fetchGroups}
                                    fetching={groupFetching}
                                />
                            </FormItem>
                        </Tooltip>
                    </Group>
                    <Group id={teacherName} separator="hide" mode='plain'>
                        <Tooltip
                            style={{textAlign: 'center'}}
                            text="Укажите своё ФИО. Таким образом, вы получите расписание, соответствующее вашим учебным занятиям."
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
                                    value={teacher} onOpen={teacherOptions.length === 0 && fetchTeachers}
                                    fetching={teacherFetching}
                                />
                            </FormItem>
                        </Tooltip>
                    </Group>
                </Epic>
                <CardGrid size="l" style={{margin: '0', padding: '0'}}>
                    <Card mode="outline-tint" style={{
                        margin: 'var(--vkui--size_base_padding_vertical--regular) 0 0', textAlign: "justify",
                        padding: 'var(--vkui--size_base_padding_vertical--regular) var(--vkui--size_base_padding_horizontal--regular) '
                    }}>
                        <div style={{marginBottom: '10px'}}>
                            <Paragraph>
                                Если вы не нашли нужную группу или преподавателя в списке, пожалуйста,
                                сообщите об этом разработчикам. Для отправки обратной связи и уведомления об
                                отсутствующих данных, перейдите по следующей ссылке:
                                <Link href={config.group.href} target="_blank"> Разработчики: {config.group.name}
                                    <Icon24ExternalLinkOutline width={16} height={16}/></Link>.
                            </Paragraph>
                        </div>
                        <div>
                            <Paragraph>
                                Благодарим за ваше внимание и помощь в совершенствовании нашего сервиса!
                            </Paragraph>
                        </div>
                    </Card>
                </CardGrid>
                <div hidden={userID !== 390295814}>
                    <Button appearance='negative' align="center" mode="outline" stretched={true} onClick={() => {
                        updateGroupOrTeacherTemp({"group": "", "teacher": ""})
                    }}
                            style={{margin: 'calc(var(--vkui--size_base_padding_vertical--regular)*1) 0 0'}}
                            disabled={groupOrTeacherTemp['group'] === "" && groupOrTeacherTemp['teacher'] === ""}
                    >Очистить</Button>
                </div>
            </TooltipContainer>
            {snackbar}
        </CardGrid>
    </Group>
};