import PropTypes from './PropTypes';

export interface IProps {
  id: string;
  name: string;
  type: PropTypes;
  options: {
    defaultValue: string | number | boolean;
    options?: string[];
    min?: number;
    max?: number;
  };
}

export interface IChartRenderProps {
  props: IProps[];
}

export interface IChartModule {
  id: string;
  name: string;
  props: IProps[];
  render({ props }: IChartRenderProps): React.ReactNode;
}

export interface IModule {
  chart?: IChartModule;
}
