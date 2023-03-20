import { Button, Popover, PopoverArrow, PopoverContent, PopoverTrigger } from '@chakra-ui/react';
import { Colorful } from '@uiw/react-color';

interface ColorPickerProps {
  value: string;
  onChange: (val: string) => void;
  valueOnButton?: boolean;
  disableAlpha?: boolean;
}

const ColorPicker = ({ value, onChange, valueOnButton, disableAlpha }: ColorPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button bg={value} w={20}>
          {valueOnButton ? value : 'Select'}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <Colorful
          color={value}
          disableAlpha={disableAlpha}
          onChange={(color) => {
            onChange(color.hexa);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
