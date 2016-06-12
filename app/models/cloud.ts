export interface Cloud {
   id: string;
   text: string;
   slug: string;
   name: string;
}

export interface InstanceType {
   id: string;
   text: string;
   name: string;
}

export interface Placement {
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

export class TargetCloudInfo {
   public cloudId: string;
   public instanceType: string;
   public placement: string;
   public keypair: string;
   public network: string;
   public subnet: string;
   public ebsOptimized: string;
   public iops: string;
}
