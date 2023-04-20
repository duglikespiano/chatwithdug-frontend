import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { CgProfile } from 'react-icons/cg';
import { callSocket } from '../Lobby/Lobby.jsx';
import NoticeChatting from './NoticeChatting/NoticeChatting.jsx';
import './ConnectorInfoBox.css';

export default function ConnectorInfoBox({ connector, myInfo }) {
	const [exceptMeInfo, setExceptMeInfo] = useState([]);
	const navigate = useNavigate();

	//TODO 상대방 socketId를 session storage에 저장
	//있을 경우 callSocket하기
	const signOut = () => {
		Swal.fire({
			title: 'Would you like to sign out?',
			icon: 'question',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Accept',
			cancelButtonText: 'Cancel',
		}).then((result) => {
			if (result.isConfirmed) {
				callSocket(
					'leaveRoomNotification',
					myInfo.userSocketId,
					sessionStorage.getItem('yourSocketId'),
					`${myInfo.userSocketId} has left from ${sessionStorage.getItem(
						'roomNumber'
					)}`
				);
				callSocket('status', myInfo.userSocketId, false);
				navigate('/');
			} else {
				return;
			}
		});
	};

	useEffect(() => {
		setExceptMeInfo((exceptMeInfo) =>
			connector.filter((item) => item.userSocketId !== myInfo.userSocketId)
		);
	}, [connector, myInfo]);

	return (
		<div id="ConnectorInfoBox">
			<div id="greetingBox">Welcome, {myInfo.userName}!~♫</div>
			<div id="infoBox">Online users</div>
			<div id="myProfileBox">
				<CgProfile id="myProfilePicture" />
				<div>
					{myInfo.userName} (You)
					{myInfo.userSocketId}
				</div>
				<div id="signOut" onClick={signOut}>
					Click here to sign out
				</div>
			</div>

			{connector[
				connector.findIndex((item) => item.userSocketId === myInfo.userSocketId)
			]?.status ? (
				<div>
					{exceptMeInfo?.map((item, i) => (
						<div key={i} className="profileBoxChatting">
							<div>
								<CgProfile className="profilePicture" />
								{item.userName}
							</div>

							{item.status ? <NoticeChatting /> : null}
						</div>
					))}
				</div>
			) : (
				<div>
					{exceptMeInfo?.map((item, i) => (
						<div
							key={i}
							className={
								item.status ? 'profileBoxChatting' : 'profileBoxAvailable'
							}
							onClick={(event) => {
								event.preventDefault();

								Swal.fire({
									title: `You've invited ${exceptMeInfo[i].userName}`,
									icon: 'success',
									showConfirmButton: true,
								});
								callSocket(
									'invite',
									myInfo.userSocketId,
									exceptMeInfo[i].userSocketId,
									myInfo.userName
								);
							}}
						>
							<div>
								<CgProfile className="profilePicture" />
								{item.userName}
							</div>
							{item.status ? <NoticeChatting /> : null}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
