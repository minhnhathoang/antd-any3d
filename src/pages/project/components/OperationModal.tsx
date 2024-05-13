import {
  ModalForm,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, Result } from 'antd';
import type { FC } from 'react';
import type { BasicListItemDataType } from '../data.d';
import useStyles from '../style.style';
type OperationModalProps = {
  done: boolean;
  open: boolean;
  current: Partial<BasicListItemDataType> | undefined;
  onDone: () => void;
  onSubmit: (values: BasicListItemDataType) => void;
  children?: React.ReactNode;
};
const OperationModal: FC<OperationModalProps> = (props) => {
  const { styles } = useStyles();
  const { done, open, current, onDone, onSubmit, children } = props;
  if (!open) {
    return null;
  }
  return (
    <ModalForm<BasicListItemDataType>
      open={open}
      title={done ? null : `Project ${current ? 'Edit' : 'Add'}`}
      className={styles.standardListForm}
      width={640}
      onFinish={async (values) => {
        onSubmit(values);
      }}
      initialValues={current}
      submitter={{
        render: (_, dom) => (done ? null : dom),
      }}
      trigger={<>{children}</>}
      modalProps={{
        onCancel: () => onDone(),
        destroyOnClose: true,
        bodyStyle: done
          ? {
              padding: '72px 0',
            }
          : {},
      }}
    >
      {!done ? (
        <>
          <ProFormText
            name="title"
            label="Project Name"
            rules={[
              {
                required: true,
                message: 'Please enter a project name',
              },
            ]}
            placeholder="e.g. AR project"
          />
          <ProFormDateTimePicker
            name="createdAt"
            label="Start Date"
            fieldProps={{
              style: {
                width: '100%',
              },
            }}
            placeholder="请选择"
          />
          <ProFormSelect
            name="owner"
            label="Project Owner"
            rules={[
              {
                required: true,
                message: '请选择任务负责人',
              },
            ]}
            options={[
              {
                label: '付晓晓',
                value: 'xiao',
              },
              {
                label: '周毛毛',
                value: 'mao',
              },
            ]}
            placeholder="Please select an administrator"
          />
          <ProFormTextArea
            name="subDescription"
            label="Project Description"
            rules={[
              {
                required: true,
                message: 'Please enter a product description of at least five characters!',
                min: 5,
              },
            ]}
            placeholder="Please enter at least five characters"
          />
        </>
      ) : (
        <Result
          status="success"
          title="操作成功"
          subTitle="一系列的信息描述，很短同样也可以带标点。"
          extra={
            <Button type="primary" onClick={onDone}>
              知道了
            </Button>
          }
          className={styles.formResult}
        />
      )}
    </ModalForm>
  );
};
export default OperationModal;
