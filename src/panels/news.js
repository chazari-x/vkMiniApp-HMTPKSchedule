import {Button, Group, Placeholder, Separator} from "@vkontakte/vkui";
import {Icon56MentionOutline, Icon56UsersOutline} from "@vkontakte/icons";
import React from "react";

const News = () => {
    return (
        <Group>
            <Placeholder
                icon={<Icon56UsersOutline/>}
                header="Уведомления от сообществ"
                action={<Button size="m">Подключить сообщества</Button>}
            >
                Подключите сообщества, от которых Вы хотите получать уведомления
            </Placeholder>
            <Separator/>
            <Placeholder icon={<Icon56MentionOutline/>}>
                Введите адрес страницы в поле поиска
            </Placeholder>
        </Group>
    );
};

export default News;