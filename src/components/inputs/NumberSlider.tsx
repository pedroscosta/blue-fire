import {
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputProps,
  Slider,
  SliderFilledTrack,
  SliderProps,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/react';
import { useState } from 'react';

export type NumberSliderProps = SliderProps & NumberInputProps;

const NumberSlider = ({ w, width, ...props }: NumberSliderProps) => {
  const [val, setValue] = useState<number>(props.defaultValue ?? 0);
  const handleChange = (value: number) => setValue(value);

  const actualW = w || width;

  return (
    <Flex flex={actualW !== undefined ? `0 0 ${actualW}` : 'auto'}>
      <Slider
        value={val}
        flex="1"
        focusThumbOnChange={false}
        onChange={(val) => handleChange(val)}
        {...props}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
      <NumberInput
        maxW="60px"
        ml="8px"
        value={val}
        onChange={(_, val) => handleChange(val)}
        sx={{ '--number-input-stepper-width': '0' }}
        {...props}
      >
        <NumberInputField />
      </NumberInput>
    </Flex>
  );
};

export default NumberSlider;
