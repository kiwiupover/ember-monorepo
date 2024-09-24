import type { TOC } from '@ember/component/template-only';
export interface BannerSignature {
    Element: HTMLElement;
    Args: {
        heading?: string;
        description?: string;
        stacked?: boolean;
        onClose?: () => void;
    };
    Blocks: {
        heading?: [];
        description?: [];
        body?: [];
        actions: [];
    };
}
export declare const Banner: TOC<BannerSignature>;
export default Banner;
//# sourceMappingURL=banner.d.ts.map