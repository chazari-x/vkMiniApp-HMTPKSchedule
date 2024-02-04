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

// export const Modal = ({activeModal, setActiveModal, vkBridgeAppearance}) => {
//     const onboard = [
//         {
//             src: "",
//             element: <div>
//                 <ContentCard
//                     style={{
//                         borderRadius: '0',
//                         textAlign: 'center',
//                         padding: '0',
//                         background: 'none',
//                         boxShadow: 'none'
//                     }}
//                     header='Добро пожаловать!'
//                     caption={<div style={{marginTop: 'var(--vkui--size_base_padding_vertical--regular)'}}>
//                         <div style={{marginBottom: 'var(--vkui--size_base_padding_vertical--regular)'}}>
//                             Здесь вы найдете актуальную информацию о расписании, которая берется непосредственно с
//                             официального сайта колледжа.
//                         </div>
//
//                         <div style={{marginBottom: 'var(--vkui--size_base_padding_vertical--regular)'}}>
//                             Однако, для получения официальной информации, такой как изменения в
//                             расписании или другие важные обновления, рекомендуется проверять
//                             официальный сайт колледжа.
//                         </div>
//                         <div style={{marginBottom: 'var(--vkui--size_base_padding_vertical--regular)'}}>
//                             Мы ценим взаимодействие с нашими пользователями и приглашаем вас сообщать о любых
//                             замеченных ошибках, предлагать улучшения и делиться вашим опытом. С вашей помощью мы сможем сделать
//                             наше приложение ещё лучше!
//                         </div>
//                     </div>}
//                     maxHeight={300}
//                 />
//             </div>
//         },
//         {
//             src: vkBridgeAppearance === 'light' ? 'https://i.imgur.com/2qk7PIq.jpg' : 'https://i.imgur.com/D9Rv69H.jpg',
//             header: "Раздел \"Мое расписание\"",
//             caption: "Здесь вы можете легко выбрать свою группу или преподавателя, что позволит вам моментально видеть необходимую информацию при каждом входе в приложение."
//         },
//         {
//             src: vkBridgeAppearance === 'light' ? 'https://i.imgur.com/z5UJlX3.jpg' : 'https://i.imgur.com/3pM5uhG.jpg',
//             header: "Раздел \"Расписание группы\"",
//             caption: "Здесь вы можете легко просматривать расписание для различных групп. Этот раздел обеспечивает удобство просмотра без постоянного изменения своих настроек."
//         },
//         {
//             src: vkBridgeAppearance === 'light' ? 'https://i.imgur.com/D71unqd.jpg' : 'https://i.imgur.com/m2HBOF9.jpg',
//             header: "Раздел \"Расписание преподавателя\"",
//             caption: "Здесь вы можете удобно просматривать расписание для различных преподавателей. Этот раздел также обеспечивает удобство просмотра без необходимости постоянного изменения своих настроек."
//         },
//         {
//             src: vkBridgeAppearance === 'light' ? 'https://i.imgur.com/ajzIS5S.jpg' : 'https://i.imgur.com/1yqKLDK.jpg',
//             header: "Проверить расписание на сайте",
//             caption: "Вы также можете проверить расписание, нажав на кнопку \"Проверить расписание на сайте\", которая расположена под расписанием."
//         }
//     ]
//
//     const [slideIndex, setSlideIndex] = useState(0);
//     return <ModalRoot activeModal={activeModal ? 'modalPageOnboarding' : null}>
//         <ModalCard
//             style={{paddingTop: 'var(--vkui--size_panel_header_height--regular)', position: 'relative'}}
//             dismissButtonMode="inside"
//             id="modalPageOnboarding"
//             onClose={() => {
//                 setActiveModal(false)
//                 update(0, undefined)
//             }}
//         >
//             <Group separator='hide' mode='plain' style={{padding: 0, margin: 0, background: 'none'}}>
//                 <Gallery
//                     align="center"
//                     slideIndex={slideIndex}
//                     onChange={setSlideIndex}
//                 >
//                     {onboard.map(o => {
//                         if (o.src === "") {
//                             return o.element
//                         }
//
//                         return <ContentCard
//                             src={o.src}
//                             alt={o.header}
//                             style={{
//                                 textAlign: 'center',
//                                 borderRadius: '0',
//                                 background: 'none',
//                                 boxShadow: 'none'}}
//                             header={o.header}
//                             caption={o.caption}
//                             maxHeight={300}
//                         />
//                     })}
//                 </Gallery>
//                 <FormItem style={{
//                     display: 'flex',
//                     justifyContent: 'center',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     padding: 'var(--vkui--size_base_padding_vertical--regular) 0 0'
//                 }}>
//                     <ButtonGroup mode="horizontal" gap="m" stretched>
//                         <Button
//                             size="l" mode="primary" stretched appearance="accent-invariable"
//                             disabled={slideIndex===0}
//                             onClick={() => {
//                                 if (slideIndex > 0) {
//                                     setSlideIndex(slideIndex-1)
//                                 }
//                             }}
//                         >
//                             Назад
//                         </Button>
//                         <Button
//                             size="l" mode="primary" stretched appearance="accent-invariable"
//                             onClick={() => {
//                                 if (slideIndex < onboard.length-1) {
//                                     setSlideIndex(slideIndex+1)
//                                 } else {
//                                     setActiveModal(false)
//                                     update(0, undefined)
//                                 }
//                             }}
//                         >
//                             {slideIndex === onboard.length-1 ? "Хорошо" : "Далее"}
//                         </Button>
//                     </ButtonGroup>
//                     <Button
//                         size="l" mode='link' onClick={() => {
//                         setActiveModal(false)
//                         update(0, undefined)
//                     }}
//                         style={{padding: 'var(--vkui--size_base_padding_vertical--regular) 0 0'}}
//                     >
//                         Пропустить
//                     </Button>
//                 </FormItem>
//             </Group>
//         </ModalCard>
//     </ModalRoot>
// }