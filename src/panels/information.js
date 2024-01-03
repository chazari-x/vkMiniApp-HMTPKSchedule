import React from 'react';

import {Group, Paragraph, Link} from '@vkontakte/vkui';
import "@vkontakte/icons";
import {Icon24ExternalLinkOutline} from "@vkontakte/icons";
import {groupHref, groupName} from "../other/config";

export const Information = () => {
	return (
		<Group separator='hide' mode='plain'>
			<div style={{
				padding: 'var(--vkui--size_panel_header_height--regular) var(--vkui--size_base_padding_horizontal--regular) var(--vkui--size_base_padding_vertical--regular)',
				borderRadius: 'var(--vkui--size_border_radius_paper--regular)', backgroundColor: 'var(--vkui--color_background_content)'
			}}>
				<div style={{marginBottom: '10px', textAlign: "justify"}}>
					<Paragraph>
						Приложение "ХМТПК Расписание" не является официальным приложением
						Ханты-Мансийского технолого-педагогического колледжа.
					</Paragraph>
				</div>
				<div style={{marginBottom: '10px', textAlign: "justify"}}>
					<Paragraph>
						Пользователи приложения "ХМТПК Расписание" могут использовать его как
						удобный инструмент для просмотра расписания и управления своим временем.
						Однако, для получения официальной информации, такой как изменения в
						расписании или другие важные обновления, рекомендуется проверять
						официальный сайт колледжа.
					</Paragraph>
				</div>
				<div style={{marginBottom: '10px', textAlign: "justify"}}>
					<Paragraph>
						Помните, что разработчики приложения "ХМТПК Расписание" не несут
						ответственности за точность и актуальность информации, предоставляемой
						в приложении.
					</Paragraph>
				</div>
				<div style={{marginBottom: '10px', textAlign: "justify"}}>
					<Paragraph>
						<Link href={groupHref}>
							Разработчик: {groupName}
							<Icon24ExternalLinkOutline width={16} height={16} />
						</Link> принимает жалобы и предложения.
					</Paragraph>
				</div>
				<div style={{textAlign: "justify"}}>
					<Paragraph>
						<Link href='https://hmtpk.ru/'>
							Официальный сайт Ханты-Мансийского технолого-педагогического колледжа
							<Icon24ExternalLinkOutline width={16} height={16} />
						</Link> является официальным источником информации о расписании,
						новостях, и других официальных данных. Рекомендуется обращаться к этому
						официальному ресурсу для получения достоверной и актуальной информации.
					</Paragraph>
				</div>
			</div>
		</Group>
	);
};