import { useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ImExit } from 'react-icons/im';
import Swal from 'sweetalert2';
import ChatTextInputBox from './ChatTextInputBox.jsx';
import ChatContentsBox from './ChatContentsBox.jsx';
import { callSocket } from '../Lobby.jsx';
import './ChatRoom.css';

export default function ChatRoom() {
	const navigate = useNavigate();
	const {
		roomNumber,
		chatContents,
		myInfo,
		yourInfo,
		leave,
		leaveHandler,
		roomNumberHandler,
		typing,
	} = useOutletContext();

	const quitChatRoom = () => {
		Swal.fire({
			title: 'Want to leave?',
			text: 'You will lost chat contents!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Leave',
		}).then((result) => {
			if (result.isConfirmed) {
				callSocket(
					'leaveRoomNotification',
					myInfo.userSocketId,
					yourInfo.userSocketId,
					`${myInfo.userSocketId} has left from ${roomNumber}`
				);
				navigate('/lobby');
				leaveHandler();
				callSocket('status', myInfo.userSocketId, false);
				roomNumberHandler();
			} else {
				window.history.pushState(null, '', window.location.href);
			}
		});
	};

	//------------------------------ effect ------------------------------//
	// 사용자가 페이지를 떠나기 전 확인을 위한 function등록을 위한 useEffect
	useEffect(() => {
		if (myInfo.userSocketId && !yourInfo.userSocketId && !roomNumber) {
			navigate('/lobby');
		}
	}, [navigate, roomNumber, myInfo.userSocketId, yourInfo.userSocketId]);

	// 사용자가 페이지를 떠나기 전 확인을 위한 function등록을 위한 useEffect
	useEffect(() => {
		window.addEventListener('popstate', quitChatRoom);
		window.history.pushState(null, '', window.location.href);
		return () => {
			window.removeEventListener('popstate', quitChatRoom);
			sessionStorage.removeItem('yourSocketId');
			sessionStorage.removeItem('roomNumber');
		};
		// eslint-disable-next-line
	}, []);

	return (
		<div id="ChatRoom">
			<ImExit id="quitChatRoomButton" onClick={quitChatRoom} />
			<ChatContentsBox
				chatContents={chatContents}
				myInfo={myInfo}
				yourInfo={yourInfo}
				leave={leave}
			/>
			<ChatTextInputBox
				myInfo={myInfo}
				yourInfo={yourInfo}
				roomNumber={roomNumber}
				typing={typing}
				leave={leave}
			/>
		</div>
	);
}
