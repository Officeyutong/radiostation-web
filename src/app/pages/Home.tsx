import React, { useState, useEffect } from "react";
import { Container, Header, Input, Segment, Form, Checkbox, Button, Modal, Message, Pagination, Label, Icon, Divider } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { show as showDialog } from "../dialogs/Dialog";
import Cookies from "js-cookie";
import { SongData } from "../types";
import SongCard from "../utils/SongCard";
import SearchModal from "./SearchModal";
type ConfirmingModalProps = {
    onApprove: () => (void);
    onClose: () => (void);
    showing: boolean;
} & SongData;

const ConfirmModal: React.FC<ConfirmingModalProps> = ({ songID, onApprove, onClose, showing, picURL, audioURL, author, name }: ConfirmingModalProps) => {
    return <Modal
        onClose={onClose}
        open={showing}
    >
        <Modal.Header>您确定要提交这首歌曲吗</Modal.Header>
        <Modal.Content>
            <SongCard
                data={{
                    songID: songID,
                    picURL: picURL,
                    audioURL: audioURL,
                    author: author,
                    name: name
                } as SongData}
            ></SongCard>
            <Message warning>
                <Message.Header>注意</Message.Header>
                <p>请确认这是您要提交的歌曲后再点击确认！</p>
                <p>提交错误的歌曲ID一律会被驳回！</p>
            </Message>
        </Modal.Content>
        <Modal.Actions>
            <Button color="green" positive onClick={onApprove}>确认</Button>
            <Button color="red" negative onClick={onClose}>取消</Button>
        </Modal.Actions>
    </Modal>;

};
const Home: React.FC<{}> = () => {
    const history = useHistory();
    let [song, setSong] = useState("114514");
    let [requester, setRequester] = useState("qwqqwq");
    let [target, setTarget] = useState("");
    let [comment, setComment] = useState("");
    let [anonymous, setAnonymous] = useState(false);
    let [confirming, setConfirming] = useState(false);
    let [error, setError] = useState<{
        ID: boolean;
        requester: boolean;
    }>({ ID: false, requester: false });
    let [showSearching, setShowSearching] = useState(false);
    let [songData, setSongData] = useState<SongData>({
        audioURL: "",
        author: "",
        picURL: "",
        songID: -1,
        name: ""
    });
    useEffect(() => {
        document.title = "益文之声点歌姬";
    });
    const prepareSubmit = () => {
        let hasError = false;
        if (song === "") {
            hasError = true;
            setError({
                ...error,
                ID: true
            });
        }
        if (requester === "") {
            hasError = true;
            setError({
                ...error,
                requester: true
            });
        }
        if (hasError) {
            showDialog("请填写歌曲ID和点歌人", "错误", true);
            return;
        }
        let lastSubmit = Cookies.get("last-submit");
        if (lastSubmit && ((new Date()).getTime() - parseInt(lastSubmit)) / 1000 < 24 * 60 * 60) {
            showDialog("两次提交请求之间必须间隔大于24小时！", "错误", true);
            return;
        }

        axios.post("/api/query_song", {
            songID: parseInt(song)
        }).then(resp => {
            let data = resp.data;
            console.log(data);
            if (data.code) {
                showDialog(data.message, "发生错误", true);
                return;
            }
            setSongData({
                songID: parseInt(song),
                audioURL: data.data.audio_url,
                author: data.data.author,
                picURL: data.data.picture_url,
                name: data.data.name
            });
            setConfirming(true);
        });
    };
    const realSubmit = () => {
        axios.post("/api/submit", {
            songID: song,
            requester: requester,
            anonymous: anonymous,
            target: target,
            comment: comment
        }).then(resp => {
            setConfirming(false);
            let data = resp.data;
            if (data.code) {
                showDialog(data.message, "发生错误", true);
                return;
            }
            const message = data.message;
            Cookies.set("last-submit", (new Date()).getTime().toString());
            showDialog(message, "操作完成", false);
        });
    };
    const requestCallback: (songID: number) => (void) = (songID) => {
        setSong(songID.toString());
        document.body.scrollIntoView();
    };
    const searchDoneCallback = (songID: number) => {
        setShowSearching(false);
        setSong(songID.toString());
    };
    return <Container style={{ marginTop: "70px", marginBottom: "70px" }}>
        <div style={{ top: "10%" }}>
            <Header as="h1">
                点歌
            </Header>
            <>
                <Segment stacked>
                    <Form as="div" >
                        <Form.Field>
                            <Input
                                error={error.ID}
                                label={{ icon: "asterisk" }}
                                value={song}
                                onChange={e => {
                                    setSong(e.target.value);
                                    setError({
                                        ...error,
                                        ID: false
                                    });
                                }}
                                labelPosition="left corner"
                                // icon="music" 
                                action={{
                                    color: "teal",
                                    labelPosition: "right",
                                    icon: "search",
                                    content: "打开搜索页面..",
                                    onClick: () => setShowSearching(true)
                                }}
                                placeholder="网易云歌曲链接或ID(必填).."
                            ></Input>
                        </Form.Field>
                        <Form.Field>
                            <Input error={error.requester} label={{ icon: "asterisk" }} value={requester} onChange={e => {
                                setRequester(e.target.value);
                                setError({
                                    ...error,
                                    requester: false
                                })
                            }} labelPosition="left corner" icon="user" placeholder="点歌人姓名及班级(必填).."></Input>
                        </Form.Field>
                        <Form.Field>
                            <Input value={target} onChange={e => setTarget(e.target.value)} icon="at" placeholder="被点歌人姓名(可空).."></Input>
                        </Form.Field>
                        <Form.Field>
                            <textarea placeholder="留言(可空).." value={comment} onChange={e => setComment(e.target.value)}></textarea>
                        </Form.Field>
                        <Form.Field>
                            <Checkbox label="匿名(不会公开身份信息)" toggle checked={anonymous} onClick={(e, { checked }) => setAnonymous(checked as boolean)}></Checkbox>
                        </Form.Field>
                        <Button color="green" size="large" onClick={prepareSubmit}>
                            提交
                        </Button>
                        <Button color="blue" size="large" onClick={e => history.push("/modify")}>
                            查询..
                        </Button>
                        <a style={{ textDecoration: "underline" }} target="_blank" rel="noopener noreferrer" href="https://yutong_java.gitee.io/ywvoice-help/guide.html">帮助文档</a>
                    </Form>
                </Segment>
                <ConfirmModal
                    onApprove={realSubmit}
                    onClose={() => setConfirming(false)}
                    showing={confirming}
                    songID={parseInt(song)}
                    audioURL={songData.audioURL}
                    author={songData.author}
                    picURL={songData.picURL}
                    name={songData.name}
                >
                </ConfirmModal>
                <SearchModal
                    doneCallback={searchDoneCallback}
                    onClose={() => setShowSearching(false)}
                    showing={showSearching}
                >

                </SearchModal>
            </>
            <SongList requestCallback={requestCallback}></SongList>
        </div>
    </Container>;
};
const SongList: React.FC<{
    requestCallback: (songID: number) => (void)
}> = ({ requestCallback }) => {
    let [data, setData] = useState<Array<{ songData: SongData; count: number }>>([]);
    let [page, setPage] = useState(1);
    let [loaded, setLoaded] = useState(false);
    let [pageCount, setPageCount] = useState(0);
    // eslint-disable-next-line
    const loadPage = ((page: number) => {
        axios.post("/api/songlist", { page: page }).then(resp => {
            let data = resp.data;
            if (data.code) {
                showDialog(data.message, "错误", true);
                return;
            }
            setData(data.data);
            setPage(page);
            console.log(data);
            setPageCount(data.pageCount);
        });
    });
    useEffect(() => {
        if (!loaded) {
            loadPage(1);
            setLoaded(true);
        }
    }, [loaded, loadPage]);

    return loaded ? (<Segment stacked>
        {data.map(item => (
            <Container key={item.songData.songID}>
                <SongCard data={item.songData} ></SongCard>
                <Container textAlign="right">
                    <Button as="div" labelPosition="left">
                        <Label style={{ cursor: "default" }}>
                            已有 {item.count} 预订.
                        </Label>
                        <Button icon color="yellow" onClick={() => requestCallback(item.songData.songID)}>
                            <Icon name="check"></Icon>
                            我也要点
                        </Button>
                    </Button>
                </Container>
                <Divider></Divider>
            </Container>
        ))}

        <Container textAlign="center">
            <Pagination
                totalPages={pageCount}
                activePage={page}
                onPageChange={(e, data) => {
                    console.log("page", data.activePage);
                    // setPage(data.activePage as number);
                    loadPage(data.activePage as number);
                    console.log(data);
                }}

            ></Pagination>
        </Container>
    </Segment>) : <></>;
};


export default Home;
