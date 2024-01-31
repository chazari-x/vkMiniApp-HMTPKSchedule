import React, {useEffect, useState} from 'react';
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
	FormItem,
	Gallery,
	Header,
	ButtonGroup,
	ModalRoot,
	ContentCard, ModalCard, Paragraph,
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
import {fetchGroupOrTeacher, update} from "./other/other";
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

	const [activeModal, setActiveModal] = React.useState(false);
	const [main, setMain] = React.useState("load");
	useEffect(() => {
		(window["groupOrTeacher"] === undefined) ? fetchGroupOrTeacher().then(() => {
			setActiveModal(window["tooltips"][0])
			setMain("main")
		}).catch() : setMain("main")
	}, [])

	const Panels = new Map();
	Panels.set("mySchedule", {ico: <Icon28UserCardOutline/>, value: 'Мое расписание', element: <MySch/>});
	Panels.set("groupSchedule", {ico: <Icon28Users3Outline/>, value: 'Расписание группы', element: <GroupSch/>});
	Panels.set("teacherSchedule", {ico: <Icon28UserOutline/>, value: 'Расписание преподавателя', element: <TeacherSch/>});
	Panels.set("information", {ico: <Icon28InfoOutline/>, value: 'Информация', element: <Information/>});
	const PanelsKeys = Array.from(Panels.keys());

	const platform = usePlatform();
	const hasHeader = platform !== Platform.VKCOM;

	const Onboard = [
		{
			src: "",
			element: <div>
				<div style={{marginBottom: '10px', textAlign: "justify"}}>
					<Header>
						Добро пожаловать!
					</Header>
				</div>
				<div style={{marginBottom: '10px', textAlign: "justify"}}>
					<Paragraph>
						Здесь вы найдете актуальную информацию о расписании, которая берется непосредственно с
						официального сайта колледжа.
						Однако, для получения официальной информации, такой как изменения в
						расписании или другие важные обновления, рекомендуется проверять
						официальный сайт колледжа.
					</Paragraph>
				</div>
				<div style={{marginBottom: '10px', textAlign: "justify"}}>
					<div>
						Мы стремимся обеспечить максимальную точность информации,
						но в случае обнаружения ошибок или неточностей, мы готовы к оперативной их коррекции.
						Мы ценим взаимодействие с нашими пользователями и приглашаем вас сообщать о любых замеченных
						ошибках, предлагать улучшения и делиться вашим опытом. С вашей помощью мы сможем сделать
						наше приложение ещё лучше!
					</div>
				</div>
			</div>
		},
		{
			src: vkBridgeAppearance === 'light' ? 'https://i.imgur.com/2qk7PIq.jpg' : 'https://i.imgur.com/D9Rv69H.jpg',
			header: "Раздел \"Мое расписание\"",
			caption: "Здесь вы можете легко выбрать свою группу или преподавателя, что позволит вам моментально видеть необходимую информацию при каждом входе в приложение."
		},
		{
			src: vkBridgeAppearance === 'light' ? 'https://i.imgur.com/z5UJlX3.jpg' : 'https://i.imgur.com/3pM5uhG.jpg',
			header: "Раздел \"Расписание группы\"",
			caption: "Здесь вы можете легко просматривать расписание для различных групп. Этот раздел обеспечивает удобство просмотра без постоянного изменения своих настроек."
		},
		{
			src: vkBridgeAppearance === 'light' ? 'https://i.imgur.com/D71unqd.jpg' : 'https://i.imgur.com/m2HBOF9.jpg',
			header: "Раздел \"Расписание преподавателя\"",
			caption: "Здесь вы можете удобно просматривать расписание для различных преподавателей. Этот раздел также обеспечивает удобство просмотра без необходимости постоянного изменения своих настроек."
		},
		{
			src: vkBridgeAppearance === 'light' ? 'https://i.imgur.com/ajzIS5S.jpg' : 'https://i.imgur.com/1yqKLDK.jpg',
			header: "Проверить расписание на сайте",
			caption: "Вы также можете проверить расписание, нажав на кнопку \"Проверить расписание на сайте\", которая расположена под расписанием."
		}
	]

	const [slideIndex, setSlideIndex] = useState(0);
	return (
		<ConfigProvider
			appearance={vkBridgeAppearance} platform={vk_platform === 'desktop_web' ? 'vkcom' : undefined}
			isWebView={vkBridge.isWebView()} hasCustomPanelHeaderAfter={true}
		>
			<AdaptivityProvider {...vkBridgeAdaptivityProps}>
				<AppRoot safeAreaInsets={vkBridgeInsets}>
					<SplitLayout style={{justifyContent: 'center'}} header={hasHeader && <PanelHeader separator={false} />}
								 modal={<ModalRoot activeModal={activeModal ? 'modalPageOnboarding' : null}>
									 <ModalCard
										 id="modalPageOnboarding"
										 onClose={() => {
											 setActiveModal(false)
											 update(0, undefined)
										 }}
									 >
										 <Group separator='hide' mode='plain' style={{padding: 0, margin: 0, background: 'none'}}>
											 <Gallery
												 align="center"
												 slideIndex={slideIndex}
												 onChange={setSlideIndex}
											 >
												 {Onboard.map(o => {
													 if (o.src === "") {
														 return o.element
													 }

													 return <ContentCard
														 src={o.src}
														 alt={o.header}
														 style={{
															 textAlign: 'center',
															 borderRadius: '0',
															 background: 'none'}}
														 header={o.header}
														 caption={o.caption}
														 maxHeight={300}
													 />
												 })}
											 </Gallery>
											 <FormItem style={{
												 display: 'flex',
												 justifyContent: 'center',
												 flexDirection: 'column',
												 alignItems: 'center',
												 padding: 'var(--vkui--size_base_padding_vertical--regular) 0 0'
											 }}>
												 <ButtonGroup mode="horizontal" gap="m" stretched>
													 <Button
														 size="l" mode="primary" stretched appearance="accent-invariable"
														 disabled={slideIndex===0}
														 onClick={() => {
															 if (slideIndex > 0) {
																 setSlideIndex(slideIndex-1)
															 }
														 }}
													 >
														 Назад
													 </Button>
													 <Button
														 size="l" mode="primary" stretched appearance="accent-invariable"
														 onClick={() => {
															 if (slideIndex < Onboard.length-1) {
																 setSlideIndex(slideIndex+1)
															 } else {
																 setActiveModal(false)
																 update(0, undefined)
															 }
														 }}
													 >
														 {slideIndex === Onboard.length-1 ? "Хорошо" : "Далее"}
													 </Button>
												 </ButtonGroup>
												 <Button
													 size="l" mode='link' onClick={() => {
														 setActiveModal(false)
													 	update(0, undefined)
													 }}
													 style={{padding: 'var(--vkui--size_base_padding_vertical--regular) 0 0'}}
												 >
													 Пропустить
												 </Button>
											 </FormItem>
										 </Group>
									 </ModalCard>
								 </ModalRoot>}
					>
						<SplitCol width="100%" maxWidth="560px" stretchedOnMobile>
							<Epic activeStory={main}>
								<Panel id='load'>
									<Group
										separator="hide" mode='plain'
										style={{
											padding: 'var(--vkui--size_base_padding_vertical--regular) 0',
											backgroundColor: 'var(--vkui--color_background_content)',
											display: 'flex',
											alignItems: 'center'}}
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
													margin: '0px 0px 3px',
													borderRadius: '.5rem',
													backgroundColor: 'var(--vkui--color_background_content)'
												}}
											>
												{Panels.get(key).value}
											</SimpleCell>
										))}
									</PanelHeaderContext>
									<Epic id='updateGroupOrTeacher' activeStory={mode}
										  style={{
											  minHeight: 'calc(100vh - var(--vkui--size_panel_header_height--regular))',
											  padding: '0'}}
									>
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
