import { useStore } from '@/store';
import { Box, useDisclosure, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import shallow from 'zustand/shallow';
import IconButton from './IconButton';

const CollapsibleSidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [curView, setCurView] = useState<string>();

  const context = useStore((s) => s.context, shallow);

  const views = useStore((s) => s.registry.query, shallow)('bf:sheet-editor-sidebar', context);

  const CurViewComponent = curView && views[curView] ? views[curView].component : undefined;

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
          {Object.entries(views).map(([id, view]) => (
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
