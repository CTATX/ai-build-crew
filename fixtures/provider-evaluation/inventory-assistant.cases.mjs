export const inventoryAssistantCases = Object.freeze([
  Object.freeze({
    id: "synthetic-barcode-match",
    input: "Synthetic inventory records: ALT-104, alternator, barcode 000104, location BIN-A3, quantity 2. A technician scanned barcode 000104. State whether the part is in stock and give the part ID, location, and quantity. Use one concise sentence.",
    requiredTerms: Object.freeze(["ALT-104", "BIN-A3", "2"]),
  }),
  Object.freeze({
    id: "synthetic-photo-identification",
    input: "Synthetic image-recognition metadata says: likely brake caliper, manufacturer code BC-220. Inventory records: BC-220, front brake caliper, location BIN-C7, quantity 0. State whether it is available and the next operational action. Use one concise sentence.",
    requiredTerms: Object.freeze(["BC-220", "BIN-C7", "order"]),
  }),
  Object.freeze({
    id: "synthetic-spoken-stock-query",
    input: "Synthetic speech transcript: Do we have the water pump kit for repair order 82? Inventory records: WP-082, water pump kit, location SHELF-B2, quantity 4. Answer availability, part ID, location, and quantity. Use one concise sentence.",
    requiredTerms: Object.freeze(["WP-082", "SHELF-B2", "4"]),
  }),
]);
