import React, { useState, useEffect } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useNavigate, useParams } from 'react-router-dom';
import { userCreatedPinsQuery, userSavedPinsQuery, userQuery } from '../utils/data';
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { googleLogout } from '@react-oauth/google';

const randomImage = "https://source.unsplash.com/1600x900/?nature,photography,technology"
const activeBtnStyles = "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none";
const notActiveBtnStyles = "bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none"
const UserProfile = () => {

    const [user, setUser] = useState(null);
    const [pins, setPins] = useState(null);
    const [text, setText] = useState('Created');
    const [activeBtn, setActiveBtn] = useState('created');
    const navigate = useNavigate();
    const { userId } = useParams();

    useEffect(() => {
        const query = userQuery(userId);

        client.fetch(query)
            .then((data) => {
                setUser(data[0]);
            })
    }, [user])

    useEffect(() => {
        if (text === 'Created') {
            const createdPinsQuery = userCreatedPinsQuery(userId);
            client.fetch(createdPinsQuery)
                .then((data) => {
                    setPins(data);
                })
        } else {
            const savedPinsQuery = userSavedPinsQuery(userId);
            client.fetch(savedPinsQuery)
                .then((data) => {
                    setPins(data);
                })
        }
    }, [text, userId])

    const logOut = () => {
        localStorage.clear();
        navigate('/login');
    }

    if (!user) {
        return <Spinner message="Loading profile" />
    }

    return (
        <div className='relative pb-2 h-full justify-center items-center'>
            <div className='flex flex-col pb-5'>
                <div className='relative flex flex-col mb-7'>
                    <div className='flex flex-col justify-center items-center'>
                        <img
                            src={randomImage}
                            className="w-full h-370 2xl:h-510 shadow-lg object-cover"
                            alt="banner-pic"
                        />
                        <img
                            className='rounded-full w-20 h-20 -mt-10 shadow-xl object-cover'
                            src={user.image}
                            alt="user-pic"
                        />
                        <h1 className='font-bold text-3xl text-center mt-3'>
                            {user.userName}
                        </h1>
                        <div className='absolute top-0 z-1 right-0 p-2'>
                            {userId === user._id && (
                                /*<GoogleLogin
                                    onSuccess={responseGoogle}
                                    onError={() => { console.log("Error") }}
                                />*/
                                <button
                                    type="button"
                                    className='px-2'
                                    onClick={() => {
                                        logOut();
                                        googleLogout();
                                    }}
                                >
                                    <AiOutlineLogout color='red' fontSize={21} />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className='text-center mb-7'>
                        <button
                            type='button'
                            onClick={(e) => {
                                setText(e.target.textContent)
                                setActiveBtn('created')
                            }}
                            className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}
                        >
                            Created
                        </button>
                        <button
                            type='button'
                            onClick={(e) => {
                                setText(e.target.textContent)
                                setActiveBtn('saved')
                            }}
                            className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}
                        >
                            Saved
                        </button>
                    </div>
                    {pins?.length > 0 ? (
                        <div
                            className='px-2'>
                            <MasonryLayout pins={pins} />
                        </div>
                    ) : (
                        <div className='flex justify center items-center font-bold w-full tex-xl mt-2'>
                            No Pins Found
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserProfile