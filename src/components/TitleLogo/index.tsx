import React from 'react';
import {useIntl} from "@@/exports";
import {createStyles} from "antd-style";

const useStyles = createStyles(({token}) => {
  return {
    logoText: {
      position: 'relative',
      insetBlockStart: '2px',
      fontWeight: '600',
      fontSize: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '44px',
      lineHeight: '44px',
      color: token.colorTextBase,
    }
  };
});

const TitleLogo: React.FC = () => {
  const intl = useIntl();
  const {styles} = useStyles();

  return (
    <div className={styles.logoText}>
      Any3D Portal
    </div>
  );
};

export default TitleLogo;
