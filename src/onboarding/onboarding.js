import bridge from "@vkontakte/vk-bridge";
import base64 from "../etc/base64.json";
import config from "../etc/config.json"

export function onboarding() {
    bridge.send('VKWebAppShowSlidesSheet', {
        slides: [
            {
                media: {
                    blob: base64.first,
                    type: 'image'
                },
                title: config.onboardings.one.title,
                subtitle: config.onboardings.one.subtitle
            },
            {
                media: {
                    blob: window['vkBridgeAppearance'] === 'light' ? base64.white.my : base64.dark.my,
                    type: 'image'
                },
                title: config.onboardings.two.title,
                subtitle: config.onboardings.two.subtitle
            },
            {
                media: {
                    blob: window['vkBridgeAppearance'] === 'light' ? base64.white.group : base64.dark.group,
                    type: 'image'
                },
                title: config.onboardings.three.title,
                subtitle: config.onboardings.three.subtitle
            },
            {
                media: {
                    blob: window['vkBridgeAppearance'] === 'light' ? base64.white.teacher : base64.dark.teacher,
                    type: 'image'
                },
                title: config.onboardings.four.title,
                subtitle: config.onboardings.four.subtitle
            },
            {
                media: {
                    blob: window['vkBridgeAppearance'] === 'light' ? base64.white.button : base64.dark.button,
                    type: 'image'
                },
                title: config.onboardings.five.title,
                subtitle: config.onboardings.five.subtitle
            }
        ]}).then().catch();
}