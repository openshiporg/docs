import { Box, Group, ThemeIcon, useMantineTheme } from "@mantine/core";

export function Connector({ degrees, icon, bg = "#0f1134" }) {
  const theme = useMantineTheme();

  return (
    <Group spacing={0} sx={{ transform: `rotate(${degrees}deg)` }}>
      <Box
        sx={{
          height: 3,
          background: theme.fn.linearGradient(
            45,
            theme.colors.green[5],
            theme.colors.green[9]
          ),
          flex: 1,
          // transform: `rotate(-${degrees}deg)`,
        }}
      />
      <Group
        direction="column"
        align={"center"}
        spacing={4}
        sx={{ transform: `rotate(${degrees * -1}deg)` }}
      >
        <ThemeIcon
          variant="outline"
          radius="xl"
          sx={{
            background: bg,
            color: "#fff",
            border: `2px solid ${theme.colors.gray[5]}`,
          }}
        >
          {icon}
        </ThemeIcon>
        {/* <Text
              sx={{
                textTransform: "uppercase",
                fontWeight: 700,
                letterSpacing: "0.06rem",
                width: "100%",
                color: theme.colors.cyan[6],
              }}
              size="xs"
            >
              Match
            </Text> */}
      </Group>
      <Box
        sx={{
          height: 3,
          background: theme.fn.linearGradient(
            45,
            theme.colors.blue[9],
            theme.colors.blue[5]
          ),
          flex: 1,
          // transform: `rotate(-${degrees}deg)`,
        }}
      />
    </Group>
  );
}
