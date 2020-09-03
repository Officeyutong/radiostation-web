import React from "react";
import { SongData as SongDataType } from "../types";
import { Container, Grid, Image, Segment, Card } from "semantic-ui-react";
const SongCard: React.FC<{
    data: SongDataType
}> = ({ data }) => {
    let { audioURL, author, picURL, songID, name } = data;
    return <Container style={{ marginBottom: "10px" }}>
        <Segment>
            <Grid columns="2">
                <Grid.Column width="2">
                    <Image src={picURL} size="small"></Image>
                    <Container textAlign="center" style={{ marginTop: "10px" }}>
                        <a href={`https://music.163.com/#/song?id=${songID}`} target="_blank" rel="noopener noreferrer">前往网易云</a>
                    </Container>
                </Grid.Column>
                <Grid.Column width="14">
                    <Card fluid style={{ boxShadow: "none" }}>
                        <Card.Content>
                            <Card.Header>{name}</Card.Header>
                            <Card.Meta>{author}</Card.Meta>
                            <Card.Description>
                                <audio style={{ width: "100%" }} src={audioURL} controls={true} loop={false} autoPlay={false} ></audio>
                            </Card.Description>
                        </Card.Content>
                    </Card>
                </Grid.Column>
            </Grid>
        </Segment>
    </Container>;
};

export default SongCard;
