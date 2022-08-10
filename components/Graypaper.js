import { Paper, useMantineTheme } from "@mantine/core";

export const GrayPaper = ({ children, sx, p = "md", ...rest }) => {
  const theme = useMantineTheme();
  return (
    <Paper
      shadow="xs"
      radius="md"
      p={p}
      withBorder
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[8]
            : theme.fn.lighten(theme.colors.gray[0], 0.4),
        color:
          theme.colorScheme === "dark"
            ? theme.colors.dark[3]
            : theme.colors.gray[7],
        ...sx,
      })}
      {...rest}
    >
      {children}
    </Paper>
  );
};
