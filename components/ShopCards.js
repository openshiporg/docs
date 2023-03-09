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
  Badge,
  Drawer,
} from "@mantine/core";
import { useSSG } from "nextra/ssg";
import { PlatformCard } from "./PlatformCard";
import { PlatformAdder } from "./PlatformAdder";
import { IconAlertCircle } from "@tabler/icons";
import { Prism } from "@mantine/prism";
import { Callout } from "./Callout";
import { Papercups } from "@papercups-io/chat-widget";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

export const ShopCards = () => {
  const { shops } = useSSG();
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady || !router.query.install) return;
    const paramShop = shops.findIndex(
      ({ type }) => type === router.query.install
    );
    if (paramShop !== "-1") {
      setShopIndex(paramShop);
    }
  }, [router.isReady, router.query.install]);

  const [shopIndex, setShopIndex] = useState(null);
  const [showAlert, setShowAlert] = useState(true);
  const theme = useMantineTheme();
  const { theme: themeValue, setTheme, systemTheme } = useTheme();

  const InstallationGuides = {
    Shopify: (
      <Stack pt={4} spacing={0} mx={-16}>
        {/* <Text size="sm" p="md">
          Adding a Shopify shop to Openship can be done in 3 ways:
        </Text>
        <Divider /> */}
        <Accordion
          iconPosition="right"
          styles={(theme) => ({
            label: { fontSize: 16, fontWeight: 400, lineHeight: 1.2 },
            item: { fontSize: 14 },
            // itemOpened: {
            //   backgroundColor:
            //     theme.colors.gray[theme.colorScheme === "dark" ? 9 : 0],
            // },
          })}
        >
          <Accordion.Item label="Install the Openship app on the Shopify App Store">
            When adding the shop on Openship, choose <Code>SHOPIFY</Code> as the
            type and click Connect Shopify:
            <PlatformAdder
              title="Shop"
              PlatformForms={{
                shopify: {
                  label: "Shopify",
                  fields: [
                    {
                      title: "URL",
                      name: "shop",
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
                fee for each Shopify shop our users connect. Openship charges 1
                fee, allows unlimited shops, and supports e-commerce platforms
                outside of just Shopify. There are a pletora of apps in their
                app store that follow the same pricing model as us, but the
                playing field is not even.
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
            {/* Shopify has a great guide on how to create a custom app{" "}
            <a
              href="https://help.shopify.com/en/manual/apps/custom-apps"
              rel="noopener noreferrer"
              target="_blank"
            >
              here
            </a>
            . */}
            To create a custom app on Shopify, go to:
            <br />
            <br />
            <Code>https://your-domain.myshopify.com/admin/settings/apps</Code>
            <br />
            <br />
            And follow the video below:
            <Box
              component="video"
              sx={{ border: `3px solid black`, display: "block" }}
              width="100%"
              controls
              poster="https://brief.cleanshot.cloud/media/12376/HsOfjn7mSL1pZHzTIJ2JE15sDgJosDrIWF8pJuF3.mp4?"
              src="https://user-images.githubusercontent.com/34615258/187931728-73fda576-c76a-41cf-a346-ea45b456efb2.mp4"
            />
            <br />
            <br />
            When setting the API scopes, these are the ones Openship needs
            access to:
            <br />
            <Stack mt="sm" spacing="xs">
              {[
                "read_orders",
                "write_orders",
                "read_products",
                "write_products",
                "read_fulfillments",
                "write_fulfillments",
                "read_assigned_fulfillment_orders",
                "write_assigned_fulfillment_orders",
                "read_merchant_managed_fulfillment_orders",
                "write_merchant_managed_fulfillment_orders",
                "read_shopify_payments_disputes",
              ].map((scope) => (
                <Box key={scope}>
                  <Code>{scope}</Code>
                </Box>
              ))}
            </Stack>
            <br />
            Once you have the Admin API access token copied, add a shop on
            Openship, choose
            <Code>SHOPIFY CUSTOM</Code> as the shop type, choose a shop name,
            put your shopify domain as the domain, and Admin API access token
            under access token.
            <PlatformAdder
              title="Shop"
              PlatformForms={{
                shopifycustom: {
                  label: "Shopify Custom",
                  fields: [
                    {
                      title: "Name",
                      name: "name",
                      placeholder: "Central Bike Shop",
                    },
                    {
                      title: "Domain",
                      name: "domain",
                      placeholder: "centralbikeshop",
                      rightSection: ".myshopify.com",
                    },
                    {
                      title: "Access Token",
                      name: "accessToken",
                      placeholder: "supersecret",
                    },
                  ],
                  buttonText: "Create Shop",
                },
              }}
            />
          </Accordion.Item>
          <Accordion.Item
            label={
              <>
                Create a custom app on the Shopify Partner dashboard and add the
                credentials to <Code>.env</Code> file
              </>
            }
          >
            Take it one step further and allow users to install <i>your</i>{" "}
            Shopify app when they add a Shopify shop on your Openship instance.
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
            <Code>SHOP_SHOPIFY_API_KEY</Code> and{" "}
            <Code>SHOP_SHOPIFY_SECRET</Code> respectively.
            <Prism.Tabs mt="xl">
              <Prism.Tab label=".env" language="shell">
                {`SHOP_SHOPIFY_API_KEY=API_key
SHOP_SHOPIFY_SECRET=API_secret_key`}
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
    BigCommerce: (
      <Stack pt={4} spacing={0} mx={-16}>
        {/* <Text size="sm" p="md">
          Adding a Shopify shop to Openship can be done in 3 ways:
        </Text>
        <Divider /> */}
        <Accordion
          iconPosition="right"
          styles={(theme) => ({
            label: { fontSize: 16, fontWeight: 400, lineHeight: 1.2 },
            item: { fontSize: 14 },
            // itemOpened: {
            //   backgroundColor:
            //     theme.colors.gray[theme.colorScheme === "dark" ? 9 : 0],
            // },
          })}
        >
          <Accordion.Item label="Install the Openship app on the BigCommerce App Store">
            When adding the shop on Openship, choose <Code>BIGCOMMERCE</Code> as
            the type and click Connect BigCommerce:
            <PlatformAdder
              title="Shop"
              PlatformForms={{
                shopify: {
                  label: "BigCommerce",
                  fields: [
                    {
                      title: "URL",
                      name: "shop",
                      placeholder: "centralbikeshop",
                      // rightSection: ".mybigcommerce.com",
                    },
                  ],
                  buttonText: "Connect BigCommerce",
                },
              }}
              maxWidth={270}
            />
            This will take you to BigCommerce to install Openship.
          </Accordion.Item>
          <Accordion.Item
            label={
              <>
                Create a custom app on the BigCommerce Developer dashboard and
                add the credentials to <Code>.env</Code> file
              </>
            }
          >
            Take it one step further and allow users to install <i>your</i>{" "}
            BigCommerce app when they add a BigCommerce shop on your Openship
            instance.
            <br />
            <br />
            To accomplish this, you'll need a free{" "}
            <a
              href="https://partners.bigcommerce.com/English/"
              rel="noopener noreferrer"
              target="_blank"
            >
              BigCommerce Partner
            </a>{" "}
            account. After creating one, you'll need to create an app on the
            dashboard and get the API key and API secret key. You'll need to add
            this to your <Code>.env</Code> file as{" "}
            <Code>SHOP_BIGCOMMERCE_API_KEY</Code> and{" "}
            <Code>SHOP_BIGCOMMERCE_SECRET</Code> respectively.
            <Prism.Tabs mt="xl">
              <Prism.Tab label=".env" language="shell">
                {`SHOP_BIGCOMMERCE_API_KEY=API_key
SHOP_BIGCOMMERCE_SECRET=API_secret_key`}
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
      <Drawer
        opened={shops[shopIndex]}
        onClose={() => setShopIndex(null)}
        title={
          <Group align="center" spacing="xl">
            <Text
              weight={700}
              size="md"
              sx={{ textTransform: "uppercase" }}
              color="gray"
            >
              {shops[shopIndex]?.type}{" "}
            </Text>
            <Badge size="xs" color="teal" radius="sm" mt={1}>
              Installation Guide
            </Badge>
            {/* <Badge radius="xs" size="sm" variant="outline" mt={2}>
              3 Options
            </Badge> */}
          </Group>
        }
        size="lg"
        position="right"
        padding="md"
        sx={{ overflow: "scroll" }}
        styles={{
          header: {
            marginLeft: -16,
            marginRight: -16,
            marginBottom: 0,
            marginTop: -16,
            padding: 16,
            background: themeValue === "light" ? "#ffffff" : "#000000",
            borderBottom: `1px solid ${
              themeValue === "light"
                ? theme.colors.gray[3]
                : theme.colors.gray[8]
            }`,
          },
          drawer: { overflow: "scroll" },
        }}
      >
        {InstallationGuides[shops[shopIndex]?.type]}
      </Drawer>
      <Stack mt="xl">
        {shops.map((shop, index) => (
          <PlatformCard
            {...shop}
            key={shop.id}
            onClick={() => shop.stage === "DONE" && setShopIndex(index)}
          />
        ))}
      </Stack>
    </>
  );
};
