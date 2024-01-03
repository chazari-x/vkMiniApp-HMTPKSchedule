import React from 'react';
import {
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
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import "./panels/panels";
import {
	Icon24Done,
	Icon28Menu,
} from "@vkontakte/icons";
import {MySch} from "./panels/schedules/my";
import {GroupSch} from "./panels/schedules/group";
import {TeacherSch} from "./panels/schedules/teacher";
import {Settings} from "./panels/settings";
import {Panels} from "./panels/panels";
import {Information} from "./panels/information";

const App = () => {
	const [contextOpened, setContextOpened] = React.useState(false);
	const toggleContext = () => {
		setContextOpened((prev) => !prev);
	};

	const [mode, setMode] = React.useState(() => Panels[3].id);
	const select = (e) => {
		const mode = e.currentTarget.dataset.mode;
		setMode(mode);
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

	return (
		<ConfigProvider>
			<AdaptivityProvider>
				<AppRoot>
					<SplitLayout style={{justifyContent: 'center'}} header={hasHeader && <PanelHeader separator={false}/>}>
						<SplitCol width="100%" maxWidth="560px" stretchedOnMobile>
							<PullToRefresh onRefresh={onRefresh} isFetching={fetching} style={{height: '100%'}}>
								<PanelHeader before={<Icon28Menu onClick={toggleContext} style={{marginLeft: '10px'}} />}
											 separator={false} visor={false}>
									<PanelHeaderContent>
										{function (mode, panels) {
											for (let i = 3; i < panels.length; i++) {
												if (panels[i].id === mode) {return (panels[i].value)}
											}
											return ('ХМТПК Расписание')
										}(mode, Panels)}
									</PanelHeaderContent>
								</PanelHeader>
								<PanelHeaderContext opened={contextOpened} onClose={toggleContext}>
									{Panels.slice(3).map((panel) => (
										<SimpleCell
											key={panel.id} before={panel.ico} onClick={select} data-mode={panel.id}
											after={mode === panel.id ? <Icon24Done fill="var(--vkui--color_icon_accent)" /> : null}
											style={{
												margin: '0px 0px 3px', borderRadius: '.5rem',
												backgroundColor: 'var(--vkui--color_background_content)'
											}}
										>{panel.value}</SimpleCell>
									))}
								</PanelHeaderContext>
								<Epic activeStory={mode} style={{marginTop: '2.5px', height: '100%'}}>
									{[	// {panel: Panels[0], element: <Notify/>},
										// {panel: Panels[1], element: <News/>},
										// {panel: Panels[2], element: <College/>},
										{panel: Panels[3], element: <MySch/>},
										{panel: Panels[4], element: <GroupSch/>},
										{panel: Panels[5], element: <TeacherSch/>},
										{panel: Panels[6], element: <Settings/>},
										{panel: Panels[7], element: <Information/>}
									].map(i => {
										return (<Group separator='hide' key={i.panel.id} id={i.panel.id}
												hidden={!(mode===i.panel.id)}>{i.element}</Group>)
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
