import {
  Box,
  Button,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Portal,
  VStack,
} from '@chakra-ui/react';
import { Alpha, HsvaColor, hsvaToHexa, Hue, Saturation } from '@uiw/react-color';
import SliderPointer from './SliderPointer';

interface ColorPickerProps {
  value: HsvaColor;
  onChange: (val: HsvaColor) => void;
  valueOnButton?: boolean;
  disableAlpha?: boolean;
}

const ColorPicker = ({ value, onChange, valueOnButton, disableAlpha }: ColorPickerProps) => {
  const hexaValue = hsvaToHexa(value);

  return (
    <Popover
      modifiers={[
        {
          name: 'preventOverflow',
          options: {
            altAxis: true,
            padding: 30,
          },
        },
      ]}
    >
      <PopoverTrigger>
        <Button bg={hexaValue} w={20}>
          {valueOnButton ? hexaValue : 'Select'}
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent w="100%" p={1}>
          <PopoverArrow />
          <VStack spacing={2}>
            <Box borderRadius={5} border={'1px'} borderColor={'bf-border-default'}>
              <Saturation
                hsva={value}
                onChange={(color) => {
                  onChange(color);
                }}
                radius={5}
              />
            </Box>
            <Box borderRadius={5} border={'1px'} borderColor={'bf-border-default'} width="100%">
              <Hue
                width="100%"
                hue={value.h}
                onChange={(newHue) => {
                  onChange({ ...value, ...newHue });
                }}
                height="12px"
                radius={5}
                pointer={({ left }) => (
                  <SliderPointer
                    left={left}
                    bg={hsvaToHexa({ h: value.h, s: 100, v: 100, a: 1 })}
                  />
                )}
              />
            </Box>
            {!disableAlpha && (
              <Box borderRadius={5} border={'1px'} borderColor={'bf-border-default'} width="100%">
                <Alpha
                  width="100%"
                  hsva={value}
                  onChange={(newAlpha) => {
                    onChange({ ...value, ...newAlpha });
                  }}
                  height="12px"
                  radius={5}
                  pointer={({ left }) => <SliderPointer left={left} />}
                />
              </Box>
            )}
          </VStack>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default ColorPicker;
