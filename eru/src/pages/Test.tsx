import { Fragment } from 'react'
import EventCard from '../components/EventCard';
import KeyTestCard from '../components/KeyTestCard';
import ListTodoCard from '../components/ListTodoCard';
import ReducerTest from '../components/ReducerTest';
import ProfileCard from '../components/ProfileCard';

const Test = () => {
    return (
        <Fragment>
            <EventCard />
            <KeyTestCard />
            <ListTodoCard />
            <ReducerTest />
            <ProfileCard />
        </Fragment>
    )
}

export default Test;