import React, { useEffect, useState } from "react";

import {
    Container,
    Header,
    Form,
    Button,
    Input,
    Segment,
    Pagination,
    Table,
    Checkbox,
    Icon,
    Divider
} from "semantic-ui-react";
import axios from "axios";
import { show as showDialog } from "../dialogs/Dialog";
import { BackendItem } from "../types";
import SongCard from "../utils/SongCard";
const SongItem: React.FC<{
    password: string;
    data: BackendItem;
    isAdmin: boolean;
    toggleCheck: (ID: number) => (void);
    removeRequest: (ID: number) => (void);
    removeSong: (ID: number) => (void);
}> = ({ password, data, isAdmin, removeRequest, removeSong, toggleCheck }) => {

    return <Container>
        <SongCard data={data.songData}></SongCard>
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>请求ID</Table.HeaderCell>
                    {isAdmin && <Table.HeaderCell>请求密码</Table.HeaderCell>}
                    <Table.HeaderCell>点歌人</Table.HeaderCell>
                    <Table.HeaderCell>被点歌人</Table.HeaderCell>
                    <Table.HeaderCell>时间</Table.HeaderCell>
                    {isAdmin && <Table.HeaderCell>匿名</Table.HeaderCell>}
                    <Table.HeaderCell>备注</Table.HeaderCell>
                    {isAdmin && <Table.HeaderCell>操作</Table.HeaderCell>}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {data.requests.map(item => <Table.Row key={item.ID}>
                    <Table.Cell>
                        <Checkbox checked={item.checked} label={item.ID} onClick={e => toggleCheck(item.ID)}></Checkbox>
                    </Table.Cell>
                    {isAdmin && <Table.Cell>
                        {item.password}</Table.Cell>}
                    <Table.Cell>
                        {item.requester}
                    </Table.Cell>
                    <Table.Cell>
                        {item.target}
                    </Table.Cell>
                    <Table.Cell>
                        {item.time}
                    </Table.Cell>
                    {isAdmin && <Table.Cell>
                        {item.anonymous && <Icon color="green" size="large" name="checkmark"></Icon>}
                    </Table.Cell>}
                    <Table.Cell>
                        {item.comment}
                    </Table.Cell>
                    {isAdmin && <Table.Cell>
                        <Button icon onClick={e => removeRequest(item.ID)}>
                            <Icon name="trash"></Icon>
                        </Button>
                    </Table.Cell>}
                </Table.Row>)}
            </Table.Body>
        </Table>
        <Container textAlign="left">
            <Button icon labelPosition="left" color="blue" onClick={e => removeSong(data.songData.songID)}>
                <Icon name="trash"></Icon>
                删除歌曲
            </Button>
        </Container>
        <Divider></Divider>
    </Container>;
};

const Manage: React.FC<{}> = () => {
    useEffect(() => {
        document.title = "后台管理";
    });
    let [password, setPassword] = useState("");
    let [loading, setLoading] = useState(false);
    let [isAdmin, setIsAdmin] = useState(false);
    let [pageCount, setPageCount] = useState(0);
    let [page, setPage] = useState(0);
    let [data, setData] = useState<Array<BackendItem>>([]);
    let [loaded, setLoaded] = useState(false);
    const load = () => {
        loadPage(1);
    };
    const loadPage = (page: number) => {
        setLoading(true);
        axios.post("/api/manage", {
            page: page,
            password: password
        }).then(resp => {
            setLoading(false);
            let data = resp.data;
            if (data.code) {
                showDialog(data.message, "错误", true);
                return;
            }
            console.log(data);
            setIsAdmin(data.isAdmin);
            setData(data.data);
            setPageCount(data.pageCount);
            setPage(page);
            setLoaded(true);
            document.body.scrollIntoView();
        });
    };
    const findRequest = (ID: number, localData: (typeof data) = data) => {
        for (let song of localData) {
            for (let request of song.requests) {
                if (request.ID === ID) {
                    return request;
                }
            }
        }
        // eslint-disable-next-line
        throw "?";
    };
    const toggleCheck = (ID: number) => {
        let req = findRequest(ID);
        axios.post("/api/setcheck", {
            ID: req.ID,
            checked: !req.checked,
            password: password
        }).then(resp => {
            let data_ = resp.data;
            if (data_.code) {
                showDialog(data_.message, "错误", true);
                return;
            }
            let copied = JSON.parse(JSON.stringify(data)) as (typeof data);
            console.log(copied);
            findRequest(ID, copied).checked = !req.checked;
            setData(copied);

        });
    };
    const removeRequest = (ID: number) => {
        // let req = findRequest(ID);
        axios.post("/api/remove/request", {
            ID: ID,
            password: password
        }).then(resp => {
            let data_ = resp.data;
            if (data_.code) {
                showDialog(data_.message, "错误", true);
                return;
            }
            // let oldData=data;
            for (let song of data) {
                song.requests = song.requests.filter(item => item.ID !== ID);
            }
            setData(JSON.parse(JSON.stringify(data)));
        });
    };
    const removeSong = (ID: number) => {
        axios.post("/api/remove/song", {
            ID: ID,
            password: password
        }).then(resp => {
            let data_ = resp.data;
            if (data_.code) {
                showDialog(data_.message, "错误", true);
                return;
            }
            // let oldData=data;
            data = data.filter(item => item.songData.songID !== ID);
            setData(JSON.parse(JSON.stringify(data)));
        });
    };
    return <div style={{ marginTop: "70px" }}>
        <Container>
            <Header as="h1">
                播放列表
            </Header>
            <Segment stacked loading={loading}>
                <Form loading={loading} as="div">
                    <Form.Field>
                        <label>密码</label>
                        <Input type="password" value={password} onChange={e => setPassword(e.target.value)} ></Input>
                    </Form.Field>
                    <Button onClick={load}>
                        查询
                    </Button>
                </Form>
            </Segment>
            {loaded && <Segment stacked>
                {
                    data.map(item => <SongItem
                        key={item.songData.songID}
                        password={password}
                        data={item}
                        isAdmin={isAdmin}
                        removeRequest={removeRequest}
                        removeSong={removeSong}
                        toggleCheck={toggleCheck}
                    ></SongItem>)
                }

                <Container textAlign="center">
                    <Pagination
                        totalPages={pageCount}
                        activePage={page}
                        onPageChange={(e, { activePage }) => loadPage(activePage as number)}
                    ></Pagination>
                </Container>
            </Segment>}
        </Container>
    </div>;
};

export default Manage;
