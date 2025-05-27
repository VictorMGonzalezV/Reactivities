import { observer } from "mobx-react-lite";
import { Profile } from "../../app/models/profile";
import { Card, Icon, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import FollowButton from "./FollowButton";

interface Props{
    profile:Profile;
}

export default observer (function ProfileCard({profile}:Props)
{
    const truncateText=(text:string|undefined, maxLength:number)=>{
        if(text)
            return text.length>maxLength?text.slice(0,maxLength)+"...":text
    }
    return(
   
        <Card as={Link} to={`/profiles/${profile.username}`}>
            <Card.Content>
                <Card.Header>{profile.displayName}</Card.Header>
                <Card.Description>{truncateText(profile.bio,30)}</Card.Description>
                <Image src={profile.image||'/assets/user.png'}/>
            </Card.Content>
            <Card.Content extra>
                <Icon name='user'/>
                {profile.followersCount} followers
            </Card.Content>
            <FollowButton profile={profile}/>
        </Card>
    )
    
})