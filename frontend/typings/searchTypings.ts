export interface SearchResult {
  results: Result[];
  total_results: number;
  last_visible_page: number;
  parse_status_code: number;
  created_at: string;
  updated_at: string;
  page: number;
  url: string;
  job_id: string;
  status_code: number;
  parser_type: string;
}

export interface Result {
  content: Content;
  created_at: string;
  updated_at: string;
  page: number;
  url: string;
  job_id: string;
  status_code: number;
  parser_type: string;
}

export interface Content {
  url: string;
  results: Product[]; // was 'organic' earlier
  facets?: Facet[];
  location?: Location;
  page_details: PageDetails;
  parse_status_code: number;
}

export interface Product {
  price: Price;
  rating: Rating;
  seller: Seller;
  general: General;
  variants?: Variant[];
  fulfillment?: Fulfillment;
}

export interface Price {
  price: number;
  currency: string;
}

export interface Rating {
  count: number;
  rating: number;
}

export interface Seller {
  id?: string;
  name: string;
}

export interface General {
  pos: number;
  url: string;
  image: string;
  title: string;
  sponsored: boolean;
  product_id: string;
  out_of_stock: boolean;
  section_title: string;
}

export interface Variant {
  url: string;
  title: string;
  image: string;
  product_id: string;
}

export interface Fulfillment {
  pickup: boolean;
  delivery: boolean;
  shipping: boolean;
  free_shipping: boolean;
}

export interface PageDetails {
  page: number;
  total_results: number;
  last_visible_page: number;
}

export interface Facet {
  type: string;
  values: {
    name: string;
  }[];
  display_name: string;
}

export interface Location {
  city: string;
  state: string;
  zipcode: string;
  store_id: string;
}
