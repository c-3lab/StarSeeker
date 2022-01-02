export interface OpQuery {
  entities?: { [key: string]: string }[];
  attrs?: string[];
  expression?: { [key: string]: string }[];
  metadata?: string[];
}
