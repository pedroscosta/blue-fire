import { useStore } from '@/store';
import { ParentSize } from '@visx/responsive';
import { AnyD3Scale } from '@visx/scale';
import shallow from 'zustand/shallow';
import ChartContext from './context';

const BaseChart = ({ tabId, id }: { tabId: string; id: string }) => {
  const [data, registry] = useStore((s) => [s.sheets.sheets[tabId][id], s.registry], shallow);
  const series: Record<string, AnyD3Scale> = {};
  const setSeries = (id: string, scale: AnyD3Scale) => {
    series[id] = scale;
  };

  // const BaseElement = registry.components['bf:chart-types'][data.baseType]?.component;

  return (
    <ChartContext.Provider value={{ series, setSeries }}>
      {/* {BaseElement && <BaseElement tabId={tabId} id={id} />} */}

      <ParentSize>
        {(parent) => (
          <svg width={parent.width} height={parent.height}>
            {Object.entries(data.components).map(([k, v]) => {
              const Element = registry.components['bf:chart-components'][v.component]?.component;

              if (!Element) return;

              return (
                <Element
                  key={k}
                  width={parent.width}
                  height={parent.height}
                  id={id}
                  tabId={tabId}
                />
              );
            })}
          </svg>
        )}
      </ParentSize>
    </ChartContext.Provider>
  );
};

export default BaseChart;