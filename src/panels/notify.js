import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {
	Panel,
	PanelHeader,
	Group,
	usePlatform,
	Platform,
	SplitLayout,
	SplitCol,
	View,
	PanelHeaderContent,
	PanelHeaderContext,
	SimpleCell, Placeholder, Button, Avatar, Separator
} from '@vkontakte/vkui';
import "@vkontakte/icons";
import {
	Icon24Done, Icon28CalendarOutline,
	Icon28Menu, Icon28Newsfeed, Icon28Notification, Icon28SchoolOutline,
	Icon28SettingsOutline,
	Icon28UsersOutline, Icon56MentionOutline, Icon56MessageReadOutline, Icon56UsersOutline,
} from "@vkontakte/icons";

const Notify = () => {
	return (
		<Group>
			<Placeholder
				icon={<Icon56UsersOutline/>}
				header="Уведомления от сообществ"
				action={<Button size="m"> сообщества</Button>}
			>
				Подключите сообщества, от которых Вы хотите получать уведомления
			</Placeholder>
			<Separator/>
			<Placeholder icon={<Icon56MentionOutline/>}>
				Введите адрес страницы в поле поиска
			</Placeholder>
		</Group>
	);
};

export default Notify;