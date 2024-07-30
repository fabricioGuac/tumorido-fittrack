// import { BodyForm } from '../components/BodyForm';
import  LiftForm  from '../components/LiftForm';

import { useQuery } from "@apollo/client";

import { GET_ME } from "../utils/queries";


export default function Profile() {

    const { loading, data } = useQuery(GET_ME);


    if (loading) {
        return <div>Loading...</div>;
    }

    console.log(data);
    return (<>
    <h2>{data.me.username}</h2>
    <LiftForm />

    </>)
}