import React, {useEffect} from 'react';
import {
	AdaptivityProvider,
	AppRoot,
	ConfigProvider,
	SplitLayout,
	SplitCol,
	usePlatform,
	PanelHeader,
	Group,
	Epic,
	PanelHeaderContext,
	SimpleCell,
	PullToRefresh,
	Spinner,
	Platform,
	Panel
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import {
	Icon24Done,
	Icon28InfoOutline,
	Icon28Menu,
	Icon28UserCardOutline,
	Icon28UserOutline,
	Icon28Users3Outline,
} from "@vkontakte/icons";
import {MySch} from "./panels/schedules/my";
import {GroupSch} from "./panels/schedules/group";
import {TeacherSch} from "./panels/schedules/teacher";
import {Information} from "./panels/information";
import {fetchGroupOrTeacher} from "./other/other";
import vkBridge, {parseURLSearchParamsForGetLaunchParams} from "@vkontakte/vk-bridge";
import {transformVKBridgeAdaptivity} from "./transformers/transformVKBridgeAdaptivity";
import {useAppearance, useInsets, useAdaptivity} from "@vkontakte/vk-bridge-react";

const App = () => {
	const vkBridgeAppearance = useAppearance() || undefined; // Вместо undefined можно задать значение по умолчанию
	const vkBridgeInsets = useInsets() || undefined; // Вместо undefined можно задать значение по умолчанию
	const vkBridgeAdaptivityProps = transformVKBridgeAdaptivity(useAdaptivity()); // Конвертируем значения из VK Bridge в параметры AdaptivityProvider
	const { vk_platform } = parseURLSearchParamsForGetLaunchParams(window.location.search); // [опционально] Платформа может передаваться через URL (см. https://dev.vk.com/mini-apps/development/launch-params#vk_platform)

	const [contextOpened, setContextOpened] = React.useState(false);
	const toggleContext = () => {
		setContextOpened((prev) => !prev);
	};

	const [mode, setMode] = React.useState("mySchedule");
	const select = (e) => {
		setMode(e.currentTarget.dataset.mode);
		requestAnimationFrame(toggleContext);
	};

	const [main, setMain] = React.useState("load");
	useEffect(() => {
		(window["groupOrTeacher"] === undefined) ? fetchGroupOrTeacher().then(() => {
			setMain("main")
		}).catch() : setMain("main")
	}, [])

	const [fetching, setFetching] = React.useState(false);
	const onRefresh = React.useCallback(() => {
		setFetching(true);
		setTimeout(() => {
			setFetching(false);
		}, 100);
	}, []);

	const Panels = new Map();
	Panels.set("mySchedule", {ico: <Icon28UserCardOutline/>, value: 'Мое расписание', element: <MySch/>});
	Panels.set("groupSchedule", {ico: <Icon28Users3Outline/>, value: 'Расписание группы', element: <GroupSch/>});
	Panels.set("teacherSchedule", {ico: <Icon28UserOutline/>, value: 'Расписание преподавателя', element: <TeacherSch/>});
	Panels.set("information", {ico: <Icon28InfoOutline/>, value: 'Информация', element: <Information/>});
	const PanelsKeys = Array.from(Panels.keys());

	const platform = usePlatform();
	const hasHeader = platform !== Platform.VKCOM;

	return (
		<ConfigProvider
			appearance={vkBridgeAppearance}
			platform={vk_platform === 'desktop_web' ? 'vkcom' : undefined}
			isWebView={vkBridge.isWebView()}
			hasCustomPanelHeaderAfter={true}
		>
			<AdaptivityProvider {...vkBridgeAdaptivityProps}>
				<AppRoot safeAreaInsets={vkBridgeInsets}>
					<SplitLayout style={{justifyContent: 'center'}} header={hasHeader && <PanelHeader separator={false} />}>
						<SplitCol width="100%" maxWidth="560px" stretchedOnMobile>
							<Epic activeStory={main}>
								<Panel id='load'>
									<Group separator="hide" mode='plain' style={{
										minHeight: 'calc(100vh - var(--vkui--size_base_padding_vertical--regular)*2)',
										padding: 'var(--vkui--size_base_padding_vertical--regular) 0',
										backgroundColor: 'var(--vkui--color_background_content)',
										display: 'flex', alignItems: 'center'
									}}>
										<Spinner size="large" style={{margin: '10px 0'}}/>
									</Group>
								</Panel>
								<Panel id='main'>
									<PullToRefresh onRefresh={onRefresh} isFetching={fetching} style={{height: '100%'}}>
										<PanelHeader before={<Icon28Menu onClick={toggleContext} style={{marginLeft: '10px'}}/>}
													 separator='none'>
											{Panels.has(mode) ? Panels.get(mode).value : 'ХМТПК Расписание'}
										</PanelHeader>
										<PanelHeaderContext opened={contextOpened} onClose={toggleContext}>
											{PanelsKeys.map((key) => (
												<SimpleCell
													key={key} before={Panels.get(key).ico} onClick={select} data-mode={key}
													after={mode === key ?
														<Icon24Done fill="var(--vkui--color_icon_accent)"/> : null}
													style={{
														margin: '0px 0px 3px', borderRadius: '.5rem',
														backgroundColor: 'var(--vkui--color_background_content)'
													}}>{Panels.get(key).value}</SimpleCell>
											))}
										</PanelHeaderContext>
										<Epic id='updateGroupOrTeacher' activeStory={mode}
											  style={{minHeight: 'calc(100vh - var(--vkui--size_panel_header_height--regular))', padding: '0'}}
										>
											{PanelsKeys.map((key) => (
												<Panel key={key} id={key} hidden={!(mode === key)}>
													<Group separator="hide" mode='plain' style={{
														minHeight: 'calc(100vh - var(--vkui--size_panel_header_height--regular) - var(--vkui--size_base_padding_vertical--regular)*2)',
														padding: 'var(--vkui--size_base_padding_vertical--regular) 0',
														backgroundColor: 'var(--vkui--color_background_content)'
													}}>
														{Panels.get(key).element}
													</Group>
												</Panel>
											))}
										</Epic>
									</PullToRefresh>
								</Panel>
							</Epic>
						</SplitCol>
					</SplitLayout>
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider>
	);
}

export default App;
