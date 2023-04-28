import { BoxProps } from '@chakra-ui/react';
import {
  ChakraStylesConfig,
  ClearIndicatorProps,
  ContainerProps,
  ControlProps,
  DropdownIndicatorProps,
  GroupBase,
  GroupHeadingProps,
  GroupProps,
  IndicatorsContainerProps,
  IndicatorSeparatorProps,
  InputProps,
  LoadingIndicatorProps,
  MenuListProps,
  MenuProps,
  MultiValueGenericProps,
  MultiValueProps,
  MultiValueRemoveProps,
  NoticeProps,
  OptionBase,
  OptionProps,
  OptionsOrGroups,
  PlaceholderProps,
  Select as RCS,
  SingleValueProps,
  ValueContainerProps,
} from 'chakra-react-select';
export interface Option extends OptionBase {
  label: string;
  value: string;
}

export type Group<T> = GroupBase<T>;

const isGroup = <T,>(b: T | Group<T>): b is Group<T> => {
  const opts = (b as Group<T>).options;
  return opts !== undefined && Array.isArray(opts);
};

type Components<T> = {
  Option?: (props: OptionProps<T, false, Group<T>>) => JSX.Element;
  Group?: (props: GroupProps<T, false, Group<T>>) => JSX.Element;
  ClearIndicator?: (props: ClearIndicatorProps<T, false, Group<T>>) => JSX.Element;
  Control?: (props: ControlProps<T, false, Group<T>>) => JSX.Element;
  DropdownIndicator?: (props: DropdownIndicatorProps<T, false, Group<T>>) => JSX.Element;
  GroupHeading?: (props: GroupHeadingProps<T, false, Group<T>>) => JSX.Element;
  IndicatorsContainer?: (props: IndicatorsContainerProps<T, false, Group<T>>) => JSX.Element;
  IndicatorSeparator?: (props: IndicatorSeparatorProps<T, false, Group<T>>) => JSX.Element;
  Input?: (props: InputProps<T, false, Group<T>>) => JSX.Element;
  LoadingIndicator?: (props: LoadingIndicatorProps<T, false, Group<T>>) => JSX.Element;
  Menu?: (props: MenuProps<T, false, Group<T>>) => JSX.Element;
  MenuList?: (props: MenuListProps<T, false, Group<T>>) => JSX.Element;
  LoadingMessage?: (props: NoticeProps<T, false, Group<T>>) => JSX.Element;
  NoOptionsMessage?: (props: NoticeProps<T, false, Group<T>>) => JSX.Element;
  MultiValue?: (props: MultiValueProps<T, false, Group<T>>) => JSX.Element;
  MultiValueContainer?: (props: MultiValueGenericProps<T, false, Group<T>>) => JSX.Element;
  MultiValueLabel?: (props: MultiValueGenericProps<T, false, Group<T>>) => JSX.Element;
  MultiValueRemove?: (props: MultiValueRemoveProps<T, false, Group<T>>) => JSX.Element;
  Placeholder?: (props: PlaceholderProps<T, false, Group<T>>) => JSX.Element;
  SelectContainer?: (props: ContainerProps<T, false, Group<T>>) => JSX.Element;
  SingleValue?: (props: SingleValueProps<T, false, Group<T>>) => JSX.Element;
  ValueContainer?: (props: ValueContainerProps<T, false, Group<T>>) => JSX.Element;
};
interface SelectProps<T> {
  options: OptionsOrGroups<T, Group<T>>;
  onChange?: (value: T | null) => void;
  value?: T;
  containerProps?: Partial<BoxProps>;
  placeHolder?: string;
  defaultValue?: T;
  components?: Components<T>;
  chakraStyles?: ChakraStylesConfig<T, false, Group<T>>;
  additionalProps?: any;
  variant?: 'outline' | 'filled' | 'flushed' | 'unstyled';
}

const Select = <T = Option,>({
  onChange,
  containerProps,
  chakraStyles,
  additionalProps,
  components,
  ...rest
}: SelectProps<T> & Parameters<typeof RCS<T>>[0]) => {
  return (
    <RCS<T>
      menuPortalTarget={document.body}
      selectedOptionStyle="color"
      components={components}
      onChange={(val) => onChange && onChange(val)}
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
        ...chakraStyles,
      }}
      {...rest}
      // @ts-ignore
      {...additionalProps}
    />
  );
};

export default Select;
