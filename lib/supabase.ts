import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type DbCustomer = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  assignees: string[];
  status: string | null;
  areas: string[];
  property_types: string[];
  structures: string[];
  budget: string | null;
  yield_min: string | null;
  age_max: string | null;
  own_fund: string | null;
  financings: string[];
  collateral: string | null;
  attributes: string[];
  age: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  source: string;
};

export type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  assignees: string[];
  status: string;
  areas: string[];
  propertyTypes: string[];
  structures: string[];
  budget: string;
  yieldMin: string;
  ageMax: string;
  ownFund: string;
  financings: string[];
  collateral: string;
  attributes: string[];
  age: string;
  notes: string;
  createdAt: string;
  source: string;
};

export function fromDb(c: DbCustomer): Customer {
  return {
    id: c.id,
    name: c.name,
    email: c.email ?? "",
    phone: c.phone ?? "",
    assignees: c.assignees ?? [],
    status: c.status ?? "",
    areas: c.areas ?? [],
    propertyTypes: c.property_types ?? [],
    structures: c.structures ?? [],
    budget: c.budget ?? "",
    yieldMin: c.yield_min ?? "",
    ageMax: c.age_max ?? "",
    ownFund: c.own_fund ?? "",
    financings: c.financings ?? [],
    collateral: c.collateral ?? "",
    attributes: c.attributes ?? [],
    age: c.age ?? "",
    notes: c.notes ?? "",
    createdAt: c.created_at,
    source: c.source ?? "manual",
  };
}

export function toDb(
  c: Omit<Customer, "id" | "createdAt">
): Omit<DbCustomer, "id" | "created_at" | "updated_at"> {
  return {
    name: c.name,
    email: c.email || null,
    phone: c.phone || null,
    assignees: c.assignees,
    status: c.status || null,
    areas: c.areas,
    property_types: c.propertyTypes,
    structures: c.structures,
    budget: c.budget || null,
    yield_min: c.yieldMin || null,
    age_max: c.ageMax || null,
    own_fund: c.ownFund || null,
    financings: c.financings,
    collateral: c.collateral || null,
    attributes: c.attributes,
    age: c.age || null,
    notes: c.notes || null,
    source: c.source,
  };
}
