import React from "react";
import { FaDiscord, FaGithub } from "react-icons/fa";
import styles from "./styles.module.css";

const icons = {
  github: FaGithub,
  discord: FaDiscord,
};

interface SocialIconProps {
  href: string;
  icon: "github" | "discord";
}

const SocialIcon = ({ href, icon }: SocialIconProps) => {
  const Icon = icons[icon];
  return (
    <Icon
      className={styles.Icon}
      onClick={() => {
        window.open(href, "_blank");
      }}
    />
  );
};

export default SocialIcon;
