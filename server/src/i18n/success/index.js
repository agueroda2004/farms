import { jaulaSuccessMessages } from "../success/jaulaSuccessMessages.js";
import { razaSuccessMessages } from "../success/razaSuccessMessages.js";
import { cerdaSuccessMessages } from "../success/cerdaSuccessMessages.js";
import { cerdaRemovidaSuccessMessages } from "./cerdaRemovidaSuccessMessages.js";
import { abortoSuccessMessages } from "./abortoSuccessMessages.js";
import { berracoSuccessMessages } from "./berracoSuccessMessages.js";
import { berracoRemovidoSuccessMessages } from "./berracoRemovidoSuccessMessages.js";
import { servicioSuccessMessages } from "./servicioSuccessMessages.js";
import { operarioSuccessMessages } from "./operarioSuccessMessages.js";
import { vacunaSuccessMessages } from "./vacunaSuccessMessages.js";
import { parideraSuccessMessages } from "./parideraSuccessMessages.js";
import { partoSuccessMessages } from "./partoSucccesMessages.js";

export const successMessages = {
  es: {
    ...jaulaSuccessMessages.es,
    ...razaSuccessMessages.es,
    ...cerdaSuccessMessages.es,
    ...abortoSuccessMessages.es,
    ...cerdaRemovidaSuccessMessages.es,
    ...berracoSuccessMessages.es,
    ...berracoRemovidoSuccessMessages.es,
    ...servicioSuccessMessages.es,
    ...operarioSuccessMessages.es,
    ...vacunaSuccessMessages.es,
    ...parideraSuccessMessages.es,
    ...partoSuccessMessages.es,
  },
  en: {
    ...jaulaSuccessMessages.en,
    ...razaSuccessMessages.en,
    ...cerdaSuccessMessages.en,
    ...abortoSuccessMessages.en,
    ...cerdaRemovidaSuccessMessages.en,
    ...berracoSuccessMessages.en,
    ...berracoRemovidoSuccessMessages.en,
    ...servicioSuccessMessages.en,
    ...operarioSuccessMessages.en,
    ...vacunaSuccessMessages.en,
    ...parideraSuccessMessages.en,
    ...partoSuccessMessages.en,
  },
};
