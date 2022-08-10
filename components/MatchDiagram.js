import {
  Badge,
  Box,
  Divider,
  Group,
  Paper,
  ThemeIcon,
  useMantineTheme,
  Space,
} from "@mantine/core";
import { IssueReopenedIcon } from "@primer/octicons-react";
import { Connector } from "./Connector";
import { OrderCard } from "./OrderCard";

export const MatchDiagram = ({ activeImg }) => {
  const theme = useMantineTheme();

  return (
    <Group
      spacing={0}
      pt={50}
      pb="xl"
      mx="auto"
      sx={{
        overflow: "hidden",
        flexWrap: "nowrap",
        width: "100%",
        maxWidth: 600,
        // transform: "scale(.7)",
        // [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
        //   transform: "scale(.95)",
        // },
        // [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
        //   transform: "none",
        // },
        // [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
        //   transform: "none",
        // },
      }}
    >
      <OrderCard
        title="Bike Central"
        order="BC-24592"
        color="green"
        lineItems={[
          {
            name: "Water Bottle",
            sku: "52139803",
            color: "orange",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 512 512"
                xmlSpace="preserve"
                width={28}
                fill="currentColor"
              >
                <path d="M348.379 192.121v-91.164c0-22.691-17.731-41.309-40.063-42.75V20.619C308.316 9.232 299.085 0 287.698 0h-63.395c-11.387 0-20.619 9.232-20.619 20.619v37.589c-22.333 1.442-40.063 20.059-40.063 42.75v91.164c0 9.555 6.509 17.568 15.326 19.907v49.355c-8.818 2.34-15.326 10.353-15.326 19.906v210.091c0 11.387 9.232 20.619 20.619 20.619h143.522c11.387 0 20.619-9.232 20.619-20.619V281.292c0-9.555-6.509-17.568-15.326-19.908v-49.355c8.817-2.34 15.324-10.353 15.324-19.908zM244.921 41.237h22.159v16.869h-22.159V41.237zm31.698 375.34c0 11.387-9.232 20.619-20.619 20.619s-20.619-9.232-20.619-20.619v-60.481c0-11.387 9.232-20.619 20.619-20.619s20.619 9.232 20.619 20.619v60.481zm15.197-155.903h-71.632v-47.933h71.632v47.933z" />
              </svg>
            ),
          },
          {
            name: "Bike Pump",
            sku: "72384762",
            color: "violet",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="500.142 557.916 15.71 31.16"
                xmlSpace="preserve"
                width={13}
                fill="currentColor"
              >
                <path d="M509.15 560.44h4.416c.405 0 .734-.544.734-1.212 0-.669-.33-1.212-.734-1.212h-11.04c-.404 0-.733.543-.733 1.212 0 .668.329 1.212.733 1.212h4.417zm-1.031 10.832a1.844 1.844 0 00-1.839 1.844v13.968c0 1.017.825 1.845 1.84 1.845a1.844 1.844 0 001.839-1.845v-13.968a1.844 1.844 0 00-1.84-1.844zm-.88-10.9h1.834v12.506h-1.834zm2.126 28.602h5.477c.502 0 .91-.264.91-.59 0-.324-.408-.588-.91-.588h-13.69c-.502 0-.91.264-.91.589 0 .325.408.589.91.589h5.477z" />
              </svg>
            ),
          },
        ]}
      />
      <Group
        direction="column"
        align="center"
        sx={{
          flex: 1,
        }}
      >
        <Group
          direction="column"
          align="center"
          spacing={2}
          sx={{
            [theme.fn.smallerThan("md")]: {
              display: "none",
            },
          }}
        >
          <Badge
            radius="sm"
            sx={{ color: theme.colors.gray[5], background: "transparent" }}
          >
            Match
          </Badge>
          <Paper withBorder sx={{ display: "flex", overflow: "hidden" }}>
            <ThemeIcon
              variant="light"
              color="orange"
              size="lg"
              radius={0}
              // sx={{ background: theme.fn.lighten(theme.colors.orange[0], 0.7) }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 512 512"
                xmlSpace="preserve"
                width={20}
                fill="currentColor"
              >
                <path d="M348.379 192.121v-91.164c0-22.691-17.731-41.309-40.063-42.75V20.619C308.316 9.232 299.085 0 287.698 0h-63.395c-11.387 0-20.619 9.232-20.619 20.619v37.589c-22.333 1.442-40.063 20.059-40.063 42.75v91.164c0 9.555 6.509 17.568 15.326 19.907v49.355c-8.818 2.34-15.326 10.353-15.326 19.906v210.091c0 11.387 9.232 20.619 20.619 20.619h143.522c11.387 0 20.619-9.232 20.619-20.619V281.292c0-9.555-6.509-17.568-15.326-19.908v-49.355c8.817-2.34 15.324-10.353 15.324-19.908zM244.921 41.237h22.159v16.869h-22.159V41.237zm31.698 375.34c0 11.387-9.232 20.619-20.619 20.619s-20.619-9.232-20.619-20.619v-60.481c0-11.387 9.232-20.619 20.619-20.619s20.619 9.232 20.619 20.619v60.481zm15.197-155.903h-71.632v-47.933h71.632v47.933z" />
              </svg>
            </ThemeIcon>
            <Divider
              variant="dashed"
              orientation="vertical"
              sx={{ height: "unset" }}
            />
            <ThemeIcon
              variant="light"
              color="cyan"
              size="lg"
              radius={0}
              // sx={{ background: theme.fn.lighten(theme.colors.cyan[0], 0.7) }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 512 512"
                xmlSpace="preserve"
                width={20}
                fill="currentColor"
              >
                <path d="M348.379 192.121v-91.164c0-22.691-17.731-41.309-40.063-42.75V20.619C308.316 9.232 299.085 0 287.698 0h-63.395c-11.387 0-20.619 9.232-20.619 20.619v37.589c-22.333 1.442-40.063 20.059-40.063 42.75v91.164c0 9.555 6.509 17.568 15.326 19.907v49.355c-8.818 2.34-15.326 10.353-15.326 19.906v210.091c0 11.387 9.232 20.619 20.619 20.619h143.522c11.387 0 20.619-9.232 20.619-20.619V281.292c0-9.555-6.509-17.568-15.326-19.908v-49.355c8.817-2.34 15.324-10.353 15.324-19.908zM244.921 41.237h22.159v16.869h-22.159V41.237zm31.698 375.34c0 11.387-9.232 20.619-20.619 20.619s-20.619-9.232-20.619-20.619v-60.481c0-11.387 9.232-20.619 20.619-20.619s20.619 9.232 20.619 20.619v60.481zm15.197-155.903h-71.632v-47.933h71.632v47.933z" />
              </svg>
            </ThemeIcon>
          </Paper>
        </Group>

        <Box sx={{ width: "100%" }}>
          <Connector degrees={-15} icon={<IssueReopenedIcon size={11} />} />
        </Box>
        <Box mt={70} sx={{ width: "100%" }}>
          <Connector degrees={15} icon={<IssueReopenedIcon size={11} />} />
        </Box>
        <Group
          direction="column"
          align="center"
          spacing={2}
          sx={{
            [theme.fn.smallerThan("md")]: {
              display: "none",
            },
          }}
        >
          <Paper withBorder sx={{ display: "flex", overflow: "hidden" }}>
            <ThemeIcon
              variant="light"
              color="violet"
              size="lg"
              radius={0}
              // sx={{ background: theme.fn.lighten(theme.colors.violet[0], 0.7) }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="500.142 557.916 15.71 31.16"
                xmlSpace="preserve"
                width={11}
                fill="currentColor"
              >
                <path d="M509.15 560.44h4.416c.405 0 .734-.544.734-1.212 0-.669-.33-1.212-.734-1.212h-11.04c-.404 0-.733.543-.733 1.212 0 .668.329 1.212.733 1.212h4.417zm-1.031 10.832a1.844 1.844 0 00-1.839 1.844v13.968c0 1.017.825 1.845 1.84 1.845a1.844 1.844 0 001.839-1.845v-13.968a1.844 1.844 0 00-1.84-1.844zm-.88-10.9h1.834v12.506h-1.834zm2.126 28.602h5.477c.502 0 .91-.264.91-.59 0-.324-.408-.588-.91-.588h-13.69c-.502 0-.91.264-.91.589 0 .325.408.589.91.589h5.477z" />
              </svg>
            </ThemeIcon>
            <Divider
              variant="dashed"
              orientation="vertical"
              sx={{ height: "unset" }}
            />
            <ThemeIcon
              variant="light"
              color="red"
              size="lg"
              radius={0}
              // sx={{ background: theme.fn.lighten(theme.colors.red[0], 0.7) }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="500.142 557.916 15.71 31.16"
                xmlSpace="preserve"
                width={11}
                fill="currentColor"
              >
                <path d="M509.15 560.44h4.416c.405 0 .734-.544.734-1.212 0-.669-.33-1.212-.734-1.212h-11.04c-.404 0-.733.543-.733 1.212 0 .668.329 1.212.733 1.212h4.417zm-1.031 10.832a1.844 1.844 0 00-1.839 1.844v13.968c0 1.017.825 1.845 1.84 1.845a1.844 1.844 0 001.839-1.845v-13.968a1.844 1.844 0 00-1.84-1.844zm-.88-10.9h1.834v12.506h-1.834zm2.126 28.602h5.477c.502 0 .91-.264.91-.59 0-.324-.408-.588-.91-.588h-13.69c-.502 0-.91.264-.91.589 0 .325.408.589.91.589h5.477z" />
              </svg>
            </ThemeIcon>
          </Paper>
          <Badge
            radius="sm"
            sx={{ color: theme.colors.gray[5], background: "transparent" }}
          >
            Match
          </Badge>
        </Group>
      </Group>
      <Group direction="column" spacing="md">
        <OrderCard
          title="Supplier #1"
          order="VB-30134"
          color="blue"
          lineItems={[
            {
              name: "Water Bottle",
              sku: "81310291",
              color: "cyan",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  viewBox="0 0 512 512"
                  xmlSpace="preserve"
                  width={28}
                  fill="currentColor"
                >
                  <path d="M348.379 192.121v-91.164c0-22.691-17.731-41.309-40.063-42.75V20.619C308.316 9.232 299.085 0 287.698 0h-63.395c-11.387 0-20.619 9.232-20.619 20.619v37.589c-22.333 1.442-40.063 20.059-40.063 42.75v91.164c0 9.555 6.509 17.568 15.326 19.907v49.355c-8.818 2.34-15.326 10.353-15.326 19.906v210.091c0 11.387 9.232 20.619 20.619 20.619h143.522c11.387 0 20.619-9.232 20.619-20.619V281.292c0-9.555-6.509-17.568-15.326-19.908v-49.355c8.817-2.34 15.324-10.353 15.324-19.908zM244.921 41.237h22.159v16.869h-22.159V41.237zm31.698 375.34c0 11.387-9.232 20.619-20.619 20.619s-20.619-9.232-20.619-20.619v-60.481c0-11.387 9.232-20.619 20.619-20.619s20.619 9.232 20.619 20.619v60.481zm15.197-155.903h-71.632v-47.933h71.632v47.933z" />
                </svg>
              ),
            },
          ]}
        />
        <Space
          sx={{
            height: 16.2,
            [theme.fn.largerThan("xs")]: {
              height: 22.2,
            },
          }}
        />
        <OrderCard
          title="Supplier #2"
          order="TS-72139"
          color="blue"
          lineItems={[
            {
              name: "Bike Pump",
              sku: "92346793",
              color: "red",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  viewBox="500.142 557.916 15.71 31.16"
                  xmlSpace="preserve"
                  width={13}
                  fill="currentColor"
                >
                  <path d="M509.15 560.44h4.416c.405 0 .734-.544.734-1.212 0-.669-.33-1.212-.734-1.212h-11.04c-.404 0-.733.543-.733 1.212 0 .668.329 1.212.733 1.212h4.417zm-1.031 10.832a1.844 1.844 0 00-1.839 1.844v13.968c0 1.017.825 1.845 1.84 1.845a1.844 1.844 0 001.839-1.845v-13.968a1.844 1.844 0 00-1.84-1.844zm-.88-10.9h1.834v12.506h-1.834zm2.126 28.602h5.477c.502 0 .91-.264.91-.59 0-.324-.408-.588-.91-.588h-13.69c-.502 0-.91.264-.91.589 0 .325.408.589.91.589h5.477z" />
                </svg>
              ),
            },
          ]}
        />
      </Group>
    </Group>
  );
};
