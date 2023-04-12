import { BoxProps } from '@chakra-ui/react';
import { OptionBase, Select as RCS } from 'chakra-react-select';

interface Option extends OptionBase {
  label: string;
  value: string;
}

interface SelectProps {
  options: string[];
  onChange?: (index: number, textValue: string) => void;
  value?: number;
  containerProps?: Partial<BoxProps>;
  placeHolder?: string;
  defaultValue?: number;
}

const Select = ({
  options,
  onChange,
  value,
  defaultValue,
  containerProps,
  placeHolder,
}: SelectProps) => {
  const formattedOptions: Option[] = options.map((opt, idx) => ({
    value: idx.toString(),
    label: opt,
  }));

  // return (
  //   <Menu
  //     isLazy={false}
  //     matchWidth={matchWidth}
  //     initialFocusRef={focus}
  //     boundary="scrollParent"
  //     onOpen={() => {
  //       setTimeout(() => {
  //         console.log(focus.current?.textContent);
  //         focus.current?.focus();
  //       }, 0);
  //     }}
  //   >
  //     {({ isOpen }) => (
  //       <>
  //         <MenuButton
  //           isActive={isOpen}
  //           as={Button}
  //           rightIcon={isOpen ? <MdExpandLess /> : <MdExpandMore />}
  //           {...{ variant: 'outline', ...buttonProps }}
  //         >
  //           {options[useValue]}
  //         </MenuButton>
  //         <MenuList sx={{ overflowY: 'auto' }} maxH={64} minW={0}>
  //           {options.map((v, k) => (
  //             <MenuItem
  //               key={k}
  //               onClick={() => {
  //                 onChange && onChange(k, v);
  //                 setInternalValue(k);
  //               }}
  //               ref={k == useValue ? focus : undefined}
  //             >
  //               {v}
  //             </MenuItem>
  //           ))}
  //         </MenuList>
  //       </>
  //     )}
  //   </Menu>
  // );

  return (
    <RCS<Option>
      name="colors"
      className="chakra-react-select"
      classNamePrefix="chakra-react-select"
      menuPortalTarget={document.body}
      options={formattedOptions}
      placeholder={placeHolder}
      selectedOptionStyle="color"
      defaultValue={defaultValue ? formattedOptions[defaultValue] : undefined}
      value={value ? formattedOptions[value] : undefined}
      onChange={(val) => onChange && val && onChange(Number(val.value), val.label)}
      chakraStyles={{
        menuList: (provided) => ({ ...provided, overflowX: 'hidden', overflowY: 'auto' }),
        dropdownIndicator: (provided) => ({
          ...provided,
          bg: 'transparent',
          px: 2,
          cursor: 'inherit',
        }),
        indicatorSeparator: (provided) => ({
          ...provided,
          display: 'none',
        }),
        container: (provided) => ({
          ...provided,
          ...containerProps,
        }),
      }}
    />
  );
};

export default Select;
