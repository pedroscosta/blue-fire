/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Divider,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SystemStyleObject,
  useStyleConfig,
} from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { BsPlusLg } from 'react-icons/bs';
import Tab from './Tab';

const DataTab = ({ id }: { id: string }) => <h1>{id}</h1>;
const SheetTab = ({ id }: { id: string }) => <h1>{id}</h1>;

const nid = nanoid();
const nid2 = nanoid();
const nid3 = nanoid();

const mockTabs = {
  tabTypes: {
    'bf:data-tab': { name: 'Data', as: DataTab },
    'bf:sheet-tab': { name: 'Sheet', as: SheetTab },
  },
  fixedTabs: ['bf:data-tab'],
  openableTabs: ['bf:sheet-tab'],
  movableTabs: [nid, nid2, nid3],
  tabs: {
    'bf:data-tab': { name: 'Data', type: 'bf:data-tab' },
    [nid]: { name: 'Sheet 1', type: 'bf:sheet-tab' },
    [nid2]: { name: 'Sheet 2', type: 'bf:sheet-tab' },
    [nid3]: { name: 'Sheet 3', type: 'bf:sheet-tab' },
  },
};

const MovableTabs = () => {
  const [tabs, setTabs] = useState(mockTabs);
  const [curTab, setCurTab] = useState(Object.keys(tabs.tabs)[0]);

  const styles: any = useStyleConfig('Tabs');

  const tablistStyles: SystemStyleObject = {
    display: 'flex',
    ...styles.tablist,
  };

  const handleTabChange = (index: string) => {
    setCurTab(index);
  };

  const handleTabMove = (draggedIndex: number, targetIndex: number) => {
    setTabs((prev) => {
      const dragged = prev.movableTabs[draggedIndex];
      prev.movableTabs.splice(draggedIndex, 1);
      prev.movableTabs.splice(targetIndex, 0, dragged);
      return { ...prev };
    });
  };

  return (
    <>
      <Box __css={tablistStyles} alignItems="center">
        {tabs.fixedTabs.map((id) => (
          <Tab
            key={id}
            selected={id === curTab}
            name={tabs.tabs[id].name}
            id={id}
            // as={tabs.tabTypes[tab.type as keyof typeof tabs.tabTypes].as}
            tabChange={() => handleTabChange(id)}
          />
        ))}
        <Divider orientation="vertical" mr={2} ml={2} />
        {tabs.movableTabs.map((id, index) => (
          <Tab
            key={id}
            selected={id === curTab}
            name={tabs.tabs[id].name}
            index={index}
            tabMove={handleTabMove}
            id={id}
            // as={tabs.tabTypes[tab.type as keyof typeof tabs.tabTypes].as}
            tabChange={() => handleTabChange(id)}
          />
        ))}
        <Menu isLazy size="sm">
          <MenuButton
            as={IconButton}
            aria-label="Search database"
            icon={<BsPlusLg />}
            variant="ghost"
            isRound
            size="xs"
            mr={2}
            ml={2}
          />
          <MenuList>
            {tabs.openableTabs.map((t) => (
              <MenuItem>{`${
                tabs.tabTypes[t as keyof typeof tabs.tabTypes].name
              } Tab`}</MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Box>
      {tabs.tabTypes[tabs.tabs[curTab].type as keyof typeof tabs.tabTypes].as({
        id: curTab,
      })}
    </>
  );
};

export default MovableTabs;
