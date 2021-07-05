declare module '*.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_PUBLIC_MAPBOX_KEY: string;
  }
}
