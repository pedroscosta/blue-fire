import { useStore } from '@/store';

const ChartsPropertiesView = () => {
  const chartTypes = useStore((s) => s.registry.components['bf:chart-components'] || {});

  return <>Charts Properties</>;
};

export default ChartsPropertiesView;
