import {
  Box,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core";
import { GrayPaper } from "./Graypaper";

export function OrderCard({ title, order, lineItems, tracking, color }) {
  const theme = useMantineTheme();

  return (
    <Box>
      <GrayPaper
        p={5}
        sx={{
          [theme.fn.largerThan("xs")]: {
            padding: 8,
          },
        }}
      >
        <Box>
          <Box
            withBorder
            sx={{
              flex: 1,
            }}
            shadow="xs"
          >
            <Box px={4} pb={4}>
              <Stack spacing={0} sx={{ flexWrap: "wrap" }}>
                <Text
                  color={
                    theme.colorScheme === "light"
                      ? theme.colors.gray[7]
                      : theme.colors.gray[0]
                  }
                  sx={{
                    textTransform: "uppercase",
                    // color: ({ palette }) => palette.purple[400],
                    fontWeight: 600,
                    letterSpacing: "0.06rem",
                    width: "100%",
                    color: theme.colors[color][6],
                    fontSize: 12,
                    [theme.fn.largerThan("xs")]: {
                      fontSize: 16,
                    },
                  }}
                >
                  {title}
                </Text>
                <Text
                  sx={{
                    marginBottom: "auto",
                    fontSize: 10,
                    [theme.fn.largerThan("xs")]: {
                      fontSize: 14,
                    },
                  }}
                  // size="sm"
                  weight={500}
                  color={
                    theme.colorScheme === "light"
                      ? theme.colors.gray[6]
                      : theme.colors.gray[3]
                  }
                >
                  Order {order}
                </Text>
              </Stack>
            </Box>
          </Box>
          {lineItems.map(({ name, sku, icon, color }) => (
            <Paper key={name}
              withBorder
              sx={{
                flex: 1,
              }}
              // shadow="xs"
              mt={5}
              pl={5}
              py={5}
              pr="md"
            >
              <Group spacing="xs">
                <ThemeIcon
                  variant="light"
                  color={color}
                  size="xl"
                  p={3}
                  sx={{
                    flex: 1,
                    width: 30,
                    height: 30,
                    minWidth: 30,
                    minHeight: 30,

                    [theme.fn.largerThan("xs")]: {
                      width: 40,
                      height: 40,
                      minWidth: 40,
                      minHeight: 40,
                    },
                  }}
                >
                  {icon}
                </ThemeIcon>
                <Group direction="column" spacing={0} sx={{ flex: 4 }}>
                  <Text
                    sx={{
                      fontSize: 11,
                      [theme.fn.largerThan("xs")]: {
                        fontSize: 16,
                      },
                    }}
                  >
                    {name}
                  </Text>
                  <Text
                    sx={{
                      fontSize: 8,
                      [theme.fn.largerThan("xs")]: {
                        fontSize: 12,
                      },
                    }}
                    // size="xs"
                    color="dimmed"
                  >
                    SKU: {sku}
                  </Text>
                </Group>
              </Group>
            </Paper>
          ))}
        </Box>
      </GrayPaper>
      {tracking && tracking.map((a) => a)}
    </Box>
  );
}
