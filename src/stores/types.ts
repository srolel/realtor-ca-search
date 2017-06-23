export interface Building {
    BathroomTotal: string;
    Bedrooms: string;
    SizeInterior: string;
    StoriesTotal: string;
    Type: string;
    Ammenities: string;
}

export interface Address {
    AddressText: string;
}

export interface Phone {
    PhoneType: string;
    PhoneNumber: string;
    AreaCode: string;
    PhoneTypeId: string;
}

export interface Email {
    ContactId: string;
}

export interface Website {
    Website: string;
    WebsiteTypeId: string;
}

export interface Organization {
    OrganizationID: number;
    Name: string;
    Logo: string;
    Address: Address;
    Phones: Phone[];
    Emails: Email[];
    HasEmail: boolean;
    PermitFreetextEmail: boolean;
    PermitShowListingLink: boolean;
    Websites: Website[];
    Designation: string;
}

export interface Phone2 {
    PhoneType: string;
    PhoneNumber: string;
    AreaCode: string;
    PhoneTypeId: string;
}

export interface Email2 {
    ContactId: string;
}

export interface Website2 {
    Website: string;
    WebsiteTypeId: string;
}

export interface Individual {
    IndividualID: number;
    Name: string;
    Organization: Organization;
    Phones: Phone2[];
    Emails: Email2[];
    Position: string;
    PermitFreetextEmail: boolean;
    FirstName: string;
    LastName: string;
    CorporationDisplayTypeId: string;
    PermitShowListingLink: boolean;
    Websites: Website2[];
    Photo: string;
    CccMember?: boolean;
    DesignationCodes: string;
}

export interface Address2 {
    AddressText: string;
    Longitude: string;
    Latitude: string;
}

export interface Photo {
    SequenceId: string;
    HighResPath: string;
    MedResPath: string;
    LowResPath: string;
    LastUpdated: string;
    Description: string;
}

export interface Parking {
    Name: string;
}

export interface Property {
    Price: string;
    Type: string;
    Address: Address2;
    Photo: Photo[];
    Parking: Parking[];
    ParkingSpaceTotal: string;
    TypeId: string;
    OwnershipType: string;
    AmmenitiesNearBy: string;
}

export interface Business {
}

export interface Land {
    SizeTotal: string;
    SizeFrontage: string;
    AccessType: string;
}

export interface AlternateURL {
    BrochureLink: string;
    DetailsLink: string;
    VideoLink: string;
    PhotoLink: string;
    MapLink: string;
}

export interface OpenHouse {
    StartTime: string;
    StartDateTime: string;
    EndDateTime: string;
    FormattedDateTime: string;
    Comments: string;
}

export interface Listing {
    Id: string;
    MlsNumber: string;
    PublicRemarks: string;
    Building: Building;
    Individual: Individual[];
    Property: Property;
    Business: Business;
    Land: Land;
    PostalCode: string;
    RelativeDetailsURL: string;
    StatusId: string;
    PhotoChangeDateUTC: string;
    AlternateURL: AlternateURL;
    PriceChangeDateUTC: string;
    OpenHouseInsertDateUTC: string;
    HasNewImageUpdate?: boolean;
    OpenHouse: OpenHouse[];
    HasOpenHouseUpdate?: boolean;
    HasPriceUpdate?: boolean;
}

