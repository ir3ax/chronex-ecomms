export type FetchCheckOut = {
    productId: string;
    quantity: number;
    total: number;
    discount: string;
    discountedPrice: number;
    price: number;
    productImg: string;
    productName: string;
    productSold: number;
    productFreebies: string | null;
    rating: number;
};

export type CompleteCheckOut = {
    product : CompleteProductInfo[];
    customer: CompleteCustomer[];
    total: number;
    completeAddress: CompleteAddress[];
}

export type CompleteCustomer = {
    contactNumber: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
}

export type CompleteAddress = {
    landmark: string;
    address: string;
    houseNumber: string;
    region: string;
    province: string;
    city: string;
    barangay: string;
};

export type CompleteProductInfo = {
    productId: string;
    productName: string;
    quantity: number;
    discountedPrice: number;
    freebies: string | null;
};

