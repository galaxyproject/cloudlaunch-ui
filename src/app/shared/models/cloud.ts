export interface Cloud {
    id: string;
    text: string;
    slug: string;
    name: string;
    cloud_type: string;
    region_name: string;
    extra_data: {};
}

export interface InstanceType {
    id: string;
    text: string;
    name: string;
}

export interface Region {
    id: string;
    text: string;
    name: string;
}

export interface PlacementZone {
    id: string;
    text: string;
    name: string;
}

export interface KeyPair {
    id: string;
    text: string;
    name: string;
}

export interface Network {
    id: string;
    text: string;
    name: string;
}

export interface SubNet {
    id: string;
    text: string;
    name: string;
}

export interface StaticIP {
    id: string;
    text: string;
    ip: string;
}

export interface CloudManCluster {
    id: number;
    text: string;
    cluster_name: string;
    placement: string;
    bucket_name: string;
}
