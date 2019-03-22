export interface Cloud {
    id: string;
    name: string;
    resourcetype: string;
    access_instructions_url: string;
    regions: Region[];
}

export type AWSCloud = Cloud;

export type AzureCloud = Cloud;

export type GCPCloud = Cloud;

export interface OpenStackCloud extends Cloud {
    auth_url: string;
    identity_api_version: string;
}

export interface Region {
    region_id: string;
    name: string;
    cloud: string;
    resourcetype: string;
    zones: PlacementZone[];
}

export interface AWSRegion extends Region {
    ec2_endpoint_url: string;
    ec2_is_secure: boolean;
    ec2_validate_certs: boolean;
    s3_endpoint_url: string;
    s3_is_secure: boolean;
    s3_validate_certs: boolean;
}

export type AzureRegion = Region;

export type GCPRegion = Region;

export type OpenStackRegion = Region;

export interface PlacementZone {
    cloud: Cloud;
    region: Region;
    cloud_id: string;
    region_id: string;
    zone_id: string;
    name: string;
}

export interface VmType {
    id: string;
    name: string;
    vcpus: number;
    ram: number;
    size_total_disk: number;
}

export interface KeyPair {
    id: string;
    name: string;
}

export interface Network {
    id: string;
    name: string;
}

export interface SubNet {
    id: string;
    name: string;
}

export interface Gateway {
    id: string;
    name: string;
}
export interface StaticIP {
    id: string;
    ip: string;
    state: string;
}

export interface CloudManCluster {
    id: number;
    cluster_name: string;
    placement: string;
    bucket_name: string;
}
