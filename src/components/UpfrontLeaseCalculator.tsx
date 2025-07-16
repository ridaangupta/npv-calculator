import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileLeaseCalculator from './MobileLeaseCalculator';
import DesktopLeaseCalculator from './DesktopLeaseCalculator';

const UpfrontLeaseCalculator = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileLeaseCalculator />;
  }

  return <DesktopLeaseCalculator />;
};

export default UpfrontLeaseCalculator;