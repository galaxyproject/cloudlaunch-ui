export interface DockerRepositoryOverview {
    is_automated: boolean;
    is_official: boolean;
    pull_count: number;
    repo_name: string;
    repo_owner: string;
    short_description: string;
    star_count: number;
}

export interface DockerRepositoryDetail {
    affiliation: string;
    can_edit: boolean;
    description: string;
    full_description: string;
    has_starred: boolean;
    is_automated: boolean;
    is_private: boolean;
    last_updated: string;
    name: string;
    namespace: string;
    permissions: Object;
    pull_count: number;
    repository_type: string;
    star_count: number;
    user: string;
}

export class PortMapping {
    container_port: string; 
    host_port: string; 

    constructor(container_port: string, host_port: string) {
        this.container_port = container_port;
        this.host_port = host_port;
    }
}

export class EnvironmentVariable {
    variable: string; 
    value: string;

    constructor(variable: string, value: string) {
        this.variable = variable;
        this.value = value;
    }
}

export class VolumeMapping {
    host_path: string;
    container_path: string;
    read_write: boolean;
    nocopy: boolean;

    constructor(host_path: string, container_path: string) {
        this.host_path = host_path;
        this.container_path = container_path;
    }
}

export class DockerRunConfiguration {
    repo_name: string; // Name of the docker repo to run
    entrypoint: string;
    command: string;
    work_dir: string;
    user: string;        
    port_mappings: PortMapping[] = [];
    env_vars: EnvironmentVariable[] = [];
    volumes: VolumeMapping[] = [];
}
