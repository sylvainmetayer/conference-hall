import { vi } from 'vitest'
import { installGlobals } from "@remix-run/node";

// This installs globals such as "fetch", "Response", "Request" and "Headers.
installGlobals();

global.console.info = vi.fn()
