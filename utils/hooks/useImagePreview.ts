import * as React from "react";

export const useImagePreview = () => {
  const [preview, setPreview] = React.useState("");

  const readFile = (e: React.BaseSyntheticEvent) => {
    const fileReader = new FileReader();
    fileReader.onload = () => setPreview(fileReader.result as string);

    fileReader.readAsDataURL(e.target.files[0]);
  };

  const clearPreview = () => {
    setPreview("");
  };

  return [preview, readFile, clearPreview] as const;
};
