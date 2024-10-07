export interface NimbusResponse {
  displayFieldName: string;
  fieldAliases: FieldAliases;
  fields: Field[];
  features: Feature[];
}

export interface Feature {
  attributes: Attributes;
}

export interface Attributes {
  OBJECTID: number;
  AREA: number;
  PERIMETER: number;
  PR_: number;
  PR_ID: number;
  RINGS_OK: number;
  RINGS_NOK: number;
  WRSPR: number;
  PR: number;
  PATH: number;
  ROW: number;
  MODE: string;
  DAYCLASS: number;
  SEQUENCE: number;
  Shape_Length: number;
  Shape_Area: number;
}

export interface FieldAliases {
  OBJECTID: string;
  AREA: string;
  PERIMETER: string;
  PR_: string;
  PR_ID: string;
  RINGS_OK: string;
  RINGS_NOK: string;
  WRSPR: string;
  PR: string;
  PATH: string;
  ROW: string;
  MODE: string;
  DAYCLASS: string;
  SEQUENCE: string;
  Shape_Length: string;
  Shape_Area: string;
}

export interface Field {
  name: string;
  type: string;
  alias: string;
  length?: number;
}
