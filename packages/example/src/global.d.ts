declare global {

    type GS = typeof globalThis & GlobalSecrets
    
    interface GlobalSecrets {
        GH_TOK: string;
      GH_TOKEN: string;
      TOKEN: string;
      VITE_GITHUB_TOKEN: string;
    }
  }
  
  export {}