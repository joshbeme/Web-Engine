// This file contains all of the type definitions used on the bridge of the Tauri app.
// Prefer objects over tuples or arrays for better clarity in Rust side deserialization.
import { z } from "zod";

export const AppState = z.object({
  config: z.object({
    theme: z.enum(["light", "dark", "system"]),
    notificationsEnabled: z.boolean(),
  }),
  user: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

/**
 * Commands type definitions
 *
 */
export const OnChangeResponse = z.object({
  data: z.string(), // new state data
  error: z.string().nullable(), // Error message if any
  errorCode: z.number().nullable(), // Error code if any
});

export const OnChangeParams = z.object({
  state_id: z.string(),
  new_state: z.string(),
});
