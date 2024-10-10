import type { TOC } from '@ember/component/template-only';
export interface TitleSignature {
  Element: HTMLElement;
  Args: {
    title?: string;
  };
}
export declare const Title: TOC<TitleSignature>;
export default Title;
