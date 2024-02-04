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
	Spinner,
	Platform,
	Panel,
	Button,
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
import {MySch} from "./pages/my/my";
import {GroupSch} from "./pages/group";
import {TeacherSch} from "./pages/teacher";
import {Information} from "./pages/information";
import vkBridge, {parseURLSearchParamsForGetLaunchParams} from "@vkontakte/vk-bridge";
import {transformVKBridgeAdaptivity} from "./transformers/transformVKBridgeAdaptivity";
import {useAppearance, useInsets, useAdaptivity} from "@vkontakte/vk-bridge-react";
import config from "./etc/config.json"
import {fetchGroupOrTeacher} from "./api/api";
import {onboarding} from "./onboarding/onboarding";
import {update} from "./utils/utils";

const App = () => {
	window['vkBridgeAppearance'] = useAppearance() || undefined; // Вместо undefined можно задать значение по умолчанию
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
			if (window["tooltips"][0]) {
				onboarding()
				update(0, undefined)
			}

			setMain("main")
		}).catch(error => {
			// todo error page
			console.error(error)
		}) : setMain("main")
	}, [])

	const Panels = new Map();
	Panels.set("mySchedule", {ico: <Icon28UserCardOutline/>, value: config.pages.my, element: <MySch/>});
	Panels.set("groupSchedule", {ico: <Icon28Users3Outline/>, value: config.pages.group, element: <GroupSch/>});
	Panels.set("teacherSchedule", {ico: <Icon28UserOutline/>, value: config.pages.teacher, element: <TeacherSch/>});
	Panels.set("information", {ico: <Icon28InfoOutline/>, value: config.pages.info, element: <Information/>});
	const PanelsKeys = Array.from(Panels.keys());

	const platform = usePlatform();
	const hasHeader = platform !== Platform.VKCOM;
	return (
		<ConfigProvider
			appearance={window['vkBridgeAppearance']} platform={vk_platform === 'desktop_web' ? 'vkcom' : undefined}
			isWebView={vkBridge.isWebView()} hasCustomPanelHeaderAfter={true}
		>
			<AdaptivityProvider {...vkBridgeAdaptivityProps}>
				<AppRoot safeAreaInsets={vkBridgeInsets}>
					<SplitLayout style={{justifyContent: 'center'}} header={hasHeader && <PanelHeader separator={false} />}>
						<SplitCol width="100%" maxWidth="560px" stretchedOnMobile>
							<Epic activeStory={main}>
								<Panel id='load'>
									<Group
										separator="hide" mode='plain'
										style={{
											padding: 'var(--vkui--size_base_padding_vertical--regular) 0',
											backgroundColor: 'var(--vkui--color_background_content)',
											display: 'flex',
											alignItems: 'center',
											height: '100vh'
										}}
									>
										<Spinner size="large" style={{margin: '10px 0'}}/>
									</Group>
								</Panel>
								<Panel id='main'>
									<PanelHeader
										before={<Button
											appearance='accent-invariable' mode='secondary' size='s'
											onClick={toggleContext} before={<Icon28Menu/>}
											style={{marginLeft: '10px', padding: 0}} />}
										separator='none'
									>
										{Panels.has(mode) ? Panels.get(mode).value : 'ХМТПК Расписание'}
									</PanelHeader>
									<PanelHeaderContext opened={contextOpened} onClose={toggleContext}>
										{PanelsKeys.map((key) => (
											<SimpleCell
												key={key} before={Panels.get(key).ico} onClick={select} data-mode={key}
												after={mode === key ?
													<Icon24Done fill="var(--vkui--color_icon_accent)"/> : null}
												style={{
													borderRadius: '.5rem',
												}}
											>
												{Panels.get(key).value}
											</SimpleCell>
										))}
									</PanelHeaderContext>
									<Epic id='updateGroupOrTeacher' activeStory={mode}
										  style={{
											  height: 'calc(100vh - var(--vkui--size_panel_header_height--regular))',
											  padding: '0', overflowY: 'scroll'
									}}>
										{PanelsKeys.map((key) => (
											<Panel key={key} id={key} hidden={!(mode === key)}>
												<Group
													separator="hide" mode='plain'
													style={{
														minHeight: 'calc(100vh - var(--vkui--size_panel_header_height--regular) - var(--vkui--size_base_padding_vertical--regular)*2)',
														padding: 'var(--vkui--size_base_padding_vertical--regular) 0',
														backgroundColor: 'var(--vkui--color_background_content)'}}
												>
													{Panels.get(key).element}
												</Group>
											</Panel>
										))}
									</Epic>
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
