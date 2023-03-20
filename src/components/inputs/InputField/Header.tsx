import { Flex } from '@chakra-ui/react';
import { Children, cloneElement, isValidElement } from 'react';
import { InputFieldProps } from '.';

const Header = ({ children, ...rest }: InputFieldProps) => {
  return (
    <Flex flex="1 1 auto" flexDir="column">
      {Children.map(children, (child) =>
        isValidElement(child) ? cloneElement(child, rest) : child,
      )}
    </Flex>
  );
};

export default Header;
