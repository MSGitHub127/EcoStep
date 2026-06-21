// Shared input-validation limits for user-supplied custom logs.
//
// These are consumed from two places — CustomLogForm (client-side guard,
// for instant feedback) and useEcoStepStore's logCustomAction (the
// authoritative guard, since that's the single place state actually gets
// mutated). Centralizing them here means the two checks can never drift
// out of sync the way two independently-defined constants could.
export const CUSTOM_LOG_LABEL_MAX = 60
export const CUSTOM_LOG_KG_MAX = 1000
