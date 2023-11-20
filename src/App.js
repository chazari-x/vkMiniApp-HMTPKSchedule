import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
	ScreenSpinner,
	AdaptivityProvider,
	AppRoot,
	ConfigProvider,
	SplitLayout,
	SplitCol,
	usePlatform,
	Platform,
	PanelHeader,
	Group,
	Epic,
	PanelHeaderContent,
	PanelHeaderContext,
	SimpleCell,
	PullToRefresh,
	Button,
	Panel,
	Tabs,
	HorizontalScroll,
	TabsItem,
	InfoRow,
	View,
	Spinner, Link, Paragraph, CardGrid, ContentCard
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import "./panels/panels";
import {
	Icon24Done, Icon24ExternalLinkOutline,
	Icon28Menu,
} from "@vkontakte/icons";
import MySch from "./panels/schedules/my";
import GroupSch from "./panels/schedules/group";
import TeacherSch from "./panels/schedules/teacher";
import Settings from "./panels/settings";
import {Panels} from "./panels/panels";

const App = () => {
	const [fetchedUser, setUser] = useState(null);

	const [contextOpened, setContextOpened] = React.useState(false);
	const [mode, setMode] = React.useState(Panels[4].id);
	const platform = usePlatform();

	const toggleContext = () => {
		setContextOpened((prev) => !prev);
	};
	const select = (e) => {
		const mode = e.currentTarget.dataset.mode;
		setMode(mode);
		requestAnimationFrame(toggleContext);
	};

	const hasHeader = platform !== Platform.VKCOM;

	const [fetching, setFetching] = React.useState(false);

	const onRefresh = React.useCallback(() => {
		setFetching(true);

		setTimeout(() => {
			setFetching(false);
		}, 100);
	}, []);

	return (
		<ConfigProvider>
			<AdaptivityProvider>
				<AppRoot>
					<SplitLayout style={{justifyContent: 'center'}} header={hasHeader && <PanelHeader separator={false}/>}>
						<SplitCol width="100%" maxWidth="560px" stretchedOnMobile autoSpaced>
							<PullToRefresh onRefresh={onRefresh} isFetching={fetching}>
								<PanelHeader before={<Icon28Menu onClick={toggleContext} style={{marginLeft: '10px'}} />}
											 separator={false}
								>
									<PanelHeaderContent>
										{function (mode, panels) {
											for (let i = 3; i < panels.length; i++) {
												if (panels[i].id === mode) {
													return (panels[i].value)
												}
											}

											return ('ХМТПК Расписание')
										}(mode, Panels)}
									</PanelHeaderContent>
								</PanelHeader>
								<PanelHeaderContext opened={contextOpened} onClose={toggleContext}>
									{Panels.slice(3).map((panel) => (
										<SimpleCell
											key={panel.id}
											before={panel.ico}
											after={mode === panel.id ? <Icon24Done fill="var(--vkui--color_icon_accent)" /> : null}
											onClick={select}
											data-mode={panel.id}
											style={{
												margin: '0px 0px 3px',
												borderRadius: '.5rem',
												backgroundColor: 'var(--vkui--color_background_content)'
											}}
										>
											{panel.value}
										</SimpleCell>
									))}
									<InfoRow style={{
										padding: 'var(--vkui--size_base_padding_vertical--regular) var(--vkui--size_base_padding_horizontal--regular)',
										borderRadius: '.5rem',
										backgroundColor: 'var(--vkui--color_background_content)'
									}} header='Информация'>

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
										<div style={{textAlign: "justify"}}>
											<Paragraph>
												Официальный сайт Ханты-Мансийского технолого-педагогического колледжа,
												доступный по адресу <Link href='https://hmtpk.ru/'>
												https://hmtpk.ru/ <Icon24ExternalLinkOutline width={16} height={16} />
												</Link>, является официальным источником информации о расписании,
												новостях, и других официальных данных. Рекомендуется обращаться к этому
												официальному ресурсу для получения достоверной и актуальной информации.
											</Paragraph>
										</div>
									</InfoRow>
								</PanelHeaderContext>
								<Epic activeStory={mode} style={{marginTop: '10px'}}>
									{
										[
											// {panel: Panels[0], element: <Notify/>},
											// {panel: Panels[1], element: <News/>},
											// {panel: Panels[2], element: <College/>},
											{panel: Panels[3], element: <MySch update={!contextOpened} fetching={fetching}/>},
											{panel: Panels[4], element: <GroupSch update={!contextOpened} fetching={fetching}/>},
											{panel: Panels[5], element: <TeacherSch update={!contextOpened} fetching={fetching}/>},
											{panel: Panels[6], element: <Settings/>}
										].map(i => {
											return (
												<Group key={i.panel.id} id={i.panel.id} hidden={!(mode===i.panel.id)}>
													{i.element}
												</Group>
											)
										})
									}
								</Epic>
							</PullToRefresh>
						</SplitCol>
					</SplitLayout>
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider>
	);
}

export default App;
