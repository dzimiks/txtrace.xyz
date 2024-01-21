type NetworkId = string;

type NetworkMetadataResponseData = {
  label: string;
  short_identifier: string;
  slug: string;
  secondary_slugs: string[];
  color: string;
  icon: string;
  exclude_from_listing: string;
  explorer_base_url: string;
  native_currency?: string;
};

type NetworkResponseData = {
  id: string;
  metadata: NetworkMetadataResponseData;
  chain_config: string;
  sort_order: number;
  name: string;
};

interface NetworkData {
  id: NetworkId;
  apiId: string;
  route: string;
  logo: string;
  routeAliases: string[];
  name: string;
  color: string;
  shortName: string;
  explorerBaseUrl: string;
  nativeCurrency: string;
  sortOrder: number;
  excluded: boolean;
  chainConfig: Record<string, string>;
}

class Network implements NetworkData {
  id: NetworkId;
  apiId: string;
  route: string;
  routeAliases: string[];
  name: string;
  logo: string;
  color: string;
  shortName: string;
  explorerBaseUrl: string;
  nativeCurrency: string;
  sortOrder: number;
  excluded: boolean;
  chainConfig: Record<string, string>;

  constructor(data: NetworkData) {
    this.id = data.id;
    this.apiId = data.apiId;
    this.route = data.route;
    this.routeAliases = data.routeAliases;
    this.name = data.name;
    this.logo = data.logo;
    this.color = data.color;
    this.shortName = data.shortName;
    this.explorerBaseUrl = data.explorerBaseUrl;
    this.nativeCurrency = data.nativeCurrency;
    this.sortOrder = data.sortOrder;
    this.excluded = data.excluded;
    this.chainConfig = data.chainConfig;
  }

  static buildFromResponse(response: NetworkResponseData): Network {
    let chainConfig: Record<string, string>;

    try {
      chainConfig = JSON.parse(response?.chain_config);
    } catch (e) {
      chainConfig = {};
    }

    return new Network({
      id: response.id,
      name: response?.metadata?.label ?? response.name,
      shortName: response?.metadata?.short_identifier,
      apiId: response.id,
      route: response?.metadata?.slug,
      routeAliases: response?.metadata?.secondary_slugs,
      color: response?.metadata?.color,
      logo: response?.metadata?.icon,
      excluded: !!response?.metadata?.exclude_from_listing,
      explorerBaseUrl: response?.metadata?.explorer_base_url,
      nativeCurrency: response?.metadata?.native_currency ?? '',
      sortOrder: response?.sort_order,
      chainConfig,
    });
  }
}

export { Network, type NetworkResponseData };
