import { Link } from "react-router-dom";
import { Button, Header, Icon, Segment } from "semantic-ui-react";

export default function NotFound(){
    return(
        <Segment placeholder>
            <Header icon>
                <Icon name='search'/>
                Kurwa! We made lookings everywhere but cannot into find nothing :/
            </Header>
            <Segment.Inline>
                <Button as={Link} to ='/activities'>
                  Do clickings for to return page of activities
                </Button>
            </Segment.Inline>
        </Segment>
    )
}