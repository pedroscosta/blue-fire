import { Alert, AlertDescription, AlertIcon, AlertStatus, AlertTitle } from '@chakra-ui/react';

type ChartErrorProps = {
  title?: string | React.ReactNode;
  message?: string | React.ReactNode;
  status?: AlertStatus;
};

const ChartError = ({ title, message, status = 'error' }: ChartErrorProps) => (
  <Alert
    status={status}
    variant="subtle"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    textAlign="center"
    height="100%"
  >
    <AlertIcon boxSize="40px" mr={0} />
    <AlertTitle mt={4} mb={1} fontSize="lg">
      {title}
    </AlertTitle>
    <AlertDescription maxWidth="sm">{message}</AlertDescription>
  </Alert>
);

export default ChartError;
