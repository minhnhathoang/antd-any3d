import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => {
  return {
    main: {
      width: '368px',
      margin: '0 auto',
      h3: { marginBottom: '20px', fontSize: '16px' },
    },
    password: {
      marginBottom: '24px',
      '.ant-form-item-explain': { display: 'none' },
    },
    getCaptcha: {
      display: 'block',
      width: '100%',
    },

    footer: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    submit: {
      width: '50%',
    },
    success: {
      transition: 'color 0.3s',
      color: token.colorSuccess,
    },
    warning: {
      transition: 'color 0.3s',
      color: token.colorWarning,
    },
    error: {
      transition: 'color 0.3s',
      color: token.colorError,
    },
    'progress-pass > .progress': {
      '.ant-progress-bg': { backgroundColor: token.colorWarning },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
    logo: {
      width: '44px',
      height: '44px',
      marginInlineEnd: '16px',
      verticalAlign: 'top',
    }
  };
});

export default useStyles;
