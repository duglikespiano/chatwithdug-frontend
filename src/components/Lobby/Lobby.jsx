import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import './Lobby.css';
import io from 'socket.io-client';

import ConnectorInfoBox from './ConnectorInfoBox.jsx';
import Swal from 'sweetalert2';

const wsClient = io.connect(`${process.env.REACT_APP_BACKEND_URL}`, {
	path: '/socket.io',
	transports: ['websocket'],
});

export const callSocket = (
	sort,
	element1,
	element2,
	element3,
	element4,
	element5,
	element6
) => {
	// TODO 이 함수 보기좋게 정리 할 것
	if (sort === 'invite') {
		wsClient.emit(sort, element1, element2, element3);
		wsClient.emit('status', element1, true);
	} else if (sort === 'chatContents') {
		wsClient.emit(
			sort,
			element1,
			element2,
			element3,
			element4,
			element5,
			element6
		);
	} else if (sort === 'leaveRoomNotification') {
		wsClient.emit(sort, element1, element2, element3);
	} else if (sort === 'status') {
		wsClient.emit(sort, element1, element2);
	} else if (sort === 'typing') {
		wsClient.emit(sort, element1, element2);
	}
};

export default function Lobby() {
	const navigate = useNavigate();
	const [connector, setConnector] = useState([]);
	// const [toWsId, setToWsId] = useState('');
	const [myInfo, setMyInfo] = useState({});
	const [yourInfo, setYourInfo] = useState({});
	const [chatContents, setChatContents] = useState([]);
	const [roomNumber, setRoomNumber] = useState('');
	const [leave, setLeave] = useState(false);
	const [typing, setTyping] = useState(false);
	const leaveHandler = () => {
		setLeave(false);
	};

	const roomNumberHandler = () => {
		setRoomNumber('');
	};

	useEffect(() => {
		// 본 페이지에 진입 시, 로그인으로 획득한 token을 backend로 전달하여 userName 확보
		wsClient.emit('joinlobby', sessionStorage.getItem('token'));
		wsClient.on('chatContents', (data) => {
			setChatContents((chatContents) => [...chatContents, data]);
		});

		// joinlobby event발생 시 set한 wsId를 오염시키지 않기 위해 refreshlobby를 별도로 생성
		wsClient.on('joinlobby', (connector) => {
			setConnector(connector);
			const myData = connector.filter(
				(item) => item.userSocketId === wsClient.id
			)[0];
			setMyInfo((myInfo) => ({
				...myInfo,
				userName: myData?.userName,
				userSocketId: myData?.userSocketId,
				status: myData?.status,
			}));
		});

		wsClient.on('refreshlobby', (connector) => {
			setConnector(connector);
		});

		wsClient.on('roomNumber', (roomNumber) => {
			setRoomNumber(roomNumber);
			wsClient.emit('joinChatRoom', roomNumber);
			sessionStorage.setItem('roomNumber', roomNumber);
		});

		wsClient.on('leaveRoomNotification', (element1, element2) => {
			if (element1 === sessionStorage.getItem('yourSocketId')) {
				setLeave(true);
			}
		});

		let time = new Date();
		wsClient.on('typing', (msg) => {
			setTyping(true);
			const timeout = () => {
				setTyping(false);
			};
			const id = setTimeout(timeout, 10);
			if (new Date() - time > -1) {
				time = new Date();
				clearTimeout(id - 1);
			}
		});

		return () => {
			// 사용자가 lobby에서 뒤로가기 버튼을 누를 때, 현재 lobby에 접속한 모든 사용자 정보를 갱신
			wsClient.emit('leavePage');
		};
	}, []);

	useEffect(() => {
		if (!sessionStorage.getItem('token')) {
			navigate('/');
		}

		let time = new Date();

		wsClient.on('typing', (msg) => {
			setTyping(true);
			const timeout = () => {
				setTyping(false);
			};
			const id = setTimeout(timeout, 1000);
			if (new Date() - time > -1) {
				time = new Date();
				clearTimeout(id - 1);
			}
		});

		// 사용자가 초대를 받으면 선택창이 뜨고,
		// '확인'선택 시  inviteAccepted event 발생 및 채팅창으로 화면 전환
		wsClient.on('invite', (inviter, invitee, inviteeName) => {
			wsClient.emit('status', myInfo.userSocketId, true);
			const toData = connector.filter(
				(item) => item.userSocketId === inviter
			)[0];
			setYourInfo((yourInfo) => ({
				...yourInfo,
				userName: toData?.userName,
				userSocketId: toData?.userSocketId,
				status: toData?.status,
			}));
			let timerInterval;
			Swal.fire({
				title: 'Would you like to join?',
				text: `${inviteeName} has invited you!`,
				icon: 'question',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Accept',
				cancelButtonText: 'Deny',
				timer: 10000,
				timerProgressBar: true,
				didOpen: () => {
					timerInterval = setInterval(() => {}, 100);
				},
				willClose: () => {
					clearInterval(timerInterval);
				},
			}).then((result) => {
				if (result.isConfirmed) {
					// inviteAccepted event 발생 시 초대 한 사람과 초대 받은 사람의 socketId를 전달
					wsClient.emit('inviteAccepted', inviter, invitee);
					// 채팅창 leave상태 초기화
					setLeave(false);
					// 초대를 받고 수락한 사람의 화면 전환
					setChatContents([]);
					sessionStorage.setItem('yourSocketId', inviter);
					navigate('/lobby/chatroom');
				} else {
					wsClient.emit('status', myInfo.userSocketId, false);
					wsClient.emit('inviteDenied', toData.userSocketId, false);
				}
			});
		});

		// 초대를 한 사람이 상대방이 초대를 수락했다는 메세지를 받을 경우,
		wsClient.on('inviteAccepted', (message, toWsId) => {
			if (message === true) {
				const toData = connector.filter(
					(item) => item.userSocketId === toWsId
				)[0];
				setYourInfo((yourInfo) => ({
					...yourInfo,
					userName: toData?.userName,
					userSocketId: toData?.userSocketId,
					status: toData?.status,
				}));
				// 채팅창 leave상태 초기화
				setLeave(false);
				wsClient.emit('status', myInfo.userSocketId, true);
				setChatContents([]);
				sessionStorage.setItem('yourSocketId', toWsId);
				navigate('/lobby/chatroom');
			}
		});
	}, [navigate, connector, myInfo.userSocketId, yourInfo.userSocketId]);

	wsClient.on('inviteDenied', (boolean) => {
		if (boolean === false) {
			Swal.fire({
				title: 'Oops!',
				text: `Your invitation was denied`,
				icon: 'error',
			});
		}
	});

	return (
		<div id="Lobby">
			<ConnectorInfoBox
				connector={connector}
				myInfo={myInfo}
				context={{
					leaveHandler,
					roomNumberHandler,
				}}
			/>
			<Outlet
				context={{
					chatContents,
					myInfo,
					yourInfo,
					roomNumber,
					leave,
					leaveHandler,
					roomNumberHandler,
					typing,
				}}
			/>
		</div>
	);
}
