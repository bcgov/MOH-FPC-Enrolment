// Route constants for main app
export const APP_ROUTES = {
  income_review: 'application',
  maintenance: 'maintenance',
};

// Title to be displayed in banner
export const APP_TITLE = 'Fair PharmaCare Income Review Application';
export const TAB_APP_TITLE = 'FPC Income Review';

/**
 * List of variables to configure the splash page during maintenance when
 * system will be unaviable.
 * Values are stored in the spa-env-server and must be retrieved.
 */
export const FPIR_SPA_ENV_CONFIG = {
  SPA_ENV_FPIR_MAINTENANCE_FLAG: '',
  SPA_ENV_FPIR_MAINTENANCE_START: '',
  SPA_ENV_FPIR_MAINTENANCE_END: '',
  SPA_ENV_FPIR_MAINTENANCE_MESSAGE: '',
};

/**
 * All the serverEnvs, provided as an object, converted to a type which we can
 * use as an interface or for responses.  By doing it this way, we can
 * accomplish **both** of the following without duplication:
 *
 * 1. Automatically added to the HTTP request
 * 2. Added to the type/interface
 *
 * Thus, we're updating types and modifying runtime behaviour in one stroke.
 */
export type SpaEnvResponse = typeof FPIR_SPA_ENV_CONFIG;
export const MAINT_FLAG_TRUE = 'true';
export const MAINT_FLAG_FALSE = 'false';
