import React from "react";
import ReactDOM from "react-dom";
import { Modal, Header, Message, Button } from "semantic-ui-react";
type StateType = {
    showing: boolean;
    message: string;
    title: string;
    error: boolean;
    success: boolean;

};
type PropType = {
    error: boolean;
    success: boolean;
    message: string;
    title: string;
};
class MyMessageBox extends React.Component<PropType, StateType> {


    readonly state: Readonly<StateType> = {
        showing: false,
        message: "",
        title: "标题",
        error: true,
        success: false
    }
    public constructor(props: PropType) {
        super(props);
        this.state = {
            showing: true,
            ...props

        };
    }
    render() {
        return (<Modal
            open={this.state.showing}
            size="tiny"
            closeOnDimmerClick={true}
            closeOnDocumentClick={true}
        >
            <Header content={this.state.title} />
            <Modal.Content>
                <Message error={this.state.error} success={!this.state.error}>
                    <Header>
                        <h3>{this.state.error ? "错误" : "完成"}</h3>
                    </Header>
                    <div dangerouslySetInnerHTML={{ __html: this.state.message }}>

                    </div>
                </Message>
            </Modal.Content>
            <Modal.Actions>
                <Button as="a" color="blue" href="/">返回主页</Button>
                <Button color="green" onClick={() => this.setState({ showing: false })}>关闭</Button>
            </Modal.Actions>
        </Modal>);
    }
};

const show = (message: string, title: string = "提示", error: boolean = false, success: boolean = false) => {
    let target = document.createElement("div");
    ReactDOM.render(<MyMessageBox message={message} title={title} error={error} success={success} />, target);
};

export { show };
