import {Button, Col, DatePicker, Form, Input, message, notification, Row, Upload} from "antd";
import dayjs from "dayjs";
import {useGetUserData, useSetUserData} from "../../src/hook";
import React from "react";
import {doRequest} from "../../src/common/do-request";
import CardInfoUser from "./card-info-user";
import {PlusOutlined, UploadOutlined} from "@ant-design/icons";

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
};

const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};

const beforeUpload = (file: any) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 8;
  if (!isLt2M) {
    message.error('Image must smaller than 8MB!');
  }
  return isJpgOrPng && isLt2M;
};

const UserInfoClient = () => {
  const [form] = Form.useForm();
  const setUserInfo = useSetUserData();
  const userInfo = useGetUserData();
  const handleSubmitUserInfo = async () => {
    const newUser = {
      ...form.getFieldsValue(),
    }
    const networkdata = {
      url: "users/update-info",
      body: {
        ...newUser
      }
    }
    try {
      const response = await doRequest(networkdata, "put");
      if(response?.error) {
        notification.error({message: response?.error?.name})
        return;
      } else {
        notification.success({message: "Success"})
      }
      setUserInfo({...userInfo, ...newUser});
    } catch (e) {
      console.log("error: ", e)
    }
  }
  const user = form.getFieldsValue();
  const uploadButton = (
        <div style={{ marginTop: 8 }}><PlusOutlined /> Upload</div>
  );
  return (
    <div className={"max-w-[1240px] pt-[50px] m-auto px-[20px]"}>
      <Row>
        <Col {...{xs: 24, sm: 24, md: 16}}>
          <h1 className={"mb-[50px] text-[28px]"}>Your wallet address: {userInfo?.userAddress}</h1>
          <Form form={form} name="dynamic_rule" initialValues={{...userInfo, dateOfBirth: userInfo?.dateOfBirth && dayjs(userInfo?.dateOfBirth)}}>
            <Form.Item
                {...formItemLayout}
                name="imgUrl"
                label={"Avatar"}
            >
              <Upload
                  {...{
                    name: "request",
                    listType: "picture-card",
                    maxCount: 1,
                    action: `${process.env.NEXT_PUBLIC_API}/files`,
                    defaultFileList: [{
                      uid: '-1',
                      name: 'my-avatar.png',
                      status: 'done',
                      url: userInfo?.imgUrl,
                      thumbUrl: userInfo?.imgUrl,
                    }],
                    onChange(info: any) {
                      if (info.file.status === 'done') {
                        const fileUrl = `${info?.file?.response?.[0]?.url}/upload/${info?.file?.response?.[0]?.name}`;
                        form.setFieldValue("imgUrl", fileUrl);
                        message.success(`${info.file.name} file uploaded successfully`);
                      }
                    },
                    beforeUpload,
                  }}
              >
                {user?.imageUrl ? <img src={user?.imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
              </Upload>
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              name="username"
              label="Name"
              rules={[
                {
                  required: true,
                  message: 'Please input your name',
                },
              ]}
            >
              <Input placeholder="Please input your name" />
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              name="address"
              label="Address"
              rules={[
                {
                  message: 'Please input your address',
                },
              ]}
            >
              <Input placeholder="Please input your address" />
            </Form.Item>
            <Form.Item
              {...formItemLayout}
              name="dateOfBirth"
              label="Date of birth"
            >
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item {...formTailLayout}>
              <Button onClick={handleSubmitUserInfo}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col {...{xs: 24, sm: 24, md: 8}}>
          <h2>Preview</h2>
          <CardInfoUser {...{
            form
          }}/>
        </Col>
      </Row>
    </div>
  )
}

export default UserInfoClient;
