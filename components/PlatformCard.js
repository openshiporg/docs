import React, { useState } from "react";
import {
  Box,
  useMantineTheme,
  Paper,
  Button,
  Badge,
  Popover,
  Tooltip,
  Stack,
  Text,
  Group,
  ActionIcon,
  Collapse,
  List,
  Code,
} from "@mantine/core";
import Image from "next/image";
import { IconArrowUpRight, IconExternalLink } from "@tabler/icons";
import { CheckIcon, GlobeIcon } from "@primer/octicons-react";
import { GrayPaper } from "./Graypaper";

export function PlatformCard({
  id,
  stage,
  type,
  image,
  upvotes,
  website,
  color = "teal",
  endpoint,
  onClick,
}) {
  const [upvoteState, setUpvotes] = useState(upvotes);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [opened, setOpened] = useState(false);

  const theme = useMantineTheme();
  return (
    <>
      <Paper
        withBorder
        p="xs"
        sx={{
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[7]
              : theme.fn.lighten(theme.colors.blueGray[0], 0.8),
        }}
      >
        <Group>
          <Button
            // variant="light"
            size="sm"
            // radius="lg"
            // type="unset"
            variant={"light"}
            color={color}
            sx={{
              height: 50,
              width: 50,
              border: `1px solid ${
                theme.colors[color][theme.colorScheme === "dark" ? 9 : 1]
              }`,
              background: theme.fn.rgba(
                theme.colors[color][theme.colorScheme === "dark" ? 9 : 0],
                theme.colorScheme === "dark" ? 0.25 : 0.3
              ),
              boxShadow: !disabled && theme.shadows.xs,
              paddingLeft: 0,
              paddingRight: 0,
              // opacity: type !== "Shopify" && 0.7,
            }}
            // styles={{
            //   leftIcon: { marginRight: 4, marginTop: 1 },
            // }}
            // onClick={(e) => {
            //   e.stopPropagation();
            // }}
            onClick={async () => {
              setLoading(true);
              // onClick();
              // await fetch(endpoint, {
              //   method: "POST",
              //   headers: {
              //     "Content-type": "application/json",
              //   },
              //   body: JSON.stringify({
              //     id,
              //     upvotes: upvoteState,
              //   }),
              // });
              setDisabled(true);
              setUpvotes(upvoteState + 1);
              setLoading(false);
            }}
            loading={loading}
            disabled={disabled}
          >
            {stage === "DONE" ? (
              <CheckIcon size={20} />
            ) : (
              <Stack align={"center"} spacing={4}>
                <Box sx={{ width: 15, height: 15 }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fill="currentColor" d="M15,14H5l5-9L15,14z" />
                  </svg>
                </Box>
                <Text size="sm">{upvoteState}</Text>
              </Stack>
            )}
          </Button>
          <Stack spacing={0} sx={{ flex: 1 }}>
            <Group
              spacing={0}
              sx={{ justifyContent: "space-between", alignItems: "flex-start" }}
            >
              <Group spacing="xs" sx={{ alignItems: "flex-start" }}>
                <Text weight={500} sx={{lineHeight: 1}}>{type}</Text>
                <Text size="xl" mt={-1} sx={{lineHeight: 1}}>·</Text>
                <Badge
                  size="sm"
                  variant={stage === "DONE" ? "light" : "outline"}
                  color={color}
                >
                  {stage === "DONE" ? "READY" : stage}
                </Badge>
                <Text size="xl" mt={-1} sx={{lineHeight: 1}}>·</Text>
                <Button
                  component="a"
                  href={website}
                  rel="noopener noreferrer"
                  target="_blank"
                  variant="light"
                  compact
                  size="xs"
                  color="gray"
                  rightIcon={<IconArrowUpRight size={12} />}
                >
                  <Box
                    sx={{
                      // display: "flex",
                      // height: 100,
                      width: 14,
                      // opacity: stage !== "DONE" && 0.4,
                    }}
                  >
                    <Image
                      alt={`${type} photo`}
                      src={image}
                      width="100%"
                      height="100%"
                    />
                  </Box>
                </Button>
                {/* <Button
              component="a"
              href={website}
              rel="noopener noreferrer"
              variant="subtle"
              compact
              size="sm"
              leftIcon={<IconArrowUpRight size={12} />}
            >
              Website
            </Button> */}
              </Group>
              {stage === "DONE" && (
                <Group spacing={"xs"}>
                  {/* <Button
                    color="indigo"
                    variant="subtle"
                    compact
                    size="xs"
                    onClick={onClick}
                  >
                    Installation Guide
                  </Button> */}
                  <Text
                    variant="link"
                    onClick={onClick}
                    size="xs"
                    mb={4}
                    sx={{ cursor: "pointer" }}
                  >
                    Installation Guide
                  </Text>
                </Group>
              )}
            </Group>
            <Text color="dimmed" size="sm">
              Connect {type} to streamline order fulfillment
            </Text>
          </Stack>
        </Group>
      </Paper>
    </>
  );
}
