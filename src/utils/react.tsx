type ConditonalWrapperProps = {
  children: React.ReactElement;
  condition: boolean;
  wrapper: (children: React.ReactElement) => JSX.Element;
};

export const ConditionalWrapper: React.FC<ConditonalWrapperProps> = ({
  condition,
  wrapper,
  children,
}) => (condition ? wrapper(children) : children);
