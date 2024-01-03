import {
    Icon28CalendarOutline,
    Icon28Newsfeed,
    Icon28Notification,
    Icon28SchoolOutline,
    Icon28SettingsOutline
} from "@vkontakte/icons";
import React from "react";

const Panels = [
    {id: 'notifications', ico: <Icon28Notification/>, value: 'Объявления'},
    {id: 'news', ico: <Icon28Newsfeed/>, value: 'Новости'},
    {id: 'college', ico: <Icon28SchoolOutline/>, value: 'Колледж'},
    {id: 'mySchedule', ico: <Icon28CalendarOutline/>, value: 'Мое расписание'},
    {id: 'groupSchedule', ico: <Icon28CalendarOutline/>, value: 'Расписание группы'},
    {id: 'teacherSchedule', ico: <Icon28CalendarOutline/>, value: 'Расписание преподавателя'},
    {id: 'settings', ico: <Icon28SettingsOutline/>, value: 'Настройки'},
    {id: 'information', ico: <Icon28SettingsOutline/>, value: 'Информация'}
]

const Dates = [
    {id: 0, value: 'ПН'},
    {id: 1, value: 'ВТ'},
    {id: 2, value: 'СР'},
    {id: 3, value: 'ЧТ'},
    {id: 4, value: 'ПТ'},
    {id: 5, value: 'СБ'},
    {id: 6, value: 'ВС'}
]

export {Panels, Dates}