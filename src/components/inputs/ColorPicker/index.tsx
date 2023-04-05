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
import { Alpha, hexToHsva, HsvaColor, hsvaToHexa, Hue, Saturation } from '@uiw/react-color';
import { colors } from 'bluefire';
import SliderPointer from './SliderPointer';

interface ColorPickerProps {
  value: HsvaColor | string;
  onChange: (val: HsvaColor | string) => void;
  valueOnButton?: boolean;
  disableAlpha?: boolean;
}

const ColorPicker = ({ value, onChange, valueOnButton, disableAlpha }: ColorPickerProps) => {
  console.log(value);
  const hsvaValue =
    typeof value === 'string'
      ? hexToHsva(value.startsWith('#') ? value : colors.getCssVar(value))
      : value;
  const hexaValue = hsvaToHexa(hsvaValue);

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
                hsva={hsvaValue}
                onChange={(color) => {
                  onChange(color);
                }}
                radius={5}
              />
            </Box>
            <Box borderRadius={5} border={'1px'} borderColor={'bf-border-default'} width="100%">
              <Hue
                width="100%"
                hue={hsvaValue.h}
                onChange={(newHue) => {
                  onChange({ ...hsvaValue, ...newHue });
                }}
                height="12px"
                radius={5}
                pointer={({ left }) => (
                  <SliderPointer
                    left={left}
                    bg={hsvaToHexa({ h: hsvaValue.h, s: 100, v: 100, a: 1 })}
                  />
                )}
              />
            </Box>
            {!disableAlpha && (
              <Box borderRadius={5} border={'1px'} borderColor={'bf-border-default'} width="100%">
                <Alpha
                  width="100%"
                  hsva={hsvaValue}
                  onChange={(newAlpha) => {
                    onChange({ ...hsvaValue, ...newAlpha });
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
