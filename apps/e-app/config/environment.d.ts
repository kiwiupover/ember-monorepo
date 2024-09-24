declare const config: {
  modulePrefix: string;
  podModulePrefix: string;
  environment: string;
  rootURL: string;
  locationType: 'history' | 'hash' | 'none';
  EmberENV: {
    EXTEND_PROTOTYPES: boolean;
    FEATURES: Record<string, boolean>;
  };
  supabase: {
    url: string;
    key: string;
  };
  APP: Record<string, unknown>;
};

export default config;
