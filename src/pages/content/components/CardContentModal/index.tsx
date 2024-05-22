import {GridContent} from '@ant-design/pro-components';
import {Menu} from 'antd';
import React, {useLayoutEffect, useRef, useState} from 'react';
import BindingView from './components/binding';
import useStyles from './style.style';
import DetailsView from "@/pages/content/components/CardContentModal/components/details";
import MetadataView from "@/pages/content/components/CardContentModal/components/metadata";
import ImageTargetView from "@/pages/content/components/CardContentModal/components/imageTarget";

type CardContentStateKeys = 'details' | 'metadata' | 'imageTarget';
type CardContentState = {
  mode: 'inline' | 'horizontal';
  selectKey: CardContentStateKeys;
};

const CartContentModal: React.FC<{
  content: ContentCO,
  onUpdateContent: (content: any) => void

}> = ({content, onUpdateContent}) => {
  const {styles} = useStyles();
  const menuMap: Record<string, React.ReactNode> = {
    details: 'Details',
    metadata: 'Metadata',
    imageTarget: 'Image Target',
  };
  const [initConfig, setInitConfig] = useState<CardContentState>({
    mode: 'inline',
    selectKey: 'details',
  });
  const dom = useRef<HTMLDivElement>();
  const resize = () => {
    requestAnimationFrame(() => {
      if (!dom.current) {
        return;
      }
      let mode: 'inline' | 'horizontal' = 'inline';
      const {offsetWidth} = dom.current;
      if (dom.current.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      setInitConfig({
        ...initConfig,
        mode: mode as CardContentState['mode'],
      });
    });
  };
  useLayoutEffect(() => {
    if (dom.current) {
      window.addEventListener('resize', resize);
      resize();
    }
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [dom.current]);
  const getMenu = () => {
    return Object.keys(menuMap).map((item) => ({key: item, label: menuMap[item]}));
  };

  const renderChildren = (content: ContentCO) => {
    const {selectKey} = initConfig;
    switch (selectKey) {
      case 'details':
        return <DetailsView content={content} />;
      case 'metadata':
        return <MetadataView content={content}/>;
      case 'imageTarget':
        return <ImageTargetView content={content}/>;
      default:
        return null;
    }
  };

  return (
    <GridContent>
      <div
        className={styles.main}
        ref={(ref) => {
          if (ref) {
            dom.current = ref;
          }
        }}
      >
        <div className={styles.leftMenu}>
          <Menu
            mode={initConfig.mode}
            selectedKeys={[initConfig.selectKey]}
            onClick={({key}) => {
              setInitConfig({
                ...initConfig,
                selectKey: key as CardContentStateKeys,
              });
            }}
            items={getMenu()}
          />
        </div>
        <div className={styles.right}>
          {renderChildren(content)}
        </div>
      </div>
    </GridContent>
  );
};
export default CartContentModal;
