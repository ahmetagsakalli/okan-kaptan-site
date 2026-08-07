import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ className = "", priority = false }: BrandLogoProps) {
  return (
    <Image
      className={`brand-logo-image ${className}`}
      src="/images/okan-kaptan-logo.png"
      alt="Okan Kaptan Mordoğan logo"
      width={656}
      height={542}
      priority={priority}
      sizes="(max-width: 540px) 90px, 118px"
    />
  );
}
