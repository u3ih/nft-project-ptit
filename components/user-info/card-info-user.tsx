import React from "react";
import {Card, Form} from "antd";
import dayjs from "dayjs";
const { Meta } = Card;

const CardInfoUser = (props: {form: any}) => {
    const { form } = props;
    const username = Form.useWatch("username", form);
    const imgUrl = Form.useWatch("imgUrl", form);
    const dateOfBirth = Form.useWatch("dateOfBirth", form);
    const address = Form.useWatch("address", form);
    return (
        <Card
            hoverable
            style={{ width: 240 }}
            cover={<img alt="example" src={imgUrl} />}
        >
            <Meta {...{
                title: username,
                description: dayjs(dateOfBirth).format("DD/MM/YYYY")
            }} />
            <p>{address}</p>
        </Card>
    )
}

export default CardInfoUser;
