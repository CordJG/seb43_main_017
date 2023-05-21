import { FiPlayCircle, FiFolderPlus } from 'react-icons/fi';
import { MdFileDownload } from 'react-icons/md';
import { HiOutlineHeart, HiHeart } from 'react-icons/hi';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { downloadLink } from 'src/recoil/Atoms';
import { useRecoilState } from 'recoil';
import { useEffect } from 'react';

interface SideiconProps {
    musicId: number;
}

const Sideicon: React.FC<SideiconProps> = ({ musicId }) => {
    const [like, setLike] = useState<boolean>(false);
    const [download] = useRecoilState<string>(downloadLink);

    const memberId: string | undefined = window.localStorage.getItem('memberId') || undefined;
    const token: string | undefined = window.localStorage.getItem('access_token') || undefined;

    const handleLike = () => {
        if (!token) {
            return;
        }

        const updatedLike = !like; // 새로운 like 상태

        setLike(updatedLike); // 먼저 상태 업데이트

        axios
            .post(
                `http://ec2-52-78-105-114.ap-northeast-2.compute.amazonaws.com:8080/music-like/toggle`,
                {
                    memberId: memberId,
                    musicId: musicId,
                },
                {
                    headers: {
                        Authorization: token,
                    },
                },
            )
            .then((response) => {
                console.log(response.data);
                const updatedMusicId = response.data.musicId;
                setLike(updatedMusicId === musicId);
            })
            .catch((error) => {
                console.error(error);
                setLike(!updatedLike);
            });
    };

    useEffect(() => {
        axios
            .get('http://ec2-52-78-105-114.ap-northeast-2.compute.amazonaws.com:8080/musics/liked-musics', {
                headers: {
                    Authorization: token,
                },
            })
            .then((response) => {
                const data = response.data.data;
                const likedMusicIds = data.map((item: { musicId: number }) => item.musicId);
                setLike(likedMusicIds.includes(musicId));
                console.log(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [setLike]);

    return (
        <MusicIconGroup>
            <Link to={`/musiclist/${musicId}`}>
                <FiPlayCircle className="color-blue" />
            </Link>
            <FiFolderPlus />
            <a href={`/music/${download}`} download>
                <MdFileDownload />
            </a>
            {like ? (
                <HiHeart onClick={handleLike} className="color-red like-action" />
            ) : (
                <HiOutlineHeart onClick={handleLike} className="color-red" />
            )}
        </MusicIconGroup>
    );
};

export default Sideicon;

const MusicIconGroup = styled.li`
    > * {
        margin: 0px 20px;
        font-size: 1rem;
    }
    .color-blue {
        color: #6e9cff;
        font-size: 1.5rem;
        transition: 0.2s ease-in-out;
    }
    .color-blue:hover {
        color: #a3c0ff;
    }

    .color-red {
        color: rgba(199, 68, 68, 1);
    }
    .like-action {
        animation: likeaction 0.5s forwards;
    }
    a {
        color: inherit;
        text-decoration: none;
    }
    @keyframes likeaction {
        50% {
            transform: scale(1.5);
            color: #ff7777;
        }
    }
    @media (max-width: 1200px) {
        > * {
            margin: 0px 10px;
        }
    }
`;
