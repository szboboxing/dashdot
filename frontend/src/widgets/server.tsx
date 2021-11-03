import {
  faApple,
  faCentos,
  faFedora,
  faGithub,
  faLinux,
  faRedhat,
  faSuse,
  faUbuntu,
  faWindows,
  IconDefinition,
} from '@fortawesome/free-brands-svg-icons';
import { faServer } from '@fortawesome/free-solid-svg-icons';
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';
import { Button, Switch } from 'antd';
import { OsInfo } from 'dashdot-shared';
import { FC, useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import InfoTable from '../components/info-table';
import SkeletonContent from '../components/skeleton-content';
import ThemedText from '../components/text';
import { useSetting } from '../services/settings';

const Container = styled.div`
  flex: 1;
  max-width: 100%;

  display: flex;
  flex-direction: column;
  padding: 25px;
`;

const Heading = styled(ThemedText)`
  width: 100%;
  max-width: 100%;
  margin-top: 20px;

  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: flex-end;
  column-gap: 15px;

  font-size: 2rem;

  > * {
    max-width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;

const Appendix = styled.span`
  font-size: 1.5rem;
`;

const ServerName = styled.span`
  font-weight: bold;
  text-decoration: underline;
  text-decoration-color: ${props => props.theme.colors.primary};
  position: relative;
  bottom: -5px;
`;

const ThemeSwitchContainer = styled.div`
  position: absolute;
  right: 25px;
  top: 25px;
  z-index: 2;

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const Link = styled(Button)`
  border: none;

  &:active {
    > svg {
      color: ${props => props.theme.colors.primary};
    }
  }
  > svg {
    color: ${props => props.theme.colors.text};
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  column-gap: 40px;

  flex-grow: 1;
`;

const StyledInfoTable = styled(InfoTable)`
  padding: 5px;
  max-width: 400px;
  flex-grow: 1;
  flex-shrink: 1;
`;

const ServerIconContainer = styled.div`
  margin-right: 20px;
`;

const ServerIcon: FC<{ os: string } & Omit<FontAwesomeIconProps, 'icon'>> = ({
  os,
  ...iconProps
}) => {
  const theme = useTheme();

  let icon: IconDefinition = faServer;

  if (os.includes('ubuntu')) {
    icon = faUbuntu;
  } else if (os.includes('suse')) {
    icon = faSuse;
  } else if (os.includes('redhat')) {
    icon = faRedhat;
  } else if (os.includes('fedora')) {
    icon = faFedora;
  } else if (os.includes('centos')) {
    icon = faCentos;
  } else if (os.includes('linux')) {
    icon = faLinux;
  } else if (
    os.includes('mac') ||
    os.includes('osx') ||
    os.includes('darwin') ||
    os.includes('apple')
  ) {
    icon = faApple;
  } else if (os.includes('win')) {
    icon = faWindows;
  }

  return (
    <FontAwesomeIcon color={theme.colors.text} {...iconProps} icon={icon} />
  );
};

const ServerWidget: FC<Partial<OsInfo>> = props => {
  const [darkMode, setDarkMode] = useSetting('darkMode');
  const [uptime, setUptime] = useState(0);

  const days = Math.floor(uptime / (24 * 60 * 60));
  const hours = Math.floor((uptime % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((uptime % (60 * 60)) / 60);
  const seconds = Math.floor(uptime % 60);

  const dateInfos = [
    {
      label: '',
      value: `${days} days`,
      amount: days,
    },
    {
      label: '',
      value: `${hours} hours`,
      amount: hours,
    },
    {
      label: '',
      value: `${minutes} minutes`,
      amount: minutes,
    },
    {
      label: '',
      value: `${seconds} seconds`,
      amount: seconds,
    },
  ].reduce((acc, cur) => {
    if (acc.length > 0) {
      acc.push(cur);
    } else if (cur.amount > 0) {
      acc.push(cur);
    }

    return acc;
  }, [] as { label: string; value: string }[]);

  if (dateInfos[0]) {
    dateInfos[0].label = 'Up since';
  } else {
    dateInfos[0] = {
      label: 'Up since',
      value: '',
    };
  }

  // Client-side calculation of uptime
  useEffect(() => {
    const uptime = props.uptime ?? 0;

    let interval: any;
    if (uptime > 0) {
      const startTime = Date.now();

      setUptime(uptime);
      interval = setInterval(() => {
        const passedTime = (Date.now() - startTime) / 1000;
        setUptime(uptime + passedTime);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [props.uptime]);

  return (
    <Container>
      <ButtonsContainer>
        <Link
          ghost
          shape='circle'
          icon={<FontAwesomeIcon icon={faGithub} />}
          href='https://github.com/MauriceNino/dashdot'
          target='_blank'
        />
      </ButtonsContainer>

      <ThemeSwitchContainer>
        <ThemedText>Dark Mode</ThemedText>
        <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
      </ThemeSwitchContainer>

      <Heading>
        <Appendix>dash.</Appendix>
        <ServerName>{window.location.hostname}</ServerName>
      </Heading>

      <ContentContainer>
        <StyledInfoTable
          infos={[
            {
              label: 'OS',
              value: `${props.distro ?? ''} ${props.release ?? ''}`,
            },
            {
              label: 'Arch',
              value: props.arch,
            },
            ...dateInfos,
          ]}
        />

        <ServerIconContainer>
          <SkeletonContent width={120} height={120} borderRadius='15px'>
            {props.distro != null && props.platform != null && (
              <ServerIcon
                os={(props.distro + props.platform).toLowerCase()}
                size='7x'
              />
            )}
          </SkeletonContent>
        </ServerIconContainer>
      </ContentContainer>
    </Container>
  );
};

export default ServerWidget;
