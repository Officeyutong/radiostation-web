type SongData = {
    songID: number;
    audioURL: string;
    author: string;
    picURL: string;
    name: string;

};
type RequestData = {
    ID: number;
    checked: boolean;
    target: string;
    time: string;
    comment: string;
    requester: string;
    anonymous: string;
    password?: string;

};
type BackendItem = {
    songData: SongData;
    requests: Array<RequestData>;
}

type SearchItem = {
    songID: number;
    name: string;
    author: string;

};
export type { SongData, RequestData, BackendItem, SearchItem };