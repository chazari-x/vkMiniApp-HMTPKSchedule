import React, {Component} from 'react';
import {Paragraph, Link, CardGrid, Card} from '@vkontakte/vkui';
import "@vkontakte/icons";
import {Icon24ExternalLinkOutline} from "@vkontakte/icons";
import config from "../etc/config.json";
import bridge from "@vkontakte/vk-bridge";

export const Information = () => {
	return (<Block/>);
}

class Block extends Component {
	constructor(props) {
		super(props)
	}

	componentDidMount() {
		try {
			const margin = parseInt(getComputedStyle(document.getElementById("infoSchedule"))
				.getPropertyValue("margin-top").replaceAll("px", ''), 10)
			const height = document.getElementById("infoSchedule").clientHeight;
			const headerHeight = document.getElementsByClassName("vkuiPanelHeader").item(0).clientHeight;
			if (bridge.supports("VKWebAppResizeWindow")) {
				bridge.send("VKWebAppResizeWindow", {"height": height+headerHeight+margin*2+2}).then().catch(e => {});
			}
		} catch {}
	}

	render() {
		return (
			<CardGrid id="infoSchedule" size="l" style={{margin: 'var(--vkui--size_base_padding_vertical--regular) 0', padding: '0'}}>
				<Card mode="outline-tint" style={{
					margin: '0 var(--vkui--size_base_padding_horizontal--regular) var(--vkui--size_base_padding_vertical--regular)',
					padding: 'var(--vkui--size_base_padding_vertical--regular) var(--vkui--size_base_padding_horizontal--regular)'
				}}>
					<div>
						<Paragraph>
							{config.texts.Paragraph3}
						</Paragraph>
					</div>
				</Card>
				<Card mode="outline-tint" style={{
					margin: '0 var(--vkui--size_base_padding_horizontal--regular) var(--vkui--size_base_padding_vertical--regular)',
					padding: 'var(--vkui--size_base_padding_vertical--regular) var(--vkui--size_base_padding_horizontal--regular)'
				}}>
					<div>
						<Paragraph>
							{config.texts.Paragraph4}
						</Paragraph>
					</div>
				</Card>
				<Card mode="outline-tint" style={{
					margin: '0 var(--vkui--size_base_padding_horizontal--regular) var(--vkui--size_base_padding_vertical--regular)',
					padding: 'var(--vkui--size_base_padding_vertical--regular) var(--vkui--size_base_padding_horizontal--regular)'
				}}>
					<div>
						<Paragraph>
							<Link href={window['app'] === 'ok' ? config.group.hrefs.ok : config.group.hrefs.vk} target="_blank">
								{config.group.name} <Icon24ExternalLinkOutline width={16} height={16}/>
							</Link> {config.texts.Paragraph5}
						</Paragraph>
					</div>
				</Card>
				<Card mode="outline-tint" style={{
					margin: '0 var(--vkui--size_base_padding_horizontal--regular)',
					padding: 'var(--vkui--size_base_padding_vertical--regular)  var(--vkui--size_base_padding_horizontal--regular)'
				}}>
					<div>
						<Link href='https://hmtpk.ru/' target="_blank">
							{config.links.link1} <Icon24ExternalLinkOutline width={16} height={16}/>
						</Link> {config.texts.Paragraph6}
					</div>
				</Card>
			</CardGrid>
		)
	}
}