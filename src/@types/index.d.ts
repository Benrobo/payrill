

export interface NetworkDataType{
    users?: Array<any>,
    transactions?: Array<any>
    cards?: Array<any>;
    products?: Array<any>;
    ecarts?: Array<any>;
}

export interface NetworkLoadingType {
    users?: boolean,
    transactions?: boolean;
    transfer?: boolean;
    withdraw?: boolean;
    getCards: boolean;
}

export interface NetworkErrorType {
    users?: null | string,
    transactions?: null | string
    transfer?: null | string;
    withdraw?: null | string;
    cards?: null | string,
    products?: null | string;
    ecarts?: null | string;
}


export interface PinType{
    labelPin: string,
    originalPin: string;
    copyPin: string;
}

type Error = {
    users: null,
    transactions: null,
    transfer: null,
    withdraw: null
}

type LoaderType = {
    users: boolean,
    transactions: boolean,
    transfer: boolean,
    withdraw: boolean,
}

type DataType = {
    users: Array<any>
}

type DefaultPinType = {
    labelPin: string,
    copyPin: string,
    originalPin: string,
}

export interface ProviderType {
    logout ?: ()=> void
    pin?: DefaultPinType
    isAuthenticated?: boolean
    user?: any
    Data?: DataType 
    Loader?: LoaderType
    Error?: Error
    steps?: any
    Currency?: string
    setSteps?: any
    clearStep?: (stepName: string, value: number) => void
    setError?: any
    setLoader?: any
    setPin?: any
    clearPin?: ()=> void;
    setData?: any
}