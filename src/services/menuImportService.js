const HEADER_ALIASES = {
  name: "Name",
  product: "Name",
  productname: "Name",
  category: "Category",
  price: "Price",
  description: "Description",
  image: "Image",
  imageurl: "Image",
  available: "Available",
  bestseller: "BestSeller",
  todaysspecial: "TodaysSpecial",
  archived: "Archived",
};

function normalizeHeader(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function parseBoolean(value, fallback) {
  if (typeof value === "boolean") return value;
  if (value === undefined || value === null || value === "") return fallback;

  const normalized = String(value).trim().toLowerCase();
  if (["true", "yes", "1", "y"].includes(normalized)) return true;
  if (["false", "no", "0", "n"].includes(normalized)) return false;
  return fallback;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const nextCharacter = text[index + 1];

    if (character === '"') {
      if (quoted && nextCharacter === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      row.push(value);
      value = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && nextCharacter === "\n") index += 1;
      row.push(value);
      if (row.some((cell) => cell.trim() !== "")) rows.push(row);
      row = [];
      value = "";
    } else {
      value += character;
    }
  }

  row.push(value);
  if (row.some((cell) => cell.trim() !== "")) rows.push(row);

  if (rows.length < 2) {
    throw new Error("The CSV must contain a header and at least one product.");
  }

  const headers = rows[0].map(
    (header) => HEADER_ALIASES[normalizeHeader(header)] || header.trim(),
  );

  return rows.slice(1).map((cells) =>
    headers.reduce((record, header, index) => {
      record[header] = cells[index]?.trim() ?? "";
      return record;
    }, {}),
  );
}

function normalizeImportedItem(rawItem, index) {
  const name = String(rawItem.Name ?? rawItem.name ?? "").trim();
  const category = String(rawItem.Category ?? rawItem.category ?? "").trim();
  const price = Number(rawItem.Price ?? rawItem.price);

  if (!name) throw new Error(`Row ${index + 1}: product name is required.`);
  if (!category) throw new Error(`Row ${index + 1}: category is required.`);
  if (!Number.isFinite(price) || price < 0) {
    throw new Error(`Row ${index + 1}: price must be zero or more.`);
  }

  return {
    Name: name,
    Category: category,
    Price: price,
    Description: String(rawItem.Description ?? rawItem.description ?? "").trim(),
    Image: String(rawItem.Image ?? rawItem.image ?? "").trim(),
    Available: parseBoolean(rawItem.Available ?? rawItem.available, true),
    BestSeller: parseBoolean(rawItem.BestSeller ?? rawItem.bestSeller, false),
    TodaysSpecial: parseBoolean(
      rawItem.TodaysSpecial ?? rawItem.todaysSpecial,
      false,
    ),
    Archived: parseBoolean(rawItem.Archived ?? rawItem.archived, false),
  };
}

export async function parseMenuImportFile(file) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const text = await file.text();
  let records;

  if (extension === "json") {
    const parsed = JSON.parse(text);
    records = Array.isArray(parsed) ? parsed : parsed.items;
    if (!Array.isArray(records)) {
      throw new Error("JSON must contain an array of menu products.");
    }
  } else if (extension === "csv") {
    records = parseCsv(text);
  } else {
    throw new Error("Choose a CSV or JSON file.");
  }

  if (records.length === 0) {
    throw new Error("The selected file does not contain any products.");
  }
  if (records.length > 1000) {
    throw new Error("Import a maximum of 1,000 products at a time.");
  }

  return records.map(normalizeImportedItem);
}

export function downloadMenuImportTemplate() {
  const template = [
    "Name,Category,Price,Description,Image,Available,BestSeller,TodaysSpecial,Archived",
    '"Cappuccino","Hot Coffee",180,"Espresso with steamed milk","",true,true,false,false',
  ].join("\n");
  const url = URL.createObjectURL(
    new Blob([template], { type: "text/csv;charset=utf-8" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "menu-import-template.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}