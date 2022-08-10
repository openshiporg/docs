import React, { useState } from "react";
import {
  Box,
  Group,
  ActionIcon,
  useMantineTheme,
  Popper,
  Paper,
  Code,
  Button,
  Text,
  Center,
} from "@mantine/core";
import crypto from "crypto";
import { KeyIcon, CopyIcon, SyncIcon, CheckIcon } from "@primer/octicons-react";
import { useClipboard } from "@mantine/hooks";

export function KeyPopper({ buttonColor, buttonBorder }) {
  const [referenceElement, setReferenceElement] = useState(null);
  const [value, setValue] = useState(null);
  const [visible, setVisible] = useState(true);
  const theme = useMantineTheme();
  const clipboard = useClipboard({ timeout: 1000 });

  async function createKey() {
    setValue(crypto.randomBytes(8).toString("hex"));
  }

  return (
    <Center ml={-200} mt="lg">
      <ActionIcon
        ref={setReferenceElement}
        variant="light"
        color={buttonColor}
        sx={{
          border:
            buttonBorder &&
            `1px solid ${
              theme.colors.gray[theme.colorScheme === "dark" ? 9 : 3]
            }`,
          // boxShadow: theme.shadows.xs,
        }}
        onClick={() => setVisible((m) => !m)}
        type="unset"
      >
        <KeyIcon />
      </ActionIcon>

      <Popper
        position="right"
        placement="center"
        mounted={visible}
        referenceElement={referenceElement}
        transition="pop-top-left"
        transitionDuration={200}
      >
        <Paper
          // style={{
          //   backgroundColor:
          //     theme.colorScheme === "dark"
          //       ? theme.colors.dark[5]
          //       : theme.colors.gray[1],
          // }}
          shadow="xs"
          withBorder
          sx={{ pointerEvents: "all" }}
          p={2}
        >
          {value ? (
            <Group spacing={0}>
              <Code>
                <Group spacing="xs" pl={4}>
                  {value}
                  <ActionIcon
                    // variant="light"
                    // color="blue"
                    size="sm"
                    sx={{
                      border:
                        buttonBorder &&
                        `1px solid ${
                          theme.colors.gray[
                            theme.colorScheme === "dark" ? 9 : 3
                          ]
                        }`,
                      // boxShadow: theme.shadows.xs,
                    }}
                    color="blue"
                    onClick={() => clipboard.copy(value)}
                  >
                    {clipboard.copied ? (
                      <CheckIcon size={10} />
                    ) : (
                      <CopyIcon size={10} />
                    )}
                  </ActionIcon>
                </Group>
              </Code>

              <ActionIcon
                ml={6}
                variant="light"
                color="red"
                size="sm"
                sx={{
                  border:
                    buttonBorder &&
                    `1px solid ${
                      theme.colors.gray[theme.colorScheme === "dark" ? 9 : 3]
                    }`,
                  // boxShadow: theme.shadows.xs,
                }}
                onClick={async () => await createKey()}

                // onClick={() =>
                //   modals.openConfirmModal({
                //     title: (
                //       <Text
                //         weight={600}
                //         size="xl"
                //         // transform="uppercase"
                //         color="gray"
                //         sx={
                //           {
                //             // fontWeight: 700,
                //             // letterSpacing: 0.6,
                //           }
                //         }
                //       >
                //         Regenerate Key
                //       </Text>
                //     ),
                //     centered: true,
                //     children: (
                //       <Text size="sm">
                //         Are you sure you want to regenerate this key? This
                //         action will invalidate your previous key and any
                //         applications using the previous key will need to be
                //         updated.
                //       </Text>
                //     ),
                //     labels: {
                //       confirm: "Regenerate Key",
                //       cancel: "No don't regenerate it",
                //     },
                //     confirmProps: { color: "red" },
                //     // onCancel: () => console.log("Cancel"),
                //     onConfirm: createKey,
                //   })
                // }
              >
                <SyncIcon size={12} />
              </ActionIcon>
            </Group>
          ) : (
            <Button
              color="teal"
              variant="light"
              compact
              leftIcon={<SyncIcon size={12} />}
              onClick={async () => await createKey()}
            >
              GENERATE KEY
            </Button>
          )}

          {/* <ActionIcon
              ref={setReferenceElement}
              variant="light"
              color={buttonColor}
              sx={{
                border:
                  buttonBorder &&
                  `1px solid ${
                    theme.colors.gray[theme.colorScheme === "dark" ? 9 : 3]
                  }`,
                // boxShadow: theme.shadows.xs,
              }}
              onClick={() => setVisible((m) => !m)}
            >
              <CopyIcon />
            </ActionIcon> */}
        </Paper>
      </Popper>
    </Center>
  );
}
