import { Modal } from "@mantine/core";
import type { Image } from "@prisma/client";
import classNames from "classnames";
import { useState } from "react";

export function CMImage({
  image,
  className,
}: {
  image: Image;
  className?: string;
}) {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        size="auto"
        withCloseButton={false}
      >
        <img
          alt=""
          src={image.url}
          className={classNames("aspect-auto h-[80%] cursor-zoom-out")}
          onClick={() => setOpened(false)}
        />
      </Modal>
      <img
        alt=""
        src={image.url}
        className={classNames("aspect-auto h-24 cursor-zoom-in", className)}
        onClick={() => setOpened(true)}
      />
    </>
  );
}
