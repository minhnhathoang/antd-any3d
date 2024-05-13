import {Link, useSearchParams} from '@umijs/max';
import {Button, Result} from 'antd';
import React from 'react';
import useStyles from './style.style';
import { SmileOutlined } from '@ant-design/icons';

const RegisterResult: React.FC<Record<string, unknown>> = () => {
    const {styles} = useStyles();
    const [params] = useSearchParams();

    const actions = (
      <div className={styles.actions}>
        <Link to="/">
          <Button size="large" type="primary">Back Home</Button>
        </Link>
      </div>
    );

    const email = params?.get('email') || 'nhath.uet@gmail.com';
    const username = params?.get('username') || "nhathm";
    return (
      <Result
        className={styles.registerResult}
        icon={<SmileOutlined />}
        title={
          <div className={styles.title}>
            <span>Your account registration for <b>{username}</b> was successful.</span>
          </div>
        }
        extra={actions}
      />
    )
      ;
  }
;
export default RegisterResult;
