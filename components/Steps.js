import { Badge, List, Text, useMantineTheme } from "@mantine/core";
import themeConfig from "../theme.config";

export function Steps({ steps }) {
  return (
    <List type="ordered" size="md" withPadding mt="lg" mb={50} ml="xl">
      {steps.map(({ text, badge, href }) => (
        <List.Item
          key={href}
          mb={10}
          // icon={
          //   <ThemeIcon
          //     variant="light"
          //     color="dark"
          //     size="xs"
          //     sx={{ background: "transparent" }}
          //   >
          //     {index + 1}.
          //   </ThemeIcon>
          // }
        >
          {/* <Group spacing="sm"> */}
          <Badge radius="xs" size="sm" color={badge.color} mr="md" ml="sm">
            {badge.text}
          </Badge>
          <Text
            weight={500}
            component="a"
            href={href}
            sx={(theme) => ({
              color: theme.colors.gray[theme.colorScheme === "dark" ? 3 : 7],
              ":hover": {
                // textDecoration: "underline",
                color: theme.colors.blue[theme.colorScheme === "dark" ? 4 : 5],
              },
            })}
          >
            {text}
          </Text>
          {/* </Group> */}
        </List.Item>
      ))}
    </List>
  );
}
