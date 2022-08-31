import { useState } from "react";
import Image from "next/image";
import { patterns } from "./Patterns";
import { Box, Stack, Text, useMantineTheme } from "@mantine/core";

export const Video = ({ videoId }) => {
  const [showVideo, setShowVideo] = useState(false);
  const theme = useMantineTheme();
  return (
    <Box sx={{ width: "100%", overflow: "hidden" }} mt={20}>
      {showVideo ? (
        <Box sx={{ aspectRatio: "16 / 9", width: "100%" }}>
          <Box
            component="video"
            sx={{
              border: `4px solid ${theme.colors.dark[7]}`,
              borderRadius: 4,
            }}
            width="100%"
            poster="https://brief.cleanshot.cloud/media/12376/TNqapKGuK8n35bMpMWXMRHHeCsugPIrBwf261XKg.mp4?"
            controls
          >
            <source
              src="https://media.cleanshot.cloud/media/12376/TNqapKGuK8n35bMpMWXMRHHeCsugPIrBwf261XKg.mp4?Expires=1661931989&Signature=EuGKc3BSCbNu5uiq1hryTIQl4AJMjZ4eGM~1suk7nHOJlz55mSZzU1lzCGA3LPrCpakLDy7ft-5S-5mpPodkNaPbmLHtAxi9jV3g1QjG~inBl11zgrxG7ocMEK9-9Y7Pcb~nB0fXv1SBzNyRQvwsmalzJduor~x735P03p6G6ER-4yw~1wt7yR8M-OYUF7NXGEHqKRhq5vATyE5dQ3RHLU67W~ROnU10zS1ujS3LDIC4Av88oX6FvOPQOButicLwel3vKzbtGWjAumSFIdlHkIP5677ztjXuIk7lsXGDP~huHVriJfvTkWdV~-LqVKw44AkNMsES-WqSSx~JxwqJvg__&Key-Pair-Id=K269JMAT9ZF4GZ"
              type="video/mp4"
            />
          </Box>
        </Box>
      ) : (
        <Box sx={{ position: "relative" }}>
          <div
            style={{
              borderRadius: 4,
              width: "100%",
              height: 523,
              backgroundColor: "rgb(15, 23, 42)",
              backgroundImage: patterns({
                FILLCOLOR: "#000",
                FILLOPACITY: 1,
              }).topography,
            }}
          />

          <Stack
            align={"center"}
            mt={120}
            sx={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
          >
            <span style={{ width: "35%", color: "#fff", marginBottom: 12 }}>
              <svg viewBox="0 180 495 110">
                <path
                  d="M363.113 225.168v34.25h4.485l.059-14.875.059-14.875.378-1.333c4.174-14.693 22.894-17.61 29.026-4.524 1.598 3.409 1.653 4.117 1.656 21.315l.003 14.292h4.334l-.001-15.292c0-18.154-.014-18.293-2.181-22.592-6.398-12.687-24.211-14.177-32.297-2.701l-.938 1.331-.043-14.623-.042-14.623h-4.498v34.25m58.255-33.16c-3.029 1.152-2.963 5.483.098 6.5 2.973.987 5.588-2.148 4.105-4.923-.76-1.423-2.698-2.15-4.203-1.577m-91.136 19.258c-10.35 1.515-16.239 12.834-10.094 19.403 2.404 2.569 5.247 4.08 10.808 5.745 7.354 2.201 10.19 3.454 12.148 5.368 3.745 3.66 1.265 10.937-4.498 13.203-3.121 1.228-8.388 1.342-11.109.24-2.793-1.131-4.367-2.164-6.672-4.379l-1.722-1.656-1.684 1.684-1.684 1.683.693.828c.711.849 2.302 2.209 3.778 3.229 11.074 7.656 26.697 3.412 28.849-7.836 1.477-7.719-2.752-12.598-13.599-15.691-10.536-3.003-13.267-4.896-13.234-9.169.069-8.786 13.141-11.463 20.564-4.21 1.897 1.854 1.434 1.871 3.423-.128l1.664-1.67-1.417-1.345c-1.304-1.237-3.41-2.697-4.833-3.35-1.965-.902-2.538-1.132-3.611-1.449-2.162-.64-5.393-.847-7.77-.5m131.297.076c-5.072.853-10.561 4.334-13.746 8.716-.41.565-.804 1.027-.875 1.027-.071 0-.129-2.025-.129-4.5v-4.5h-4.5v68.176l2.209-.046 2.208-.047.083-14.917.084-14.916.956 1.269c10.248 13.603 29.494 11.074 37.031-4.867 8.195-17.335-5.661-38.365-23.321-35.395m-351.504.742c-15.57 2.77-24.614 19.791-17.977 33.832 8.692 18.388 33.913 18.949 43.479.967 9.126-17.155-6.307-38.213-25.502-34.799m60.171-.067c-3.553.629-8.208 2.874-10.785 5.203-.896.809-.965.663-.965-2.064v-2.41l-4.792.044-4.791.045v66.666h9.5l.041-12.5c.023-6.875.079-12.6.125-12.722.057-.151.418.068 1.125.683 14.482 12.585 36.608 1.048 36.525-19.044-.046-11.341-6.423-20.026-17.233-23.469-2.092-.666-6.262-.872-8.75-.432m55.083-.178c-.137.027-.812.137-1.5.244-11.226 1.747-19.693 11.758-19.737 23.335-.062 16.186 14.997 27.977 30.64 23.991 2.622-.668 6.26-2.422 8.971-4.324 1.588-1.115 4.793-4.148 4.793-4.536 0-.12-1.377-1.593-3.059-3.274l-3.059-3.055-.732.807c-6.32 6.976-15.075 8.456-21.983 3.716-2.847-1.953-5.834-6.594-5.834-9.065 0-.234 1.824-.26 18.066-.26 16.543 0 18.074-.023 18.17-.272.057-.149.187-1.03.289-1.958 1.559-14.207-8.56-25.541-22.691-25.416-1.146.01-2.196.04-2.334.067m56.334.167c-3.486.625-7 2.269-9.857 4.611-.425.349-.817.634-.87.634-.053 0-.118-.993-.143-2.208l-.047-2.208-4.792-.045-4.791-.044v46.51l4.791-.044 4.792-.044.097-14.25c.06-8.859.161-14.502.268-14.917.42-1.641.612-2.21 1.076-3.191 3.937-8.333 16.619-8.509 20.629-.286 1.142 2.343 1.082 1.437 1.177 17.811l.086 14.833 4.792.044 4.792.044v-14.921c0-17.595-.047-18.134-1.915-22.194-3.456-7.507-11.659-11.646-20.085-10.135m138.5 23.745v23.667h4.333v-47.333h-4.333v23.666m48.583-19.764c15.991 4.474 19.104 27.686 4.993 37.232-13.886 9.394-31.402-6.828-25.88-23.968 3.027-9.397 12.717-15.55 20.887-13.264m-237.583 4.373c4.659.954 9.833 6.53 9.833 10.596 0 .071-6.038.129-13.417.129s-13.416-.063-13.416-.139c0-.335.741-2.353 1.202-3.273 2.981-5.95 8.954-8.714 15.798-7.313m-113.681.575c12.331 3.295 15.12 20.628 4.496 27.938-11.321 7.789-25.727-3.694-21.811-17.387 2.209-7.724 10.038-12.495 17.315-10.551m58.097-.073c9.184 2.318 13.84 13.745 9.21 22.602-5.756 11.009-20.066 10.313-24.972-1.216-4.758-11.18 4.804-24.153 15.762-21.386"
                  fill="currentColor"
                />
                <g transform="matrix(1.3, 0, 0, 1.3, 5.39868, 205.029358)">
                  <rect
                    x="27"
                    y="28"
                    style={{ fill: "currentColor" }}
                    width="2"
                    height="18"
                    data-original="#424A60"
                    className="active-path"
                    data-old_color="currentColorfff"
                  />
                  <rect
                    x="37.5"
                    y="2.893"
                    transform="matrix(0.7071 0.7071 -0.7071 0.7071 20.8223 -23.2696)"
                    style={{ fill: "currentColor" }}
                    width="2"
                    height="21.213"
                    data-original="#424A60"
                    className="active-path"
                    data-old_color="currentColorfff"
                  />
                  <rect
                    x="15"
                    y="21.858"
                    transform="matrix(0.7071 0.7071 -0.7071 0.7071 30.1421 -0.7696)"
                    style={{ fill: "currentColor" }}
                    width="2"
                    height="28.284"
                    data-original="#424A60"
                    className="active-path"
                    data-old_color="currentColorfff"
                  />
                  <rect
                    x="10.722"
                    y="13.5"
                    transform="matrix(0.7071 0.7071 -0.7071 0.7071 15.6716 -8.8345)"
                    style={{ fill: "currentColor" }}
                    width="15.556"
                    height="2"
                    data-original="#424A60"
                    className="active-path"
                    data-old_color="currentColorfff"
                  />
                  <rect
                    x="26.893"
                    y="32.5"
                    transform="matrix(0.7071 0.7071 -0.7071 0.7071 34.6716 -16.7046)"
                    style={{ fill: "currentColor" }}
                    width="21.213"
                    height="2"
                    data-original="#424A60"
                    className="active-path"
                    data-old_color="currentColorfff"
                  />
                  <circle
                    style={{ fill: "#735DD0" }}
                    cx="48"
                    cy="5"
                    r="5"
                    data-original="#43B05C"
                    data-old_color="#745CD4"
                  />
                  <circle
                    style={{ fill: "#14B5D0" }}
                    cx="28"
                    cy="48"
                    r="5"
                    data-original="#7383BF"
                    data-old_color="#7383BF"
                  />
                  <circle
                    style={{ fill: "#47B881" }}
                    cx="5"
                    cy="46"
                    r="5"
                    data-original="#57D8AB"
                    data-old_color="#43BC84"
                  />
                  <circle
                    style={{ fill: "#EC4C47" }}
                    cx="12"
                    cy="8"
                    r="3"
                    data-original="#D75A4A"
                    data-old_color="#F08F4C"
                  />
                  <circle
                    style={{ fill: "#EBBA16" }}
                    cx="44"
                    cy="40"
                    r="3"
                    data-original="#EBBA16"
                  />
                  <circle
                    style={{ fill: "#1070CA" }}
                    cx="28"
                    cy="24"
                    r="7"
                    data-original="#4B6DAA"
                    data-old_color="#0A89CE"
                  />
                </g>
              </svg>
            </span>
            <Box
              onClick={() => setShowVideo(true)}
              sx={{
                cursor: "pointer",
                position: "relative",
                width: 70,
                color: theme.colors.blue[9],
              }}
            >
              <svg
                viewBox="0 0 116 115"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M57.9993 114.857C73.1545 114.857 87.689 108.837 98.4054 98.1204C109.122 87.404 115.142 72.8695 115.142 57.7143C115.142 42.5591 109.122 28.0246 98.4054 17.3082C87.689 6.59183 73.1545 0.571434 57.9993 0.571434C42.8441 0.571434 28.3096 6.59183 17.5932 17.3082C6.87684 28.0246 0.856445 42.5591 0.856445 57.7143C0.856445 72.8695 6.87684 87.404 17.5932 98.1204C28.3096 108.837 42.8441 114.857 57.9993 114.857ZM54.8207 37.4857C53.745 36.768 52.4946 36.3558 51.203 36.2931C49.9114 36.2303 48.6269 36.5194 47.4867 37.1295C46.3465 37.7395 45.3933 38.6477 44.7288 39.7571C44.0643 40.8665 43.7134 42.1354 43.7136 43.4286V72C43.7134 73.2932 44.0643 74.5621 44.7288 75.6715C45.3933 76.7809 46.3465 77.689 47.4867 78.2991C48.6269 78.9092 49.9114 79.1983 51.203 79.1355C52.4946 79.0728 53.745 78.6606 54.8207 77.9429L76.2493 63.6571C77.2276 63.0048 78.0297 62.1211 78.5844 61.0844C79.1392 60.0477 79.4295 58.8901 79.4295 57.7143C79.4295 56.5385 79.1392 55.3809 78.5844 54.3442C78.0297 53.3075 77.2276 52.4237 76.2493 51.7714L54.8207 37.4857Z"
                />
              </svg>
            </Box>
            <Text
              variant="gradient"
              gradient={{ from: "#9a6a39", to: "#eeba7e", deg: 45 }}
              sx={{ fontSize: 36 }}
              weight={600}
              mt="xl"
            >
              ...in 4 minutes
            </Text>
          </Stack>
        </Box>
      )}
    </Box>
  );
};
