import { useCallback, useState } from "react";
import type { FileWithPath } from "react-dropzone";
import { useDropzone } from "react-dropzone";

import {
  classNames,
  generateClientDropzoneAccept,
} from "uploadthing/client";
import type { ExpandedRouteConfig } from "uploadthing/server";

const generatePermittedFileTypes = (config?: ExpandedRouteConfig) => {
  const fileTypes = config ? Object.keys(config) : [];

  const maxFileCount = config
    ? Object.values(config).map((v) => v.maxFileCount)
    : [];

  return { fileTypes, multiple: maxFileCount.some((v) => v && v > 1) };
};

export const UploadDropzone = (
  props: {
    onFilesChanged?: (files: File[]) => void;
  }
) => {
  const [numFiles, setNumFiles] = useState(0);  // NEW

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    if (props.onFilesChanged) {
      props.onFilesChanged(acceptedFiles);
    }

    setNumFiles(acceptedFiles.length);  // NEW
  }, [props.onFilesChanged]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });
  return (
    <div
      className={classNames(
        "ut-mt-2 ut-flex ut-justify-center ut-rounded-lg ut-border ut-border-dashed ut-border-gray-900/25 ut-px-6 ut-py-10",
        isDragActive ? "ut-bg-blue-600/10" : "",
      )}
    >
      <div className="text-center" {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag and drop some files here, or click to select files</p>
        {numFiles > 0 && (   // NEW
          <p>You have added {numFiles} file{numFiles > 1 ? 's' : ''}.</p>
        )}
      </div>
    </div>
  );
};
