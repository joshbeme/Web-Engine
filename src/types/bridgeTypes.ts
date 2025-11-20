import type { infer as Infer } from "zod";
import { AppState } from "@bridge-types";

export type AppState = Infer<typeof AppState>;
