import { MongoClient, ObjectId } from "mongodb"
import MeetupDetail from "../../components/meetups/MeetupDetail"
import Head from 'next/head'

const MeetupDetails = (props) => {
    return (
        <>
            <Head>
                <title>{props.meetupData.title}</title>
                <meta name="description" content={props.meetupData.description} />
            </Head>
            <MeetupDetail
                title={props.meetupData.title}
                image={props.meetupData.image}
                address={props.meetupData.address}
                description={props.meetupData.description}
            />
        </>

    )
}
export async function getStaticPaths() {
    const client = await MongoClient.connect("mongodb+srv://yash:yash@cluster0.watljam.mongodb.net/?retryWrites=true&w=majority")
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
    client.close();
    return {
        fallback: 'blocking',
        paths: meetups.map(meetup => ({ params: { meetupId: meetup._id.toString() } }))
    }
}
export async function getStaticProps(context) {
    // fetch data from an API
    const meetupId = context.params.meetupId;

    const client = await MongoClient.connect("mongodb+srv://yash:yash@cluster0.watljam.mongodb.net/?retryWrites=true&w=majority")
    const db = client.db();
    const meetupsCollection = db.collection('meetups');
    const meetup = await meetupsCollection.findOne({ _id: ObjectId(meetupId) });
    client.close();
    // console.log(meetupId)
    return {
        props: {
            meetupData: {
                id: meetup._id.toString(),
                title: meetup.title,
                address: meetup.address,
                image: meetup.image,
                description: meetup.description
            }
        },
        revalidate: 10
    }
}
export default MeetupDetails