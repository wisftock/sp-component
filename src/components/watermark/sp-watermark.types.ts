export interface SpWatermarkProps {
  /** Texto de la marca de agua (default: "CONFIDENCIAL") */
  text?: string;
  /** URL de imagen alternativa al texto */
  image?: string;
  /** Opacidad 0–1 (default: 0.15) */
  opacity?: number;
  /** Rotación en grados (default: -22) */
  rotate?: number;
  /** Espacio horizontal entre repeticiones en px (default: 200) */
  "gap-x"?: number;
  /** Espacio vertical entre repeticiones en px (default: 140) */
  "gap-y"?: number;
  /** Fuente CSS del texto (default: "14px sans-serif") */
  font?: string;
  /** Color del texto o imagen (default: "#000") */
  color?: string;
}
