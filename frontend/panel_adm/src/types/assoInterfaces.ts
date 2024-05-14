export interface AssociationCreation {
    name: string
    description: string
    location: "KB" | "VJ",
    logo: LogoAsso["id"]  // Image id
}

export interface LogoAsso {
    id: number;
    url: string;
}

export interface Association {
    id: number;
    name: string;
    description: string;
    location: "KB" | "VJ";
    logo: LogoAsso
}
