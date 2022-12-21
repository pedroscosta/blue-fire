/* eslint-disable @typescript-eslint/no-explicit-any */
import { useStore } from '@/store';
import {
  Box,
  Divider,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  SystemStyleObject,
  useStyleConfig,
} from '@chakra-ui/react';
import { useState } from 'react';
import { BsPlusLg } from 'react-icons/bs';
import shallow from 'zustand/shallow';
import Tab from './Tab';

const MovableTabs = () => {
  const { tabs, tabTypes, fixedTabs, movableTabs, openableTabs, moveTab } = useStore(
    (s) => s.tabs,
    shallow,
  );

  const context = useStore((s) => s.context, shallow);

  const actionButtons = useStore((s) => s.registry.query, shallow)('bf:tabs-actions', context);

  const [curTab, setCurTab] = useState(Object.keys(tabs)[0]);

  context.set('bf:current-tab-id', curTab);
  context.set('bf:current-tab-type', tabs[curTab].type);

  const styles: any = useStyleConfig('Tabs');

  const tablistStyles: SystemStyleObject = {
    ...styles.tablist,
    display: 'flex',
  };

  const handleTabChange = (index: string) => {
    setCurTab(index);
    context.set('bf:current-tab-id', curTab);
    context.set('bf:current-tab-type', tabs[curTab].type);
  };

  const TabType = tabTypes[tabs[curTab].type as keyof typeof tabTypes].as;

  return (
    <>
      <Box __css={tablistStyles} alignItems="center">
        {fixedTabs.map((id) => (
          <Tab
            key={id}
            selected={id === curTab}
            name={tabs[id].name}
            id={id}
            type="fixed-tab"
            tabChange={() => handleTabChange(id)}
          />
        ))}
        <Divider orientation="vertical" mr={2} ml={2} />
        {movableTabs.map((id, index) => (
          <Tab
            key={id}
            selected={id === curTab}
            name={tabs[id]?.name || '-'}
            index={index}
            tabMove={moveTab}
            id={id}
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
            {openableTabs.map((t) => (
              <MenuItem key={t}>{`${tabTypes[t as keyof typeof tabTypes].name} Tab`}</MenuItem>
            ))}
          </MenuList>
        </Menu>
        <Spacer />
        <Flex direction={'row'} gap={1} paddingRight={1}>
          {Object.entries(actionButtons).map(([key, value]) => {
            const RegisteredComponent = value.component;

            return <RegisteredComponent key={key} />;
          })}
        </Flex>
      </Box>
      {<TabType id={curTab} />}
    </>
  );
};

export default MovableTabs;
