const ENV = process.env.NODE_ENV || 'development'

export let config: Config;

class Config {
  ENV: string
  FIREBASE_PROJECT_ID?: string
  FIREBASE_API_KEY?: string
  FIREBASE_AUTH_DOMAIN?: string
  FIREBASE_AUTH_EMULATOR_HOST?: string
  COOKIE_SIGNED_SECRET: string

  constructor() {
    this.ENV = ENV
    this.FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID
    this.FIREBASE_API_KEY = process.env.FIREBASE_API_KEY
    this.FIREBASE_AUTH_DOMAIN = process.env.FIREBASE_AUTH_DOMAIN
    this.FIREBASE_AUTH_EMULATOR_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST
    this.COOKIE_SIGNED_SECRET = process.env.COOKIE_SIGNED_SECRET || 'secr3t'
  }

  get isProduction(): boolean {
    return this.ENV === 'production'
  }

  get isDevelopment(): boolean {
    return this.ENV === 'development'
  }

  get isTest(): boolean {
    return this.ENV === 'test'
  }
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// reload the env config with every change either.
declare global {
  var __config: Config | undefined;
}

if (ENV === 'production') {
  config = new Config();
} else {
  if (!global.__config) {
    console.log(`🌍 Environment "${ENV}".`)
    global.__config = new Config();
  }
  config = global.__config;
}
