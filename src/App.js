import React from 'react';
import {
	AdaptivityProvider, AppRoot, ConfigProvider, SplitLayout, SplitCol, usePlatform, Platform, PanelHeader, Group,
	Epic, PanelHeaderContent, PanelHeaderContext, SimpleCell, PullToRefresh,
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import {
	Icon24Done,
	Icon28CalendarOutline,
	Icon28InfoOutline,
	Icon28Menu,
} from "@vkontakte/icons";
import {MySch} from "./panels/schedules/my";
import {GroupSch} from "./panels/schedules/group";
import {TeacherSch} from "./panels/schedules/teacher";
import {Information} from "./panels/information";

const App = () => {
	const [contextOpened, setContextOpened] = React.useState(false);
	const toggleContext = () => {
		setContextOpened((prev) => !prev);
	};

	const [mode, setMode] = React.useState("mySchedule");
	const select = (e) => {
		setMode(e.currentTarget.dataset.mode);
		requestAnimationFrame(toggleContext);
	};

	const platform = usePlatform();
	const hasHeader = platform !== Platform.VKCOM;

	const [fetching, setFetching] = React.useState(false);
	const onRefresh = React.useCallback(() => {
		setFetching(true);
		setTimeout(() => {
			setFetching(false);
		}, 100);
	}, []);

	const Panels = new Map();
	Panels.set("mySchedule", {ico: <Icon28CalendarOutline/>, value: 'Мое расписание', element: <MySch/>});
	Panels.set("groupSchedule", {ico: <Icon28CalendarOutline/>, value: 'Расписание группы', element: <GroupSch/>});
	Panels.set("teacherSchedule", {ico: <Icon28CalendarOutline/>, value: 'Расписание преподавателя', element: <TeacherSch/>});
	Panels.set("information", {ico: <Icon28InfoOutline/>, value: 'Информация', element: <Information/>});
	const PanelsKeys = Array.from(Panels.keys());

	return (
		<ConfigProvider>
			<AdaptivityProvider>
				<AppRoot>
					<SplitLayout style={{justifyContent: 'center'}} header={hasHeader && <PanelHeader separator={false}/>}>
						<SplitCol width="100%" maxWidth="560px" stretchedOnMobile>
							<PullToRefresh onRefresh={onRefresh} isFetching={fetching} style={{height: '100%'}}>
								<PanelHeader before={<Icon28Menu onClick={toggleContext} style={{marginLeft: '10px'}}/>}
											 separator={false} visor={false}
								>
									<PanelHeaderContent>
										{Panels.has(mode) ? Panels.get(mode).value : 'ХМТПК Расписание'}
									</PanelHeaderContent>
								</PanelHeader>
								<PanelHeaderContext opened={contextOpened} onClose={toggleContext}>
									{PanelsKeys.map((key) => (
										<SimpleCell
											key={key} before={Panels.get(key).ico} onClick={select} data-mode={key}
											after={mode === key ? <Icon24Done fill="var(--vkui--color_icon_accent)" /> : null}
											style={{margin: '0px 0px 3px', borderRadius: '.5rem',
												backgroundColor: 'var(--vkui--color_background_content)'}}
										>{Panels.get(key).value}</SimpleCell>
									))}
								</PanelHeaderContext>
								<Epic activeStory={mode} style={{marginTop: '2.5px', height: '100%'}}>
									{PanelsKeys.map(key => {
										return (
											<Group separator='hide' key={key} id={key} hidden={!(mode===key)}>
												{Panels.get(key).element}
											</Group>
										)
									})}
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
