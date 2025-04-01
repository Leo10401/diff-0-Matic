/// <reference types="node" />
export interface UrlRequestObject {
    encoding?: string | null;
    url: string | null;
}
export interface BufferObject {
    ext?: string;
    data: Buffer;
    name?: string;
}
export declare const imageHash: (oldSrc: string | UrlRequestObject | BufferObject, bits: any, method: any, cb: any) => void;
