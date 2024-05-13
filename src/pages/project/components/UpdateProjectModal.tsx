import {
  ModalForm,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import React, {FC} from 'react';
import useStyles from '../style.style';

type UpdateProjectModalProps = {
  id: string,
  done: boolean;
  open: boolean;
  current: Partial<ProjectCO> | undefined;
  onDone: () => void;
  onSubmit: (id: string, cmd: ProjectUpdateCmd) => void;
  children?: React.ReactNode;
};

const UpdateProjectModal: FC<UpdateProjectModalProps> = (props) => {
  const {styles} = useStyles();
  const {id, done, open, current, onDone, onSubmit, children} = props;
  if (!open) {
    return null;
  }
  return (
    <ModalForm<ProjectUpdateCmd>
      open={open}
      title={'Update Project'}
      className={styles.standardListForm}
      width={640}
      onFinish={async (cmd) => {
        onSubmit(id, cmd);
        onDone();
        return true;
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
      <ProFormText
        name="name"
        label="Project Name"
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
export default UpdateProjectModal;
