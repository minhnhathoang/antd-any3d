import {
  ModalForm,
  ProFormText
} from '@ant-design/pro-components';
import React, {FC} from 'react';
import useStyles from '../style.style';
import {useModel} from "@@/exports";

type VuforiaKeyModalProps = {
  projectId: string;
  id?: string;
  open: boolean;
  current: Partial<VuforiaKey> | undefined;
  onDone: () => void;
  children?: React.ReactNode;
};

const VuforiaKeyForm: FC<VuforiaKeyModalProps> = (props) => {
  const {addVuforiaKey, updateVuforiaKey} = useModel('project');

  const {styles} = useStyles();
  const {projectId, id, open, current, onDone, children} = props;
  if (!open) {
    return null;
  }
  return (
    <ModalForm<VuforiaKey>
      open={open}
      title={'Server Access Keys'}
      className={styles.standardListForm}
      width={640}
      onFinish={async (cmd) => {
        if (id) {
          cmd.id = id;
          await updateVuforiaKey(id, cmd);
        } else {
          cmd.projectId = projectId;
          await addVuforiaKey(projectId, cmd);
        }
        onDone();
        return true;
      }}
      initialValues={current}
      submitter={{
        render: (_, dom) => (dom),
      }}
      trigger={<>{children}</>}
      modalProps={{
        onCancel: () => onDone(),
        destroyOnClose: true,
      }}
    >
      <ProFormText
        name="accessKey"
        label="Access Key"
        rules={[
          {
            required: true,
            message: 'Please enter a project name!',
          },
        ]}
        placeholder="e.g. AR project"
      />

      <ProFormText
        name="secretKey"
        label="Secret Key"
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
export default VuforiaKeyForm;
