import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { CgProfile } from 'react-icons/cg';
import { callSocket } from '../Lobby/Lobby.jsx';
import NoticeChatting from './NoticeChatting/NoticeChatting.jsx';
import './ConnectorInfoBox.css';

export default function ConnectorInfoBox({ connector, myInfo }) {
	const [exceptMeInfo, setExceptMeInfo] = useState([]);

	useEffect(() => {
		setExceptMeInfo((exceptMeInfo) =>
			connector.filter((item) => item.userSocketId !== myInfo.userSocketId)
		);
	}, [connector, myInfo]);

	return (
		<div id="ConnectorInfoBox">
			<div id="greetingBox">Welcome, {myInfo.userName}!~♫</div>
			<div id="infoBox">Online users</div>
			<div className="myProfileBox">
				<CgProfile className="profilePicture" />
				{myInfo.userName} (You)
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
								let timerInterval;
								Swal.fire({
									title: `You've invited ${exceptMeInfo[i].userName}`,
									icon: 'success',
									showConfirmButton: true,
									timer: 3000,
									timerProgressBar: true,
									didOpen: () => {
										timerInterval = setInterval(() => {}, 100);
									},
									willClose: () => {
										clearInterval(timerInterval);
									},
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
