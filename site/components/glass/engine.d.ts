export type GlassOptions = {
  root: HTMLElement;
  canvas: HTMLCanvasElement;
  /** SVG d'une silhouette (viewBox 0 0 1000 1000, fill-rule evenodd). */
  shape: string;
  /** Cinq couleurs : une par chapitre, de l'accroche au contact. */
  palette: string[];
  /** Carte posée sur une dalle de verre 3D, dans le dernier chapitre. */
  contactCard?: HTMLElement | null;
  fragments?: number;
  onReady?: () => void;
};

/** Monte la scène 3D dans `root` et renvoie la fonction qui la démonte. */
export function startGlass(options: GlassOptions): () => void;
