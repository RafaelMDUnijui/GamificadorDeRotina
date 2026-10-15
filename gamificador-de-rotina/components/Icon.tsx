// Ícones SVG próprios (substituem os emojis, que mudam de aparência em cada sistema).
// Herdam a cor do texto (currentColor) e são decorativos: o significado vem do texto ao lado.
import type { ComponentPropsWithoutRef } from 'react';
import Image from 'next/image';

type IconProps = { size?: number } & Omit<ComponentPropsWithoutRef<'svg'>, 'width' | 'height'>;

export function LogoIcon({ size = 20 }: { size?: number }) {
  return <Image src="/logo-calendario.png" alt="" width={size} height={size} aria-hidden="true" />;
}

function Svg({ size = 20, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function FlameIcon({ size = 20, ...rest }: IconProps) {
  return (
    <Svg size={size} fill="currentColor" stroke="none" {...rest}>
      <path d="M12.6 2.2c.3 2.6 1.6 4.3 3.1 6 1.6 1.8 3.3 3.6 3.3 6.6A7 7 0 0 1 12 21.8a7 7 0 0 1-7-7c0-2.5 1.2-4.3 2.6-5.6.1 1.5.7 2.6 1.7 3.2-.3-3.7.9-7.6 3.3-10.2Z" />
    </Svg>
  );
}

export function RefreshIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M20 11a8 8 0 0 0-14.3-4.6L4 8.5" />
      <path d="M4 4v4.5h4.5" />
      <path d="M4 13a8 8 0 0 0 14.3 4.6l1.7-2.1" />
      <path d="M20 20v-4.5h-4.5" />
    </Svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Svg strokeWidth={3} {...props}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </Svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  );
}
