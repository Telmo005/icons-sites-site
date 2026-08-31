/** Public site-wide constants — not secrets, safe to import from client code. */
export const SUPPORT_EMAIL = "telmo.sigauquejr@gmail.com";

/** Legal seller identity, shown on the legal pages and footer. Must match
 * exactly what's registered on the Paddle account (name and country), or
 * domain/account verification can be rejected for the mismatch. */
export const LEGAL_ENTITY = {
  name: "ES QUEEN IMPORTAÇÕES E LOGÍSTICA, SU, LDA",
  country: "Moçambique",
  address:
    "Av./Rua Justino Chemane, Bairro Polana Caniço - A, N.º 231, Andar R/C, Maputo Cidade, Moçambique",
  taxId: "401901019",
};
