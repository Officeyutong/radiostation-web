import React, { useState } from "react";

import {
    Modal,
    Button,
    Input,
    Loader,
    Dimmer,
    Container,
    Table
} from "semantic-ui-react";

import axios from "axios";
import { show as showDialog } from "../dialogs/Dialog";
import { SearchItem } from "../types";
const SearchModal: React.FC<{
    showing: boolean;
    onClose: () => (void);
    doneCallback: (songID: number) => (void);
}> = ({ doneCallback, onClose, showing }) => {
    let [loading, setLoading] = useState(false);
    let [keyword, setKeyword] = useState("");
    let [loaded, setLoaded] = useState(false);
    let [data, setData] = useState<Array<SearchItem>>([]);
    const doSearch = () => {
        console.log("searching..", keyword);
        setLoading(true);
        axios.post("/api/search", { keyword: keyword }).then(resp => {
            let data = resp.data;
            setLoading(false);
            if (data.code) {
                showDialog(data.message, "错误", true);
                return;
            }
            setData(data.data);
            setLoaded(true);
        });
    };
    return <Modal
        open={showing}
        onClose={onClose}
    >
        <Modal.Header>搜索歌曲</Modal.Header>
        <Modal.Content >
            <Dimmer active={loading}>
                <Loader>搜索中..</Loader>
            </Dimmer>
            <Input action={{
                icon: "search",
                color: "blue",
                labelPosition: "right",
                content: "搜索",
                onClick: doSearch
            }} loading={loading} fluid onChange={e => setKeyword(e.target.value)} placeholder="请在此输入搜索关键词.."></Input>
            <Container textAlign="center" style={{ marginTop: "30px", overflowY: "scroll", maxHeight: "500px" }}>
                {loaded && <Table textAlign="center">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>
                                ID
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                歌名
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                艺术家
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                操作
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {data.map(item =>
                            <Table.Row key={item.songID}>
                                <Table.Cell>
                                    <a href={`https://music.163.com/#/song?id=${item.songID}`} target="_blank" rel="noopener noreferrer">{item.songID}</a>
                                </Table.Cell>
                                <Table.Cell>{item.name}</Table.Cell>
                                <Table.Cell>{item.author}</Table.Cell>
                                <Table.Cell>
                                    <Button size="tiny" color="blue" onClick={e => doneCallback(item.songID)}>选择</Button>
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>}
            </Container>
        </Modal.Content>
        <Modal.Actions>
            <Button color="green" onClick={onClose}>
                关闭
            </Button>
        </Modal.Actions>
    </Modal>;
};

export default SearchModal;