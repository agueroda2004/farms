import { jaulaErrorMessages } from "../errors/jaulaErrorMessages.js";
import { razaErrorMessages } from "../errors/razaErrorMessages.js";
import { cerdaErrorMessages } from "../errors/cerdaErrorMessages.js";
import { cerdaRemovidaErrorMessages } from "../errors/cerdaRemovidaErrorMessages.js";
import { abortoErrorMessages } from "../errors/abortoErrorMessages.js";
import { berracoErrorMessages } from "../errors/berracoErrorMessages.js";
import { servicioErrorMessages } from "../errors/servicioErrorMessages.js";
import { operarioErrorMessages } from "../errors/operarioErrorMessagess.js";
import { vacunaErrorMessages } from "../errors/vacunaErrorMessages.js";
import { parideraErrorMessages } from "../errors/parideraErrorMessages.js";

export const errorMessages = {
  es: {
    ...jaulaErrorMessages.es,
    ...razaErrorMessages.es,
    ...cerdaErrorMessages.es,
    ...cerdaRemovidaErrorMessages.es,
    ...abortoErrorMessages.es,
    ...berracoErrorMessages.es,
    ...servicioErrorMessages.es,
    ...operarioErrorMessages.es,
    ...vacunaErrorMessages.es,
    ...parideraErrorMessages.es,
  },
  en: {
    ...jaulaErrorMessages.en,
    ...razaErrorMessages.en,
    ...cerdaErrorMessages.en,
    ...cerdaRemovidaErrorMessages.en,
    ...abortoErrorMessages.en,
    ...berracoErrorMessages.en,
    ...servicioErrorMessages.en,
    ...operarioErrorMessages.en,
    ...vacunaErrorMessages.en,
    ...parideraErrorMessages.en,
  },
};
