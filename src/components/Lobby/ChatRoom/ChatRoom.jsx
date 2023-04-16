import { useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ImExit } from 'react-icons/im';
import Swal from 'sweetalert2';
import ChatTextInputBox from './ChatTextInputBox.jsx';
import ChatContentsBox from './ChatContentsBox.jsx';
import { callSocket } from '../Lobby.jsx';
import './ChatRoom.css';
import { history } from '../../../index.js';

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
			}
		});
	};

	//------------------------------ effect ------------------------------//
	// // 사용자가 페이지를 떠나기 전 확인을 위한 function등록을 위한 useEffect
	useEffect(() => {
		if (myInfo.userSocketId && !yourInfo.userSocketId && !roomNumber) {
			navigate('/lobby');
		}
		return () => {
			sessionStorage.removeItem('roomNumber');
		};
	}, [navigate, roomNumber, myInfo.userSocketId, yourInfo.userSocketId]);

	useEffect(() => {
		const preventBack = () => {
			history.push('/lobby/chatroom');
			quitChatRoom();
		};

		const unlistenHistoryEvent = history.listen(({ action }) => {
			if (action === 'POP') {
				preventBack();
			}
		});
		return unlistenHistoryEvent;
	});

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
