import { Transient } from '@dash/common';
import { motion, Variants } from 'framer-motion';
import { FC, useEffect } from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { default as styled } from 'styled-components';
import { GlassPane } from '../components/glass-pane';
import { useIsMobile } from '../services/mobile';
import { usePageData } from '../services/page-data';
import { CpuWidget } from '../widgets/cpu';
import { ErrorWidget } from '../widgets/error';
import { GpuWidget } from '../widgets/gpu';
import { NetworkWidget } from '../widgets/network';
import { RamWidget } from '../widgets/ram';
import { ServerWidget } from '../widgets/server';
import { StorageWidget } from '../widgets/storage';
import { ThemedText } from './text';

const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
};

const ContentContainer = styled.div<Transient<{ mobile: boolean }>>`
  width: 100vw;
  max-width: 100%;
  min-height: 100vh;
  /* prettier-ignore */
  padding: ${({ $mobile }) => ($mobile ? '50px' : '7vh')} ${({ $mobile }) =>
    $mobile ? '25px' : '4vw'};
  display: flex;
`;

const FlexContainer = styled(motion.div)<Transient<{ mobile: boolean }>>`
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-flow: row wrap;
  column-gap: 40px;
  row-gap: ${({ $mobile }) => ($mobile ? '40px' : '70px')};
`;

const ErrorContainer = styled(motion.div)<Transient<{ mobile: boolean }>>`
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-flow: row wrap;
  column-gap: 40px;
  row-gap: ${({ $mobile }) => ($mobile ? '40px' : '70px')};

  justify-content: center;
  align-items: center;
`;

export const MainWidgetContainer: FC = () => {
  const isMobile = useIsMobile();

  const {
    pageLoaded,
    error,
    serverInfo,
    config,
    cpuLoad,
    storageLoad,
    ramLoad,
    networkLoad,
    gpuLoad,
  } = usePageData();

  const osData = serverInfo?.os;
  const cpuData = serverInfo?.cpu;
  const ramData = serverInfo?.ram;
  const networkData = serverInfo?.network;
  const storageData = serverInfo?.storage;
  const gpuData = serverInfo?.gpu;

  useEffect(() => {
    if (config?.page_title) {
      document.title = config.page_title;
    }
  }, [config?.page_title]);

  if (error) {
    return (
      <SimpleBar style={{ height: '100%' }}>
        <ContentContainer $mobile={isMobile}>
          <ErrorContainer
            variants={containerVariants}
            initial='initial'
            animate='animate'
            exit='exit'
            $mobile={isMobile}
          >
            <GlassPane variants={itemVariants} grow={0} minWidth={500}>
              <ErrorWidget errorText={error.text} />
            </GlassPane>
          </ErrorContainer>
        </ContentContainer>
      </SimpleBar>
    );
  }

  if (!pageLoaded || !config) return null;

  const configs = {
    os: {
      grow: config.os_widget_grow,
      minWidth: config.os_widget_min_width,
      Widget: ServerWidget,
      data: osData,
    },
    cpu: {
      grow: config.cpu_widget_grow,
      minWidth: config.cpu_widget_min_width,
      Widget: CpuWidget,
      data: cpuData,
      load: cpuLoad,
    },
    storage: {
      grow: config.storage_widget_grow,
      minWidth: config.storage_widget_min_width,
      Widget: StorageWidget,
      data: storageData,
      load: storageLoad,
    },
    ram: {
      grow: config.ram_widget_grow,
      minWidth: config.ram_widget_min_width,
      Widget: RamWidget,
      data: ramData,
      load: ramLoad,
    },
    network: {
      grow: config.network_widget_grow,
      minWidth: config.network_widget_min_width,
      Widget: NetworkWidget,
      data: networkData,
      load: networkLoad,
    },
    gpu: {
      grow: config.gpu_widget_grow,
      minWidth: config.gpu_widget_min_width,
      Widget: GpuWidget,
      data: gpuData,
      load: gpuLoad,
    },
  };

  return (
    <SimpleBar style={{ height: '100%' }}>
      <ContentContainer $mobile={isMobile}>
        <FlexContainer
          $mobile={isMobile}
          variants={containerVariants}
          initial='initial'
          animate='animate'
          exit='exit'
        >
          {config.widget_list.map(widget => {
            const currentConfig = configs[widget];

            return (
              <GlassPane
                key={widget}
                variants={itemVariants}
                layoutId={`widget_${widget}`}
                grow={currentConfig.grow}
                minWidth={currentConfig.minWidth}
              >
                <currentConfig.Widget
                  // @ts-ignore
                  data={currentConfig.data}
                  // @ts-ignore
                  load={currentConfig.load}
                  config={config}
                />
              </GlassPane>
            );
          })}
        </FlexContainer>

        {config.show_dash_version === 'bottom_right' && (
          <ThemedText
            style={{
              position: 'fixed',
              right: '10px',
              bottom: '10px',
            }}
          >
            {osData?.dash_version}
          </ThemedText>
        )}
      </ContentContainer>
    </SimpleBar>
  );
};
