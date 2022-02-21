export interface Domain {
  name: string;
  version: string;
}

export interface CustomProvider {
  connectorName: string;
  _signTypedData(domain: Domain, types: any, message: any): Promise<string>;
}
