import GridLayout from '@/components/editor/grid/GridLayout';
import CollapsibleSidebar from '@/components/navigation/CollapsibleSidebar';
import { Box } from '@chakra-ui/react';
import { FC } from 'react';
import { AutoSizer as _AutoSizer, AutoSizerProps } from 'react-virtualized';

const AutoSizer = _AutoSizer as unknown as FC<AutoSizerProps>; // react-virtualized is broken when using React-18

const SheetTab = ({ id }: { id: string }) => {
  return (
    <Box style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'row', width: '100%' }}>
      <Box p={0.5} style={{ flex: '1 1 auto', display: 'flex', overflow: 'hidden' }}>
        <AutoSizer>{({ height, width }) => <GridLayout height={height} width={width} tabId={id} />}</AutoSizer>
      </Box>
      <CollapsibleSidebar />
    </Box>
  );
};

export default SheetTab;
