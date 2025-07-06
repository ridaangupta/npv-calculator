
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileNPVCalculator from './MobileNPVCalculator';
import DesktopNPVCalculator from './DesktopNPVCalculator';

const NPVCalculator = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileNPVCalculator />;
  }

  return <DesktopNPVCalculator />;
};

export default NPVCalculator;
