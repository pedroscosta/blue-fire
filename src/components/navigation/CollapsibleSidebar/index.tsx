import { Box, useDisclosure, VStack } from '@chakra-ui/react';
import { ElementType, useState } from 'react';
import { MdAddChart } from 'react-icons/md';
import IconButton from './IconButton';
import ChartsView from './views/ChartsView';

const mockData: Record<
  string,
  { data: { icon: ElementType; title: string }; component: ElementType }
> = {
  createChart: {
    data: {
      icon: MdAddChart,
      title: 'Charts',
    },
    component: ChartsView,
  },
  createChart2: {
    data: {
      icon: MdAddChart,
      title: 'Charts 2',
    },
    component: () => {
      return <div>ChartsView2</div>;
    },
  },
};

const CollapsibleSidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [curView, setCurView] = useState<string>();

  const CurViewComponent = curView ? mockData[curView].component : undefined;

  return (
    <>
      {isOpen && CurViewComponent && (
        <Box
          width={`calc(var(--chakra-sizes-80) + 1px)`}
          borderLeft={'1px'}
          borderColor={'bf-divider'}
          padding={1}
        >
          <CurViewComponent />
        </Box>
      )}
      <Box
        width={`calc(var(--chakra-sizes-12) + 1px)`}
        borderLeft={'1px'}
        borderColor={'bf-divider'}
      >
        <VStack spacing={1} paddingTop={1}>
          {Object.entries(mockData).map(([id, view]) => (
            <IconButton
              key={id}
              icon={view.data.icon}
              title={view.data.title}
              onClick={() => {
                if (curView === id) {
                  setCurView(undefined);
                  onClose();
                } else {
                  setCurView(id);
                  onOpen();
                }
              }}
              active={curView === id}
            />
          ))}
        </VStack>
      </Box>
    </>
  );
};

export default CollapsibleSidebar;
