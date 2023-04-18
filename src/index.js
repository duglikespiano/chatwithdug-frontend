import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import './index.css';
import SignIn from './components/SignIn/SignIn.jsx';
import SignUp from './components/SignUp/SignUp.jsx';
import ResetPassword from './components/ResetPassword/ResetPassword.jsx';
import Lobby from './components/Lobby/Lobby.jsx';
import reportWebVitals from './reportWebVitals';
import ChatRoom from './components/Lobby/ChatRoom/ChatRoom';
import Introduction from './components/Lobby/Introduction';

export const history = createBrowserHistory();

const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter([
	{
		path: '/',
		element: <SignIn />,
		errorElement: <p>NOT FOUND!</p>,
	},
	{ path: '/signup', element: <SignUp /> },
	{ path: '/resetpassword', element: <ResetPassword /> },
	{
		path: '/lobby',
		element: <Lobby />,
		children: [
			{ index: true, element: <Introduction /> },
			{ path: '/lobby/chatroom', element: <ChatRoom /> },
		],
	},
]);

root.render(
	// <React.StrictMode>
	<RouterProvider router={router}>
		<SignIn />
	</RouterProvider>
	// </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
