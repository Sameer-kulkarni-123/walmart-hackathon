export interface WalmartProductResult {
  results: ProductContent[];
  job: JobDetails;
}

export interface ProductContent {
  content: Product;
  created_at: string;
  updated_at: string;
  page: number;
  url: string;
  job_id: string;
  status_code: number;
  parser_type: string;
  is_render_forced?: boolean;
}

export interface Product {
  price: Price;
  rating?: Rating;
  seller?: Seller;
  general: General;
  location?: Location;
  variations?: Variation[];
  breadcrumbs?: Breadcrumb[];
  fulfillment?: Fulfillment;
  specifications?: Specification[];
  parse_status_code?: number;
  cheapest_seller_name?: string | null;
  sold_by_walmart_price?: string | null;
}

export interface Price {
  price: number;
  currency: string;
  price_strikethrough?: number;
}

export interface Rating {
  count: number;
  rating: number;
}

export interface Seller {
  id: string;
  url: string;
  name: string;
  catalog_id: string;
  official_name: string;
}

export interface General {
  url: string;
  meta: Meta;
  badge?: string[];
  brand?: string;
  title: string;
  images: string[];
  main_image: string;
  description: string;
}

export interface Meta {
  sku: string;
  gtin: string | null;
}

export interface Location {
  city: string;
  state: string;
  store_id: string;
  zip_code: string;
}

export interface Variation {
  price: Price;
  state: string;
  product_id: string;
  selected_options: SelectedOption[];
}

export interface SelectedOption {
  key: string;
  value: string;
}

export interface Breadcrumb {
  url: string;
  category_name: string;
}

export interface Fulfillment {
  pickup: boolean;
  delivery: boolean;
  shipping: boolean;
  out_of_stock: boolean;
  free_shipping: boolean;
  pickup_information: string;
  delivery_information: string;
  shipping_information: string;
}

export interface Specification {
  key: string;
  value: string;
}

export interface JobDetails {
  callback_url: string;
  client_id?: number;
  context?: JobContext[];
  created_at: string;
  domain?: string;
  geo_location?: string | null;
  id: string;
  limit?: number;
  locale?: string | null;
  pages?: number;
  parse: boolean;
  parser_type?: string | null;
  parsing_instructions?: string | null;
  browser_instructions?: string | null;
  render?: boolean | null;
  url: string;
  query?: string;
  source: string;
  start_page?: number;
  status: string;
  storage_type?: string | null;
  storage_url?: string | null;
  subdomain?: string;
  content_encoding?: string;
  updated_at: string;
  user_agent_type?: string;
  session_info?: string | null;
  statuses?: any[];
  client_notes?: string | null;
  _links: Link[];
}

export interface JobContext {
  key: string;
  value: any;
}

export interface Link {
  rel: string;
  href: string;
  method: string;
}
