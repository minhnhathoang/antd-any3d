import { useProgress } from '@react-three/drei';
import { Spin } from 'antd';

const CustomLoader: React.FC = () => {
  const { active, progress, errors, item, loaded, total } = useProgress();

  return (
      <Spin spinning={active} fullscreen />
  );
};

export default CustomLoader;
