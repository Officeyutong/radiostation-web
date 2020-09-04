import React, { useState, useEffect } from "react";
import {
    Header,
    Segment,
    Form,
    Input,
    Button,
    Checkbox,
    Container,
    Message
} from "semantic-ui-react";
import axios from "axios";
import { show as showDialog } from "../dialogs/Dialog";
type UserDataType = {
    song: string;
    requester: string;
    target: string;
    comment: string;
    anonymous: boolean;
    time: string;
};
const Modify: React.FC<{}> = () => {
    useEffect(() => {
        document.title = "修改点歌请求"
    });
    let [ID, setID] = useState("");
    let [password, setPassword] = useState("");
    let [loaded, setLoaded] = useState(false);
    let [userData, setUserData] = useState<UserDataType>({
        anonymous: false,
        comment: "",
        requester: "",
        song: "",
        target: "",
        time: ""
    });

    const query = () => {
        axios.post("/api/query", {
            ID: ID,
            password: password
        }).then(resp => {
            let data = resp.data;
            if (data.code) {
                showDialog(data.message, "错误", true);
                return;
            }
            setUserData({
                anonymous: data.data.anonymous,
                comment: data.data.comment,
                requester: data.data.requester,
                song: data.data.songID.toString(),
                target: data.data.target,
                time: data.data.time
            });
            setLoaded(true);
        });
    };
    const update = () => {
        if (userData.requester === "") {
            showDialog("请勿留空点歌人", "错误", true);
            return;
        }
        if (/^[1-9][0-9]*$/.test(userData.song) === false) {
            showDialog("歌曲ID只能为数字", "错误", true);
            return;
        }
        axios.post("/api/update", {
            ...userData,
            ID: ID,
            password: password
        }).then(resp => {
            let data = resp.data;
            if (data.code) {
                showDialog(data.message, "错误", true);
                return;
            }
            showDialog(data.message);
        });
    };
    return <Container >
        <div style={{ marginTop: "10%" }}>
            <Header as="h1">
                查询
        </Header>
            <Segment stacked>
                <Form>
                    <Form.Field>
                        <Input placeholder="请求ID.." onChange={e => setID(e.target.value)}></Input>
                    </Form.Field>
                    <Form.Field>
                        <Input placeholder="密码" type="password" onChange={e => setPassword(e.target.value)}></Input>
                    </Form.Field>
                    <Button size="large" color="green" onClick={query} >
                        查询
                    </Button>
                </Form>
            </Segment>
            {loaded && <Segment stacked>
                <Form as="div">
                    <Form.Field>
                        <Input label={{ icon: "asterisk" }} value={userData.song} onChange={e => {
                            setUserData({
                                ...userData,
                                song: e.target.value
                            })
                        }} labelPosition="left corner" icon="music" placeholder="网易云歌曲ID.."></Input>
                    </Form.Field>
                    <Form.Field>
                        <Input label={{ icon: "asterisk" }} value={userData.requester} onChange={e => {
                            setUserData({
                                ...userData,
                                requester: e.target.value
                            })
                        }} labelPosition="left corner" icon="user" placeholder="点歌人姓名及班级(必填).."></Input>
                    </Form.Field>
                    <Form.Field>
                        <Input value={userData.target} onChange={e => setUserData({
                            ...userData,
                            target: e.target.value
                        })} icon="at" placeholder="被点歌人姓名(可空).."></Input>
                    </Form.Field>
                    <Form.Field>
                        <textarea placeholder="留言(可空).." value={userData.comment} onChange={e => setUserData({
                            ...userData,
                            comment: e.target.value
                        })}></textarea>
                    </Form.Field>
                    <Form.Field>
                        <Checkbox label="匿名(不会公开身份信息)" toggle checked={userData.anonymous} onClick={(e, { checked }) => setUserData({
                            ...userData,
                            anonymous: (checked as boolean)
                        })}></Checkbox>
                    </Form.Field>
                    <Message>
                        <Message.Content>
                            <p>提交于 {userData.time} </p>
                        </Message.Content>
                    </Message>
                    <Button size="large" color="green" onClick={update} >
                        更新
                    </Button>
                </Form>
            </Segment>}
        </div>

    </Container>;

};

export default Modify;
