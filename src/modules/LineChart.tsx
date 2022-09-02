import PropTypes from '../common/modules/PropTypes';
import { IModule, IChartRenderProps } from '../common/modules/Types';

export default class LineChart implements IModule {
  chart = {
    id: 'BF:LINE_CHART',
    name: 'Line Chart',
    props: [
      {
        id: 'LINE_CHART:AREA',
        name: 'Filling under the line',
        type: PropTypes.DROPDOWN,
        options: { defaultValue: 0, options: ['None', 'Fill', 'Striped'] },
      },
    ],
    render: ({ props }: IChartRenderProps) => <>{JSON.stringify(props)}</>,
  };
}
