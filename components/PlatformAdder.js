import { useState } from "react";
import {
  Text,
  useMantineTheme,
  Box,
  Select,
  Modal,
  Paper,
  Center,
  Divider,
  Button,
  TextInput,
  Stack,
} from "@mantine/core";

export const PlatformAdder = ({
  title = "Channel",
  PlatformForms = {
    demo: {
      label: "Demo",
      fields: [
        {
          title: "Name",
          name: "name",
          placeholder: `Demo ${title}`,
        },
      ],
      buttonText: `Create ${title}`,
    },
  },
  maxWidth = 250,
}) => {
  const theme = useMantineTheme();
  const [type, setType] = useState(Object.keys(PlatformForms)[0]);

  return (
    <Center>
      <Paper sx={{ maxWidth }} withBorder my="lg" shadow="xs">
        <Text
          weight={600}
          size="sm"
          color="gray"
          px="sm"
          pt={5}
          pb={4}
          sx={{
            background:
              theme.colorScheme === "light"
                ? theme.colors.blueGray[0]
                : theme.colors.dark[7],
          }}
        >
          Create {title}
        </Text>
        <Divider size={0.5} />
        <Stack spacing="xs" p="xs">
          <Select
            label={`${title} Type`}
            value={type}
            onChange={(value) => {
              setType(value);
            }}
            data={Object.keys(PlatformForms).map((key) => ({
              value: key,
              label: PlatformForms[key].label,
            }))}
            styles={{
              root: {
                position: "relative",
              },

              input: {
                fontWeight: 600,
                color:
                  theme.colorScheme === "light"
                    ? theme.colors.cyan[7]
                    : theme.colors.dark[0],
                height: "auto",
                paddingTop: 18,
                paddingLeft: 13,
                border: `1px solid ${
                  theme.colors.blueGray[theme.colorScheme === "dark" ? 7 : 2]
                }`,
                boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                // fontSize: "16px !important",
                textTransform: "uppercase",
                background:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[5]
                    : theme.fn.lighten(theme.colors.blueGray[0], 0.5),
                "&:focus, &:focus-within": {
                  outline: "none",
                  borderColor: `${
                    theme.colors[theme.primaryColor][
                      theme.colorScheme === "dark" ? 8 : 5
                    ]
                  } !important`,
                },
              },

              required: {
                display: "none",
                // ":before": { marginLeft: "auto", content: '" required"' },
              },

              error: {
                fontSize: 14,
              },

              label: {
                position: "absolute",
                pointerEvents: "none",
                color:
                  theme.colors.blueGray[theme.colorScheme === "dark" ? 2 : 6],
                fontSize: theme.fontSizes.xs,
                paddingLeft: 14,
                paddingTop: 6,
                zIndex: 1,
              },
              item: {
                fontWeight: 600,
                marginTop: 3,
                textTransform: "uppercase",
              },
            }}
            size="sm"
          />
          <Form {...PlatformForms[type]} />
        </Stack>
      </Paper>
    </Center>
  );
};

export const Form = ({ label, fields, metafields, buttonText }) => {
  const theme = useMantineTheme();

  return (
    <>
      {fields.map(({ name, title, placeholder, rightSection }) => (
        <TextInput
          placeholder={placeholder}
          label={title}
          sx={{ overflow: "hidden" }}
          rightSection={rightSection}
          rightSectionWidth={140}
          size="sm"
          styles={{
            rightSection: {
              width: 120,
              color:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[9]
                  : theme.colors.blueGray[5],

              top: 20,
              bottom: 1,
              borderTopRightRadius: 4,
              borderBottomRightRadius: 4,
            },
          }}
        />
      ))}
      {metafields && (
        <Paper
          p="xs"
          withBorder
          mt="md"
          sx={{
            background:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.blueGray[1],
          }}
        >
          <Stack px={3} spacing={0}>
            <Text
              weight={500}
              size="xs"
              color={
                theme.colors.blueGray[theme.colorScheme === "dark" ? 3 : 7]
              }
              transform="uppercase"
            >
              {label} fields
            </Text>
          </Stack>
          {metafields.map(
            ({ name, title, placeholder, rightSection }, index) => (
              <TextInput
                placeholder={placeholder}
                label={title}
                sx={{ overflow: "hidden" }}
                rightSection={rightSection}
                rightSectionWidth={140}
                size="sm"
                styles={{
                  rightSection: {
                    width: 140,
                    color:
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[9]
                        : theme.colors.blueGray[5],

                    top: 20,
                    bottom: 1,
                    borderTopRightRadius: 4,
                    borderBottomRightRadius: 4,
                  },
                }}
              />
            )
          )}
        </Paper>
      )}
      <Box sx={{ display: "flex", width: "100%" }}>
        <Button
          // color="indigo"
          type="submit"
          uppercase
          // variant="light"
          fullWidth
          ml="auto"
          size="sm"
          variant="gradient"
          gradient={{
            from: theme.colors.indigo[5],
            to: theme.colors.indigo[9],
            deg: 135,
          }}
          sx={{
            fontWeight: 700,
            letterSpacing: 0.6,
            //   border: `1px solid ${
            //     theme.colorScheme === "light" && theme.colors.green[1]
            //   }`,
            boxShadow: theme.shadows.xs,
          }}
        >
          {buttonText}
        </Button>
      </Box>
    </>
  );
};
