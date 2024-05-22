import { useProgress } from "@react-three/drei";
import { Spin } from "antd";
import React, { useEffect, useState } from "react";

export const CustomLoader = () => {
  const { progress } = useProgress();
  const [isLoading, setIsLoading] = useState(true);

  const [minDisplayTime, setMinDisplayTime] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinDisplayTime(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if ((progress >= 100 || progress === 0 ) && !minDisplayTime) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } else {
      setIsLoading(true);
    }
  }, [progress, minDisplayTime]);

  return (
    <>
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 9999,
        }}>
          <Spin size="large" />
        </div>
      )}
    </>
  );
};
