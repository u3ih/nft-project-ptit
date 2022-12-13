import {Button, DatePicker, Form, Input, notification} from "antd";
import dayjs from "dayjs";
import {useGetUserAddress, useGetUserContract, useGetUserData, useSetUserData} from "../../src/hook";
import React from "react";
import {doRequest} from "../../src/common/do-request";

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 },
};

const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};

const UserInfoClient = () => {
  const [form] = Form.useForm();
  const setUserInfo = useSetUserData();
  const userInfo = useGetUserData();
  console.log("userInfo: ", userInfo);
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

  return (
    <div className={"max-w-[1240px] pt-[50px] m-auto"}>
      <h1 className={"mb-[50px] text-[28px]"}>Your wallet address: {userInfo?.userAddress}</h1>
      <Form form={form} name="dynamic_rule" initialValues={{...userInfo, dateOfBirth: userInfo?.dateOfBirth && dayjs(userInfo?.dateOfBirth)}}>
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
    </div>
  )
}

export default UserInfoClient;
