import React from "react";
import { SandpackClient } from "@codesandbox/sandpack-client";
export function Preview({
  className,
  files,
  presetConfig,
  show,
  children,
  codeConfig,
  style,
  ...rest
}) {
  return (
    <div>
      <SandpackPreview files={files} presetConfig={presetConfig} />
    </div>
  );
}

function SandpackPreview({ files, presetConfig }) {
  const iframeRef = React.useRef(null);
  const clientRef = React.useRef(null);

  React.useEffect(() => {
    clientRef.current = new SandpackClient(
      iframeRef.current,
      {
        ...presetConfig,
        files: mergeFiles(presetConfig.files, files),
      },
      {
        showOpenInCodeSandbox: false,
        // showErrorScreen: false,
        // showLoadingScreen: false,
      }
    );
  }, []);

  React.useEffect(() => {
    if (clientRef.current) {
      clientRef.current.updatePreview({
        ...presetConfig,
        files: mergeFiles(presetConfig.files, files),
      });
    }
  }, [files]);

  return <iframe ref={iframeRef} />;
}

function mergeFiles(csbFiles, chFiles) {
  const result = { ...csbFiles };
  chFiles.forEach((file) => {
    result["/" + file.name] = {
      code: file.code.lines
        .map((l) => l.tokens.map((t) => t.content).join(""))
        .join("\n"),
    };
  });
  return result;
}
