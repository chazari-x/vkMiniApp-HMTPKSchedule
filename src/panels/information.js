import React from 'react';
import {Group, Paragraph, Link} from '@vkontakte/vkui';
import "@vkontakte/icons";
import {Icon24ExternalLinkOutline} from "@vkontakte/icons";
import config from "../other/config.json";

export const Information = () => {
	return (
		<Group separator='hide' mode='plain'>
			<div style={{
				margin: '0 var(--vkui--size_base_padding_horizontal--regular)',
				borderRadius: 'var(--vkui--size_border_radius_paper--regular)',
				backgroundColor: 'var(--vkui--color_background_content)'
			}}>
				<div style={{marginBottom: '10px', textAlign: "justify"}}>
					<Paragraph>
						Приложение "ХМТПК Расписание" предоставляет максимально точное расписание,
						полученное непосредственно с официального сайта Ханты-Мансийского технолого-педагогического
						колледжа.
						Вы можете также проверить расписание, нажав на кнопку "Проверить".
					</Paragraph>
				</div>
				<div style={{marginBottom: '10px', textAlign: "justify"}}>
					<Paragraph>
						Пользователи приложения могут использовать его как
						удобный инструмент для просмотра расписания и управления своим временем.
						Однако, для получения официальной информации, такой как изменения в
						расписании или другие важные обновления, рекомендуется проверять
						официальный сайт колледжа.
					</Paragraph>
				</div>
				<div style={{marginBottom: '10px', textAlign: "justify"}}>
					<Paragraph>
						<Link href={config.group.href} target="_blank">
							Разработчики: {config.group.name}
							<Icon24ExternalLinkOutline width={16} height={16}/>
						</Link> стремятся обеспечить максимальную точность
						информации, но в случае обнаружения ошибок или неточностей, они готовы к оперативной их коррекции.
						Мы ценим взаимодействие с нашими пользователями и приглашаем вас сообщать о любых замеченных
						ошибках, предлагать улучшения и делиться вашим опытом. С вашей помощью мы сможем сделать наше приложение
						ещё лучше!
					</Paragraph>
				</div>
				<div style={{textAlign: "justify"}}>
					<Paragraph>
						<Link href='https://hmtpk.ru/' target="_blank">
							Официальный сайт Ханты-Мансийского технолого-педагогического колледжа
							<Icon24ExternalLinkOutline width={16} height={16}/>
						</Link> является официальным источником информации о расписании,
						новостях и других официальных данных. Рекомендуется обращаться к этому
						официальному ресурсу для получения достоверной и актуальной информации.
					</Paragraph>
				</div>
			</div>
		</Group>

	);
};