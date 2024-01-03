import {CustomSelect, Epic, Footnote, FormItem, FormStatus, Group, Snackbar} from "@vkontakte/vkui";
import React, {useEffect} from "react";
import bridge from "@vkontakte/vk-bridge";
import ReactDOM from "react-dom";
import {fetchSchedule} from "../other/other";
import {Icon28CheckCircleOutline, Icon28ErrorCircleOutline} from "@vkontakte/icons";
import {token} from "../other/config";

export const Settings = () => {
    const [snackbar, setSnackbar] = React.useState(null);
    const openSuccess = () => {
        if (snackbar) return;
        setSnackbar(<Snackbar onClose={() => setSnackbar(null)}
                              before={<Icon28CheckCircleOutline fill="var(--vkui--color_icon_positive)" />}
            >Настройки изменены</Snackbar>,
        );
    };

    const openError = () => {
        if (snackbar) return;
        setSnackbar(<Snackbar onClose={() => setSnackbar(null)}
                              before={<Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)"/>}
            >Не удалось применить изменения</Snackbar>,
        );
    };

    const storageSet = () => {
        if (window['userID'] !== 0) {
            bridge.send(
                "VKWebAppCallAPIMethod",
                {
                    "method": "storage.set",
                    "params": {
                        "v": "5.154",
                        "access_token": token,
                        "key": "schedule",
                        "user_id": window['userID'],
                        "value": window['groupOrTeacher']
                    }
                }
            ).then(null).catch((error) => {
                console.log(error)
                openError()
            });
        } else {
            ReactDOM.render(<FormStatus mode='error' header='Произошла ошибка' style={{
                margin: '2px 4px', padding: '5px', justifyContent: 'center', alignItems: 'center'
            }}>Произошла ошибка при получении Вашего идентификатора
            </FormStatus>, document.getElementById('settings-menu'))
        }
    }

    let [group, setGroup] = React.useState("")
    const onGroupChange = (e) => {
        window['groupOrTeacher'] = {"group": e.target.value, "teacher": ""}
        storageSet()
        openSuccess()
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
                {"method": "execute.getGroups", "params": {"v": "5.154", "access_token": token}}
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
        window['groupOrTeacher'] = {"group": "", "teacher": e.target.value}
        storageSet()
        openSuccess()
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
                {"method": "execute.getTeachers", "params": {"v": "5.154", "access_token": token}}
            ).then((data) => {
                setTeacherOptions(data.response);
                setTeacherFetching(false);
            }).catch((error) => {
                openError()
                console.log(error)
            });
        }
    };

    let [menu, setMenu] = React.useState("")
    const onMenuChange = (e) => {setMenu(e.target.value)}

    useEffect(() => {
        fetchSchedule().then(_ => {
            if (window['groupOrTeacher'] !== null) {
                if (window['groupOrTeacher']['group'] !== "") {
                    setGroup(window['groupOrTeacher']['group'])
                    setMenu(groupName)
                    fetchGroups()
                } else if (window['groupOrTeacher']['teacher'] !== "") {
                    setTeacher(window['groupOrTeacher']['teacher'])
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
    }, [null]);

    const teacherName = "Преподаватель"
    const groupName = "Группа"

    return <Group separator='hide' mode='plain' id='settings-menu'
                  style={{height: 'calc(100vh - 2*var(--vkui--size_panel_header_height--regular))',
                      margin: '0', paddingTop: 'var(--vkui--size_panel_header_height--regular)'
    }}>
        <Footnote style={{padding: "0 var(--vkui--size_base_padding_horizontal--regular"}}>Мое расписание</Footnote>
        <div>
            <FormItem
                style={{
                    flex: '1', padding: 'var(--vkui--size_base_padding_vertical--regular) ' +
                        'var(--vkui--size_base_padding_horizontal--regular)',
                }}>
                <CustomSelect
                    placeholder="Выберите тип расписания" value={menu} onChange={onMenuChange}
                    options={[{label: groupName, value: groupName,}, {label: teacherName, value: teacherName}]}
                />
            </FormItem>
            <Epic activeStory={menu} style={{padding: 'var(--vkui--size_base_padding_vertical--regular) 0'}}>
                <Group id={groupName} separator="hide" mode='plain'>
                    <FormItem
                        style={{flex: '1', padding: '0 var(--vkui--size_base_padding_horizontal--regular)'}}>
                        <CustomSelect
                            placeholder="Выберите группу" searchable options={groupOptions} onChange={onGroupChange}
                            value={group} onOpen={groupOptions.length === 0 && fetchGroups} fetching={groupFetching}
                        />
                    </FormItem>
                </Group>
                <Group id={teacherName} separator="hide" mode='plain'>
                    <FormItem style={{flex: '1', padding: '0 var(--vkui--size_base_padding_horizontal--regular)'}}>
                        <CustomSelect
                            placeholder="Выберите преподавателя" searchable options={teacherOptions} onChange={onTeacherChange}
                            value={teacher} onOpen={teacherOptions.length === 0 && fetchTeachers} fetching={teacherFetching}
                        />
                    </FormItem>
                </Group>
            </Epic>
        </div>
        {snackbar}
    </Group>
};