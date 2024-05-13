import {
  ModalForm,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import React, {FC} from 'react';
import useStyles from '../style.style';

type CreateProjectModalProps = {
  done: boolean;
  open: boolean;
  onDone: () => void;
  onSubmit: (cmd: ProjectAddCmd) => void;
  children?: React.ReactNode;
};

const CreateProjectModal: FC<CreateProjectModalProps> = (props) => {
  const {styles} = useStyles();
  const {done, open, onDone, onSubmit, children} = props;
  if (!open) {
    return null;
  }
  return (
    <ModalForm<ProjectCO>
      open={open}
      title={'Add a new Project'}
      className={styles.standardListForm}
      width={640}
      onFinish={async (cmd) => {
        onSubmit(cmd);
        onDone();
        return true;
      }}
      initialValues={undefined}
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
      <ProFormText
        name="name"
        label="Name"
        rules={[
          {
            required: true,
            message: 'Please enter a project name!',
          },
        ]}
        placeholder="e.g. AR project"
      />

      <ProFormTextArea
        name="description"
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
    </ModalForm>
  );
};
export default CreateProjectModal;
