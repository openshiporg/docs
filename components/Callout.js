import { Notification, useMantineTheme } from "@mantine/core";

export function Callout({ color, title, body, mt = "lg" }) {
  const theme = useMantineTheme();
  return (
    <Notification
      color={color}
      mt={mt}
      sx={{
        boxShadow: theme.shadows.xs,
        // background:
        //   theme.colorScheme === "dark"
        //     ? theme.colors.gray[0]
        //     : theme.fn.lighten(theme.colors.blueGray[0], .2),
      }}
      styles={{
        // description: {
        //   color: theme.colors.blueGray[theme.colorScheme === "dark" ? 0 : 5],
        // },
        closeButton: { display: "none" },
      }}
      title={title}
    >
      {body}
    </Notification>
  );
}
