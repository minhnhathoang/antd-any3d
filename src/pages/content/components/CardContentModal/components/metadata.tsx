import React from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space, Typography } from 'antd';

const onFinish = (values: any) => {
  console.log('Received values of form:', values);
};

const MetadataView: React.FC<{
  content: Content;
}> = ({ content }) => {
  return (
    <Form
      name="dynamic_form_nest_item"
      onFinish={onFinish}
      style={{maxWidth: 600, maxHeight: 500, padding: 16}}
    >
      <Form.Item noStyle shouldUpdate>
        {() => (
          <Typography>
            <pre>{JSON.stringify(content.metadata !== null ? JSON.parse(content.metadata) : {}, null, 2)}</pre>
          </Typography>
        )}
      </Form.Item>
    </Form>
  );
};

export default MetadataView;
