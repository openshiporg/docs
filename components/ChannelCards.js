import { useState } from "react";
import {
  Stack,
  Modal,
  Accordion,
  Text,
  Divider,
  Code,
  Alert,
  List,
  Group,
  Button,
  Collapse,
  Box,
  useMantineTheme,
} from "@mantine/core";
import { useSSG } from "nextra/ssg";
import { PlatformCard } from "./PlatformCard";
import { PlatformAdder } from "./PlatformAdder";
import { IconAlertCircle } from "@tabler/icons";
import { Prism } from "@mantine/prism";
import { Callout } from "./Callout";
import { Papercups } from "@papercups-io/chat-widget";

export const ChannelCards = () => {
  const { channels } = useSSG();
  const [channelIndex, setChannelIndex] = useState(null);
  const [showAlert, setShowAlert] = useState(true);
  const theme = useMantineTheme();

  const InstallationGuides = {
    Shopify: (
      <Stack m={-20} pt={4} spacing={0}>
        <Text size="sm" p="md">
          Adding a Shopify channel to Openship can be done in 3 ways:
        </Text>
        <Divider />
        <Accordion
          iconPosition="right"
          styles={(theme) => ({
            label: { fontSize: 14, fontWeight: 500, lineHeight: 1.2 },
            item: { fontSize: 14 },
            itemOpened: {
              backgroundColor:
                theme.colors.gray[theme.colorScheme === "dark" ? 9 : 0],
            },
          })}
        >
          <Accordion.Item label="Install the Openship app on the Shopify App Store">
            When adding the channel on Openship, choose <Code>SHOPIFY</Code> as
            the type and click Connect Shopify:
            <PlatformAdder
              title="Channel"
              PlatformForms={{
                shopify: {
                  label: "Shopify",
                  fields: [
                    {
                      title: "URL",
                      name: "domain",
                      placeholder: "centralbikeshop",
                      rightSection: ".myshopify.com",
                    },
                  ],
                  buttonText: "Connect Shopify",
                },
              }}
            />
            This will take you to Shopify to install Openship.
            <Alert
              icon={<IconAlertCircle size={16} />}
              title={
                <Group>
                  Openship's App Status
                  <Button
                    compact
                    color="gray"
                    size="xs"
                    variant="subtle"
                    ml="auto"
                    weight={400}
                    onClick={() => setShowAlert((o) => !o)}
                  >
                    {showAlert ? "Hide" : "Show"}
                  </Button>
                </Group>
              }
              color="red"
              mt="xl"
              size="lg"
              pb={5}
              // variant="outline"
              sx={{
                border: `1px solid ${
                  theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]
                }`,
                boxShadow: theme.shadows.xs,
              }}
              styles={{ label: { width: "100%" } }}
            >
              <Collapse in={showAlert} pb="sm">
                When you install Openship on Shopify, you'll notice the app is
                unlisted.
                <br />
                <br />
                This is due to our pricing model. Shopify wants us to charge a
                fee for each Shopify channel our users connect. Openship charges
                1 fee, allows unlimited channels, and supports e-commerce
                platforms outside of just Shopify. There are a pletora of apps
                in their app store that follow the same pricing model as us, but
                the playing field is not even.
                <br />
                <br />
                This wasn't an issue since unlisted apps could still be
                installed, but Shopify is removing this ability. They're forcing
                all apps to be installed from their App Store, adhere to their
                set pricing structure, while making exceptions for some apps
                along the way.
                <br />
                <br />
                Thankfully, installing this application is not the only way to
                use Shopify on Openship. You can create a custom app on your
                shop admin or create an app on the Shopify Partner dashboard.
                Read below to learn how.
              </Collapse>
            </Alert>
          </Accordion.Item>
          <Accordion.Item
            label="Create a custom app on your shop admin and add the credentials on
                Openship"
          >
            Shopify has a great guide on how to create a custom app{" "}
            <a
              href="https://help.shopify.com/en/manual/apps/custom-apps"
              rel="noopener noreferrer"
              target="_blank"
            >
              here
            </a>
            .
            <br />
            <br />
            When setting the API scopes, these are the ones Openship needs
            access to:
            <br />
            <Stack mt="sm" spacing="xs">
              {[
                "write_orders",
                "write_products",
                "read_orders",
                "read_products",
                "read_fulfillments",
                "write_fulfillments",
                "write_draft_orders",
                "read_assigned_fulfillment_orders",
                "write_assigned_fulfillment_orders",
                "read_merchant_managed_fulfillment_orders",
                "write_merchant_managed_fulfillment_orders",
                "read_shopify_payments_disputes",
              ].map((scope) => (
                <Box>
                  <Code>{scope}</Code>
                </Box>
              ))}
            </Stack>
            <br />
            Once the custom app is created, Shopify will give you the option to
            install it on your shop. After you install it, you will need the
            Admin API access token. Shopify will only reveal it to you once.
            <br />
            <br />
            Once you have it, add a channel on Openship, choose
            <Code>SHOPIFY CUSTOM</Code> as the channel type, choose a channel
            name, put your shopify domain as the domain, and Admin API access
            token under access token.
            <PlatformAdder
              title="Channel"
              PlatformForms={{
                shopifycustom: {
                  label: "Shopify Custom",
                  fields: [
                    {
                      title: "Name",
                      name: "name",
                      placeholder: "Bike Tire Wholesale",
                    },
                    {
                      title: "Domain",
                      name: "domain",
                      placeholder: "biketires",
                      rightSection: ".myshopify.com",
                    },
                    {
                      title: "Access Token",
                      name: "accessToken",
                      placeholder: "supersecret",
                    },
                  ],
                  buttonText: "Create Channel",
                },
              }}
            />
          </Accordion.Item>
          <Accordion.Item
            label={
              <>
                Create a custom app on the Shopify Partner dashboard and add
                credentials to <Code>.env</Code> file
              </>
            }
          >
            Take it one step further and allow users to install <i>your</i>{" "}
            Shopify app when they add a Shopify channel on Openship.
            <br />
            <br />
            To accomplish this, you'll need a free{" "}
            <a
              href="https://www.shopify.com/partners"
              rel="noopener noreferrer"
              target="_blank"
            >
              Shopify Partners
            </a>{" "}
            account. After creating one, you'll need to create an app on the
            dashboard and get the API key and API secret key. You'll need to add
            this to your <Code>.env</Code> file as{" "}
            <Code>CHANNEL_SHOPIFY_API_KEY</Code> and{" "}
            <Code>CHANNEL_SHOPIFY_SECRET</Code> respectively.
            <Prism.Tabs mt="xl">
              <Prism.Tab label=".env" language="shell">
                {`CHANNEL_SHOPIFY_API_KEY=API_key
CHANNEL_SHOPIFY_SECRET=API_secret_key`}
              </Prism.Tab>
            </Prism.Tabs>
            <Callout
              mt="sm"
              color="blue"
              body={
                <Text size="sm">
                  If you're using Openship Cloud,{" "}
                  <Text
                    variant="link"
                    component="a"
                    size="sm"
                    onClick={Papercups.toggle}
                    style={{ cursor: "pointer" }}
                  >
                    get in touch
                  </Text>{" "}
                  and we'll add these variables to your instance.
                </Text>
              }
            />
          </Accordion.Item>
        </Accordion>
      </Stack>
    ),
  };

  return (
    <>
      <Modal
        opened={channels[channelIndex]}
        onClose={() => setChannelIndex(null)}
        title={`Adding a ${channels[channelIndex]?.type} channel`}
      >
        {InstallationGuides[channels[channelIndex]?.type]}
      </Modal>
      <Stack mt="xl">
        {channels.map((channel, index) => (
          <PlatformCard
            {...channel}
            color="indigo"
            onClick={() => channel.stage === "DONE" && setChannelIndex(index)}
          />
        ))}
      </Stack>
    </>
  );
};
