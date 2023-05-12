import Head from 'next/head'
import { MongoClient } from 'mongodb';
import MeetupList from "../components/meetups/MeetupList";

const HomePage = (props) => {
    return (
        <>
            <Head>
                <title>React Meetups</title>
                <meta name="description" content="Browse a huge list of highly active React meetups!" />
            </Head>
            <MeetupList meetups={props.meetups} />
        </>
    )
}
export async function getStaticProps() {

    const client = await MongoClient.connect("mongodb+srv://yash:yash@cluster0.watljam.mongodb.net/?retryWrites=true&w=majority")
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const meetups = await meetupsCollection.find().toArray();
    client.close();

    return {
        props: {
            meetups: meetups.map(meetup => ({
                title: meetup.title,
                address: meetup.address,
                image: meetup.image,
                id: meetup._id.toString()
            }))
        },
        revalidate: 10
    }
}
export default HomePage; 