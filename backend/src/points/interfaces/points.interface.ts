export interface MetaData {
  type?: string;
  value?: string;
}

export interface ContextElement {
  id: string;
  type: string;
}

export interface ContextElementAttribute {
  type: string;
  value: string;
  metadata?: MetaData;
}

export interface Properties {
  [key: string]: any;
}

export interface Geometry {
  type: string;
  coordinates?: number[];
}

export interface Feature {
  type: 'Feature';
  properties: Properties;
  geometry: Geometry;
}

export interface FeatureCollection {
  type: 'FeatureCollection';
  features: Feature[];
}
