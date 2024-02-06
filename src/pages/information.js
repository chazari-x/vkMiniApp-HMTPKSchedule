import React from 'react';
import {Paragraph, Link, CardGrid, Card} from '@vkontakte/vkui';
import "@vkontakte/icons";
import {Icon24ExternalLinkOutline} from "@vkontakte/icons";
import config from "../etc/config.json";

export const Information = () => {
	return (
		<CardGrid size="l" style={{margin: '0', padding: '0'}}>
			<Card mode="outline-tint" style={{
				margin: '0 var(--vkui--size_base_padding_horizontal--regular)',
				padding: 'var(--vkui--size_base_padding_vertical--regular) var(--vkui--size_base_padding_horizontal--regular) '
			}}>
				<div style={{marginBottom: 'var(--vkui--size_base_padding_vertical--regular)'}}>
					<Paragraph>
						{config.texts.Paragraph3}
					</Paragraph>
				</div>
				<div style={{marginBottom: 'var(--vkui--size_base_padding_vertical--regular)'}}>
					<Paragraph>
						{config.texts.Paragraph4}
					</Paragraph>
				</div>
				<div style={{marginBottom: 'var(--vkui--size_base_padding_vertical--regular)'}}>
					<Paragraph>
						<Link href={config.group.href} target="_blank">
							{config.group.name} <Icon24ExternalLinkOutline width={16} height={16}/>
						</Link> {config.texts.Paragraph5}
					</Paragraph>
				</div>
				<div>
					<Paragraph>
						<Link href='https://hmtpk.ru/' target="_blank">
							{config.links.link1} <Icon24ExternalLinkOutline width={16} height={16}/>
						</Link> {config.texts.Paragraph6}
					</Paragraph>
				</div>
			</Card>
		</CardGrid>
	);
};